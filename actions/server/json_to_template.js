async function(properties, context) {
    /* eslint-disable no-console */

    // Helper function to build the template string recursively
    const buildTemplateString = (obj, ignoredKeys, wrappingOption, compact, currentPath = '', indent = '  ') => {
        if (typeof obj !== 'object' || obj === null) {
            return '';
        }

        const isArray = Array.isArray(obj);
        let result = isArray ? '[' : '{';
        let first = true;

        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

            const originalValue = obj[key];
            const newPath = currentPath ? `${currentPath}.${key}` : key;

            if (!first) {
                result += ',';
            }
            first = false;

            if (ignoredKeys.has(newPath)) {
                // If key is ignored, stringify its original value and append
                if (!compact) {
                    result += `\n${indent}`;
                }
                if (!isArray) {
                    result += `"${key}":${compact ? '' : ' '}`;
                }
                const ignoredValueIndent = compact ? 0 : 2;
                const ignoredValueJoiner = compact ? '' : `\n${indent}`;
                result += JSON.stringify(originalValue, null, ignoredValueIndent).split('\n').join(ignoredValueJoiner);
                continue;
            }

            if (!compact) {
                result += `\n${indent}`;
            }
            if (!isArray) {
                result += `"${key}":${compact ? '' : ' '}`;
            }

            if (typeof originalValue === 'object' && originalValue !== null) {
                result += buildTemplateString(originalValue, ignoredKeys, wrappingOption, compact, newPath, indent + '  ');
            } else {
                let replacement;
                const template = `<${isArray ? originalValue : key}>`;

                switch (wrappingOption) {
                    case 'Wrap all':
                        replacement = `"${template}"`;
                        break;
                    case 'Wrap only strings':
                        if (typeof originalValue === 'string') {
                            replacement = `"${template}"`;
                        } else {
                            replacement = template;
                        }
                        break;
                    case 'No wrapping':
                    default:
                        replacement = template;
                        break;
                }
                result += replacement;
            }
        }

        if (!compact) {
            result += `\n${indent.slice(2)}`;
        }
        result += isArray ? ']' : '}';
        return result;
    };

    try {
        if (!properties.json) {
            return {
                output: null,
                is_error: true,
                error_message: 'Input JSON is empty.'
            };
        }

        let jsonObject;
        try {
            jsonObject = JSON.parse(properties.json);
        } catch (e) {
            return {
                output: null,
                is_error: true,
                error_message: `Invalid input JSON format: ${e.message}`
            };
        }

        const ignoreSet = new Set(
            properties.ignore_keys ? properties.ignore_keys.split(',').map(k => k.trim()) : []
        );

        const outputString = buildTemplateString(jsonObject, ignoreSet, properties.wrapping_option, properties.compact_json);

        return {
            output: outputString,
            is_error: false,
            error_message: null
        };

    } catch (error) {
        console.error('JSON to Template Transformation Error:', error.message);
        return {
            output: null,
            is_error: true,
            error_message: `Failed to generate template: ${error.message}`
        };
    }
}
