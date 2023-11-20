import { has } from 'lodash'

/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 */

export const getAvailableKey = (
  preferredKey,
  registry,
  uiSchema,
  formData
) => {
  const { getUiOptions } = registry
  const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema)

  let index = 0
  let newKey = preferredKey
  while (has(formData, newKey)) {
    // eslint-disable-next-line no-plusplus
    newKey = `${preferredKey}${duplicateKeySuffixSeparator}${++index}`
  }

  return newKey
}

export default getAvailableKey
