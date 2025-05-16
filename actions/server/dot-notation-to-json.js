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

  let sourceData = properties.source === 'Text Block' ? properties.text_block : properties.text_list;

  if (!sourceData) {
    errorMessage = 'Dot Notation to JSON: No source data provided.';
    isError = true;
    context.log(errorMessage);
    return {
      json_output: null,
      is_error: isError,
      error_message: errorMessage
    };
  }

  let lines = [];
  if (properties.source === 'Text Block') {
    lines = properties.text_block.split('\n');
  } else {
    lines = properties.text_list;
  }

  let intermediateObject = {};

  try {
    for (const line of lines) {
      if (line.trim() !== '') {
        const [key, value] = line.split(keyValueSeparator, 2); // Limit to 2 splits
        if (key && value) {
          intermediateObject[key.trim()] = value.trim();
        }
      }
    }

    jsonOutput = dotInstance.object(intermediateObject);

    return {
      json_output: jsonOutput,
      is_error: false,
      error_message: ''
    };

  } catch (error) {
    errorMessage = `Error in Dot Notation to JSON: ${error.message}. Input: ${sourceData.substring(0, 200)}`;
    isError = true;
    context.log(errorMessage);
    return {
      json_output: null,
      is_error: isError,
      error_message: errorMessage
    };
  }
}
