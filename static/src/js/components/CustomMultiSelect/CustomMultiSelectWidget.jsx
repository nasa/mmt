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

const CustomMultiSelectWidget = ({
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
  const { items } = schema
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
  const existingValues = []
  value.forEach((currentValue) => {
    if (currentValue != null) {
      existingValues.push({
        value: currentValue,
        label: currentValue
      })
    }
  })

  console.log('select', existingValues)
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

  // If enumOptions are define in uiSchema, these options take precedence over schema enums.
  selectOptionList(schemaEnums)

  const handleChange = (event) => {
    const result = []
    event.forEach((current) => {
      result.push(current.value)
    })

    onChange(result)
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
        defaultValue={existingValues ?? ''}
        options={selectOptions}
        isClearable
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        menuIsOpen={showMenu}
        isDisabled={disabled}
        isMulti
      />
    </CustomWidgetWrapper>
  )
}

CustomMultiSelectWidget.defaultProps = {
  disabled: false,
  value: null,
  placeholder: '',
  uiSchema: {
    'ui:title': null
  }
}

CustomMultiSelectWidget.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func
    }).isRequired,
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    items: PropTypes.shape({}).isRequired,
    description: PropTypes.string,
    maxLength: PropTypes.number,
    enum: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }),
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomMultiSelectWidget
