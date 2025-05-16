let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;

        if (window.JSONEditor && typeof window.JSONEditor.repairJSON === 'function') {
            try {
                const currentText = editor.getText();
                // The repairJSON function is a static method on the JSONEditor constructor
                const repairedText = window.JSONEditor.repairJSON(currentText);
                
                editor.setText(repairedText);

                // After setting, update states
                // The onChange handler should manage publishing currentJsonText, currentJsonObject, isValidJson, etc.
                // However, setText might not trigger onChange if the content is identical after repair,
                // or if repair results in the same invalid state.
                // It's good to explicitly update states here.

                let newJson, newIsValid;
                let newErrorMessages = [];
                try {
                    newJson = editor.get(); // Try to get the object form
                    newIsValid = true; // If get() succeeds, it's valid
                    const validationErrors = editor.validate(); // Check schema validation
                    if (validationErrors && validationErrors.length > 0) {
                        newIsValid = false;
                        newErrorMessages = validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`);
                    }
                } catch (e) {
                    newJson = null; // Or keep the text form if object is not retrievable
                    newIsValid = false;
                    newErrorMessages.push('Repaired JSON still not valid: ' + e.message);
                }

                instance.publishState('currentJsonText', repairedText);
                // instance.publishState('currentJsonObject', newJson); // Removed
                instance.publishState('isValidJson', newIsValid);
                instance.publishState('errorMessages', newErrorMessages);
                
                // Trigger jsonChanged as content might have changed
                instance.triggerEvent('jsonChanged');
                if (!newIsValid) {
                    instance.triggerEvent('errorOccurred');
                }


            } catch (e) {
                context.reportDebugger('repairJson action: Error during JSON repair process. ' + e.message);
                // This catch is for errors in the repair logic itself, not necessarily JSON validity.
            }
        } else {
            context.reportDebugger('repairJson action: JSONEditor.repairJSON static method not found.');
        }
    } else {
        context.reportDebugger('repairJson action: Editor not ready or not found.');
    }
};
