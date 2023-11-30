import { has } from 'lodash'
import { getUiOptions } from '@rjsf/utils'

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
  const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema, registry.globalUiOptions)

  let index = 0
  let newKey = preferredKey
  // Loop through formData to see if there is a key with the value of newKey.
  // If so, append an incremented index number
  while (has(formData, newKey)) {
    newKey = `${preferredKey}${duplicateKeySuffixSeparator}${index += 1}`
  }

  console.log(newKey)

  return newKey
}

export default getAvailableKey
