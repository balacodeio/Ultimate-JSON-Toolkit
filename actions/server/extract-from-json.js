let ssa = async function(properties, context) {
  const { JSONPath } = require('jsonpath-plus');

  let jsonData;
  let finalResultList = [];
  let finalResultSingle = null;
  const isError = false; // Renamed to camelCase
  const errorMessage = ''; // Renamed to camelCase

  // --- Validate Inputs ---
  if (!properties.json_data) {
    return {
      result: null,
      result_list: [],
      is_error: true,
      error_message: 'JSON data cannot be empty.'
    };
  }
  if (!properties.json_path_query) {
    return {
      result: null,
      result_list: [],
      is_error: true,
      error_message: 'JSONPath query cannot be empty.'
    };
  }

  // --- Handle JSON Parsing Error ---
  try {
    jsonData = JSON.parse(properties.json_data);
  } catch (error) {
    return {
      result: null,
      result_list: [],
      is_error: true,
      error_message: `Invalid JSON data provided: ${error.message}`
    };
  }

  // --- Prepare JSONPath Options ---
  // Default wrap_results to true if undefined (Bubble default is true)
  const wrapResults = properties.wrap_results === undefined ? true : properties.wrap_results;
  // Default prevent_eval to true if undefined (Bubble default is true)
  const preventEval = properties.prevent_eval === undefined ? true : properties.prevent_eval;

  const options = {
    path: properties.json_path_query,
    json: jsonData,
    preventEval
  };

  // --- Handle JSONPath Execution Error ---
  let rawResult;
  try {
    rawResult = JSONPath(options);
  } catch (error) {
    return {
      result: null,
      result_list: [],
      is_error: true,
      error_message: `Error executing JSONPath query: ${error.message}`
    };
  }

  // --- Process Result ---
  if (rawResult === undefined || rawResult === null) {
    rawResult = [];
  } else if (!Array.isArray(rawResult)) {
    rawResult = [rawResult];
  }

  finalResultList = rawResult.map(item => {
    if (item === null || typeof item === 'undefined') {
      return 'null'; // Always represent null/undefined as 'null' string for list consistency
    }

    if (wrapResults === false) {
      // "Less wrapped" mode: return primitives as is (Bubble handles coercion for number/boolean to text)
      // Objects and Arrays still get JSON.stringified for text compatibility
      if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
        return item;
      } else {
        return JSON.stringify(item);
      }
    } else {
      // "Fully wrapped" mode (wrapResults is true): stringify non-strings
      if (typeof item === 'string') {
        return item;
      } else {
        return JSON.stringify(item);
      }
    }
  });

  if (finalResultList.length > 0) {
    finalResultSingle = finalResultList[0];
  } else {
    finalResultSingle = null;
    // No error message for empty results unless JSONPath itself errored (handled above)
  }

  // --- Final Return ---
  return {
    result: finalResultSingle || null,
    result_list: finalResultList || [],
    is_error: isError || false, // Map camelCase variable to snake_case key
    error_message: errorMessage || null // Map camelCase variable to snake_case key
  };
};