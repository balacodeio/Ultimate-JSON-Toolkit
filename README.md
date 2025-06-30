# Ultimate JSON Toolkit Plugin for Bubble.io

This plugin provides powerful tools for working with JSON data directly within your Bubble.io applications. It includes an interactive JSON editor element and a suite of server-side actions for common JSON manipulation tasks.

## SEO Description

A powerful Bubble.io plugin for advanced JSON manipulation and editing.

It allows users to view, edit, format, and validate JSON data directly within your application interface. Supports various modes like tree, code, and form, and includes features like schema validation, search, and undo/redo. It also provides server-side actions for tasks like compacting, transforming, extracting, and converting between JSON and dot notation, making it invaluable for developers working with complex JSON data.

## Usage Instructions

### Installation

1.  Navigate to the "Plugins" tab in your Bubble application.
2.  Click "Add plugins".
3.  Search for "Ultimate JSON Toolkit".
4.  Click "Install".

### JSON Editor Element

The JSON Editor is a visual element you can add to your pages to allow users to view and edit JSON data interactively.

- **Adding the Element:** Find the "JSON Editor" element in the Visual Elements palette and drag it onto your page.
- **Properties:** Configure the element's appearance and behavior using the properties in the element inspector:
    - **Initial JSON:** The JSON text to load into the editor when the page loads.
    - **Mode:** Choose the editor's display mode (Tree, Code, or Form).
    - **Read-only:** If checked, the editor content cannot be changed by the user.
    - **Schema:** Provide a JSON schema to enable validation.
    - *(Include other relevant properties here)*
- **Exposed States:** Access the editor's current state in workflows:
    - **Current JSON:** The current content of the editor as a text string.
    - **Is Valid:** A boolean indicating if the current JSON is valid according to the provided schema (if any).
    - **Validation Errors:** A list of text strings detailing any validation errors.
    - **Mode:** The current display mode of the editor.
- **Events:** Trigger workflows based on editor activity:
    - **JSON Changed:** Triggered whenever the JSON content in the editor is modified.
    - **Editor Ready:** Triggered when the editor element has fully initialized and is ready for interaction.
    - **Validation Errors Found:** Triggered when validation is performed and errors are detected.
- **Actions:** Control the editor's behavior using element actions in workflows:
    - **Set JSON:** Load new JSON content into the editor.
    - **Set Mode:** Change the editor's display mode.
    - **Set Schema:** Update the validation schema.
    - **Format JSON:** Automatically format the JSON content for readability.
    - **Compact JSON:** Remove whitespace from the JSON content.
    - **Repair JSON:** Attempt to fix common JSON syntax errors.
    - **Validate JSON:** Manually trigger validation against the current schema.
    - **Focus Editor:** Set focus to the editor element.
    - **Expand All:** Expand all nodes in Tree mode.
    - **Collapse All:** Collapse all nodes in Tree mode.
    - **Refresh Editor:** Re-render the editor.

### Server-Side Actions

These actions run on the server and can be used in your Bubble workflows to perform JSON manipulation tasks.

- **Finding Actions:** Find these actions under the "Plugins" category in the workflow editor.
- **Available Actions:**
    - **Compact JSON:**
        - *Input:* `JSON Text` (text) - The JSON string to compact.
        - *Output:* `Compacted JSON` (text) - The JSON string with whitespace removed.
    - **Dot Notation to JSON:**
        - *Input:* `Dot Notation Text` (text) - A string representing data in dot notation (e.g., `user.address.city=New York`).
        - *Output:* `JSON Text` (text) - The resulting JSON object as a string.
    - **Extract from JSON:**
        - *Inputs:*
            - `JSON Text` (text) - The JSON string to extract from.
            - `Dot Notation Path` (text) - The dot notation path to the desired value (e.g., `user.address.city`).
        - *Output:* `Extracted Value` (text, number, boolean, or JSON text) - The value found at the specified path.
    - **JSON to Dot Notation:**
        - *Input:* `JSON Text` (text) - The JSON string to convert.
        - *Output:* `Dot Notation Text` (text) - The resulting dot notation string.
    - **Transform JSON Schema:**
        - *Inputs:*
            - `JSON Text` (text) - The JSON string to transform.
            - `Schema Text` (text) - The JSON schema to apply for transformation.
        - *Output:* `Transformed JSON` (text) - The JSON string after applying the schema transformation.

## Examples

- **Example 1: Basic Editor Usage**
    - Add the JSON Editor element to a page.
    - Set the "Initial JSON" property.
    - Use a workflow to read the "Current JSON" state when the "JSON Changed" event is triggered.
- **Example 2: Formatting JSON**
    - Add a button and the JSON Editor element.
    - Create a workflow for the button click.
    - Use the "Format JSON" element action targeting the JSON Editor.
- **Example 3: Using a Server-Side Action**
    - Add an input element for JSON text and a text element to display the result.
    - Add a button.
    - Create a workflow for the button click.
    - Use the "Extract from JSON" server-side action, using the input's value for `JSON Text` and a static dot notation path.
    - Display the result of the action in the text element.

## Prerequisites and Limitations

- **Prerequisites:** Requires a Bubble.io account. *(Add any specific plan requirements or external service needs here if applicable)*
- **Limitations:**
    - Performance may degrade with extremely large JSON datasets.

## Troubleshooting

- **Issue:** Invalid JSON input in the editor or server-side actions.
    - **Solution:** Use the "Repair JSON" or "Validate JSON" element actions. Ensure your input data for server-side actions is valid JSON.
- **Issue:** Unexpected results from server-side actions.
    - **Solution:** Double-check input parameters, especially dot notation paths and schema syntax.

## Author

This plugin is developed and maintained by Balacode.io

For support or inquiries, please contact: hello@balacode.io

## Additional Resources

- [Ultimate JSON Toolkit Plugin Page](https://bubble.io/plugin/ultimate-json-toolkit-1747320116038x575809202516131840)
