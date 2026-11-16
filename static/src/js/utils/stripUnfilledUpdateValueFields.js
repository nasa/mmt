// '', 0 and [] are the blank/unfilled default values for a text, number, and array field.
const isUnfilledPlaceholder = (fieldValue) => (
  fieldValue === ''
  || fieldValue === 0
  || (Array.isArray(fieldValue) && fieldValue.length === 0)
)

/**
 * Drops every key whose value is still unfilled ('', 0, or []) from an updateValue. `null` is
 * left alone -- that's an explicit "remove this field's value", distinct from "untouched".
 *
 * Recurses into nested objects/arrays, and drops an array entry entirely once stripping
 * leaves it with no keys left.
 *
 * @param {*} updateValue A parsed updateValue -- a single object, or an array of them.
 */
const stripUnfilledUpdateValueFields = (updateValue) => {
  if (Array.isArray(updateValue)) {
    return updateValue
      .map(stripUnfilledUpdateValueFields)
      .filter((entry) => (
        !(entry && typeof entry === 'object' && Object.keys(entry).length === 0)
      ))
  }

  if (updateValue === null || typeof updateValue !== 'object') {
    return updateValue
  }

  return Object.fromEntries(
    Object.entries(updateValue)
      .filter(([, fieldValue]) => !isUnfilledPlaceholder(fieldValue))
      .map(([key, fieldValue]) => [key, stripUnfilledUpdateValueFields(fieldValue)])
  )
}

export default stripUnfilledUpdateValueFields
