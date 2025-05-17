async function(properties, context) {
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

  let linesToProcess = null;
  let sourceDataType = 'Unknown'; // For error reporting

  try {
    // 1. Determine the source of lines, prioritizing text_block
    if (properties.text_block && typeof properties.text_block === 'string' && properties.text_block.trim() !== '') {
      const normalizedTextBlock = properties.text_block.replace(/\\n/g, '\n'); // Normalize potential literal \n
      linesToProcess = normalizedTextBlock.split('\n');
      sourceDataType = 'Text Block';
    } else if (properties.text_list) {
      // Rule IV.C: Access Bubble list properties using get() and length()
      const listLength = await properties.text_list.length();
      if (listLength > 0) {
        linesToProcess = await properties.text_list.get(0, listLength);
        sourceDataType = 'Text List';
      }
    }

    // 2. If neither source provides initial data, throw a specific error.
    if (!linesToProcess || linesToProcess.length === 0) {
      throw new Error('No input data provided. Please provide a non-empty Text Block or a Text List with items.');
    }

    // 3. Process the selected lines, ignoring empty/whitespace-only lines.
    let intermediateObject = {};
    let validPairsFound = false;

    for (const line of linesToProcess) {
      if (line && typeof line === 'string' && line.trim() !== '') { // Ensure line is a non-empty string
        const [key, value] = line.split(keyValueSeparator, 2); // Limit to 2 splits
        if (key && value !== undefined) { // Check if value is defined (can be empty string)
          intermediateObject[key.trim()] = value.trim();
          validPairsFound = true; // Mark that we found at least one valid pair
        }
      }
    }

    // 4. After processing, if no valid key-value pairs were found, throw a different specific error.
    if (!validPairsFound) {
       throw new Error('No valid key-value pairs found in the provided input.');
    }

    // 5. Otherwise, proceed with the dot notation conversion and return the JSON object.
    jsonOutput = dotInstance.object(intermediateObject);

    return {
      json_output: JSON.stringify(jsonOutput), // Note: this is a string representation of the jsonOutput,
      is_error: false,
      error_message: ''
    };

  } catch (error) {
    // Improved error reporting
    let inputPreview = 'Could not generate input preview.';
    try {
        // Attempt to generate a preview of the source data that caused the error
        // Use the original properties.text_block or properties.text_list for preview
        const originalSourceData = (properties.text_block && typeof properties.text_block === 'string' && properties.text_block.trim() !== '')
            ? properties.text_block
            : (properties.text_list ? await properties.text_list.get(0, await properties.text_list.length()) : null);

        if (originalSourceData !== undefined && originalSourceData !== null) {
           if (Array.isArray(originalSourceData)) {
             inputPreview = JSON.stringify(originalSourceData).substring(0, 200);
           } else if (typeof originalSourceData === 'object') {
             inputPreview = JSON.stringify(originalSourceData).substring(0, 200);
           }
           else if (typeof originalSourceData === 'string') {
             inputPreview = originalSourceData.substring(0, 200);
           } else {
             inputPreview = String(originalSourceData).substring(0, 200);
           }
        } else {
           inputPreview = 'Source data was null or undefined.';
        }
    } catch (previewError) {
        inputPreview = `Could not generate input preview due to internal error: ${previewError.message}`;
        console.log(inputPreview); // Log the preview error itself
    }


    errorMessage = `Error in Dot Notation to JSON: ${error.message}. Input preview: ${inputPreview}`;
    isError = true;
    console.log(errorMessage);
    return {
      json_output: null,
      is_error: isError,
      error_message: errorMessage
    };
  }
}
