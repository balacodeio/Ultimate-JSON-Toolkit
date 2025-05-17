async function(properties, context) {
  const jsonSchemaGenerator = require('json-schema-generator');
  const jsonSchemaFaker = require('json-schema-faker');

  let inputData = properties.input_data;
  let conversionDirection = properties.conversion_direction;
  let outputData = null;
  let errorMessage = null;

  try {
    let parsedInput;
    try {
      parsedInput = JSON.parse(inputData);
    } catch (e) {
      errorMessage = "Invalid JSON: " + e.message;
      console.log("JSON Parse Error: " + e.message);
      return { output_data: null, error_message: errorMessage };
    }

    if (conversionDirection === "JSON to Schema") {
      try {
        outputData = JSON.stringify(jsonSchemaGenerator(parsedInput));
      } catch (e) {
        errorMessage = "Schema Generation Error: " + e.message;
        console.log("Schema Generation Error: " + e.message);
      }
    } else if (conversionDirection === "Schema to JSON") {
      try {
        // Attempt to generate a JSON object to validate the schema
        jsonSchemaFaker.generate(parsedInput);
        outputData = JSON.stringify(jsonSchemaFaker.generate(parsedInput));
      } catch (e) {
        errorMessage = "Invalid JSON Schema or JSON Generation Error: " + e.message;
        console.log("JSON Generation Error: " + e.message);
      }
    } else {
      errorMessage = "Invalid conversion direction.  Must be 'JSON to Schema' or 'Schema to JSON'";
      console.log(errorMessage);
    }
  } catch (e) {
    errorMessage = "An unexpected error occurred: " + e.message;
    console.log("Unexpected error: " + e.message);
  }

  return {
    output_data: outputData,
    error_message: errorMessage
  };
}
