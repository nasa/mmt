import React from 'react'
import { has } from 'lodash'
import { getUiOptions } from '@rjsf/utils'

/**
 * This class is pulled from:
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 *
 * It contains methods necessary for LayoutGridField.  I could not figure out how to extend this class via Typescript.
 * So for now, I'm just includeing the source of the necessary methods here.
 */
export default class ObjectField extends React.Component {
  onPropertyChange = (
    name,
    addedByAdditionalProperties = false
  ) => (value, newErrorSchema, id) => {
    const { formData, onChange, errorSchema } = this.props

    if (value === undefined && addedByAdditionalProperties) {
      // Don't set value = undefined for fields added by
      // additionalProperties. Doing so removes them from the
      // formData, which causes them to completely disappear
      // (including the input field for the property name). Unlike
      // fields which are "mandated" by the schema, these fields can
      // be set to undefined by clicking a "delete field" button, so
      // set empty values to the empty string.
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

  getAvailableKey = (preferredKey, formData) => {
    const { uiSchema } = this.props
    const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema)

    let index = 0
    let newKey = preferredKey
    while (has(formData, newKey)) {
      newKey = `${preferredKey}${duplicateKeySuffixSeparator}${++index}`
    }

    return newKey
  }

  onKeyChange = (oldValue) => (value, newErrorSchema) => {
    if (oldValue === value) {
      return
    }

    const { formData, onChange, errorSchema } = this.props

    value = this.getAvailableKey(value, formData)
    const newFormData = {
      ...formData
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

  isRequired(name) {
    const { schema } = this.props

    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
  }
}
