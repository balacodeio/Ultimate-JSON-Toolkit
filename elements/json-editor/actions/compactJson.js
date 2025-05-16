let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;

        try {
            // Get the current JSON object
            const currentJson = editor.get();
            
            // Stringify it compactly
            const compactJsonString = JSON.stringify(currentJson); // No space argument for max compactness
            
            // Set the editor content with the compact string.
            // This will likely switch the editor mode to 'text' or 'code'.
            editor.setText(compactJsonString);

            // Update states as the text representation and possibly mode have changed
            instance.publishState('currentJsonText', compactJsonString);
            instance.publishState('currentJsonObject', currentJson); // Object itself is the same
            instance.publishState('currentMode', editor.getMode()); // Mode might have changed

            // jsonChanged event might be triggered by the editor's onChange handler.
            // modeChanged event might also be triggered.
            // If not, we might need to trigger them manually.
            // instance.triggerEvent('jsonChanged');
            // instance.triggerEvent('modeChanged');

        } catch (e) {
            context.reportDebugger('compactJson action: Error during compacting. ' + e.message);
            // This might happen if current content is not valid JSON and editor.get() fails.
            instance.publishState('isValidJson', false);
            instance.publishState('errorMessages', ['Compacting error: ' + e.message]);
            instance.triggerEvent('errorOccurred');
        }
    } else {
        context.reportDebugger('compactJson action: Editor not ready or not found.');
    }
};
