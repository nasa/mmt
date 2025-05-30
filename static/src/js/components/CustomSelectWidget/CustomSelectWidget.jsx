import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { isEmpty, startCase } from 'lodash-es'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'
import parseCmrResponse from '../../utils/parseCmrResponse'
import useControlledKeywords from '../../hooks/useControlledKeywords'

/**
 * CustomSelectWidget
 * @typedef {Object} CustomSelectWidget
 * @property {Boolean} disable A boolean value to disable the select field.
 * @property {String} label The label of the widget.
 * @property {String} id The id of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user selects an option.
 * @property {String} placeholder A placeholder text for the multiselect.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {String[]} selectOptions Optional items to be provided to the select field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A Date value saved to the draft.
 */

/**
 * Renders Custom Select Widget
 * @param {CustomSelectWidget} props
 */
const CustomSelectWidget = ({
  disabled,
  id,
  label,
  onBlur,
  onChange,
  placeholder,
  registry,
  required,
  schema,
  selectOptions: propsSelectOptions,
  uiSchema,
  options,
  value
}) => {
  const { items = {} } = schema
  const { schemaUtils } = registry
  const retrievedSchema = schemaUtils.retrieveSchema(items)

  const [selectOptions, setSelectOptions] = useState([])

  const selectScrollRef = useRef(null)

  const controlledField = uiSchema['ui:controlled']
  const { name: keywordType, controlName } = controlledField || {}
  const {
    keywords,
    isLoading
  } = useControlledKeywords(keywordType)

  const {
    enum: schemaEnums = retrievedSchema?.enum ?? [],
    description
  } = schema
  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext
  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them and sets the showMenu state to true
    if (shouldFocus) {
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldFocus])

  // Maps the list of options into a list of objects with labels and values
  const buildOptions = (enums) => enums.map((enumValue) => ({
    label: enumValue,
    value: enumValue
  }))

  useEffect(() => {
    if (propsSelectOptions) {
      setSelectOptions(buildOptions(propsSelectOptions))

      return
    }

    if (schemaEnums.length) {
      setSelectOptions(buildOptions(schemaEnums))
    }

    const uiOptions = uiSchema['ui:options'] || {}
    const { enumOptions } = uiOptions

    if (enumOptions) {
      setSelectOptions(buildOptions(enumOptions))
    }

    const { enumOptions: oneOfEnums } = options

    if (oneOfEnums) {
      setSelectOptions(oneOfEnums)
    }
  }, [propsSelectOptions, options])

  useEffect(() => {
    if (!isEmpty(keywords)) {
      const parsedKeywords = parseCmrResponse(keywords, controlName)

      const parsedOptions = parsedKeywords.map((enumValue) => {
        const [firstValue] = enumValue

        return {
          value: firstValue,
          label: firstValue
        }
      })

      setSelectOptions(parsedOptions)
    }
  }, [keywords])

  const handleChange = (event) => {
    const { value: newValue } = event || {}

    onChange(newValue)
  }

  const handleBlur = () => {
    setFocusField(null)
    onBlur(id)
  }

  const { enumOptions: oneOfEnums } = options || {}

  const getExistingValue = () => {
    if (value !== null) {
      if (typeof value === 'number') {
        return oneOfEnums[value]
      }

      return {
        value,
        label: value
      }
    }

    return null
  }

  const existingValue = getExistingValue()

  return (
    <CustomWidgetWrapper
      description={description}
      label={label}
      id={id}
      required={required}
      scrollRef={selectScrollRef}
      title={title}
    >
      <Select
        key={`${id}_${focusField}`}
        id={id}
        autoFocus={shouldFocus}
        isClearable
        isDisabled={disabled}
        isLoading={isLoading}
        onBlur={handleBlur}
        onChange={handleChange}
        options={selectOptions}
        placeholder={placeholder || `Select ${title}`}
        styles={
          {
            control: (baseStyles, { isFocused }) => ({
              ...baseStyles,
              borderColor: isFocused ? '#86b7fe' : 'var(--bs-gray-400)',
              boxShadow: isFocused && 'var(--bs-focus-ring-x, 0) var(--bs-focus-ring-y, 0) var(--bs-focus-ring-blur, 0) var(--bs-focus-ring-width) var(--bs-focus-ring-color)'
            })
          }
        }
        value={existingValue}
      />
    </CustomWidgetWrapper>
  )
}

CustomSelectWidget.defaultProps = {
  disabled: false,
  placeholder: null,
  selectOptions: null,
  uiSchema: {},
  value: null,
  options: {},
  required: false
}

CustomSelectWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired,
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func
    })
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    items: PropTypes.shape({}),
    description: PropTypes.string,
    maxLength: PropTypes.number,
    enum: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.string),
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      enumOptions: PropTypes.arrayOf(PropTypes.string)
    }),
    'ui:title': PropTypes.string,
    'ui:controlled': PropTypes.shape({
      name: PropTypes.string.isRequired,
      controlName: PropTypes.string.isRequired
    })
  }),
  options: PropTypes.shape({
    enumOptions: PropTypes.arrayOf(PropTypes.shape({}))
  }),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf([null]),
    PropTypes.arrayOf(PropTypes.any)
  ])
}

export default CustomSelectWidget
