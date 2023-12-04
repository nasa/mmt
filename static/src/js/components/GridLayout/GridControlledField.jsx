import React, { useEffect, useRef, useState } from 'react'
import { cloneDeep, kebabCase } from 'lodash'
import PropTypes from 'prop-types'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import convertToDottedNotation from '../../utils/convertToDottedNotation'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import createPath from '../../utils/createPath'
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
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} formData contains the JSON data for parent form of the field
 * @property {Object} idSchema A idSchema for the field being shown.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} mapping is the mapping from JSON to CMR field names
 * @property {Function} onSelectValue A callback function triggered when the user selects a value
 * @property {String} name is the JSON field name
 * @property {String} controlName is the CMR field name
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders GridControlledField
 * @param {GridControlledField} props
 */
const GridControlledField = ({
  schema,
  registry,
  formData,
  idSchema,
  onChange,
  onSelectValue,
  name,
  controlName,
  mapping,
  uiSchema
}) => {
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

  // TODO saving the values is working correctly, but displaying them is failing. I think it has something to do with the keywords being recalulated in this step after the context changes
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

    const placeholder = uiSchema['ui:place-holder']

    return (
      <div className="form-group field field-string">
        <CustomTextWidget
          id={idSchema[name].$id}
          name={name}
          disabled
          required={isRequired(name)}
          label={title}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
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
  if (isLoading) {
    placeholder = 'Fetching keywords...'
  } else if (enumsLength === 0) {
    placeholder = `No available ${title}`
  }

  return (
    <div className="form-group field field-string">
      <CustomSelectWidget
        name={name}
        required={isRequired(name)}
        label={title}
        schema={retrievedSchema.properties[name]}
        registry={registry}
        value={formData[name]}
        onChange={
          (selectValue) => {
            let data = cloneDeep(formData)
            data[name] = selectValue
            data = clearFormData(mapping, data, controlName)
            onChange(data, null)

            if (onSelectValue) {
              onSelectValue(name, selectValue)
            }
          }
        }
        isLoading={isLoading}
        placeholder={placeholder}
        onBlur={() => null}
        onFocus={() => null}
        options={undefined}
        disabled={enumsLength === 0}
        id={idSchema[name].$id}
        selectOptions={enums}
        uiSchema={uiSchema}
      />
    </div>
  )
}

GridControlledField.defaultProps = {
  uiSchema: {},
  onSelectValue: null
}

GridControlledField.propTypes = {
  formData: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  controlName: PropTypes.string.isRequired,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired
  }).isRequired,
  schema: PropTypes.shape({
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)])
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  mapping: PropTypes.shape({
    name: PropTypes.string,
    map: PropTypes.shape({}),
    includeParentFormData: PropTypes.bool
  }).isRequired,
  onSelectValue: PropTypes.func,
  uiSchema: PropTypes.shape({})
}

export default GridControlledField
