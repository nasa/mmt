// Every field schema accepts `null` alongside its real type by default -- that's how a user
// explicitly removes a field's value (see stripUnfilledUpdateValueFields.js), as distinct
// from leaving it at its unfilled skeleton default, which gets dropped instead of submitted.
// Without this, the schema rejects `null` outright with "Expected array but received null".
// A field that's actually required in this context has that `null` stripped back out again
// below, since a required field can't be removed -- it has to have a real value.
const nullable = (type) => [type, 'null']

// Builds a JSON Schema fragment for one BulkUpdateValueField-shaped field def (see
// constants/bulkUpdateFields.js), so the updateValue JSON editor can offer schema-driven
// autocomplete/hover help and flag structural errors, without hand-building a form per field.
const fieldToSchema = ({
  type, options, fields: nestedFields
}) => {
  if (type === 'number') {
    return { type: nullable('integer') }
  }

  if (type === 'select') {
    return {
      type: nullable('string'),
      enum: [...options, null]
    }
  }

  if (type === 'multiselect') {
    return {
      type: nullable('array'),
      items: {
        type: 'string',
        enum: options
      }
    }
  }

  if (type === 'nested-array') {
    return {
      type: nullable('array'),
      items: {
        type: 'object',
        properties: Object.fromEntries(
          nestedFields.map((field) => [field.key, fieldToSchema(field)])
        ),
        additionalProperties: false
      }
    }
  }

  return { type: nullable('string') }
}

/**
 * Builds the JSON Schema for the updateValue JSON editor, given the flat field defs for the
 * selected updateField and whether the selected updateType supports an array of entries.
 *
 * Per CMR's docs, `updateValue` "could be an array of objects" for those types -- "could",
 * not "must". So `allowMultiple` widens the schema to accept either a single entry or an
 * array, rather than requiring the array form. `allowMultiple` also decides whether any
 * `requiredWhenReplacing` field is actually required (see `fields`).
 *
 * @param {import('../constants/bulkUpdateFields').BulkUpdateValueField[]} fields
 * @param {Boolean} allowMultiple
 */
const buildUpdateValueJsonSchema = (fields, allowMultiple) => {
  const properties = Object.fromEntries(fields.map((field) => [field.key, fieldToSchema(field)]))

  // A field marked `requiredWhenReplacing` (e.g. Data Centers' Roles) must be present with at
  // least one real value whenever this action type submits a whole new/replaced entry
  // (allowMultiple -- ADD_TO_EXISTING/CLEAR_ALL_AND_REPLACE/FIND_AND_REPLACE): CMR's UMM-C
  // schema requires that field on the entry, so a blank one would fail CMR's own validation
  // after submit instead of being caught here first. Not enforced for FIND_AND_UPDATE's
  // partial merge, where the existing entry already has a valid value.
  const requiredKeys = allowMultiple
    ? fields.filter(({ requiredWhenReplacing }) => requiredWhenReplacing).map(({ key }) => key)
    : []

  requiredKeys.forEach((key) => {
    const propertySchema = properties[key]

    // `required` only checks that the key is present -- an explicit `null` still satisfies
    // it (and still matches this field's nullable `type`), so without this a null value would
    // silently bypass required-ness entirely, the same way it would otherwise bypass the
    // `minItems` below. A genuinely required field has to have a real value, not null.
    const { type } = propertySchema
    const nonNullType = Array.isArray(type) ? type.filter((t) => t !== 'null') : type
    const resolvedType = nonNullType.length === 1 ? nonNullType[0] : nonNullType

    properties[key] = {
      ...propertySchema,
      type: resolvedType,
      ...(propertySchema.enum && { enum: propertySchema.enum.filter((value) => value !== null) }),
      ...(propertySchema.items && { minItems: 1 }),
      // A required string field (text or select) still needs a real value -- `required`
      // only checks the key is present, and `type: 'string'` matches an empty string too, so
      // without this an untouched '' skeleton default would silently pass as "filled in".
      ...(resolvedType === 'string' && { minLength: 1 })
    }
  })

  const entrySchema = {
    type: 'object',
    properties,
    additionalProperties: false,
    ...(requiredKeys.length > 0 && { required: requiredKeys })
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
