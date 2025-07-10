# Ultimate JSON Toolkit Setup Guide

## Overall Plugin Information

**Plugin Name:** Ultimate JSON Toolkit  
**Description:** A collection of tools for working with JSON data.  
**Categories:** Editor, JSON  
**Author:** Ali Farahat  
**Company:** Balacode.io  
**Version:** 0.0.1  

This plugin provides comprehensive JSON manipulation capabilities including editing, transformation, validation, and dot notation operations.

## Client-Side Actions

Currently, no standalone client-side actions are defined in this plugin.

## Server-Side Actions

### 1. Compact JSON
**Internal ID/Name:** compact_json  
**Description:** Removes unnecessary whitespace from JSON data to create a compact representation.  
**Fields:**
- `json_input` (Text): The JSON string to compact
**Returned Values:**
- `json_output` (Text): The compacted JSON string
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

### 2. Dot Notation to JSON
**Internal ID/Name:** dot-notation-to-json  
**Description:** Converts dot notation key-value pairs to a JSON object.  
**Fields:**
- `text_block` (Text): Newline-separated key=value pairs in dot notation
- `text_list` (List of texts): Alternative input as a list of key=value pairs
- `notation_separator` (Text): Custom separator for dot notation (default: '.')
- `value_separator` (Text): Custom separator for key-value pairs (default: '=')
**Returned Values:**
- `json_output` (Text): The resulting JSON string
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

### 3. Extract from JSON
**Internal ID/Name:** extract-from-json  
**Description:** Extracts data from JSON using JSONPath queries.  
**Fields:**
- `json_data` (Text): The JSON string to query
- `json_path_query` (Text): JSONPath expression
- `wrap_results` (Boolean): Whether to wrap results (default: true)
- `prevent_eval` (Boolean): Whether to prevent eval in JSONPath (default: true)
**Returned Values:**
- `result` (Text): First matching result
- `result_list` (List of texts): All matching results
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

### 4. JSON to Template
**Internal ID/Name:** json_to_template  
**Description:** Generates template strings from JSON data.  
**Fields:**
- `json_input` (Text): The JSON string to process
- `template_format` (Text): Template format specification
**Returned Values:**
- `template_output` (Text): The generated template
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

### 5. JSON to Dot Notation
**Internal ID/Name:** json-to-dot-notation  
**Description:** Converts JSON objects to dot notation key-value pairs.  
**Fields:**
- `json_input` (Text): The JSON string to convert
- `notation_separator` (Text): Custom separator for dot notation (default: '.')
- `value_separator` (Text): Custom separator for key-value pairs (default: '=')
**Returned Values:**
- `dot_notation_output` (Text): The resulting dot notation string
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

### 6. Modify JSON with Dot Notation
**Internal ID/Name:** modify-json-with-dot-notation  
**Description:** Modifies a JSON object by adding/updating and removing keys using dot notation.  
**Fields:**
- `json` (Text): The initial JSON string to modify
- `add_update_text_block` (Text): Newline-separated key=value pairs for adding/updating keys
- `remove_text_block` (Text): Newline-separated dot notation paths to remove
- `notation_separator` (Text): Custom separator for dot notation (default: '.')
- `value_separator` (Text): Custom separator for key-value pairs (default: '=')
**Returned Values:**
- `json_output` (Text): The modified JSON string
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any
**Example Usage:**
- Add/Update: `user.name=John\nuser.age=30\nuser.active=true`
- Remove: `user.email\nuser.phone`

### 7. Transform JSON Schema
**Internal ID/Name:** transform_json_schema  
**Description:** Transforms and validates JSON schemas.  
**Fields:**
- `schema_input` (Text): The JSON schema to transform
- `transformation_rules` (Text): Rules for schema transformation
**Returned Values:**
- `schema_output` (Text): The transformed schema
- `is_error` (Boolean): Whether an error occurred
- `error_message` (Text): Error details if any

## Elements

### JSON Editor
**Internal ID/Name:** json-editor  
**Description:** An interactive JSON editor element with multiple viewing modes and validation capabilities.  
**Category:** Visual Elements  

**Standard Bubble Properties Utilized:**
- Width and Height for sizing
- Visibility conditions
- Margin and padding

**Autobinding:** Supported - binds to the current JSON content of the editor

**Properties (Fields):**
- `initialJson` (Text): Initial JSON content to load
- `mode` (Text): Editor mode (tree, code, form, view)
- `theme` (Text): Editor theme
- `readOnly` (Boolean): Whether the editor is read-only
- `showValidation` (Boolean): Whether to show validation errors

**Exposed States:**
- `currentJson` (Text): Current JSON content
- `isValid` (Boolean): Whether the current JSON is valid
- `errorMessage` (Text): Current validation error message
- `mode` (Text): Current editor mode

**Events:**
- `jsonChanged`: Triggered when JSON content changes
- `validationError`: Triggered when validation fails
- `modeChanged`: Triggered when editor mode changes

**Actions:**
- `setJson`: Set the JSON content
- `setMode`: Change the editor mode
- `formatJson`: Format the current JSON
- `validateJson`: Validate the current JSON
- `expandAll`: Expand all nodes in tree mode
- `collapseAll`: Collapse all nodes in tree mode
- `refreshEditor`: Refresh the editor display
- `focusEditor`: Focus the editor
- `repairJson`: Attempt to repair invalid JSON
- `compactJson`: Compact the JSON (remove whitespace)
- `setSchema`: Set a JSON schema for validation

For detailed element setup information, refer to `elements/json-editor/element-setup.md`.
