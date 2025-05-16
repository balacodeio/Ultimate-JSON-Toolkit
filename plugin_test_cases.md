# Bubble.io Plugin Test Cases: Ultimate JSON Toolkit

This document outlines test cases for the Server-Side Actions (SSAs) and Element Actions of the Ultimate JSON Toolkit plugin. These tests should be performed within the Bubble.io editor.

## I. Server-Side Actions (SSAs)

### A. SSA: Compact JSON (`actions/server/compact_json.js`)
   - **Inputs:**
     - `json_string` (text): The JSON string to compact.
   - **Outputs:**
     - `compacted_json` (text): The compacted JSON string.
     - `error` (text): Error message if any.
   - **Test Cases:**
     1.  **Valid Formatted JSON:**
         *   Input `json_string`: `{\n  "name": "John Doe",\n  "age": 30,\n  "isStudent": false\n}`
         *   Expected `compacted_json`: `{"name":"John Doe","age":30,"isStudent":false}`
         *   Expected `error`: (empty or null)
     2.  **Already Compacted JSON:**
         *   Input `json_string`: `{"name":"Jane Doe","city":"New York"}`
         *   Expected `compacted_json`: `{"name":"Jane Doe","city":"New York"}`
         *   Expected `error`: (empty or null)
     3.  **Invalid JSON (Syntax Error):**
         *   Input `json_string`: `{\n  "name": "John Doe",\n  "age": 30,\n  "isStudent": false,\n}` (trailing comma)
         *   Expected `compacted_json`: (empty or null)
         *   Expected `error`: (contains a message like "Invalid JSON input: Unexpected token } in JSON at position X" or similar)
     4.  **Empty JSON String:**
         *   Input `json_string`: `""` (empty string)
         *   Expected `compacted_json`: (empty or null)
         *   Expected `error`: "Input JSON string is empty or not a string."
     5.  **Null Input:**
         *   Input `json_string`: (expression evaluating to null)
         *   Expected `compacted_json`: (empty or null)
         *   Expected `error`: "Input JSON string is empty or not a string."
     6.  **Non-JSON String:**
         *   Input `json_string`: `"Just a regular string"`
         *   Expected `compacted_json`: (empty or null)
         *   Expected `error`: (contains a message like "Invalid JSON input: Unexpected token J in JSON at position 0" or similar for non-object/array strings)
     7.  **JSON with Special Characters:**
         *   Input `json_string`: `{\n  "message": "Hello\\nWorld"\n}`
         *   Expected `compacted_json`: `{"message":"Hello\\nWorld"}`
         *   Expected `error`: (empty or null)

### B. SSA: Dot Notation to JSON (`actions/server/dot-notation-to-json.js`)
   - **Inputs:**
     - `source` (text, enum: "Text Block" or "Text List"): Source of the dot notation data.
     - `text_block` (text): Dot notation lines as a single string (if `source` is "Text Block").
     - `text_list` (list of texts): Dot notation lines as a list (if `source` is "Text List").
     - `value_separator` (text, optional): Separator between key and value (default: `=`).
     - `notation_separator` (text, optional): Separator for dot notation keys (default: `.`).
   - **Outputs:**
     - `json_output` (JSON Object): The resulting JSON object.
     - `is_error` (boolean): True if an error occurred.
     - `error_message` (text): Error details.
   - **Test Cases:**
     1.  **Simple Conversion (Text Block, Default Separators):**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `user.name=John Doe\nuser.age=30\naddress.city=New York`
         *   Expected `json_output`: `{"user": {"name": "John Doe", "age": "30"}, "address": {"city": "New York"}}`
         *   Expected `is_error`: false
         *   Expected `error_message`: (empty or null)
     2.  **Simple Conversion (Text List, Default Separators):**
         *   Input `source`: "Text List"
         *   Input `text_list`: `["user.name=John Doe", "user.age=30", "address.city=New York"]`
         *   Expected `json_output`: `{"user": {"name": "John Doe", "age": "30"}, "address": {"city": "New York"}}`
         *   Expected `is_error`: false
     3.  **Custom Value Separator (e.g., `:`):**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `user.name:Jane Doe\nuser.occupation:Engineer`
         *   Input `value_separator`: `:`
         *   Expected `json_output`: `{"user": {"name": "Jane Doe", "occupation": "Engineer"}}`
         *   Expected `is_error`: false
     4.  **Custom Notation Separator (e.g., `_`):**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `user_name=Max\nuser_id=123`
         *   Input `notation_separator`: `_`
         *   Expected `json_output`: `{"user": {"name": "Max", "id": "123"}}`
         *   Expected `is_error`: false
     5.  **Mixed Custom Separators:**
         *   Input `source`: "Text List"
         *   Input `text_list`: `["config-path-value /opt/app", "config-debug-enabled /true"]`
         *   Input `value_separator`: ` ` (space)
         *   Input `notation_separator`: `-`
         *   Expected `json_output`: `{"config": {"path": {"value": "/opt/app"}, "debug": {"enabled": "/true"}}}` (Note: values are strings)
         *   Expected `is_error`: false
     6.  **Empty Input (Text Block):**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `""`
         *   Expected `json_output`: `{}` (or null depending on library behavior for empty input)
         *   Expected `is_error`: false (or true if it's considered an error by the action)
         *   Expected `error_message`: (empty or "Dot Notation to JSON: No source data provided." if empty is an error)
     7.  **Empty Input (Text List):**
         *   Input `source`: "Text List"
         *   Input `text_list`: (empty list)
         *   Expected `json_output`: `{}` (or null)
         *   Expected `is_error`: false (or true)
     8.  **Malformed Line (Missing Value Separator):**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `user.nameJohnDoe`
         *   Expected `json_output`: `{}` (or how the library handles it)
         *   Expected `is_error`: false (likely, as it might skip the line)
     9.  **Line with Only Key:**
         *   Input `source`: "Text Block"
         *   Input `text_block`: `user.name=`
         *   Expected `json_output`: `{"user": {"name": ""}}`
         *   Expected `is_error`: false
     10. **No Source Data Provided:**
         *   Input `source`: "Text Block"
         *   Input `text_block`: (null)
         *   Expected `json_output`: null
         *   Expected `is_error`: true
         *   Expected `error_message`: "Dot Notation to JSON: No source data provided."

### C. SSA: Extract from JSON (`actions/server/extract-from-json.js`)
   - **Inputs:**
     - `json_data` (text): The JSON string to query.
     - `json_path_query` (text): The JSONPath query.
     - `wrap_results` (boolean, optional, default: true): Whether to stringify non-string results.
     - `prevent_eval` (boolean, optional, default: true): Prevent JSONPath `eval`.
   - **Outputs:**
     - `result` (text): The first result item, or null.
     - `result_list` (list of texts): All result items.
     - `is_error` (boolean): True if an error occurred.
     - `error_message` (text): Error details.
   - **Test Cases:**
     1.  **Basic Path (String Result):**
         *   Input `json_data`: `{"name": "Alice", "age": 25}`
         *   Input `json_path_query`: `$.name`
         *   Expected `result`: "Alice"
         *   Expected `result_list`: `["Alice"]`
         *   Expected `is_error`: false
     2.  **Basic Path (Number Result, wrap_results=true):**
         *   Input `json_data`: `{"name": "Alice", "age": 25}`
         *   Input `json_path_query`: `$.age`
         *   Input `wrap_results`: true (or default)
         *   Expected `result`: "25"
         *   Expected `result_list`: `["25"]`
         *   Expected `is_error`: false
     3.  **Basic Path (Number Result, wrap_results=false):**
         *   Input `json_data`: `{"name": "Alice", "age": 25}`
         *   Input `json_path_query`: `$.age`
         *   Input `wrap_results`: false
         *   Expected `result`: 25 (Bubble will show as text "25")
         *   Expected `result_list`: `[25]` (Bubble will show as list of texts `["25"]`)
         *   Expected `is_error`: false
     4.  **Path to Object (wrap_results=true):**
         *   Input `json_data`: `{"user": {"name": "Bob", "id": 101}}`
         *   Input `json_path_query`: `$.user`
         *   Input `wrap_results`: true (or default)
         *   Expected `result`: `{"name":"Bob","id":101}`
         *   Expected `result_list`: `["{\"name\":\"Bob\",\"id\":101}"]`
         *   Expected `is_error`: false
     5.  **Path to Object (wrap_results=false):**
         *   Input `json_data`: `{"user": {"name": "Bob", "id": 101}}`
         *   Input `json_path_query`: `$.user`
         *   Input `wrap_results`: false
         *   Expected `result`: `{"name":"Bob","id":101}`
         *   Expected `result_list`: `["{\"name\":\"Bob\",\"id\":101}"]` (Objects are still stringified)
         *   Expected `is_error`: false
     6.  **Path to Array of Strings (wrap_results=true):**
         *   Input `json_data`: `{"tags": ["dev", "test"]}`
         *   Input `json_path_query`: `$.tags`
         *   Input `wrap_results`: true
         *   Expected `result`: `["dev","test"]` (The array itself is stringified)
         *   Expected `result_list`: `["[\"dev\",\"test\"]"]`
         *   Expected `is_error`: false
     7.  **Path to Array Items (Wildcard):**
         *   Input `json_data`: `{"items": [{"id":1,"val":"A"}, {"id":2,"val":"B"}]}`
         *   Input `json_path_query`: `$.items[*].val`
         *   Expected `result`: "A"
         *   Expected `result_list`: `["A", "B"]`
         *   Expected `is_error`: false
     8.  **No Match:**
         *   Input `json_data`: `{"name": "Alice"}`
         *   Input `json_path_query`: `$.address`
         *   Expected `result`: null
         *   Expected `result_list`: (empty list)
         *   Expected `is_error`: false
     9.  **Invalid JSON Data:**
         *   Input `json_data`: `{"name": "Alice",`
         *   Input `json_path_query`: `$.name`
         *   Expected `result`: null
         *   Expected `result_list`: (empty list)
         *   Expected `is_error`: true
         *   Expected `error_message`: (contains "Invalid JSON data provided:")
     10. **Invalid JSONPath Query:**
         *   Input `json_data`: `{"name": "Alice"}`
         *   Input `json_path_query`: `$.[]` (invalid syntax)
         *   Expected `result`: null
         *   Expected `result_list`: (empty list)
         *   Expected `is_error`: true
         *   Expected `error_message`: (contains "Error executing JSONPath query:")
     11. **Empty JSON Data:**
         *   Input `json_data`: `""`
         *   Input `json_path_query`: `$.name`
         *   Expected `is_error`: true
         *   Expected `error_message`: "JSON data cannot be empty."
     12. **Empty JSONPath Query:**
         *   Input `json_data`: `{"name": "Alice"}`
         *   Input `json_path_query`: `""`
         *   Expected `is_error`: true
         *   Expected `error_message`: "JSONPath query cannot be empty."
     13. **Result is null in JSON (wrap_results=true):**
         *   Input `json_data`: `{"value": null}`
         *   Input `json_path_query`: `$.value`
         *   Input `wrap_results`: true
         *   Expected `result`: "null"
         *   Expected `result_list`: `["null"]`
         *   Expected `is_error`: false
     14. **Result is null in JSON (wrap_results=false):**
         *   Input `json_data`: `{"value": null}`
         *   Input `json_path_query`: `$.value`
         *   Input `wrap_results`: false
         *   Expected `result`: "null" (as per code `item === null ? 'null'`)
         *   Expected `result_list`: `["null"]`
         *   Expected `is_error`: false

### D. SSA: JSON to Dot Notation (`actions/server/json-to-dot-notation.js`)
   - **Inputs:**
     - `source_json` (text): The JSON string to convert.
     - `dot_notation_separator` (text, optional): Separator for dot notation keys (default: `.`).
     - `key_value_separator` (text, optional): Separator for key-value pair strings (default: ` = `).
   - **Outputs:**
     - `dot_notation_keys` (list of texts): List of keys in dot notation.
     - `dot_notation_key_values` (list of texts): List of "key<separator>value" strings.
   - **Test Cases:**
     1.  **Simple JSON (Default Separators):**
         *   Input `source_json`: `{"user": {"name": "John", "age": 30}, "status": "active"}`
         *   Expected `dot_notation_keys`: `["user.name", "user.age", "status"]` (order may vary)
         *   Expected `dot_notation_key_values`: `["user.name = John", "user.age = 30", "status = active"]` (order may vary, values are stringified)
     2.  **Custom Dot Notation Separator (e.g., `_`):**
         *   Input `source_json`: `{"config": {"retry": true, "timeout": 5000}}`
         *   Input `dot_notation_separator`: `_`
         *   Expected `dot_notation_keys`: `["config_retry", "config_timeout"]`
         *   Expected `dot_notation_key_values`: `["config_retry = true", "config_timeout = 5000"]`
     3.  **Custom Key-Value Separator (e.g., `::`):**
         *   Input `source_json`: `{"item": "test", "value": 123}`
         *   Input `key_value_separator`: `::`
         *   Expected `dot_notation_keys`: `["item", "value"]`
         *   Expected `dot_notation_key_values`: `["item::test", "value::123"]`
     4.  **JSON with Array:**
         *   Input `source_json`: `{"user": {"tags": ["admin", "editor"]}}`
         *   Expected `dot_notation_keys`: `["user.tags.0", "user.tags.1"]`
         *   Expected `dot_notation_key_values`: `["user.tags.0 = admin", "user.tags.1 = editor"]`
     5.  **JSON with Null Value:**
         *   Input `source_json`: `{"data": null, "info": {"valid": true}}`
         *   Expected `dot_notation_keys`: `["data", "info.valid"]`
         *   Expected `dot_notation_key_values`: `["data = null", "info.valid = true"]`
     6.  **Invalid JSON Input:**
         *   Input `source_json`: `{"user": "test",`
         *   Expected `dot_notation_keys`: (empty list)
         *   Expected `dot_notation_key_values`: (empty list) (Error logged server-side)
     7.  **Empty JSON String:**
         *   Input `source_json`: `""`
         *   Expected `dot_notation_keys`: (empty list)
         *   Expected `dot_notation_key_values`: (empty list)
     8.  **Empty Object JSON:**
         *   Input `source_json`: `{}`
         *   Expected `dot_notation_keys`: (empty list)
         *   Expected `dot_notation_key_values`: (empty list)

### E. SSA: Transform JSON Schema (`actions/server/transform_json_schema.js`)
   - **Inputs:**
     - `input_data` (text): JSON string or JSON Schema string.
     - `conversion_direction` (text, enum: "JSON to Schema" or "Schema to JSON").
   - **Outputs:**
     - `output_data` (text): Resulting JSON Schema or generated JSON.
     - `error_message` (text): Error details.
   - **Test Cases:**
     1.  **JSON to Schema (Simple Object):**
         *   Input `input_data`: `{"name": "Example", "count": 10, "isActive": true}`
         *   Input `conversion_direction`: "JSON to Schema"
         *   Expected `output_data`: (A valid JSON schema string representing the input, e.g., `{"type":"object","properties":{"name":{"type":"string"},"count":{"type":"integer"},"isActive":{"type":"boolean"}},"required":["name","count","isActive"]}`) - exact output may vary by library.
         *   Expected `error_message`: (empty or null)
     2.  **JSON to Schema (Nested Object & Array):**
         *   Input `input_data`: `{"user": {"id": "u1", "roles": ["admin", "user"]}}`
         *   Input `conversion_direction`: "JSON to Schema"
         *   Expected `output_data`: (A valid JSON schema string)
         *   Expected `error_message`: (empty or null)
     3.  **Schema to JSON (Simple Schema):**
         *   Input `input_data`: `{"type":"object","properties":{"name":{"type":"string","minLength":1},"age":{"type":"integer","minimum":0}},"required":["name","age"]}`
         *   Input `conversion_direction`: "Schema to JSON"
         *   Expected `output_data`: (A valid JSON string conforming to the schema, e.g., `{"name":"someString","age":10}`) - values will be fake/generated.
         *   Expected `error_message`: (empty or null)
     4.  **Schema to JSON (Schema with Array):**
         *   Input `input_data`: `{"type":"object","properties":{"tags":{"type":"array","items":{"type":"string"}}}}`
         *   Input `conversion_direction`: "Schema to JSON"
         *   Expected `output_data`: (A valid JSON string with a "tags" array of strings)
         *   Expected `error_message`: (empty or null)
     5.  **Invalid Input JSON (for JSON to Schema):**
         *   Input `input_data`: `{"name": "test",`
         *   Input `conversion_direction`: "JSON to Schema"
         *   Expected `output_data`: null
         *   Expected `error_message`: (contains "Invalid JSON:")
     6.  **Invalid Input Schema (for Schema to JSON):**
         *   Input `input_data`: `{"type":"object","properties":{"name":{"type":"invalidType"}}}`
         *   Input `conversion_direction`: "Schema to JSON"
         *   Expected `output_data`: null
         *   Expected `error_message`: (contains "Invalid JSON Schema or JSON Generation Error:")
     7.  **Invalid Conversion Direction:**
         *   Input `input_data`: `{}`
         *   Input `conversion_direction`: "Unknown Direction"
         *   Expected `output_data`: null
         *   Expected `error_message`: "Invalid conversion direction. Must be 'JSON to Schema' or 'Schema to JSON'"
     8.  **Empty Input Data:**
         *   Input `input_data`: `""`
         *   Input `conversion_direction`: "JSON to Schema"
         *   Expected `output_data`: null
         *   Expected `error_message`: (contains "Invalid JSON:")

## II. Element: JSON Editor (`json-editor`)

**Setup for Element Tests:**
- Place the `JSON Editor` element on a Bubble page.
- Use workflows to trigger its actions.
- Use text elements or the debugger to observe its exposed states (`Current JSON Text`, `Current JSON Object`, `Is Valid JSON`, `Error Messages`, `Current Mode`).

### A. Action: Collapse All (`elements/json-editor/actions/collapseAll.js`)
   - **Preconditions:** Editor should be in 'tree' mode.
   - **Test Cases:**
     1.  **Collapse in Tree Mode:**
         *   Set editor mode to 'tree'.
         *   Load a JSON with multiple levels (e.g., `{"a":{"b":{"c":1}},"d":2}`).
         *   Expand some nodes manually.
         *   Trigger `Collapse All` action.
         *   Expected: All nodes in the editor should collapse to their root level.
     2.  **Attempt Collapse in Non-Tree Mode (e.g., 'code'):**
         *   Set editor mode to 'code'.
         *   Load some JSON.
         *   Trigger `Collapse All` action.
         *   Expected: No visual change in the editor. Debugger message: "collapseAll action: collapseAll is only applicable in "tree" mode..."

### B. Action: Compact JSON (`elements/json-editor/actions/compactJson.js`)
   - **Test Cases:**
     1.  **Compact Formatted JSON:**
         *   Load formatted JSON: `{\n  "key": "value",\n  "number": 123\n}`
         *   Trigger `Compact JSON` action.
         *   Expected Editor Content: `{"key":"value","number":123}`
         *   Expected State `currentJsonText`: `{"key":"value","number":123}`
         *   Expected State `currentJsonObject`: (Object representation of the JSON)
         *   Expected State `currentMode`: (may change to 'text' or 'code')
         *   Expected State `isValidJson`: true
     2.  **Compact Already Compact JSON:**
         *   Load compact JSON: `{"key":"value"}`
         *   Trigger `Compact JSON` action.
         *   Expected Editor Content: `{"key":"value"}`
         *   Expected State `currentJsonText`: `{"key":"value"}`
     3.  **Compact Invalid JSON in Editor:**
         *   Manually type invalid JSON into the editor (e.g., `{"key":` in 'code' mode).
         *   Trigger `Compact JSON` action.
         *   Expected: Error handling.
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains "Compacting error:" or similar)
         *   Event `errorOccurred` triggered.

### C. Action: Expand All (`elements/json-editor/actions/expandAll.js`)
   - **Preconditions:** Editor should be in 'tree' mode.
   - **Test Cases:**
     1.  **Expand in Tree Mode:**
         *   Set editor mode to 'tree'.
         *   Load a JSON with multiple levels (e.g., `{"a":{"b":{"c":1}},"d":2}`).
         *   Collapse all nodes (or some).
         *   Trigger `Expand All` action.
         *   Expected: All nodes in the editor should expand fully.
     2.  **Attempt Expand in Non-Tree Mode (e.g., 'code'):**
         *   Set editor mode to 'code'.
         *   Load some JSON.
         *   Trigger `Expand All` action.
         *   Expected: No visual change. Debugger message: "expandAll action: expandAll is only applicable in "tree" mode..."

### D. Action: Focus Editor (`elements/json-editor/actions/focusEditor.js`)
   - **Test Cases:**
     1.  **Focus the Editor:**
         *   Have another input element on the page and focus it.
         *   Trigger `Focus Editor` action.
         *   Expected: The JSON editor element should gain focus (e.g., cursor appears inside if in 'code'/'text' mode).
         *   Event `focused` should be triggered (verify with a workflow listening to this event).

### E. Action: Format JSON (`elements/json-editor/actions/formatJson.js`)
   - **Test Cases:**
     1.  **Format Compact JSON:**
         *   Load compact JSON: `{"key":"value","number":123}` (ensure editor is in 'code' or 'text' mode to see formatting).
         *   Trigger `Format JSON` action.
         *   Expected Editor Content (example): `{\n  "key": "value",\n  "number": 123\n}` (or with editor's default indentation)
         *   Expected State `currentJsonText`: (formatted string)
     2.  **Format Already Formatted JSON:**
         *   Load formatted JSON.
         *   Trigger `Format JSON` action.
         *   Expected Editor Content: Should remain the same or be re-formatted to a consistent style.
     3.  **Format Invalid JSON:**
         *   Manually type invalid JSON (e.g., `{"key":` in 'code' mode).
         *   Trigger `Format JSON` action.
         *   Expected: Error handling.
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains "Formatting error:")
         *   Event `errorOccurred` triggered.

### F. Action: Repair JSON (`elements/json-editor/actions/repairJson.js`)
   - **Test Cases:**
     1.  **Repair JSON with Trailing Comma (Object):**
         *   Set editor content (e.g., via `Set JSON` or typing in 'code' mode) to: `{"name":"test", "value":1,}`
         *   Trigger `Repair JSON` action.
         *   Expected Editor Content: `{"name":"test", "value":1}`
         *   Expected State `isValidJson`: true
         *   Event `jsonChanged` triggered.
     2.  **Repair JSON with Trailing Comma (Array):**
         *   Set editor content to: `["a", "b",]`
         *   Trigger `Repair JSON` action.
         *   Expected Editor Content: `["a", "b"]`
         *   Expected State `isValidJson`: true
     3.  **Repair JSON with Missing Quotes on Keys:**
         *   Set editor content to: `{name:"test"}`
         *   Trigger `Repair JSON` action.
         *   Expected Editor Content: `{"name":"test"}` (if library supports this repair)
         *   Expected State `isValidJson`: true
     4.  **Attempt Repair on Valid JSON:**
         *   Set editor content to valid JSON: `{"id":123}`
         *   Trigger `Repair JSON` action.
         *   Expected Editor Content: `{"id":123}` (no change)
         *   Expected State `isValidJson`: true
     5.  **Attempt Repair on Unrepairable JSON:**
         *   Set editor content to severely malformed JSON: `{"id":123` (missing closing brace)
         *   Trigger `Repair JSON` action.
         *   Expected Editor Content: (may or may not change, depending on library's capability)
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains "Repaired JSON still not valid" or similar)
         *   Events `jsonChanged` and `errorOccurred` triggered.

### G. Action: Set JSON (`elements/json-editor/actions/setJson.js`)
   - **Inputs:**
     - `jsonString` (text): The JSON string to load.
   - **Test Cases:**
     1.  **Set Valid JSON String:**
         *   Input `jsonString`: `{"product":"Laptop","price":1200}`
         *   Trigger `Set JSON` action.
         *   Expected Editor Content: (Displays the JSON, formatted or compact based on mode)
         *   Expected State `currentJsonText`: `{"product":"Laptop","price":1200}` (or formatted)
         *   Expected State `isValidJson`: true
         *   Event `jsonChanged` triggered.
     2.  **Set Invalid JSON String:**
         *   Input `jsonString`: `{"product":"Laptop","price":1200,}` (trailing comma)
         *   Trigger `Set JSON` action.
         *   Expected Editor Content: `{"product":"Laptop","price":1200,}` (fallback setText behavior)
         *   Expected State `currentJsonText`: `{"product":"Laptop","price":1200,}`
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains "Invalid JSON provided:")
         *   Event `errorOccurred` triggered.
     3.  **Set Empty String:**
         *   Input `jsonString`: `""`
         *   Trigger `Set JSON` action.
         *   Expected Editor Content: `""` (fallback setText)
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains "Invalid JSON provided:" or similar, as empty string is not valid JSON object/array)
     4.  **Set Non-String (e.g., Number from Bubble):**
         *   Input `jsonString`: (expression evaluating to a number, e.g., 123)
         *   Trigger `Set JSON` action.
         *   Expected: Debugger message "setJson action: input jsonString is not a string." No change to editor.

### H. Action: Set Mode (`elements/json-editor/actions/setMode.js`)
   - **Inputs:**
     - `mode` (text): Target mode (e.g., "tree", "code", "form", "text", "view").
   - **Test Cases:**
     1.  **Set Mode to 'tree':**
         *   Input `mode`: "tree"
         *   Trigger `Set Mode` action.
         *   Expected Editor View: Changes to tree view.
         *   Expected State `currentMode`: "tree"
         *   Event `modeChanged` triggered.
     2.  **Set Mode to 'code':**
         *   Input `mode`: "code"
         *   Trigger `Set Mode` action.
         *   Expected Editor View: Changes to code/text view.
         *   Expected State `currentMode`: "code"
         *   Event `modeChanged` triggered.
     3.  **Set to an Invalid Mode String:**
         *   Input `mode`: "invalidMode"
         *   Trigger `Set Mode` action.
         *   Expected: Editor mode might not change, or library might default/error. Debugger message "setMode action: Error setting mode..."
     4.  **Set Mode with Non-String Input:**
         *   Input `mode`: (expression evaluating to a number)
         *   Trigger `Set Mode` action.
         *   Expected: Debugger message "setMode action: input mode is not a string."

### I. Action: Set Schema (`elements/json-editor/actions/setSchema.js`)
   - **Inputs:**
     - `schemaJson` (text): JSON string for the schema.
     - `schemaRefsJson` (text, optional): JSON string for schema references.
   - **Test Cases:**
     1.  **Set Valid Schema:**
         *   Load JSON into editor: `{"name": "Test", "age": 30}`
         *   Input `schemaJson`: `{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer"}},"required":["name"]}`
         *   Trigger `Set Schema` action.
         *   Expected State `isValidJson`: true (as current JSON matches schema)
         *   Expected State `errorMessages`: (empty)
         *   Event `validated` triggered.
     2.  **Set Schema that Makes Current JSON Invalid:**
         *   Load JSON: `{"name": "Test", "age": "thirty"}` (age is string)
         *   Input `schemaJson`: `{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"integer"}}}`
         *   Trigger `Set Schema` action.
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains message about 'age' not being an integer)
         *   Events `validated` and `errorOccurred` triggered.
     3.  **Set Invalid Schema JSON:**
         *   Input `schemaJson`: `{"type":"object",` (malformed)
         *   Trigger `Set Schema` action.
         *   Expected State `errorMessages`: (contains "Invalid Schema JSON:")
         *   Event `errorOccurred` triggered.
     4.  **Unset Schema (Empty String):**
         *   Previously set a schema. Current JSON is valid against it.
         *   Input `schemaJson`: `""` (empty string)
         *   Trigger `Set Schema` action.
         *   Expected: Schema validation is removed. `isValidJson` should be true if the JSON itself is syntactically valid, regardless of prior schema.
         *   Event `validated` triggered.
     5.  **Set Schema with Valid Refs:**
         *   Input `schemaJson`: `{"type":"object", "properties": {"address": {"$ref": "#/definitions/addressSchema"}}}`
         *   Input `schemaRefsJson`: `{"definitions": {"addressSchema": {"type": "object", "properties": {"street": {"type": "string"}}}}}`
         *   Load JSON: `{"address": {"street": "123 Main St"}}`
         *   Trigger `Set Schema` action.
         *   Expected State `isValidJson`: true
     6.  **Set Schema with Invalid Refs JSON:**
         *   Input `schemaJson`: `{"type":"object", "properties": {"user": {"type":"string"}}}`
         *   Input `schemaRefsJson`: `{"definitions": {` (malformed)
         *   Trigger `Set Schema` action.
         *   Expected: Schema might be set without refs, or an error related to refs might be logged. Main schema should still apply. Debugger message for schemaRefsJson parsing error.

### J. Action: Validate JSON (`elements/json-editor/actions/validateJson.js`)
   - **Test Cases:**
     1.  **Validate Currently Valid JSON (No Schema):**
         *   Load valid JSON: `{"id":1}`
         *   Ensure no schema is set.
         *   Trigger `Validate JSON` action.
         *   Expected State `isValidJson`: true
         *   Expected State `errorMessages`: (empty)
         *   Event `validated` triggered.
     2.  **Validate Currently Invalid JSON (Syntax Error, No Schema):**
         *   Load/type invalid JSON: `{"id":1,}`
         *   Trigger `Validate JSON` action.
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains syntax error message from the editor library)
         *   Events `validated` and `errorOccurred` triggered.
     3.  **Validate Valid JSON Against Matching Schema:**
         *   Set schema: `{"type":"object", "properties":{"name":{"type":"string"}}}`
         *   Load JSON: `{"name":"Valid Name"}`
         *   Trigger `Validate JSON` action.
         *   Expected State `isValidJson`: true
         *   Event `validated` triggered.
     4.  **Validate Valid JSON Against Non-Matching Schema:**
         *   Set schema: `{"type":"object", "properties":{"name":{"type":"string","minLength":5}}}`
         *   Load JSON: `{"name":"Val"}`
         *   Trigger `Validate JSON` action.
         *   Expected State `isValidJson`: false
         *   Expected State `errorMessages`: (contains message about minLength)
         *   Events `validated` and `errorOccurred` triggered.
