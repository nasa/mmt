import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

import './CustomTextWidget.scss'

/**
 * CustomTextWidget
 * @typedef {Object} CustomTextWidget
 * @property {Boolean} disable A boolean value to disable the text field.
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {String} placeholder A placeholder text for the text field.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A text value saved to the draft.
 */

/**
 * Renders Custom Text Widget
 * @param {CustomTextWidget} props
 */
const CustomTextWidget = ({
  disabled,
  id,
  label,
  onBlur,
  onChange,
  placeholder,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const inputScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  const { maxLength, description, type } = schema

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

  // Handle the value changing in the field
  const handleChange = (event) => {
    const { value: newValue } = event.target
    let valueToSet = newValue
    // If type is number, remove everything except digits, '.', 'e', 'E', '+' and '-'
    if (type === 'number') {
      valueToSet = newValue.replace(/[^\d.eE+-]/g, '')
    }

    onChange(valueToSet)
  }

  // Handle the field losing focus
  const handleBlur = () => {
    if (setFocusField) {
      setFocusField(null)
    }

    onBlur(id)
  }

  return (
    <CustomWidgetWrapper
      charactersUsed={value?.length}
      description={description}
      id={id}
      label={label}
      maxLength={maxLength}
      required={required}
      scrollRef={inputScrollRef}
      title={title}
    >
      <input
        className="custom-text-widget__input form-control"
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={title}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        ref={focusRef}
        tabIndex={0}
        type="text"
        value={value}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextWidget.defaultProps = {
  disabled: false,
  onBlur: null,
  placeholder: null,
  value: '',
  required: false
}

CustomTextWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    type: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default CustomTextWidget
