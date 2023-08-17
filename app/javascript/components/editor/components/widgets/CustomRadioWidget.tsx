import React from 'react'
import { WidgetProps } from '@rjsf/utils'
import './Widget.css'
import _ from 'lodash'

interface CustomRadioWidgetProps extends WidgetProps {
  onChange: (value: boolean) => void,
}
class CustomRadioWidget extends React.Component<CustomRadioWidgetProps, never> {
  render() {
    const {
      required, id, value, onChange, label = '', uiSchema = {}
    } = this.props
    const componentId = 'custom-radio-widget'
    let title = _.startCase(label.split(/-/)[0])

    if (uiSchema['ui:title']) {
      title = uiSchema['ui:title']
    }

    return (
      <div className="custom-radio-widget" data-testid={`${componentId}`}>
        <div className="field-label-box">
          <span data-testid={`${componentId}--label`} className="metadata-editor-field-label">
            {title}
          </span>
          <span>
            {required && title ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
        <input
          type="radio"
          id={id}
          checked={value === true}
          onChange={() => onChange(true)}
          data-testid={`${componentId}--value__true`}
        />
        <label htmlFor={id}>True</label>
        <br />
        <input
          type="radio"
          id={id}
          checked={value === false}
          onChange={() => onChange(false)}
          data-testid={`${componentId}--value__false`}
        />
        <label htmlFor={id}>False</label>
      </div>
    )
  }
}

export default CustomRadioWidget
