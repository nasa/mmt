import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { useNavigate, useParams } from 'react-router'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './CustomTextWidget.scss'

// TODO a lot of this logic feels like it can/should still be abstracted out. Focus logic will need to happen for every widget

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
  const {
    conceptId,
    sectionName,
    fieldName
  } = useParams()
  const navigate = useNavigate()
  const [showDescription, setShowDescription] = useState(false)
  const [charsUsed, setCharsUsed] = useState(value != null ? value.length : 0)
  const inputScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  const { maxLength, description } = schema

  const fieldType = uiSchema ? uiSchema['ui:type'] : null
  const headerClassName = uiSchema && uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : null

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  let shouldFocus = false
  console.log('🚀 ~ file: CustomTextWidget.jsx:58 ~ id:', id)
  console.log('🚀 ~ file: CustomTextWidget.jsx:59 ~ focusField:', focusField)
  if (focusField === id) {
    shouldFocus = true
  } else if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      shouldFocus = true
    }
  }

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      inputScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  useEffect(() => {
    if (fieldName) {
      // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
      navigate(`../${conceptId}/${sectionName}`, { replace: true })
    }
  }, [fieldName])

  const handleFocus = () => {
    setShowDescription(true)
  }

  const handleChange = (event) => {
    const { value: newValue } = event.target

    if (newValue === '') {
      setCharsUsed(0)
      onChange(undefined)
    }

    setCharsUsed(newValue.length)
    onChange(newValue)
  }

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
        value={value ?? ''}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextWidget.defaultProps = {
  disabled: false,
  value: null
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
  uiSchema: PropTypes.shape({}).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomTextWidget
