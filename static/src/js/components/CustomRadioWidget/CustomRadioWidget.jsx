import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import Button from '../Button/Button'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

/**
 * CustomRadioWidget
 * @typedef {Object} CustomRadioWidget
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomRadioWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value An option is saved to the draft.
 */

/**
 * Renders Custom Radio Field Template
 * @param {CustomRadioWidget} props
 */
const CustomRadioWidget = ({
  id,
  label,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)
  const { formContext } = registry

  const {
    focusField
  } = formContext

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  let trueOptionLabel = null
  let falseOptionLabel = null
  let showClear = true

  if (uiSchema['ui:options']) {
    trueOptionLabel = uiSchema['ui:options'].trueOptionLabel
    falseOptionLabel = uiSchema['ui:options'].falseOptionLabel
    showClear = uiSchema['ui:options'].showClear
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  // Sets inputValue to input selected
  const handleChange = (event) => {
    const { name } = event.target
    const newValue = name === 'true'

    onChange(newValue)
  }

  // Needed for this UI implementaion so that users can clear their selection
  const handleClear = () => {
    onChange(undefined)
  }

  return (
    <CustomWidgetWrapper
      description={schema.description}
      id={id}
      label={label}
      required={required}
      scrollRef={selectScrollRef}
      title={title}
    >
      <div
        className="custom-radio-widget d-flex align-items-center gap-3"
        role="radiogroup"
      >
        <label
          className="form-check-label d-flex align-items-center"
          htmlFor={`${id}-true`}
        >
          <input
            className="d-flex form-check-input m-2"
            id={`${id}-true`}
            name="true"
            onChange={handleChange}
            type="radio"
            checked={value === true}
            ref={focusRef}
          />
          {trueOptionLabel || 'True'}
        </label>
        <label
          className="form-check-label d-flex align-items-center"
          htmlFor={`${id}-false`}
        >
          <input
            className="form-check-input m-2"
            id={`${id}-false`}
            name="false"
            onChange={handleChange}
            type="radio"
            checked={value === false}
          />
          {falseOptionLabel || 'False'}
        </label>
        {
          showClear && (
            <Button
              className="custom-radio-widget-clear-btn"
              variant="light-dark"
              size="sm"
              onClick={handleClear}
            >
              Clear selection
            </Button>
          )
        }
      </div>
    </CustomWidgetWrapper>
  )
}

CustomRadioWidget.defaultProps = {
  value: null
}

CustomRadioWidget.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      trueOptionLabel: PropTypes.string,
      falseOptionLabel: PropTypes.string,
      showClear: PropTypes.bool
    }),
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.bool
}

export default CustomRadioWidget
