let update = function(instance, properties, context) {
    'use strict';

    // Store live properties for access by callbacks (like onEditable)
    instance.data.currentProperties = properties;

    // If the editor instance hasn't been created yet (first run of update)
    if (!instance.data.isReady) {
        if (typeof instance.data.setupEditorInstance === 'function') {
            instance.data.setupEditorInstance(properties);
            // setupEditorInstance will attempt to create instance.data.editor.
            // It will not set isReady itself if it fails.
            if (instance.data.editor) { // Check if editor was successfully created
                 instance.data.isReady = true;
            } else {
                // Editor creation failed, setupEditorInstance should have reported.
                // isReady remains false.
                return; 
            }
        } else {
            // This should not happen if initialize.js ran correctly
            console.error('setupEditorInstance function not found on instance.data.');
            context.reportDebugger('Critical error: setupEditorInstance not found.');
            return;
        }
    }

    // If editor is ready and exists, handle property updates
    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const lastProps = instance.data.lastProperties || {};
        let optionsToUpdate = {};
        let needsOptionUpdate = false;
        let heightRecalculationNeeded = false;

        // Handle changes to bubble properties like fit_height_to_content
        if (properties.bubble && lastProps.bubble) {
            if (properties.bubble.fit_height_to_content !== lastProps.bubble.fit_height_to_content) {
                heightRecalculationNeeded = true;
                if (properties.bubble.fit_height_to_content) {
                    instance.data.editor_container.style.height = 'auto'; // Allow it to size naturally
                    // Re-initialize ResizeObserver if it wasn't active or re-observe
                    if (window.ResizeObserver && !instance.data.resizeObserver) {
                        instance.data.resizeObserver = new ResizeObserver(instance.data.debouncedUpdateHeight || instance.data.updateElementHeight);
                        const elToObserve = instance.data.editor_container.querySelector('.jsoneditor') || instance.data.editor_container;
                        instance.data.resizeObserver.observe(elToObserve);
                    }
                } else {
                    // Fixed height mode (Bubble controls via instance.canvas)
                    instance.data.editor_container.style.height = '100%';
                    if (instance.data.resizeObserver) {
                        instance.data.resizeObserver.disconnect();
                        // delete instance.data.resizeObserver; // or set to null
                    }
                }
            }
        }


        // Helper to compare values, especially for complex types or Bubble lists
        function bubbleListsAreEqual(list1, list2) {
            if (!list1 && !list2) return true;
            if (!list1 || !list2) return false;
            if (typeof list1.length !== 'function' || typeof list2.length !== 'function' ||
                typeof list1.get !== 'function' || typeof list2.get !== 'function') {
                // Not Bubble lists, fallback to simple comparison or assume different if structure mismatch
                return JSON.stringify(list1) === JSON.stringify(list2); 
            }
            if (list1.length() !== list2.length()) return false;
            const arr1 = list1.get(0, list1.length());
            const arr2 = list2.get(0, list2.length());
            return JSON.stringify(arr1) === JSON.stringify(arr2);
        }

        // Check for changes in properties and update the editor accordingly

        // initialJson: This is tricky. It's "initial".
        // If the user changes it in Bubble, should it overwrite editor content?
        // Typically, an "initial" property is only used once.
        // For a dynamic update, a different property like "currentJsonContent" or an action "setJson" is better.
        // For now, let's assume if `initialJson` changes, we update the editor.
        if (properties.initialJson !== lastProps.initialJson) {
            try {
                const newJson = JSON.parse(properties.initialJson);
                // Only update if the text content is actually different to avoid losing editor state
                if (editor.getText() !== properties.initialJson) {
                     editor.set(newJson); // .set() is preferred as it takes an object
                }
            } catch (e) {
                context.reportDebugger('Error parsing properties.initialJson in update: ' + e.message);
                // editor.setText(properties.initialJson); // Try setting as text if parse fails, editor might handle
            }
        }

        if (properties.mode !== lastProps.mode && properties.mode !== editor.getMode()) {
            try {
                editor.setMode(properties.mode);
            } catch (e) {
                 context.reportDebugger('Error setting mode in update: ' + e.message);
            }
        }

        if (properties.schema !== lastProps.schema) {
            try {
                const newSchema = properties.schema ? JSON.parse(properties.schema) : undefined;
                // The setSchema method might also take schemaRefs. Check API.
                // For now, assuming setSchema only takes the main schema.
                // If schemaRefs also changed, they should be passed together.
                let newSchemaRefs = editor.options.schemaRefs; // Keep existing if not changed
                if (properties.schemaRefs !== lastProps.schemaRefs) {
                    newSchemaRefs = properties.schemaRefs ? JSON.parse(properties.schemaRefs) : undefined;
                }
                editor.setSchema(newSchema, newSchemaRefs); 
            } catch (e) {
                context.reportDebugger('Error parsing/setting schema in update: ' + e.message);
            }
        } else if (properties.schemaRefs !== lastProps.schemaRefs) { // Schema didn't change, but refs did
             try {
                const currentSchema = editor.options.schema;
                const newSchemaRefs = properties.schemaRefs ? JSON.parse(properties.schemaRefs) : undefined;
                editor.setSchema(currentSchema, newSchemaRefs);
             } catch (e) {
                context.reportDebugger('Error parsing/setting schemaRefs in update: ' + e.message);
             }
        }
        
        // For other options, collect them and use updateOptions if they changed
        if (properties.enableSearch !== lastProps.enableSearch) {
            optionsToUpdate.search = properties.enableSearch;
            needsOptionUpdate = true;
        }
        if (properties.enableUndoRedo !== lastProps.enableUndoRedo) {
            optionsToUpdate.history = properties.enableUndoRedo;
            needsOptionUpdate = true;
        }
        if (properties.indentation !== lastProps.indentation) {
            optionsToUpdate.indentation = properties.indentation;
            needsOptionUpdate = true;
        }
        if (properties.mainMenuBar !== lastProps.mainMenuBar) {
            optionsToUpdate.mainMenuBar = properties.mainMenuBar;
            needsOptionUpdate = true;
            heightRecalculationNeeded = true;
        }
        if (properties.navigationBar !== lastProps.navigationBar) {
            optionsToUpdate.navigationBar = properties.navigationBar;
            needsOptionUpdate = true;
            heightRecalculationNeeded = true;
        }
        if (properties.statusBar !== lastProps.statusBar) {
            optionsToUpdate.statusBar = properties.statusBar; // Assuming library supports this in updateOptions
            needsOptionUpdate = true;
            heightRecalculationNeeded = true;
        }
        if (properties.escapeUnicode !== lastProps.escapeUnicode) {
            optionsToUpdate.escapeUnicode = properties.escapeUnicode;
            needsOptionUpdate = true;
        }
        if (properties.sortObjectKeys !== lastProps.sortObjectKeys) {
            optionsToUpdate.sortObjectKeys = properties.sortObjectKeys;
            needsOptionUpdate = true;
        }
        if (properties.theme !== lastProps.theme) {
            optionsToUpdate.theme = properties.theme;
            needsOptionUpdate = true;
        }
        if (properties.allowedModes !== lastProps.allowedModes) { // Compare as strings first
            if (typeof properties.allowedModes === 'string' && properties.allowedModes.trim() !== '') {
                try {
                    const modesArray = properties.allowedModes.split(',').map(mode => mode.trim()).filter(mode => mode.length > 0);
                    if (modesArray.length > 0) {
                        optionsToUpdate.modes = modesArray;
                    } else {
                        optionsToUpdate.modes = ['tree', 'view', 'form', 'code', 'text'];
                    }
                    needsOptionUpdate = true;
                } catch (e) { 
                    context.reportDebugger('Error processing allowedModes CSV string in update: ' + e.message);
                    // Potentially set to default or skip update for this option
                }
            } else if (typeof properties.allowedModes === 'string' && properties.allowedModes.trim() === '') {
                 // Empty string means default all modes
                 optionsToUpdate.modes = ['tree', 'view', 'form', 'code', 'text'];
                 needsOptionUpdate = true;
            }
            // If properties.allowedModes is null/undefined, it might mean use default,
            // which is handled by the editor or initial setup.
            // If it was explicitly set to null from a previous string value, then update.
            else if (properties.allowedModes === null && lastProps.allowedModes !== null) {
                 optionsToUpdate.modes = ['tree', 'view', 'form', 'code', 'text']; // Default
                 needsOptionUpdate = true;
            }
        }

        // isReadOnly is handled by the onEditable callback, which reads live instance.data.currentProperties.
        // If isReadOnly changes, the callback will pick it up on next edit attempt.
        // No direct editor.setReadOnly() method usually, but if there was, we'd call it here.
        // If a visual change is needed immediately (e.g. styling), editor.refresh() or similar might be needed.
        // For jsoneditor, onEditable is dynamic.

        if (needsOptionUpdate) {
            try {
                editor.updateOptions(optionsToUpdate);
            } catch (e) {
                context.reportDebugger('Error calling editor.updateOptions: ' + e.message);
            }
        }

        if (heightRecalculationNeeded && typeof instance.data.updateElementHeight === 'function') {
            // Use the debounced version if available from initialize.js
            const updateFn = instance.data.debouncedUpdateHeight || instance.data.updateElementHeight;
            updateFn();
        }

        // After all updates, save a deep copy of the current properties for the next comparison
        try {
            instance.data.lastProperties = JSON.parse(JSON.stringify(properties));
        } catch (e) {
            context.reportDebugger('Could not deep copy properties in update: ' + e.message);
            // If deep copy fails, subsequent updates might trigger more than necessary.
            // A more robust deep copy for Bubble objects might be needed if this becomes an issue.
            instance.data.lastProperties = Object.assign({}, properties); // Shallow copy as fallback
        }
    }
};
