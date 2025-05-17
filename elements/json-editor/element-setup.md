# Interactive JSON Editor - Element Setup Guide

This document outlines the setup details for the "Interactive JSON Editor" Bubble plugin element, intended for use in the Bubble plugin editor.

## Element Definition

*   **Element Name (Internal):** `JSONEditor` (or a similar unique name you choose in the plugin editor)
*   **Display Name (Caption in Bubble Editor):** Interactive JSON Editor
*   **Description (Plugin Editor):** A powerful visual element to view, edit, format, and validate JSON documents. Supports various modes (tree, code, form, text, view), schema validation, search, undo/redo, and more. Utilizes the josdejong/jsoneditor library. Supports Bubble's autobinding feature and "fit height to content".
*   **Categories:** Visual Elements, Input Forms, Developer Tools (As per image: "Input form")
*   **Icon:** (You'll need to upload a suitable icon)
*   **Standard Bubble Properties:** Enable Resizable, Responsive, Background, Borders, Padding, Box Shadow, Font Style, "This element can fit width to content", "This element can fit height to content", "Support hovered and pressed states", "Support standard visible property" as per the provided image.
*   **Autobinding:** Supported. To enable, check "Support autobinding on the parent group's or page's thing" in Bubble's general properties for the element, and set "Modify fields with type" to `text`. The `Initial JSON` property (type: text) is designed to serve as the primary field for autobinding. The element publishes changes to Bubble's internal `bubble_fn_autobinding` state, which updates the bound data source.
*   **Element has an input field that is a custom type (Thing...):** No
*   **This element is a list:** No
*   **This element is a container:** No (It hosts its own UI, but doesn't act as a Bubble container for other elements)


## Properties (Fields)

These are the configurable fields for the element that users will set in the Bubble editor.

---

1.  **ID / Name:** `initialJson`
    *   **Caption:** Initial JSON
    *   **Type:** `text`
    *   **Editor Type:** Multiline Text Input (or "Field an expression that returns a text")
    *   **Default Value:** `{}`
    *   **Documentation:** The initial JSON string to load into the editor. Must be valid JSON. If empty or invalid, the editor might show an error or default to an empty object. This field is intended to be used for Bubble's autobinding feature when "Support autobinding..." is enabled and this property is selected as the data source for the autobinding.
    *   **Example:** `{"name": "John Doe", "age": 30}`

2.  **ID / Name:** `mode`
    *   **Caption:** Initial Mode
    *   **Type:** `text`
    *   **Editor Type:** Dropdown
    *   **Dropdown Options:** `tree` (default), `view`, `form`, `code`, `text`
    *   **Default Value:** `tree`
    *   **Documentation:** Sets the initial viewing/editing mode of the JSON editor.
        *   `tree`: Editable tree view.
        *   `view`: Read-only tree view.
        *   `form`: Editable form view (requires a schema for optimal use).
        *   `code`: Editable code view (text editor with syntax highlighting).
        *   `text`: Editable plain text view.

3.  **ID / Name:** `allowedModes`
    *   **Caption:** Allowed Modes (CSV - Optional)
    *   **Type:** `text`
    *   **Editor Type:** Text Input
    *   **Default Value:** (Leave blank, code defaults to all modes: 'tree,view,form,code,text')
    *   **Documentation:** (Optional) A comma-separated string of modes that the user can switch between using the editor's UI. If empty or not provided, all standard modes are allowed. Valid modes: 'tree', 'view', 'form', 'code', 'text'.
    *   **Example:** `tree,code,form`

4.  **ID / Name:** `schema`
    *   **Caption:** JSON Schema (Optional)
    *   **Type:** `text`
    *   **Editor Type:** Multiline Text Input (or "Field an expression that returns a text")
    *   **Default Value:** (Leave blank)
    *   **Documentation:** (Optional) A JSON Schema (as a string) to validate the JSON content against. Also used to structure the 'form' mode. See json-schema.org for details.
    *   **Example:** `{"type": "object", "properties": {"name": {"type": "string"}, "age": {"type": "integer"}}, "required": ["name"]}`

5.  **ID / Name:** `schemaRefs`
    *   **Caption:** JSON Schema Refs (Optional)
    *   **Type:** `text`
    *   **Editor Type:** Multiline Text Input (or "Field an expression that returns a text")
    *   **Default Value:** (Leave blank)
    *   **Documentation:** (Optional) An object (as a JSON string) containing schema definitions for `$ref` resolution within your main schema. Keys are IDs, values are schema objects.
    *   **Example:** `{"addressSchema": {"type": "object", "properties": {"street": {"type": "string"}}}}` (if your main schema uses `"$ref": "addressSchema"`)

6.  **ID / Name:** `enableSearch`
    *   **Caption:** Enable Search
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `yes`
    *   **Documentation:** If checked, shows the search box in the editor.

7.  **ID / Name:** `enableUndoRedo`
    *   **Caption:** Enable Undo/Redo (History)
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `yes`
    *   **Documentation:** If checked, enables history tracking for undo/redo operations.

8.  **ID / Name:** `indentation`
    *   **Caption:** Indentation (Spaces)
    *   **Type:** `number`
    *   **Editor Type:** Number Input (or "Field an expression that returns a number")
    *   **Default Value:** `2`
    *   **Documentation:** Number of spaces to use for indentation in 'code' and 'text' modes, and when formatting JSON. Min: 0, Max: 8 (recommended).

9.  **ID / Name:** `isReadOnly`
    *   **Caption:** Read-Only
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `no`
    *   **Documentation:** If checked, the editor content cannot be modified by the user through the UI. Actions like "Set JSON" can still change content.

10. **ID / Name:** `mainMenuBar`
    *   **Caption:** Show Main Menu Bar
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `yes`
    *   **Documentation:** If checked, displays the main menu bar of the editor (mode switcher, format, compact, etc.).

11. **ID / Name:** `navigationBar`
    *   **Caption:** Show Navigation Bar
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `yes`
    *   **Documentation:** If checked, displays the navigation bar (breadcrumbs) in 'tree' and 'form' modes.

12. **ID / Name:** `statusBar`
    *   **Caption:** Show Status Bar
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `yes`
    *   **Documentation:** If checked, displays the status bar at the bottom (shows cursor position, selection details - if supported by the library version/theme).

13. **ID / Name:** `escapeUnicode`
    *   **Caption:** Escape Unicode Characters
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `no`
    *   **Documentation:** If checked, unicode characters like '€' will be escaped as `\u20AC`.

14. **ID / Name:** `sortObjectKeys`
    *   **Caption:** Sort Object Keys Alphabetically
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `no`
    *   **Documentation:** If checked, keys of objects will be sorted alphabetically in 'tree', 'view', and 'form' modes.

15. **ID / Name:** `allowSchemaSuggestions`
    *   **Caption:** Allow Schema Suggestions
    *   **Type:** `boolean` ("yes/no")
    *   **Editor Type:** Checkbox
    *   **Default Value:** `no`
    *   **Documentation:** If checked and a schema is provided, enables autocomplete suggestions based on the schema.

16. **ID / Name:** `theme`
    *   **Caption:** Editor Theme (Optional)
    *   **Type:** `text`
    *   **Editor Type:** Text Input
    *   **Default Value:** (Leave blank for default theme)
    *   **Documentation:** (Optional) Specifies a theme for the editor, e.g., 'ace/theme/jsoneditor' or custom themes if supported. Consult library documentation for available themes.

---

## Exposed States

These are data values exposed by the element that can be used in Bubble expressions and workflows.

1.  **ID / Name:** `currentJsonText`
    *   **Caption:** Current JSON (Text)
    *   **Type:** `text`
    *   **Documentation:** The current content of the editor as a JSON string. Updated dynamically as the user types or content changes. When autobinding is configured with the 'Initial JSON' property, changes made in the editor are published via this text representation to update the bound data source.

2.  **ID / Name:** `isValidJson`
    *   **Caption:** Is Valid JSON
    *   **Type:** `boolean` ("yes/no")
    *   **Documentation:** `yes` if the current editor content is valid JSON and (if a schema is provided) validates against the schema. `no` otherwise.

3.  **ID / Name:** `errorMessages`
    *   **Caption:** Error Messages
    *   **Type:** `list of texts`
    *   **Documentation:** A list of error messages if the JSON is invalid or fails schema validation. Empty if valid.

4.  **ID / Name:** `currentMode`
    *   **Caption:** Current Mode
    *   **Type:** `text`
    *   **Documentation:** The current active mode of the editor (e.g., 'tree', 'code').

5.  **ID / Name:** `selectedPath`
    *   **Caption:** Selected Node Path
    *   **Type:** `text`
    *   **Documentation:** A dot-separated path to the currently selected node in the editor (e.g., "object.array[0].field"). Empty if no specific node is selected.

---

## Events

These are custom events triggered by the element that can start Bubble workflows.

1.  **ID / Name:** `jsonChanged`
    *   **Caption:** JSON Changed
    *   **Documentation:** Triggered when the JSON content in the editor is modified by the user or programmatically through an action like "Set JSON".

2.  **ID / Name:** `modeChanged`
    *   **Caption:** Mode Changed
    *   **Documentation:** Triggered when the editor's mode (tree, code, etc.) is changed.

3.  **ID / Name:** `errorOccurred`
    *   **Caption:** Error Occurred
    *   **Documentation:** Triggered when a JSON parsing error, schema validation error, or other operational error occurs within the editor. Check "Error Messages" state for details.

4.  **ID / Name:** `validated`
    *   **Caption:** Validation Ran
    *   **Documentation:** Triggered after a JSON schema validation attempt (either automatically or via the "Validate JSON" action). Check "Is Valid JSON" and "Error Messages" states for results.

5.  **ID / Name:** `focused`
    *   **Caption:** Editor Focused
    *   **Documentation:** Triggered when the editor gains focus.

6.  **ID / Name:** `blurred`
    *   **Caption:** Editor Blurred
    *   **Documentation:** Triggered when the editor loses focus.

---

## Actions

These are actions that can be called on the element in Bubble workflows.

1.  **ID / Name:** `setJson`
    *   **Caption:** Set JSON from String
    *   **Fields:**
        *   `jsonString` (ID: `jsonString`, Caption: JSON String, Type: `text`) - **Documentation:** The JSON string to load into the editor.
    *   **Documentation:** Replaces the editor's content with the provided JSON string. Users can convert Bubble objects to a JSON string using Bubble's `:formatted as JSON text` operator before passing it to this action.

2.  **ID / Name:** `setMode`
    *   **Caption:** Set Mode
    *   **Fields:**
        *   `mode` (ID: `mode`, Caption: Mode, Type: `text`, Editor: Dropdown, Options: `tree,view,form,code,text`) - **Documentation:** The mode to switch the editor to.
    *   **Documentation:** Changes the current viewing/editing mode of the editor.

4.  **ID / Name:** `setSchema`
    *   **Caption:** Set JSON Schema
    *   **Fields:**
        *   `schemaJson` (ID: `schemaJson`, Caption: Schema JSON, Type: `text`) - **Documentation:** The JSON Schema string.
        *   `schemaRefsJson` (ID: `schemaRefsJson`, Caption: Schema Refs JSON (Optional), Type: `text`) - **Documentation:** (Optional) JSON string for schema references.
    *   **Documentation:** Sets or updates the JSON schema used for validation and 'form' mode.

5.  **ID / Name:** `formatJson`
    *   **Caption:** Format JSON
    *   **Documentation:** Re-formats the current JSON content using the configured indentation. Primarily effective in 'code' or 'text' modes.

6.  **ID / Name:** `compactJson`
    *   **Caption:** Compact JSON
    *   **Documentation:** Removes non-essential whitespace from the JSON. May switch the editor to 'text' or 'code' mode.

7.  **ID / Name:** `expandAll`
    *   **Caption:** Expand All Nodes
    *   **Documentation:** Expands all collapsible nodes in 'tree' mode.

8.  **ID / Name:** `collapseAll`
    *   **Caption:** Collapse All Nodes
    *   **Documentation:** Collapses all nodes to their root level in 'tree' mode.

9.  **ID / Name:** `focusEditor`
    *   **Caption:** Focus Editor
    *   **Documentation:** Sets the keyboard focus to the JSON editor.

10. **ID / Name:** `repairJson`
    *   **Caption:** Repair JSON
    *   **Documentation:** Attempts to repair common issues in malformed JSON text using the library's built-in repair function. The content will be updated with the repaired version.

11. **ID / Name:** `validateJson`
    *   **Caption:** Validate JSON
    *   **Documentation:** Explicitly triggers validation of the current JSON content against the provided schema. Updates "Is Valid JSON" and "Error Messages" states and triggers the "Validated" event.

12. **ID / Name:** `refreshEditor`
    *   **Caption:** Refresh Editor
    *   **Documentation:** Forces the editor to refresh its user interface and update all rendered HTML. Useful after making changes that might affect the display but don't automatically trigger a refresh.
