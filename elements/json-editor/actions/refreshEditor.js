let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.editor) {
        try {
            instance.data.editor.refresh();
        } catch (e) {
            console.error('Error calling refresh() on JSONEditor instance:', e);
            context.reportDebugger('JSON Editor Refresh Action Error: ' + e.message);
        }
    } else {
        console.error('JSONEditor instance not found for refresh action.');
        context.reportDebugger('JSON Editor Refresh Action Error: Editor instance not ready.');
    }
};
