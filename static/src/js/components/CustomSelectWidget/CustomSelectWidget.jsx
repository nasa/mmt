import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import parseCmrResponse from '../../utils/parseCmrResponse'
import fetchCmrKeywords from '../../utils/fetchCmrKeywords'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

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
  const [showDescription, setShowDescription] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)

  const selectOptions = []
  const { enum: schemaEnums = [], description } = schema
  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  let shouldFocus = false
  if (focusField === id) {
    shouldFocus = true
  } else if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      shouldFocus = true
    }
  }

  // If the value already has data, this will store it as an object for react-select
  const existingValue = value != null ? {
    value,
    label: value
  } : {}

  const [cmrKeywords, setCmrKeywords] = useState([])
  const controlledField = uiSchema['ui:controlled']

  // If a field in the uiSchema defines 'ui:controlled', this will make a
  // call out to CMR /keywords to retrieve the keyword.
  useEffect(() => {
    if (controlledField) {
      const { name } = controlledField
      if (name) {
        const cmrKeyword = async () => {
          setCmrKeywords(await fetchCmrKeywords(name))
        }

        cmrKeyword()
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
  } else if (Object.keys(cmrKeywords).length > 0) { // If cmrKeywords are present, this condition will parse the cmr response and add the enums the selectOption.
    const paths = parseCmrResponse(cmrKeywords, controlledField.controlName)
    const enums = paths.map((path) => (path[0]))
    selectOptionList(enums)
  } else { // Gets the enum values from the schema and adds to selectOption.
    selectOptionList(schemaEnums)
  }

  const handleChange = (event) => {
    onChange(event.value)
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
      description={showDescription ? description : null}
      scrollRef={selectScrollRef}
      required={required}
      title={title}
    >
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
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
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
