import Ajv from 'ajv'
import addFormats from 'ajv-formats'

/**
 * Validates a JSON object against a schema using Ajv
 * @param {Object} jsonData - The JSON object to validate
 * @param {Object} schema - The JSON schema to validate against
 * @returns {Object} An object containing the validated data and any error messages
 */
export const validateJson = ({ jsonData, schema }) => {
  const ajv = new Ajv({
    allErrors: true,
    removeAdditional: false,
    verbose: true
  })

  // Add support for date-time format
  addFormats(ajv)

  try {
    const validate = ajv.compile(schema)
    const valid = validate(jsonData)

    if (valid) {
      return {
        data: jsonData,
        errors: null
      }
    }

    // Filter out errors about missing required properties
    const errorMessages = validate.errors
      .filter((error) => error.keyword !== 'required')
      .map((error) => {
        // Show name of properties which do not belong to schema
        if (error.keyword === 'additionalProperties') {
          return `${error.instancePath} ${error.message}: '${error.params.additionalProperty}'`
        }

        return `${error.instancePath} ${error.message}`
      })

    return {
      data: jsonData,
      errors: errorMessages.length > 0 ? errorMessages : null
    }
  } catch (error) {
    console.error('Error during validation:', error)

    return {
      data: jsonData,
      errors: [`Error during validation: ${error.message}`]
    }
  }
}
