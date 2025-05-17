let initialize = function(instance, context) {
    'use strict';

    // Generate a unique ID for the editor container
    instance.data.uniqueId = 'jsoneditor_' + Math.random().toString(36).substr(2, 9);
    instance.data.editorContainerId = 'editor_holder_' + instance.data.uniqueId;

    // Create the container div and append it to instance.canvas
    const editorDiv = document.createElement('div');
    editorDiv.id = instance.data.editorContainerId;
    // For "fit height to content", the inner container should determine its own height.
    // instance.canvas will be adjusted by instance.setHeight().
    editorDiv.style.width = '100%'; 
    // editorDiv.style.height = 'auto'; // Let content dictate height initially.
    instance.canvas.append(editorDiv);
    instance.data.editor_container = editorDiv; // Store reference to the DOM element

    // Initialize instance.data properties
    instance.data.isReady = false;
    instance.data.editor = null;
    instance.data.lastProperties = {}; // To store a copy of properties for change detection in update
    instance.data.currentProperties = {}; // To store live properties for callbacks

    // Debounce function to limit rapid state publishing for performance
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const callbackContext = this; // Capture 'this' context if necessary, though not used here
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(callbackContext, args), delay);
        };
    }

    const debouncedPublishJson = debounce((jsonString, jsonObject) => {
        instance.publishState('currentJsonText', jsonString);
        // instance.publishState('currentJsonObject', jsonObject); // Removed as Bubble doesn't support object state type directly
        // For autobinding, if 'initialJson' is the autobound field of type text,
        // Bubble will listen to changes on the state that corresponds to it.
        // If we name an exposed state 'bubble_fn_autobinding' of type text, Bubble uses that.
        // Or, if 'initialJson' (type text) is marked for autobinding, Bubble links it to 'currentJsonText'.
        // Let's assume 'currentJsonText' is the state linked for autobinding.
        instance.publishAutobinding(jsonString); // Publish for autobinding
        instance.triggerEvent('jsonChanged');
    }, 250); // 250ms debounce delay

    instance.data.updateElementHeight = function() {
        if (!instance.data.editor || !instance.data.editor_container || !instance.canvas) {
            return;
        }
        // Check if "fit height to content" is enabled in Bubble's properties.
        // This property comes from properties.bubble.fit_height_to_content
        // We need access to `properties` here, which initialize.js doesn't have directly.
        // `instance.data.currentProperties` will hold them after first update.
        if (instance.data.currentProperties && instance.data.currentProperties.bubble && instance.data.currentProperties.bubble.fit_height_to_content) {
            // The jsoneditor itself might have a complex structure.
            // We need to measure the scrollHeight of the actual editor content area.
            // This might be instance.data.editor_container.scrollHeight if it's simple,
            // or a specific child element.
            // For now, let's assume editor_container's scrollHeight is representative.
            // Add a small buffer for padding/margins if necessary.
            let contentHeight = instance.data.editor_container.scrollHeight;
            
            // The jsoneditor library might have its own outer div that contains everything.
            // Let's try to find the main editor HTML element.
            const editorMainElement = instance.data.editor_container.querySelector('.jsoneditor');
            if (editorMainElement) {
                contentHeight = editorMainElement.scrollHeight;
            }

            if (contentHeight > 0) {
                instance.setHeight(contentHeight);
            }
        }
        // If not fit_height_to_content, Bubble controls the height, and editor should fill 100%.
        // In that case, editor_container should have height: 100%.
        // This logic needs to be in sync with how editor_container style is set.
        // Let's ensure editor_container has 100% height if not fitting to content.
        else if (instance.data.currentProperties && instance.data.currentProperties.bubble && !instance.data.currentProperties.bubble.fit_height_to_content) {
             if(instance.data.editor_container.style.height !== '100%') {
                instance.data.editor_container.style.height = '100%';
             }
        }
    };
    const debouncedUpdateHeight = debounce(instance.data.updateElementHeight, 150);


    // This function will be called by update.js on its first run
    instance.data.setupEditorInstance = function(initialProperties) {
        // Store the initial properties received from update.js
        // These are live and will be updated by subsequent calls to update.js
        instance.data.currentProperties = initialProperties;
        
        // Make a deep copy for `lastProperties` for change detection in update.js
        // Simple JSON stringify/parse for basic properties. Bubble lists/dates might need more care.
        try {
            instance.data.lastProperties = JSON.parse(JSON.stringify(initialProperties));
        } catch (e) {
            context.reportDebugger('Could not deep copy initialProperties: ' + e.message);
            instance.data.lastProperties = {}; // Fallback
        }


        if (!window.JSONEditor) {
            console.error('JSONEditor library not loaded. Ensure it is in header.html.');
            context.reportDebugger('JSONEditor library not loaded. Check header.html.');
            if (instance.data.editor_container) {
                 instance.data.editor_container.innerHTML = '<div style="color:red; padding:10px;">Error: JSONEditor library not found.</div>';
            }
            return; // Cannot proceed
        }
        
        const options = {};

        // Populate options from initialProperties
        options.mode = initialProperties.mode || 'tree';
        
        // Set initial readOnly option
        options.readOnly = initialProperties.isReadOnly !== undefined ? initialProperties.isReadOnly : false;

        // Handle 'allowedModes' (CSV string of texts)
        if (typeof initialProperties.allowedModes === 'string' && initialProperties.allowedModes.trim() !== '') {
            try {
                const modesArray = initialProperties.allowedModes.split(',').map(mode => mode.trim()).filter(mode => mode.length > 0);
                if (modesArray.length > 0) {
                    options.modes = modesArray;
                } else {
                    // If CSV is empty after trim/filter (e.g. ", ,") or just whitespace
                    options.modes = ['tree', 'view', 'form', 'code', 'text']; 
                }
            } catch (e) {
                context.reportDebugger('Error processing allowedModes CSV string: ' + e.message);
                options.modes = ['tree', 'view', 'form', 'code', 'text']; // Fallback
            }
        } else {
            // Default if property is not set, is not a string, or is an empty string
            options.modes = ['tree', 'view', 'form', 'code', 'text']; 
        }

        if (initialProperties.schema) {
            try { options.schema = JSON.parse(initialProperties.schema); }
            catch (e) { 
                context.reportDebugger('Invalid schema JSON: ' + e.message);
                options.schema = undefined; // Important to set to undefined if invalid
            }
        }
        if (initialProperties.schemaRefs) {
            try { options.schemaRefs = JSON.parse(initialProperties.schemaRefs); }
            catch (e) { 
                context.reportDebugger('Invalid schemaRefs JSON: ' + e.message);
                options.schemaRefs = undefined;
            }
        }

        options.search = initialProperties.enableSearch !== undefined ? initialProperties.enableSearch : true;
        options.history = initialProperties.enableUndoRedo !== undefined ? initialProperties.enableUndoRedo : true; // 'history' is the correct option name
        options.indentation = initialProperties.indentation !== undefined ? initialProperties.indentation : 2;
        options.mainMenuBar = initialProperties.mainMenuBar !== undefined ? initialProperties.mainMenuBar : true;
        options.navigationBar = initialProperties.navigationBar !== undefined ? initialProperties.navigationBar : true;
        options.statusBar = initialProperties.statusBar !== undefined ? initialProperties.statusBar : true; // Note: library might not have this, check docs
        options.escapeUnicode = initialProperties.escapeUnicode !== undefined ? initialProperties.escapeUnicode : false;
        options.sortObjectKeys = initialProperties.sortObjectKeys !== undefined ? initialProperties.sortObjectKeys : false;
        options.theme = initialProperties.theme || undefined; // e.g., 'ace/theme/jsoneditor'
        
        // onEditable callback to handle readOnly state
        options.onEditable = function (node) {
            // Access live properties via instance.data.currentProperties
            if (instance.data.currentProperties && instance.data.currentProperties.isReadOnly) {
                console.log('JSONEditor Initialize - onEditable returning:', false);
                return false; // Not editable if isReadOnly is true
            }
            // Default: node is editable (field and value)
            // For specific node types, can return { field: boolean, value: boolean }
            console.log('JSONEditor Initialize - onEditable returning:', true);
            return true;
        };

        // Event Handlers
        options.onChange = function() {
            if (!instance.data.editor) return;
            try {
                const currentJson = instance.data.editor.get(); 
                const currentJsonString = instance.data.editor.getText();
                debouncedPublishJson(currentJsonString, currentJson); // This now also handles autobinding state
                
                const validationErrors = instance.data.editor.validate();
                if (validationErrors && validationErrors.length > 0) {
                   instance.publishState('isValidJson', false);
                   instance.publishState('errorMessages', validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`).join('\\n'));
                } else {
                   instance.publishState('isValidJson', true);
                   instance.publishState('errorMessages', '');
                }
                debouncedUpdateHeight(); // Update height on content change
            } catch (e) {
                // This catch is if .get() itself fails (e.g., text mode with invalid JSON)
                instance.publishState('isValidJson', false);
                instance.publishState('errorMessages', [e.message].join('\\n'));
                // Still publish the raw text
                instance.publishState('currentJsonText', instance.data.editor.getText());
                // instance.publishState('currentJsonObject', null); // Removed
                instance.publishState('bubble_fn_autobinding', instance.data.editor.getText()); // also for autobinding
                instance.triggerEvent('errorOccurred');
                debouncedUpdateHeight(); // Update height even on error
            }
        };

        options.onModeChange = function(newMode/*, oldMode*/) {
            if (!instance.data.editor) return;
            instance.publishState('currentMode', newMode);
            instance.triggerEvent('modeChanged');
            debouncedUpdateHeight(); // Mode change can affect height
        };
        
        options.onError = function(err) {
            // This is for parsing errors, schema validation errors if not caught by onValidate, etc.
            if (!instance.data.editor) return;
            instance.publishState('isValidJson', false);
            const errorMessages = Array.isArray(err)
                ? err.map(e => e.message || String(e))
                : [(err && err.message) ? err.message : String(err)];
            instance.publishState('errorMessages', errorMessages.join('\\n'));
            instance.triggerEvent('errorOccurred');
            context.reportDebugger('JSONEditor reported error(s): ' + errorMessages.join('; '));
        };
        
        options.onFocus = function() {
            if (!instance.data.editor) return;
            instance.triggerEvent('focused');
        };
        options.onBlur = function() {
            if (!instance.data.editor) return;
            instance.triggerEvent('blurred');
        };
        
        options.onValidate = function(validationResult) {
            // According to docs, onValidate receives an array of error objects.
            // An empty array means valid.
            if (!instance.data.editor) return;
            if (Array.isArray(validationResult) && validationResult.length > 0) {
               instance.publishState('isValidJson', false);
               instance.publishState('errorMessages', validationResult.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`).join('\\n'));
            } else {
               instance.publishState('isValidJson', true);
               instance.publishState('errorMessages', '');
            }
            instance.triggerEvent('validated');
        };

        options.onSelectionChange = function(startNode, endNode, path) { // API: onSelectionChange(start, end, path)
            if (!instance.data.editor) return;
            const pathString = path ? path.join('.') : ''; // path can be null if nothing selected or root selected
            instance.publishState('selectedPath', pathString);
        };

        let initialJsonData = {};
        if (initialProperties.initialJson) {
            try {
                initialJsonData = JSON.parse(initialProperties.initialJson);
            } catch (e) {
                context.reportDebugger('Error parsing initialJson property: ' + e.message + '. Raw: "' + initialProperties.initialJson + '"');
                // Initialize with an error object or let the editor handle the malformed string
                initialJsonData = { "json_parse_error": "Invalid initial JSON in properties.", "value": initialProperties.initialJson };
            }
        }

        // Instantiate the editor
        try {
            instance.data.editor = new JSONEditor(instance.data.editor_container, options, initialJsonData);
            
            // Initial state publishing after editor is successfully created
            instance.publishState('currentMode', instance.data.editor.getMode());
            
            let currentText = "{}"; // Default if get fails
            let currentJson = {};   // Default if get fails
            let isValidInitially = true;
            let initialErrorMessages = [];

            try {
                currentText = instance.data.editor.getText();
                currentJson = instance.data.editor.get(); // This might throw if initialJsonData was problematic
            } catch (e) {
                context.reportDebugger('Error getting initial text/JSON from editor: ' + e.message);
                isValidInitially = false;
                initialErrorMessages.push('Failed to load initial JSON: ' + e.message);
                // currentText might be the problematic string from initialJsonData if editor loaded it as text
            }
            
            instance.publishState('currentJsonText', currentText);
            // instance.publishState('currentJsonObject', isValidInitially ? currentJson : null); // Removed

            // Perform initial validation
            const validationErrors = instance.data.editor.validate();
            if (validationErrors && validationErrors.length > 0) {
               isValidInitially = false;
               initialErrorMessages.push(...validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`));
            }
            
            instance.publishState('isValidJson', isValidInitially);
            instance.publishState('errorMessages', initialErrorMessages.join('\\n'));

        } catch (e) {
            // This catches errors during new JSONEditor() instantiation
            console.error('Failed to create JSONEditor instance:', e);
            context.reportDebugger('Fatal: Failed to create JSONEditor instance: ' + e.message);
            if (instance.data.editor_container) {
                instance.data.editor_container.innerHTML = '<div style="color:red; padding:10px;">Error creating JSON Editor: ' + e.message + '</div>';
            }
            // instance.data.isReady will remain false, update.js won't proceed with this editor.
            return; // Exit setupEditorInstance if editor creation failed
        }
        
        // Initial height update
        debouncedUpdateHeight();

        // If "fit height to content" is enabled, we might need a ResizeObserver
        // to handle cases where the editor's internal size changes without an explicit event
        // (e.g. font loading, complex rendering).
        if (initialProperties.bubble && initialProperties.bubble.fit_height_to_content) {
            if (window.ResizeObserver) {
                instance.data.resizeObserver = new ResizeObserver(debouncedUpdateHeight);
                // Observe the most relevant internal container of jsoneditor.
                // This might be instance.data.editor_container or a child.
                // For josdejong/jsoneditor, the main container is usually instance.data.editor_container itself,
                // or instance.data.editor_container.querySelector('.jsoneditor')
                const editorMainElementToObserve = instance.data.editor_container.querySelector('.jsoneditor') || instance.data.editor_container;
                instance.data.resizeObserver.observe(editorMainElementToObserve);
            }
        }
        
        // If we reach here, editor is created. isReady will be set by update.js.
    };

};
