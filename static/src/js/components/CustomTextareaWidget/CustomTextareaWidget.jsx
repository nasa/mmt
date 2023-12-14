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

/**
 * CustomTextareaWidget
 * @typedef {Object} CustomTextareaWidget
 * @property {String} label The label of the widget.
 * @property {String} id The id of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomTextareaWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A text value saved to the draft.
 */

/**
 * Renders Custom Textarea Widget
 * @param {CustomArrayFieldTemplate} props
 */
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
  const textareaScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext
  const { maxLength, description } = schema

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

  const handleChange = (event) => {
    const { value: newValue } = event.target

    onChange(newValue)
  }

  const handleBlur = () => {
    setFocusField(null)
    onBlur(id)
  }

  return (
    <CustomWidgetWrapper
      scrollRef={textareaScrollRef}
      description={description}
      charsUsed={value?.length}
      label={label}
      maxLength={maxLength}
      required={required}
      title={title}
    >
      <textarea
        ref={focusRef}
        className="custom-textarea-widget__input form-control d-block"
        id={id}
        maxLength={maxLength}
        name={title}
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextareaWidget.defaultProps = {
  value: ''
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
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomTextareaWidget
