// Builds a JSON Schema fragment for one BulkUpdateValueField-shaped field def (see
// constants/bulkUpdateFields.js), so the updateValue JSON editor can offer schema-driven
// autocomplete/hover help and flag structural errors, without hand-building a form per field.
const fieldToSchema = ({
  type, options, fields: nestedFields
}) => {
  if (type === 'number') {
    return { type: 'integer' }
  }

  if (type === 'select') {
    return {
      type: 'string',
      enum: options
    }
  }

  if (type === 'multiselect') {
    return {
      type: 'array',
      items: {
        type: 'string',
        enum: options
      }
    }
  }

  if (type === 'nested-array') {
    return {
      type: 'array',
      items: {
        type: 'object',
        properties: Object.fromEntries(
          nestedFields.map((field) => [field.key, fieldToSchema(field)])
        ),
        additionalProperties: false
      }
    }
  }

  return { type: 'string' }
}

/**
 * Builds the JSON Schema for the updateValue JSON editor, given the flat field defs for the
 * selected updateField and whether the selected updateType supports an array of entries.
 *
 * Per CMR's docs, `updateValue` "could be an array of objects" for those types -- "could",
 * not "must". So `allowMultiple` widens the schema to accept either a single entry or an
 * array, rather than requiring the array form.
 *
 * @param {import('../constants/bulkUpdateFields').BulkUpdateValueField[]} fields
 * @param {Boolean} allowMultiple
 */
const buildUpdateValueJsonSchema = (fields, allowMultiple) => {
  const entrySchema = {
    type: 'object',
    properties: Object.fromEntries(fields.map((field) => [field.key, fieldToSchema(field)])),
    additionalProperties: false
  }

  if (!allowMultiple) return entrySchema

  return {
    oneOf: [
      entrySchema,
      {
        type: 'array',
        items: entrySchema
      }
    ]
  }
}

export default buildUpdateValueJsonSchema
