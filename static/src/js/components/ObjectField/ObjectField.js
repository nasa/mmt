import React from 'react'
import PropTypes from 'prop-types'

/**
 * This class is pulled from:
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 *
 * It contains methods necessary for GridField.
 */
class ObjectField extends React.Component {
  // Returns the `onPropertyChange` handler for the `name` field. Handles the special case where a user is attempting
  // to clear the data for a field added as an additional property. Calls the `onChange()` handler with the updated
  // formData.
  // eslint-disable-next-line react/no-unused-class-component-methods
  onPropertyChange = (
    name
  ) => (value, newErrorSchema, id) => {
    const {
      errorSchema,
      formData,
      onChange
    } = this.props

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

  // Returns a flag indicating whether the `name` field is required in the object schema
  // eslint-disable-next-line react/no-unused-class-component-methods
  isRequired(name) {
    const { schema } = this.props

    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
  }

  // Computes the next available key name from the `preferredKey`, indexing through the already existing keys until one
  // that is already not assigned is found.
  // getAvailableKey = (preferredKey, formData) => {
  //   const { uiSchema } = this.props
  //   const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema)

  //   let index = 0
  //   let newKey = preferredKey
  //   while (has(formData, newKey)) {
  //     index += 1
  //     newKey = `${preferredKey}${duplicateKeySuffixSeparator}${index}`
  //   }

  //   return newKey
  // }

  /** Returns a callback function that deals with the rename of a key for an additional property for a schema. That
   * callback will attempt to rename the key and move the existing data to that key, calling `onChange` when it does. * */
  //   onKeyChange = (oldValue) => (value, newErrorSchema) => {
  //     if (oldValue === value) {
  //       return
  //     }

  //     const { formData, onChange, errorSchema } = this.props

  //     const updatedValue = this.getAvailableKey(value, formData)
  //     const newFormData = {
  //       ...formData
  //     }
  //     const newKeys = { [oldValue]: updatedValue }
  //     const keyValues = Object.keys(newFormData).map((key) => {
  //       const newKey = newKeys[key] || key

  //       return { [newKey]: newFormData[key] }
  //     })
  //     const renamedObj = Object.assign({}, ...keyValues)

  //     onChange(
  //       renamedObj,
  //       errorSchema
  //       && errorSchema && {
  //         ...errorSchema,
  //         [updatedValue]: newErrorSchema
  //       }
  //     )
  //   }
}

ObjectField.propTypes = {
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    required: PropTypes.arrayOf(
      PropTypes.string
    )
  }).isRequired
}

export default ObjectField
