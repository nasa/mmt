import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'
import getEnums from '../../utils/getEnums'

/**
 * CustomSelectWidget
 * @typedef {Object} CustomArrayFieldTemplate
 * @property {Boolean} disable A boolean value to disable the select field.
 * @property {String} label The label of the widget.
 * @property {String} id The id of the widget.
 * @property {String} placeholder A placeholder text for the multiselect.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user selects an option.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A Date value saved to the draft.
 */

/**
 * Renders Custom Select Widget
 * @param {CustomArrayFieldTemplate} props
 */
const CustomSelectWidget = ({
  disabled,
  label = '',
  id,
  placeholder,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const { items = {} } = schema
  const { schemaUtils } = registry
  const retrievedSchema = schemaUtils.retrieveSchema(items)

  const [showDescription, setShowDescription] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)

  const selectOptions = []
  const { enum: schemaEnums = retrievedSchema?.enum ?? [], description } = schema
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

  // If the value already has data, this will store it as an object for react-select
  const existingValue = value != null ? {
    value,
    label: value
  } : {}

  const [cmrEnums, setCmrEnums] = useState([])
  const controlledField = uiSchema['ui:controlled']

  // If a field in the uiSchema defines 'ui:controlled', this will make a
  // call out to CMR /keywords to retrieve the keyword.
  useEffect(() => {
    if (controlledField) {
      const { name } = controlledField
      if (name) {
        const cmrEnum = async () => {
          setCmrEnums(await getEnums(name, controlledField.controlName))
        }

        cmrEnum()
      }
    }
  }, [])

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()

      setShowMenu(true)
    }
  }, [shouldFocus])

  // Helper function that will add the list of enums to selectedOption
  const selectOptionList = (enums) => {
    enums.forEach((enumValue) => {
      selectOptions.push({
        value: enumValue,
        label: enumValue
      })
    })
  }

  // Extracting ui:options from uiSchema
  const uiOptions = uiSchema['ui:options']

  // If enumOptions are define in uiSchema, these options take precedence over schema enums.
  if (uiOptions) {
    const { enumOptions } = uiOptions

    selectOptionList(enumOptions)
  } else if (uiSchema['ui:controlled']) {
    selectOptionList(cmrEnums)
  } else { // Gets the enum values from the schema and adds to selectOption.
    selectOptionList(schemaEnums)
  }

  const handleChange = (event) => {
    const { value: selectedValue } = event || false
    onChange(selectedValue)
    setShowMenu(false)
    focusRef.current?.blur()
  }

  const handleFocus = () => {
    setShowDescription(true)
    setShowMenu(true)
  }

  const handleBlur = () => {
    onBlur(id)
    setFocusField(null)
    setShowMenu(false)
    setShowDescription(false)
  }

  return (
    <CustomWidgetWrapper
      label={label}
      scrollRef={selectScrollRef}
      required={required}
      title={title}
    >
      <span className="custom-widget__description">
        {showDescription ? description : null}
      </span>
      <Select
        id={id}
        ref={focusRef}
        placeholder={placeholder || `Select ${title}`}
        defaultValue={existingValue ?? ''}
        options={selectOptions}
        isClearable
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        menuIsOpen={showMenu}
        isDisabled={disabled}
      />
    </CustomWidgetWrapper>
  )
}

CustomSelectWidget.defaultProps = {
  disabled: false,
  value: null,
  placeholder: '',
  uiSchema: {
    'ui:title': null
  }
}

CustomSelectWidget.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired,
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func()
    })
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    items: PropTypes.shape({}),
    description: PropTypes.string,
    maxLength: PropTypes.number,
    enum: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      enumOptions: PropTypes.arrayOf()
    }),
    'ui:title': PropTypes.string,
    'ui:controlled': PropTypes.shape({
      name: PropTypes.string.isRequired,
      controlName: PropTypes.string.isRequired
    })
  }),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomSelectWidget
