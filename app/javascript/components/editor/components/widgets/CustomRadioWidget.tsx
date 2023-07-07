import React from 'react'
import { WidgetProps } from '@rjsf/utils'
import './Widget.css'

interface CustomRadioWidgetProps extends WidgetProps {
  uiSchema: object,
  onChange: (value: boolean) => void,
}
class CustomRadioWidget extends React.Component<CustomRadioWidgetProps, never> {
  render() {
    const {
      id, value, onChange, uiSchema
    } = this.props
    const valueRequired = uiSchema ? uiSchema['ui:title'] : null
    const componentId = 'custom-radio-widget'
    return (
      <div className="custom-radio-widget" data-testid={`${componentId}`}>
        <div data-testid={`${componentId}--value-required`}>{valueRequired}</div>
        <input
          type="radio"
          id={id}
          checked={value === true}
          onChange={() => onChange(true)}
          data-testid={`${componentId}--true`}
        />
        <label htmlFor={id}>True</label>
        <br />
        <input
          type="radio"
          id={id}
          checked={value === false}
          onChange={() => onChange(false)}
          data-testid={`${componentId}--false`}
        />
        <label htmlFor={id}>False</label>
      </div>
    )
  }
}

export default CustomRadioWidget
