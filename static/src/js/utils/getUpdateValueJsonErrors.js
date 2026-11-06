import validator from '@rjsf/validator-ajv8'

/**
 * Validates updateValue JSON text against its JSON Schema (see buildUpdateValueJsonSchema).
 * The schemas built for updateValue never declare `required`, so there's no need to filter
 * that kind of noise out of ajv's errors.
 *
 * `oneOf` is different: action types that support multiple entries get a
 * `oneOf: [entry, array-of-entry]` schema, and ajv reports every failing branch plus a
 * generic "must match exactly one schema in oneOf" summary for one real mistake. Only the
 * branch matching what was actually submitted (object vs array) is kept; the summary is
 * always dropped.
 *
 * @param {String} text The updateValue JSON text to validate.
 * @param {Object} schema The JSON Schema built by buildUpdateValueJsonSchema.
 * @returns {String[]} Readable error messages, empty when the text is valid JSON and
 * satisfies the schema.
 */
const getUpdateValueJsonErrors = (text, schema) => {
  let parsed

  try {
    parsed = JSON.parse(text)
  } catch (parseError) {
    return [`Invalid JSON: ${parseError.message}`]
  }

  const { errors = [] } = validator.validateFormData(parsed, schema)
  const intendedOneOfBranch = Array.isArray(parsed) ? 1 : 0

  const relevantErrors = errors.filter(({ name, schemaPath }) => {
    if (name === 'oneOf') return false

    const oneOfBranchMatch = schemaPath.match(/^#\/oneOf\/(\d+)/)

    if (!oneOfBranchMatch) return true

    return Number(oneOfBranchMatch[1]) === intendedOneOfBranch
  })

  const messages = relevantErrors.map(({
    name, property, message, params
  }) => {
    if (name === 'additionalProperties' && params?.additionalProperty) {
      const location = property ? `${property} ` : ''

      return `${location}must NOT have additional property '${params.additionalProperty}'`
    }

    return property ? `${property} ${message}` : message
  })

  return [...new Set(messages)]
}

export default getUpdateValueJsonErrors
