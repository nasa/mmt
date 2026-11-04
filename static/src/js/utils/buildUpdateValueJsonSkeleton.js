// A placeholder value per field type, so the prepopulated JSON shows every key the selected
// updateField accepts without guessing at real content on the user's behalf.
const fieldToSkeletonValue = ({ type }) => {
  if (type === 'multiselect' || type === 'nested-array') return []
  if (type === 'number') return 0

  return ''
}

/**
 * Builds the prepopulated JSON text for the updateValue editor, given the flat field defs
 * for the selected updateField and whether the selected updateType supports an array of
 * entries (per CMR's docs, `updateValue` can be a single object or an array of objects for
 * ADD_TO_EXISTING, CLEAR_ALL_AND_REPLACE, and FIND_AND_REPLACE).
 *
 * @param {import('../constants/bulkUpdateFields').BulkUpdateValueField[]} fields
 * @param {Boolean} allowMultiple
 */
const buildUpdateValueJsonSkeleton = (fields, allowMultiple) => {
  const entry = Object.fromEntries(
    fields.map((field) => [field.key, fieldToSkeletonValue(field)])
  )

  return JSON.stringify(allowMultiple ? [entry] : entry, null, 2)
}

export default buildUpdateValueJsonSkeleton
