import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

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

  const shouldFocus = shouldFocusField(focusField, id)

  // Note: I feel like this can be done in CustomWrapper
  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      textareaScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

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
    'ui:header-classname': PropTypes.string,
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomTextareaWidget
