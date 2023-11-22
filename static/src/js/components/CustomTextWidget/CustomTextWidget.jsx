import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

import './CustomTextWidget.scss'

const CustomTextWidget = ({
  disabled,
  label,
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
  const [charsUsed, setCharsUsed] = useState(value?.length)
  const [fieldValue, setFieldValue] = useState(value)

  const inputScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  const { maxLength, description } = schema

  const fieldType = uiSchema['ui:type']
  const headerClassName = uiSchema['ui:header-classname']

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      inputScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  // Handling focusing the field
  const handleFocus = () => {
    setShowDescription(true)
  }

  // Handle the value changing in the field
  const handleChange = (event) => {
    const { value: newValue } = event.target

    setFieldValue(newValue)

    if (newValue === '') {
      setCharsUsed(0)
      onChange(undefined)

      return
    }

    setCharsUsed(newValue.length)
    onChange(newValue)
  }

  // Handle the field losing focus
  const handleBlur = () => {
    setFocusField(null)

    setShowDescription(false)
    onBlur(id)
  }

  return (
    <CustomWidgetWrapper
      charsUsed={charsUsed}
      description={showDescription ? description : null}
      headerClassName={headerClassName}
      label={label}
      maxLength={maxLength}
      required={required}
      scrollRef={inputScrollRef}
      title={title}
    >
      <input
        ref={focusRef}
        className="custom-text-widget__input"
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={title}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        type={fieldType && fieldType === 'number' ? 'number' : 'text'}
        value={fieldValue}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextWidget.defaultProps = {
  disabled: false,
  value: ''
}

CustomTextWidget.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:header-classname': PropTypes.string,
    'ui:title': PropTypes.string,
    'ui:type': PropTypes.string
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomTextWidget
