import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { useNavigate, useParams } from 'react-router'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import './CustomTextareaWidget.scss'

const CustomTextareaWidget = ({
  label,
  id,
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

  const textareaScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext
  const { maxLength, description } = schema

  // Note: I feel like this can be done in CustomWrapper
  const headerClassName = uiSchema && uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : null

  let title = startCase(label.split(/-/)[0])

  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  // Note: I feel like this can be done in CustomWrapper
  let shouldFocus = false
  if (focusField === id) {
    shouldFocus = true
  } else if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      shouldFocus = true
    }
  }

  // Note: I feel like this can be done in CustomWrapper
  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      textareaScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  useEffect(() => {
    if (fieldName) {
      // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
      navigate(`../${conceptId}/${sectionName}`, { replace: true })
    }
  }, [fieldName])

  if (shouldFocus) {
    textareaScrollRef.current?.scrollIntoView({ behavior: 'smooth' })

    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

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
      scrollRef={textareaScrollRef}
      title={title}
    >
      <textarea
        className="custom-textarea-widget__input"
        ref={focusRef}
        name={title}
        maxLength={maxLength}
        value={value ?? ''}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextareaWidget.defaultProps = {
  value: null
}

CustomTextareaWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
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

  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomTextareaWidget
