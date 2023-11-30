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
  errorSchema,
  uiSchema,
  registry
) => (value, newErrorSchema) => {
  // Checks to see if user input is the same as old input. If so, do nothing
  if (oldValue === value) {
    return
  }

  // Checks that the value already exists in formData, if it does,
  // getAvailableKey creates a unique key with an appended suffix
  // eslint-disable-next-line no-param-reassign
  value = getAvailableKey(value, formData, uiSchema, registry)

  // Create a new object, renamedObj, based on existing form data and
  // change the key corresponding to oldVale to the new value.
  const newFormData = {
    ...(formData)
  }
  const newKeys = { [oldValue]: value }
  const keyValues = Object.keys(newFormData).map((key) => {
    const newKey = newKeys[key] || key

    return { [newKey]: newFormData[key] }
  })
  const renamedObj = Object.assign({}, ...keyValues)

  // Callback with updated object or error
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
