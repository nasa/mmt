/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 *
 * @param {String} name Name of the field
 * @param {Object} formData An Object with the saved metadata
 * @param {Function} onChange A callback function triggered when the user inputs a text.
 * @param {Object} errorSchema An object with the list of errors
 * @param {Boolean} addedByAdditionalProperties
*/
export const onPropertyChange = (
  name,
  formData,
  onChange,
  errorSchema,
  addedByAdditionalProperties = false
) => (value, newErrorSchema, id) => {
  if (value === undefined && addedByAdditionalProperties) {
    // Don't set value = undefined for fields added by
    // additionalProperties. Doing so removes them from the
    // formData, which causes them to completely disappear
    // (including the input field for the property name). Unlike
    // fields which are "mandated" by the schema, these fields can
    // be set to undefined by clicking a "delete field" button, so
    // set empty values to the empty string.
    // eslint-disable-next-line no-param-reassign
    value = ''
  }

  const newFormData = {
    ...formData,
    [name]: value
  }
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
