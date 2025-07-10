/**
 * Modifies a JSON object by adding/updating and removing keys using dot notation.
 * @param {object} properties - The action properties from Bubble
 * @param {string} properties.json - The initial JSON string to modify
 * @param {string} [properties.add_update_text_block] - Newline-separated key=value pairs for adding/updating
 * @param {string} [properties.remove_text_block] - Newline-separated dot notation paths to remove
 * @param {string} [properties.notation_separator] - Custom separator for dot notation (default: '.')
 * @param {string} [properties.value_separator] - Custom separator for key-value pairs (default: '=')
 * @param {object} context - The Bubble context object
 * @returns {object} Object containing json_output, is_error, and error_message
 * @async
 */
let ssa = async function(properties, context) {
  // Rule IV.A.12: All code must be inside the function block

  const Dot = require('dot-object');

  let jsonOutput = {};
  let isError = false;
  let errorMessage = '';

  // Determine the value separator
  const keyValueSeparator = (properties.value_separator && typeof properties.value_separator === 'string' && properties.value_separator.trim() !== '')
    ? properties.value_separator.trim()
    : '='; // Default key-value separator

  // Determine the dot notation separator
  const dotNotationSeparator = (properties.notation_separator && typeof properties.notation_separator === 'string' && properties.notation_separator.trim() !== '')
    ? properties.notation_separator.trim()
    : '.'; // Default dot notation separator

  const dotInstance = new Dot(dotNotationSeparator);

  try {
    // 1. Parse the initial JSON input
    if (!properties.json || typeof properties.json !== 'string' || properties.json.trim() === '') {
      throw new Error('No JSON input provided. Please provide a valid JSON string.');
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(properties.json);
    } catch (parseError) {
      throw new Error(`Invalid JSON input: ${parseError.message}`);
    }

    // 2. Process add/update operations
    if (properties.add_update_text_block && typeof properties.add_update_text_block === 'string' && properties.add_update_text_block.trim() !== '') {
      const normalizedAddUpdateBlock = properties.add_update_text_block.replace(/\\n/g, '\n'); // Normalize potential literal \n
      const addUpdateLines = normalizedAddUpdateBlock.split('\n');

      for (const line of addUpdateLines) {
        if (line && typeof line === 'string' && line.trim() !== '') { // Ensure line is a non-empty string
          const [key, value] = line.split(keyValueSeparator, 2); // Limit to 2 splits
          if (key && value !== undefined) { // Check if value is defined (can be empty string)
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            
            // Try to parse the value as JSON, otherwise use as string
            let parsedValue;
            try {
              parsedValue = JSON.parse(trimmedValue);
            } catch (valueParseError) {
              // If JSON parsing fails, use the value as a string
              parsedValue = trimmedValue;
            }
            
            dotInstance.set(trimmedKey, parsedValue, parsedJson);
          }
        }
      }
    }

    // 3. Process remove operations
    if (properties.remove_text_block && typeof properties.remove_text_block === 'string' && properties.remove_text_block.trim() !== '') {
      const normalizedRemoveBlock = properties.remove_text_block.replace(/\\n/g, '\n'); // Normalize potential literal \n
      const removeLines = normalizedRemoveBlock.split('\n');

      for (const line of removeLines) {
        if (line && typeof line === 'string' && line.trim() !== '') { // Ensure line is a non-empty string
          const trimmedKey = line.trim();
          dotInstance.remove(trimmedKey, parsedJson);
        }
      }
    }

    // 4. Return the modified JSON
    jsonOutput = parsedJson;

    return {
      json_output: JSON.stringify(jsonOutput),
      is_error: false,
      error_message: ''
    };

  } catch (error) {
    // Improved error reporting
    let inputPreview = 'Could not generate input preview.';
    try {
      // Attempt to generate a preview of the source data that caused the error
      const originalJson = properties.json || 'No JSON provided';
      const addUpdatePreview = properties.add_update_text_block ? properties.add_update_text_block.substring(0, 100) : 'No add/update operations';
      const removePreview = properties.remove_text_block ? properties.remove_text_block.substring(0, 100) : 'No remove operations';
      
      inputPreview = `JSON: ${originalJson.substring(0, 100)}, Add/Update: ${addUpdatePreview}, Remove: ${removePreview}`;
    } catch (previewError) {
      inputPreview = `Could not generate input preview due to internal error: ${previewError.message}`;
      console.log(inputPreview); // Log the preview error itself
    }

    errorMessage = `Error in Modify JSON with Dot Notation: ${error.message}. Input preview: ${inputPreview}`;
    isError = true;
    console.log(errorMessage);
    
    return {
      json_output: null,
      is_error: isError,
      error_message: errorMessage
    };
  }
};
