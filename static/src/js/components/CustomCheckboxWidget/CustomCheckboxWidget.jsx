import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import shouldFocusField from '@/js/utils/shouldFocusField'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

const CustomCheckboxWidget = ({
  disabled,
  id,
  label,
  onChange,
  value,
  registry
}) => {
  const checkboxScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry

  const {
    focusField
  } = formContext

  const handleChange = (event) => {
    const { checked } = event.target

    onChange(checked)
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
      title={null}
      scrollRef={checkboxScrollRef}
    >
      <input
        checked={value}
        className="m-2"
        disabled={disabled}
        id={label}
        name={label}
        onChange={handleChange}
        ref={focusField}
        type="checkbox"
      />
      {label}
    </CustomWidgetWrapper>

  )
}

CustomCheckboxWidget.defaultProps = {
  disabled: false,
  value: false
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
  value: PropTypes.bool
}

export default CustomCheckboxWidget
