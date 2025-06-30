async function(properties, context) {
  const jsonSchemaGenerator = require('json-schema-generator');
  const jsonSchemaFaker = require('json-schema-faker');

  // Helper function to manually resolve conditional schema logic
  function resolveConditionalSchema(schema) {
    const newSchema = JSON.parse(JSON.stringify(schema));
    if (!newSchema.allOf) {
        return newSchema;
    }
    const allOfs = newSchema.allOf;
    delete newSchema.allOf;
    allOfs.forEach(condition => {
        if (condition.if && condition.if.properties && condition.then) {
            const ifProp = Object.keys(condition.if.properties)[0];
            if (!ifProp) return;
            const ifValue = condition.if.properties[ifProp].enum[0];
            let conditionalPropValue = null;
            if (newSchema.properties && newSchema.properties[ifProp]) {
                const propDef = newSchema.properties[ifProp];
                if (propDef.const !== undefined) {
                    conditionalPropValue = propDef.const;
                } else if (propDef.enum && propDef.enum.length > 0) {
                    conditionalPropValue = propDef.enum[0];
                }
            }
            let branch = (conditionalPropValue === ifValue) ? condition.then : condition.else;
            if (branch && branch.allOf) {
                branch.allOf.forEach(subCondition => {
                    if (subCondition.required) {
                        if (!newSchema.required) newSchema.required = [];
                        newSchema.required = [...new Set([...newSchema.required, ...subCondition.required])];
                    }
                    if (subCondition.not && subCondition.not.required) {
                        if (!newSchema.required) return;
                        const fieldsToRemove = subCondition.not.required;
                        newSchema.required = newSchema.required.filter(field => !fieldsToRemove.includes(field));
                    }
                });
            }
        }
    });
    return newSchema;
  }

  // Helper function to force all defined properties to be generated
  function forceAllProperties(schema) {
      const newSchema = JSON.parse(JSON.stringify(schema));
      if (newSchema.properties) {
          const allKeys = Object.keys(newSchema.properties);
          if (!newSchema.required) newSchema.required = [];
          newSchema.required = [...new Set([...newSchema.required, ...allKeys])];
      }
      return newSchema;
  }

  // Helper function to sanitize the schema
  function sanitizeSchema(schema) {
    if (typeof schema !== 'object' || schema === null) return schema;
    if (Array.isArray(schema)) return schema.map(item => sanitizeSchema(item));
    const newSchema = {};
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        newSchema[key] = (key === 'type' && schema[key] === 'json') ? 'object' : sanitizeSchema(schema[key]);
      }
    }
    return newSchema;
  }

  // Helper function to omit keys
  function omitKeys(obj, keysToOmit) {
    if (!keysToOmit || keysToOmit.trim() === '') return obj;
    const keys = keysToOmit.split(',').map(k => k.trim());
    const newObj = JSON.parse(JSON.stringify(obj));
    for (const key of keys) {
      const path = key.split('.');
      let current = newObj;
      for (let i = 0; i < path.length; i++) {
        const segment = path[i];
        if (current === null || typeof current !== 'object') break;
        if (i === path.length - 1) delete current[segment];
        else current = current[segment];
      }
    }
    return newObj;
  }

  // Helper function to set properties
  function setSchemaProperties(schema, setKeysStr) {
    const modifiedSchema = JSON.parse(JSON.stringify(schema));
    if (!setKeysStr || setKeysStr.trim() === '') return modifiedSchema;
    const pairs = setKeysStr.split(',').map(p => p.trim());
    for (const pair of pairs) {
        const firstEqualIndex = pair.indexOf('=');
        if (firstEqualIndex === -1) continue;
        const key = pair.substring(0, firstEqualIndex).trim();
        let valueStr = pair.substring(firstEqualIndex + 1).trim();
        let value;
        if (!key) continue;
        try {
            value = JSON.parse(valueStr);
        } catch (e) {
            value = (valueStr.startsWith('"') && valueStr.endsWith('"')) ? valueStr.substring(1, valueStr.length - 1) : valueStr;
        }
        const path = key.split('.');
        let current = modifiedSchema;
        for (let i = 0; i < path.length; i++) {
            const segment = path[i];
            if (i === path.length - 1) {
                if (!current.properties) current.properties = {};
                let typeOfValue = Array.isArray(value) ? 'array' : typeof value;
                if (value === null) typeOfValue = 'null';
                
                // Preserve existing property definition and add const constraint
                const existingProp = current.properties[segment] || {};
                const newProp = {
                    ...existingProp,
                    type: typeOfValue,
                    const: value
                };
                
                // Remove enum if const is set (they conflict)
                if (newProp.enum) {
                    delete newProp.enum;
                }
                
                current.properties[segment] = newProp;
            } else {
                if (!current.properties) current.properties = {};
                if (!current.properties[segment] || typeof current.properties[segment] !== 'object') {
                    current.properties[segment] = {
                        type: 'object',
                        properties: {}
                    };
                }
                current = current.properties[segment];
            }
        }
    }
    return modifiedSchema;
  }

  // Helper function to override properties on the generated JSON
  function overrideJsonProperties(obj, setKeysStr) {
    if (!setKeysStr || setKeysStr.trim() === '') return obj;
    const newObj = JSON.parse(JSON.stringify(obj));
    const pairs = setKeysStr.split(',').map(p => p.trim());
    for (const pair of pairs) {
        const firstEqualIndex = pair.indexOf('=');
        if (firstEqualIndex === -1) continue;
        const key = pair.substring(0, firstEqualIndex).trim();
        let valueStr = pair.substring(firstEqualIndex + 1).trim();
        let value;
        if (!key) continue;
        try {
            value = JSON.parse(valueStr);
        } catch (e) {
            value = (valueStr.startsWith('"') && valueStr.endsWith('"')) ? valueStr.substring(1, valueStr.length - 1) : valueStr;
        }
        const path = key.split('.');
        let current = newObj;
        for (let i = 0; i < path.length; i++) {
            const segment = path[i];
            if (typeof current !== 'object' || current === null) break;
            if (i === path.length - 1) {
                current[segment] = value;
            } else {
                if (current[segment] === undefined) {
                    current[segment] = {};
                }
                current = current[segment];
            }
        }
    }
    return newObj;
  }

  let { input_data, conversion_direction, set_keys, omit_keys, limit_to_required } = properties;
  let outputData = null;
  let errorMessage = null;

  try {
    if (!input_data) throw new Error("Input Data cannot be empty.");
    let parsedInput = JSON.parse(input_data);
    let sanitizedInput = sanitizeSchema(parsedInput);

    if (conversion_direction === "JSON to Schema") {
      outputData = JSON.stringify(jsonSchemaGenerator(sanitizedInput));
    } else if (conversion_direction === "Schema to JSON") {
      let schemaWithSetProps = setSchemaProperties(sanitizedInput, set_keys);
      let resolvedSchema = resolveConditionalSchema(schemaWithSetProps);
      
      let finalSchema = resolvedSchema;
      if (limit_to_required === false) {
          finalSchema = forceAllProperties(resolvedSchema);
      }
      
      let generatedObject = jsonSchemaFaker(finalSchema);
      
      // Override properties with set_keys after generation (ensures const values are applied)
      let finalObject = overrideJsonProperties(generatedObject, set_keys);

      if (omit_keys) {
        finalObject = omitKeys(finalObject, omit_keys);
      }
      outputData = JSON.stringify(finalObject);
    } else {
      throw new Error("Invalid conversion direction.");
    }
  } catch (e) {
    errorMessage = e.message;
  }

  return {
    output_data: outputData,
    error_message: errorMessage
  };
}
