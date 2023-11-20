/* eslint-disable no-param-reassign */
import React, { useState } from 'react'
import { kebabCase } from 'lodash'
import PropTypes from 'prop-types'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import convertToDottedNotation from '../../utils/convertToDottedNotation'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import createPath from '../../utils/createPath'
import getParentFormData from '../../utils/getFormData'
import clearFormData from '../../utils/clearFormData'
import getKeywords from '../../utils/getKeywords'
import useAppContext from '../../hooks/useAppContext'

const LayoutGridFieldControlledField = ({
  layoutGridSchema,
  controlName,
  uiSchema,
  schema,
  registry,
  formData,
  idSchema,
  onChange
}) => {
  const [cmrResponse, setCmrResponse] = useState({})
  const [loading, setLoading] = useState(false)

  const {
    addStatusMessage,
    draft
  } = useAppContext()

  // Builds the filter for retrieving keywords.
  const createFilter = (form) => {
    const controlled = uiSchema['ui:controlled']
    const { map } = controlled

    const keys = Object.keys(map)
    const object = {}
    keys.forEach((key) => {
      if (form[key]) {
        object[map[key]] = form[key]
      }
    })

    return object
  }

  const isRequired = (name) => {
    const { required } = schema

    return Array.isArray(required) && required.indexOf(name) !== -1
  }

  const onHandleChange = uiSchema['ui:onHandleChange']

  const { schemaUtils } = registry
  const retrievedSchema = schemaUtils.retrieveSchema(schema)

  const name = layoutGridSchema

  // In this case the name referenced in the control name isn't in the schema
  if (retrievedSchema.properties[name] === undefined) {
    return null
  }

  let parentName = name
  const pos = parentName.lastIndexOf('-')
  if (pos > -1) {
    parentName = parentName.substring(0, pos)
  }

  const filter = createFilter(formData)

  const controlled = uiSchema['ui:controlled']
  const { map } = controlled
  const { includeParentFormData = false } = controlled
  if (includeParentFormData) {
    A
    const path = createPath(convertToDottedNotation(idSchema.$id))
    const parentFormData = getParentFormData(path, draft) ?? {}
    Object.keys(parentFormData).forEach((key) => {
      const newKey = map[key]
      if (newKey) {
        filter[newKey] = parentFormData[key]
      }
    })
  }

  delete filter[controlName]
  const enums = getKeywords(
    cmrResponse,
    controlName,
    filter,
    Object.values(map)
  )

  const sc = retrievedSchema.properties[name]
  if (enums.length > 0) {
    sc.enum = enums
  }

  const childIdSchema = idSchema[name]
  const keys = Object.keys(childIdSchema)
  keys.forEach((key) => {
    childIdSchema[key] = childIdSchema[key].replace('root', '')
  })

  const fieldUiSchema = uiSchema[name] ?? {}
  const title = fieldUiSchema['ui:title'] ?? name

  const existingValue = formData[name]
  const enumValue = (enums.length > 0) ? enums[0] : ''
  let value = existingValue ?? enumValue

  const { length: enumsLength } = enums

  const widget = fieldUiSchema['ui:widget']

  if (widget === CustomTextWidget) {
    const id = idSchema[name].$id
    idSchema[name].$id = id.replace('root', parentName)

    if (enums.length === 1) {
      const [first] = enums
      const priorValue = formData[name]
      formData[name] = first
      value = formData[name]
      if (priorValue !== value) {
        setTimeout(() => {
          onChange(formData, null)
        })
      }
    }

    const placeholder = fieldUiSchema['ui:place-holder']

    return (
      <div
        className="form-group field field-string"
        key={`${name}-${JSON.stringify(formData)}`}
        data-testid={`controlled-fields__custom-text-widget--${kebabCase(name)}`}
      >
        <CustomTextWidget
          key={`text--${name}`}
          id={idSchema[name].$id}
          name={name}
          disabled
          required={isRequired(name)}
          label={title}
          value={value}
          placeholder={placeholder}
          onChange={undefined}
          schema={retrievedSchema.properties[name]}
          onBlur={undefined}
          onFocus={undefined}
          registry={registry}
          options={undefined}
          uiSchema={uiSchema}
        />
      </div>
    )
  }

  if (!isRequired(name)) {
    enums.unshift(null)
  }

  let placeholder = `Select ${title}`
  if (loading) {
    placeholder = 'Fetching keywords...'
  } else if (enumsLength === 0) {
    placeholder = `No available ${title}`
  }

  return (
    <div
      className="form-group field field-string"
      data-testid={`layout-grid-field__custom-select-widget--${kebabCase(name)}`}
    >
      <CustomSelectWidget
        key={`select--${name}`}
        name={name}
        required={isRequired(name)}
        label={title}
        schema={retrievedSchema.properties[name]}
        uiSchema={uiSchema[name]}
        registry={registry}
        value={formData[name]}
        onChange={
          (selectValue) => {
            let data = formData
            data[name] = selectValue
            data = clearFormData(controlled, data, controlName)
            onChange(data, null)

            if (onHandleChange) {
              onHandleChange(name, selectValue)
            }
          }
        }
        isLoading={loading}
        placeholder={placeholder}
        onBlur={undefined}
        onFocus={undefined}
        options={undefined}
        disabled={enumsLength === 0}
        id={idSchema[name].$id}
      />
    </div>
  )
}

LayoutGridFieldControlledField.propTypes = {
  controlName: PropTypes.string.isRequired,
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  layoutGridSchema: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]).isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired,
    getUiOptions: PropTypes.func,
    schemaUtils: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    fields: PropTypes.shape({
      TitleField: PropTypes.func,
      SchemaField: PropTypes.func
    })
  }).isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
    properties: PropTypes.shape({})
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:controlled': PropTypes.string,
    'ui:onHandleChange': PropTypes.func
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default LayoutGridFieldControlledField
