let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const currentMode = editor.getMode();

        // expandAll is most relevant for 'tree' mode.
        // It might not have an effect or could error in other modes.
        if (currentMode === 'tree') {
            try {
                editor.expandAll();
            } catch (e) {
                context.reportDebugger('expandAll action: Error calling editor.expandAll(). ' + e.message);
            }
        } else {
            context.reportDebugger('expandAll action: expandAll is only applicable in "tree" mode. Current mode: ' + currentMode);
        }
    } else {
        context.reportDebugger('expandAll action: Editor not ready or not found.');
    }
};
