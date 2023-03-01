/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import MetadataEditor from '../../MetadataEditor'

type CustomTextWidgetProps = {
  label?: string,
  options: {
    title?: string
    editor: MetadataEditor
  },
  schema: {
    maxLength: number,
    description: string
  },
  required: boolean,
  onChange: (value: string) => void,
  value: string,
  disabled: boolean,
  id: string
}

type CustomTextWidgetState = {
  value: string,
  charsUsed: number
}

class CustomTextWidget extends React.Component<CustomTextWidgetProps, CustomTextWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  inputRef: React.RefObject<HTMLInputElement>

  constructor(props: CustomTextWidgetProps) {
    super(props)
    const { value = '' } = this.props
    this.state = {
      value: value == null ? '' : value,
      charsUsed: value != null ? value.length : 0
    }
    this.inputRef = React.createRef()
  }

  render() {
    const {
      label = '', schema, required, onChange, disabled, options, id = ''
    } = this.props
    const { title = label, editor } = options
    const { maxLength, description } = schema
    const { value, charsUsed } = this.state
    const { focusField = '' } = editor
    const disabledFlag = disabled || false
    if (editor.focusField) {
      if (label.toLowerCase() === focusField.toLowerCase()) {
        setTimeout(() => {
          this.inputRef.current?.focus()
        }, 100)
      }
    }

    return (
      <>
        <div className="custom-text-widget-header" data-testid={`custom-text-widget__${kebabCase(label)}--text-header`}>
          {title && (
            <span>
              {title}
              {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
            </span>
          )}
          {maxLength && (
            <span style={{ float: 'right' }}>
              {charsUsed}
              /
              {maxLength}
            </span>
          )}
        </div>

        <input
          ref={this.inputRef}
          name={title}
          disabled={disabledFlag}
          className="custom-text-widget-input"
          data-testid={`custom-text-widget__${kebabCase(label)}--text-input`}
          style={{ minWidth: '100%', height: 37 }}
          type="text"
          value={value}
          maxLength={maxLength}
          // This onClick determines if a textbox is inside of an array, if yes, then only focus on the selected textbox and display the description
          // Example of an array element id: id = 'root_0_description'
          // Example of a controlled filed id: id = 'root_description'
          onClick={() => (id && id.split('_').length >= 2 ? editor.setFocusField(id) : editor.setFocusField(label))}
          onChange={(e) => {
            const { value } = e.target
            const len = value.length
            this.setState({ value, charsUsed: len })
            onChange(value)
          }}
        />
        <span style={{ fontStyle: 'italic' }} data-testid={`custom-text-widget--description-field__${kebabCase(label)}`}>
          {(focusField.toLowerCase() === label.toLowerCase() && label !== '') || focusField.toLowerCase() === id.toLowerCase() ? description : ''}
        </span>
      </>
    )
  }
}
export default (observer(CustomTextWidget))
