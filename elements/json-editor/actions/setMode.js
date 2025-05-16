let action = function(instance, properties, context) {
    'use strict';

    if (instance.data.isReady && instance.data.editor) {
        const editor = instance.data.editor;
        const newMode = properties.mode; // e.g., 'tree', 'code', 'form', 'text', 'view'

        if (typeof newMode === 'string') {
            try {
                editor.setMode(newMode);
                // The onModeChange callback in initialize.js should handle state publishing.
                // instance.publishState('currentMode', newMode); // Already handled by onModeChange
                // instance.triggerEvent('modeChanged'); // Already handled by onModeChange
            } catch (e) {
                context.reportDebugger('setMode action: Error setting mode to "' + newMode + '". ' + e.message);
                // Potentially publish an error state or trigger an error event if mode set fails
            }
        } else {
            context.reportDebugger('setMode action: input mode is not a string.');
        }
    } else {
        context.reportDebugger('setMode action: Editor not ready or not found.');
    }
};
