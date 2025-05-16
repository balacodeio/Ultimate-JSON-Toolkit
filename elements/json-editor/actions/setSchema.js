let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const schemaJsonString = properties.schemaJson;
        const schemaRefsJsonString = properties.schemaRefsJson; // Optional

        let schema, schemaRefs;

        if (typeof schemaJsonString === 'string' && schemaJsonString.trim() !== '') {
            try {
                schema = JSON.parse(schemaJsonString);
            } catch (e) {
                context.reportDebugger('setSchema action: Error parsing schemaJson. ' + e.message);
                // Potentially trigger an error or set an error state
                instance.publishState('isValidJson', instance.data.editor.validate().length === 0); // Re-check current JSON validity
                instance.publishState('errorMessages', ['Invalid Schema JSON: ' + e.message]);
                instance.triggerEvent('errorOccurred');
                return; // Stop if schema is invalid
            }
        } else if (schemaJsonString === null || schemaJsonString.trim() === '') {
            // Allow unsetting the schema by passing null or empty string
            schema = undefined;
        } else {
            context.reportDebugger('setSchema action: schemaJson is not a string or is invalid.');
            return;
        }
        
        if (typeof schemaRefsJsonString === 'string' && schemaRefsJsonString.trim() !== '') {
            try {
                schemaRefs = JSON.parse(schemaRefsJsonString);
            } catch (e) {
                context.reportDebugger('setSchema action: Error parsing schemaRefsJson. ' + e.message);
                // Continue with schema only if schemaRefs are problematic but optional
            }
        } else if (schemaRefsJsonString === null || schemaRefsJsonString.trim() === '') {
            schemaRefs = undefined;
        }


        try {
            editor.setSchema(schema, schemaRefs);
            // After setting schema, re-validate current content and update states
            const validationErrors = editor.validate();
            if (validationErrors && validationErrors.length > 0) {
               instance.publishState('isValidJson', false);
               instance.publishState('errorMessages', validationErrors.map(e => `${e.path ? e.path.join('.') : 'doc_root'} - ${e.message}`));
            } else {
               instance.publishState('isValidJson', true);
               instance.publishState('errorMessages', []);
            }
            instance.triggerEvent('validated'); // Trigger validated event as schema change affects validation

        } catch (e) {
            context.reportDebugger('setSchema action: Error in editor.setSchema(). ' + e.message);
            instance.publishState('isValidJson', false); // Assume invalid if setSchema fails
            instance.publishState('errorMessages', ['Error applying schema: ' + e.message]);
            instance.triggerEvent('errorOccurred');
        }

    } else {
        context.reportDebugger('setSchema action: Editor not ready or not found.');
    }
};
