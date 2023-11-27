import getAvailableKey from './getAvailableKey'

/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx

 * @param {String} oldValue Previous value
 * @param {Object} formData An Object with the saved metadata
 * @param {Function} onChange A callback function triggered when the user inputs a text.
 * @param {Object} errorSchema An object with the list of errors
 */
export const onKeyChange = (
  oldValue,
  formData,
  onChange,
  errorSchema
) => (value, newErrorSchema) => {
  if (oldValue === value) {
    return
  }

  // eslint-disable-next-line no-param-reassign
  value = getAvailableKey(value, formData)
  const newFormData = {
    ...(formData)
  }
  const newKeys = { [oldValue]: value }
  const keyValues = Object.keys(newFormData).map((key) => {
    const newKey = newKeys[key] || key

    return { [newKey]: newFormData[key] }
  })
  const renamedObj = Object.assign({}, ...keyValues)

  onChange(
    renamedObj,
    errorSchema
      && errorSchema && {
      ...errorSchema,
      [value]: newErrorSchema
    }
  )
}

export default onKeyChange
