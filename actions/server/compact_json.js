async function(properties, context) {
    // Ensure all code is within this function block as per Rule IV.A.12

    // Rule IV.A.1: Use const for variables that are not reassigned.
    const jsonString = properties.json_string;

    // Rule V.5: Input Validation - Check if jsonString is provided
    if (jsonString === null || jsonString === undefined || typeof jsonString !== 'string' || jsonString.trim() === '') {
        // Rule IV.C: Use console.log for server-side logging (overriding .clinerules based on runtime error)
        console.log('Error: Input JSON string is empty or not a string.');
        return {
            compacted_json: null,
            error_message: 'Input JSON string is empty or not a string.',
            is_error: true
        };
    }

    let parsedJson;
    let compactedJsonString;

    // Replace structural escaped newlines with actual newlines for correct parsing
    // This regex targets \n that are not preceded by an odd number of backslashes
    const cleanedJsonString = jsonString.replace(/(?<!\\)(?:\\\\)*\\n/g, '\n');

    // Rule IV.C & VII.3: Error Handling
    try {
        parsedJson = JSON.parse(cleanedJsonString);
    } catch (error) {
        // Rule IV.C: Use console.log for server-side logging (overriding .clinerules based on runtime error)
        console.log(`Error parsing JSON: ${error.message}`);
        return {
            compacted_json: null,
            // Rule IV.C: Return meaningful errors
            error_message: `Invalid JSON input: ${error.message}`,
            is_error: true
        };
    }

    try {
        // JSON.stringify with no space argument compacts the JSON
        compactedJsonString = JSON.stringify(parsedJson);
    } catch (error) {
        // This catch is less likely to be hit if parsing succeeded, but included for robustness
        console.log(`Error stringifying JSON: ${error.message}`); // Overriding .clinerules
        return {
            compacted_json: null,
            error_message: `Error compacting JSON: ${error.message}`,
            is_error: true
        };
    }

    // Rule IV.C: Complex Server-Side Return Values (using simple key-values here)
    return {
        compacted_json: compactedJsonString,
        error_message: null,
        is_error: false
    };

    // Rule IV.A.2: Always require semicolons (implicitly handled by Prettier/ESLint in many setups, but good practice)
}
