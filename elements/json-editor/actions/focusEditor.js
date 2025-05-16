let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        try {
            editor.focus();
            // The onFocus callback in initialize.js should trigger the 'focused' event.
        } catch (e) {
            context.reportDebugger('focusEditor action: Error calling editor.focus(). ' + e.message);
        }
    } else {
        context.reportDebugger('focusEditor action: Editor not ready or not found.');
    }
};
