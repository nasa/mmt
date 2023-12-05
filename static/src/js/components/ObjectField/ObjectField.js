import React from 'react'
import PropTypes from 'prop-types'
import { has } from 'lodash'
import { getUiOptions } from '@rjsf/utils'

/**
 * This class is pulled from:
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 *
 * It contains methods necessary for GridField.
 */
class ObjectField extends React.Component {
  // eslint-disable-next-line react/no-unused-class-component-methods
  onPropertyChange = (
    name,
    addedByAdditionalProperties = false
  ) => (value, newErrorSchema, id) => {
    const { formData, onChange, errorSchema } = this.props

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

    const newFormData = {
      ...formData,
      [name]: updatedValue
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
      index += 1
      newKey = `${preferredKey}${duplicateKeySuffixSeparator}${index}`
    }

    return newKey
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  onKeyChange = (oldValue) => (value, newErrorSchema) => {
    if (oldValue === value) {
      return
    }

    const { formData, onChange, errorSchema } = this.props

    const updatedValue = this.getAvailableKey(value, formData)
    const newFormData = {
      ...formData
    }
    const newKeys = { [oldValue]: updatedValue }
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
        [updatedValue]: newErrorSchema
      }
    )
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  isRequired(name) {
    const { schema } = this.props

    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
  }
}

ObjectField.propTypes = {
  schema: PropTypes.shape({
    required: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  errorSchema: PropTypes.shape({}).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default ObjectField
