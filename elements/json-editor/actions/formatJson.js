let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;

        try {
            // Get the current JSON object
            const currentJson = editor.get();
            
            // Re-set the JSON. This will re-serialize it according to the editor's
            // current settings, including indentation if in 'code' or 'text' mode.
            editor.set(currentJson);

            // Update states as the text representation might have changed
            const currentText = editor.getText();
            // currentJson object itself hasn't changed structurally
            instance.publishState('currentJsonText', currentText); 
            // instance.publishState('currentJsonObject', currentJson); // Object is the same
            
            // jsonChanged event might be triggered by the editor's onChange handler if .set() invokes it.
            // If not, we might need to trigger it manually if formatting is considered a change.
            // instance.triggerEvent('jsonChanged'); 

        } catch (e) {
            context.reportDebugger('formatJson action: Error during formatting. ' + e.message);
            // This might happen if current content is not valid JSON and editor.get() fails.
            instance.publishState('isValidJson', false);
            instance.publishState('errorMessages', ['Formatting error: ' + e.message]);
            instance.triggerEvent('errorOccurred');
        }
    } else {
        context.reportDebugger('formatJson action: Editor not ready or not found.');
    }
};
