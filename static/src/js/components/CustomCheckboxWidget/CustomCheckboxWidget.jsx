import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import shouldFocusField from '@/js/utils/shouldFocusField'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

/**
 * CustomRadioWidget
 * @typedef {Object} CustomRadioWidget
 * @property {Boolean} disable Should disable a field.
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {String} value An option is saved to the draft.
 */

/**
 * Renders Custom Radio Field Template
 * @param {CustomRadioWidget} props
 */
const CustomCheckboxWidget = ({
  disabled,
  id,
  label,
  onChange,
  registry,
  uiSchema,
  value
}) => {
  const checkboxScrollRef = useRef(null)
  const focusRef = useRef(null)
  const { 'ui:clearUnselected': clearUnselected } = uiSchema
  const { formContext } = registry

  const {
    focusField
  } = formContext

  const handleChange = (event) => {
    const { checked } = event.target
    if (!checked) {
      // If clearUnselected is true, propogate up null so it removes/clears the field/value from the formData
      // Otherwise, propogate up false.
      onChange(clearUnselected ? null : checked)
    } else {
      onChange(checked)
    }
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      checkboxScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  return (
    <CustomWidgetWrapper
      id={id}
      scrollRef={checkboxScrollRef}
    >
      <input
        checked={value}
        className="me-1"
        disabled={disabled}
        id={label}
        name={label}
        onChange={handleChange}
        ref={focusRef}
        type="checkbox"
        aria-label={label}
      />
      {label}
    </CustomWidgetWrapper>
  )
}

CustomCheckboxWidget.defaultProps = {
  disabled: false,
  value: false,
  uiSchema: {
    'ui:clearUnselected': false
  }
}

CustomCheckboxWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string
    }).isRequired
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:clearUnselected': PropTypes.bool
  }),
  value: PropTypes.bool
}

export default CustomCheckboxWidget
