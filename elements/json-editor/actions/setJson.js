let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const jsonString = properties.jsonString;

        if (typeof jsonString === 'string') {
            try {
                // The library's .set() method is robust and can take a string or object.
                // If jsonString is indeed a string, parsing it first is safer to ensure it's valid JSON.
                const jsonObj = JSON.parse(jsonString);
                editor.set(jsonObj);
                
                // After setting, update states if necessary (onChange might do this)
                // Or, explicitly trigger validation and state updates
                const currentText = editor.getText();
                // const currentJson = editor.get(); // Object form not directly published as state
                instance.publishState('currentJsonText', currentText);
                // instance.publishState('currentJsonObject', currentJson); // Removed

                const validationErrors = editor.validate();
                if (validationErrors && validationErrors.length > 0) {
                   instance.publishState('isValidJson', false);
                   instance.publishState('errorMessages', validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`));
                } else {
                   instance.publishState('isValidJson', true);
                   instance.publishState('errorMessages', null);
                }
                instance.triggerEvent('jsonChanged'); // Explicitly trigger if onChange doesn't cover programmatic changes well

            } catch (e) {
                context.reportDebugger('setJson action: Error parsing input jsonString or setting JSON. ' + e.message);
                // Optionally, try editor.setText(jsonString) as a fallback if direct set fails
                // This might allow the editor to display the invalid string in 'text' or 'code' mode.
                try {
                    editor.setText(jsonString); // Fallback to setText
                    instance.publishState('currentJsonText', jsonString);
                    instance.publishState('isValidJson', false); // Likely invalid if parse failed
                    instance.publishState('errorMessages', 'Invalid JSON provided: ' + e.message);
                    instance.triggerEvent('errorOccurred');
                } catch (setTextError) {
                     context.reportDebugger('setJson action: Fallback setText also failed. ' + setTextError.message);
                }
            }
        } else {
            context.reportDebugger('setJson action: input jsonString is not a string.');
        }
    } else {
        context.reportDebugger('setJson action: Editor not ready or not found.');
    }
};
