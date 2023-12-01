/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 *
 * @param {String} name Name of the field
 * @param {Object} formData An Object with the saved metadata
 * @param {Function} onChange A callback function triggered when the user inputs a text.
 * @param {Object} errorSchema An object with the list of errors
 * @param {Boolean} addedByAdditionalProperties A flag indicating whether the field was added by additional properties.
*/

// Returns the `onPropertyChange` handler for the `name` field on the form data. Handles the special case where a user is attempting
// to clear the data for a field added as an additional property. Calls the `onChange()` handler with the updated formData.

const onPropertyChange = (
  name,
  formData,
  onChange,
  errorSchema,
  addedByAdditionalProperties = false

) => (value, newErrorSchema, id) => {
  // UpdatedValue is updating each character entering in each field on the form data
  // Initilizes updatedValue with provided value here in order to make (// eslint-disable-next-line no-param-reassign on value = '' in  if condition) to go away
  let updatedValue = value

  if (value === undefined && addedByAdditionalProperties) {
    // Don't set value = undefined for fields added by
    // additionalProperties. Doing so removes them from the
    // formData, which causes them to completely disappear
    // (including the input field for the property name). Unlike
    // fields which are "mandated" by the schema, these fields can
    // be set to undefined by clicking a "delete field" button, so
    // set empty values to the empty string.

    updatedValue = ''
  }

  // Create a new form data object by updating the specified property (name) with updated value entering in each field on the form data.
  const newFormData = {
    ...formData,
    [name]: updatedValue
  }

  // Call the provided onChange callback with the updated form data,
  // considering the errorSchema and new error information related to the specific field (name).
  onChange(
    newFormData,
    errorSchema
      && errorSchema && {
      ...errorSchema,
      [name]: newErrorSchema
    },
    id
  )
}

export default onPropertyChange
