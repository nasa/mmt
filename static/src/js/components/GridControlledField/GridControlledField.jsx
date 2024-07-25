import React, { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash-es'
import PropTypes from 'prop-types'

import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'

import createPath from '../../utils/createPath'
import convertToDottedNotation from '../../utils/convertToDottedNotation'
import getParentFormData from '../../utils/getParentFormData'
import clearFormData from '../../utils/clearFormData'
import getKeywords from '../../utils/getKeywords'

import useAppContext from '../../hooks/useAppContext'
import useControlledKeywords from '../../hooks/useControlledKeywords'

/**
 * GridControlledField
 * Handles fields that are linked via controlled vocabulary
 * This component will handle the select box change events, so if a user clicks one of
 * the select box, it will auto populate the next select box based on the field
 * selected.
 * @typedef {Object} GridControlledField
 * @property {String} controlName is the CMR field name
 * @property {Object} formData contains the JSON data for parent form of the field
 * @property {Object} idSchema A idSchema for the field being shown.
 * @property {Object} mapping is the mapping from JSON to CMR field names
 * @property {String} name is the JSON field name
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Function} onSelectValue A callback function triggered when the user selects a value
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders GridControlledField
 * @param {GridControlledField} props
 */
const GridControlledField = (props) => {
  const {
    controlName,
    formData,
    idSchema,
    mapping,
    name,
    onChange,
    onSelectValue,
    registry,
    schema,
    uiSchema
  } = props
  const {
    draft = {}
  } = useAppContext()
  const { ummMetadata } = draft

  const [cmrKeywords, setCmrKeywords] = useState([])

  const {
    keywords: schemaKeywords,
    map: controlledKeywordsMap,
    name: keywordType
  } = mapping

  const {
    keywords,
    isLoading
  } = useControlledKeywords(keywordType, schemaKeywords, controlledKeywordsMap)

  useEffect(() => {
    if (keywords && cmrKeywords !== keywords) {
      setCmrKeywords(keywords)
    }
  }, [keywords])

  // Builds the filter for retrieving keywords.
  const createFilter = (form) => {
    const { map } = mapping

    const keys = Object.keys(map)
    const object = {}
    keys.forEach((key) => {
      if (form[key]) {
        object[map[key]] = form[key]
      }
    })

    return object
  }

  const isRequired = (fieldName) => {
    const { required } = schema

    return Array.isArray(required) && required.indexOf(fieldName) !== -1
  }

  const { schemaUtils } = registry
  const retrievedSchema = schemaUtils.retrieveSchema(schema)

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

  /* The mapping is the mapping from JSON to CMR field names, as well as the
   * keyword's type (name)
   * mapping:
   * {
   *     name: 'related-urls',
   *     map: {
   *       URLContentType: 'url_content_type',
   *       Type: 'type',
   *       Subtype: 'subtype'
   *     }
   * }
   *
   */
  const { map } = mapping
  // TODO MMT-3416, this feature is only used in Variables, be sure to add tests to cover this functionality
  const { includeParentFormData = false } = mapping
  if (includeParentFormData) {
    const path = createPath(convertToDottedNotation(idSchema.$id))
    const parentFormData = getParentFormData(path, ummMetadata) ?? {}
    Object.keys(parentFormData).forEach((key) => {
      const newKey = map[key]
      if (newKey) {
        filter[newKey] = parentFormData[key]
      }
    })
  }

  delete filter[controlName]
  const enums = getKeywords(
    cmrKeywords,
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

  const title = uiSchema['ui:title'] ?? name

  const existingValue = formData[name]
  const enumValue = (enums.length > 0) ? enums[0] : ''
  let value = existingValue ?? enumValue

  const { length: enumsLength } = enums

  const widget = uiSchema['ui:widget']

  if (widget === CustomTextWidget) {
    const updatedIdSchema = idSchema

    const id = updatedIdSchema[name].$id
    updatedIdSchema[name].$id = id.replace('root', parentName)

    if (enums.length === 1) {
      const [first] = enums
      value = first

      if (value !== formData[name]) {
        let updatedFormData = cloneDeep(formData)
        updatedFormData[name] = value
        updatedFormData = clearFormData(mapping, updatedFormData, controlName)

        // Calling this onChange outside of the setTimeout results in an error:
        // Warning: Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.
        // I'm not sure how else to achieve the update without it though
        setTimeout(() => {
          onChange(updatedFormData, null)
        })
      }
    }

    const placeholder = uiSchema['ui:place-holder']

    return (
      <div className="form-group field field-string">
        <CustomTextWidget
          disabled
          id={updatedIdSchema[name].$id}
          label={title}
          name={name}
          onBlur={undefined}
          onChange={onChange}
          onFocus={undefined}
          placeholder={placeholder}
          registry={registry}
          required={isRequired(name)}
          schema={retrievedSchema.properties[name]}
          uiSchema={uiSchema}
          value={value}
        />
      </div>
    )
  }

  if (!isRequired(name)) {
    enums.unshift(null)
  }

  let placeholder = `Select ${title}`
  if (isLoading) {
    placeholder = 'Fetching keywords...'
  } else if (enumsLength === 0) {
    placeholder = `No available ${title}`
  }

  return (
    <div className="form-group field field-string mb-4">
      <CustomSelectWidget
        disabled={enumsLength === 0}
        id={idSchema[name].$id}
        isLoading={isLoading}
        label={title}
        name={name}
        onBlur={() => null}
        onChange={
          (selectValue) => {
            let updatedFormData = cloneDeep(formData)
            updatedFormData[name] = selectValue
            updatedFormData = clearFormData(mapping, updatedFormData, controlName)
            onChange(updatedFormData, null)

            if (onSelectValue) {
              onSelectValue(
                name,
                selectValue,
                {
                  ...props,
                  formData: updatedFormData
                },
                cmrKeywords
              )
            }
          }
        }
        placeholder={placeholder}
        registry={registry}
        required={isRequired(name)}
        schema={retrievedSchema.properties[name]}
        selectOptions={enums}
        uiSchema={uiSchema}
        value={formData[name]}
      />
    </div>
  )
}

GridControlledField.defaultProps = {
  uiSchema: {},
  onSelectValue: null
}

GridControlledField.propTypes = {
  controlName: PropTypes.string.isRequired,
  formData: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  mapping: PropTypes.shape({
    includeParentFormData: PropTypes.bool,
    keywords: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.string
      )
    ),
    map: PropTypes.shape({}),
    name: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelectValue: PropTypes.func,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.func
    ]).isRequired
  }).isRequired,
  schema: PropTypes.shape({
    required: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string)
    ])
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:place-holder': PropTypes.string,
    'ui:widget': PropTypes.func
  })
}

export default GridControlledField
