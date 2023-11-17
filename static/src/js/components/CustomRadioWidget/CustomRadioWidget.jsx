/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'
import './CustomRadioWidget.scss'

const CustomRadioWidget = ({
  label = '',
  id,
  required,
  schema,
  uiSchema = {},
  value
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [componentId] = useState('custom-radio-widget')

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const handleChange = (event) => {
    setInputValue(event.target.name)
  }

  const handleClear = () => {
    setInputValue(null)
  }

  return (
    <div className="custom-radio-widget" data-testid={`${componentId}`}>
      <CustomWidgetWrapper
        label={label}
        description={schema.description}
        required={required}
        title={title}
      />
      <div>
        <div className="custom-radio-widget-clear-btn" data-testid={`${componentId}--clear-btn`} onClick={handleClear}>
          Clear
        </div>
        <input
          type="radio"
          name="true"
          id={id}
          checked={inputValue === 'true'}
          onChange={handleChange}
          data-testid={`${componentId}--value__true`}
        />
        <label htmlFor={id}>True</label>
        <br />
        <input
          type="radio"
          name="false"
          id={id}
          checked={inputValue === 'false'}
          onChange={handleChange}
          data-testid={`${componentId}--value__false`}
        />
        <label htmlFor={id}>False</label>
      </div>
    </div>
  )
}

CustomRadioWidget.defaultProps = {
  value: false
}

CustomRadioWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
  }).isRequired,
  value: PropTypes.bool
}

export default CustomRadioWidget
