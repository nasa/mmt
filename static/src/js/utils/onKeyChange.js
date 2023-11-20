import getAvailableKey from './getAvailableKey'

/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
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
