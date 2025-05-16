let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const currentMode = editor.getMode();

        // collapseAll is most relevant for 'tree' mode.
        if (currentMode === 'tree') {
            try {
                editor.collapseAll();
            } catch (e) {
                context.reportDebugger('collapseAll action: Error calling editor.collapseAll(). ' + e.message);
            }
        } else {
            context.reportDebugger('collapseAll action: collapseAll is only applicable in "tree" mode. Current mode: ' + currentMode);
        }
    } else {
        context.reportDebugger('collapseAll action: Editor not ready or not found.');
    }
};
