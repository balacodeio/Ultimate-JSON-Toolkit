let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;

        try {
            // The validate method returns an array of error objects, or an empty array if valid.
            const validationErrors = editor.validate(); 
            
            if (validationErrors && validationErrors.length > 0) {
               instance.publishState('isValidJson', false);
               instance.publishState('errorMessages', validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`));
            } else {
               instance.publishState('isValidJson', true);
               instance.publishState('errorMessages', []);
            }
            
            // Trigger the 'validated' event, which is consistent with the onValidate callback.
            instance.triggerEvent('validated');
            
            // If there were errors, also trigger 'errorOccurred' for general error handling workflows.
            if (validationErrors && validationErrors.length > 0) {
                instance.triggerEvent('errorOccurred');
            }

        } catch (e) {
            // This catch would be for unexpected errors from the .validate() call itself,
            // though it's documented to return an array.
            context.reportDebugger('validateJson action: Error calling editor.validate(). ' + e.message);
            instance.publishState('isValidJson', false); // Assume invalid if validation call fails
            instance.publishState('errorMessages', ['Validation process error: ' + e.message]);
            instance.triggerEvent('errorOccurred');
        }
    } else {
        context.reportDebugger('validateJson action: Editor not ready or not found.');
    }
};
