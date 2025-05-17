async function(properties, context) {
    // /* eslint-disable no-unused-vars */ /* If context not directly used */

    const Dot = require('dot-object'); // Rule IV.A.12: require inside function

    let keysList = [];
    let keyValuesList = [];

    if (!properties.source_json || typeof properties.source_json !== 'string' || properties.source_json.trim() === '') {
        console.log('Convert JSON to Dot Notation: source_json is empty or not a string.');
        return {
            dot_notation_keys: [],
            dot_notation_key_values: [],
            is_error: true,
            error_message: 'source_json is empty or not a string.'
        };
    }

    // Determine the dot notation separator for path generation
    const dotNotationSeparator = (properties.dot_notation_separator && typeof properties.dot_notation_separator === 'string' && properties.dot_notation_separator.trim() !== '')
        ? properties.dot_notation_separator.trim()
        : '.'; // Default dot notation separator

    const dotInstance = new Dot(dotNotationSeparator); // Instantiate with the chosen path separator

    // Determine the key-value separator for the output string
    const keyValueSeparator = (properties.key_value_separator && typeof properties.key_value_separator === 'string') // Allow empty string for direct concatenation
        ? properties.key_value_separator
        : ' = '; // Default key-value separator

    try {
        const parsedJson = JSON.parse(properties.source_json);
        const dottedObject = dotInstance.dot(parsedJson);

        for (const key in dottedObject) {
            if (Object.hasOwnProperty.call(dottedObject, key)) {
                keysList.push(key);

                const value = dottedObject[key];
                let stringValue;
                if (typeof value === 'string') {
                    stringValue = value;
                } else if (value === null || value === undefined) {
                    stringValue = String(value);
                } else {
                    stringValue = JSON.stringify(value);
                }
                keyValuesList.push(`${key}${keyValueSeparator}${stringValue}`);
            }
        }

        return {
            dot_notation_keys: keysList,
            dot_notation_key_values: keyValuesList,
            is_error: false,
            error_message: ''
        };

    } catch (error) {
        console.log(`Error in Convert JSON to Dot Notation: ${error.message}. Input JSON: ${properties.source_json.substring(0, 200)}`);
        // Return empty lists on error. Consider if specific error reporting to Bubble user is needed.
        return {
            dot_notation_keys: [],
            dot_notation_key_values: [],
            is_error: true,
            error_message: error.message
        };
    }
}
