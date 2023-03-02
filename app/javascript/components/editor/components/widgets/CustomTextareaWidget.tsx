/* eslint-disable react/require-default-props */
import React from 'react'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import MetadataEditor from '../../MetadataEditor'

type CustomTextAreaWidgetProps = {
  label: string,
  schema: {
    maxLength: number,
    description: string
  },
  required: boolean,
  options: {
    minHeight: number,
    title: string,
    editor: MetadataEditor
  },
  onChange: (value: string) => void,
  value: string,
  id: string,
  uiSchema?: {
    classNames?: string
  }
}

type CustomTextAreaWidgetState = {
  value: string,
  charsUsed: number
}
class CustomTextareaWidget extends React.Component<CustomTextAreaWidgetProps, CustomTextAreaWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  textareaRef: React.RefObject<HTMLTextAreaElement>

  constructor(props: CustomTextAreaWidgetProps) {
    super(props)
    const { value = '' } = this.props
    this.state = {
      value,
      charsUsed: value.length
    }
    this.textareaRef = React.createRef()
  }

  render() {
    const {
      label = '', schema, required, onChange, options, id = '', uiSchema = {}
    } = this.props
    const { minHeight = 100, title = label, editor } = options
    const style = {
      minHeight,
      minWidth: '100%'
    }
    const classNames = uiSchema['ui:classNames'] ?? ''
    const { maxLength, description } = schema
    const { value, charsUsed } = this.state
    const { focusField = '' } = editor

    if (editor?.focusField) {
      if (title.toLowerCase() === focusField.toLowerCase()) {
        setTimeout(() => { this.textareaRef.current?.focus() }, 200)
      }
    }
    return (
      <>
        <div className="custom-textarea-widget-header" data-testid={`custom-text-area-widget__${kebabCase(label)}--text-area-header`}>
          <span>
            <span className={classNames}>
              {title}
            </span>
            {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
          </span>
          {maxLength && (
            <span style={{ float: 'right' }}>
              {charsUsed}
              /
              {maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={this.textareaRef}
          name={title}
          className="custom-textarea-widget-input"
          data-testid={`custom-text-area-widget__${kebabCase(label)}--text-area-input`}
          style={style}
          maxLength={maxLength}
          value={value}
          // This onClick determines if a textbox is inside of an array, if yes, then only focus on the selected textbox and display the description
          // Example of an array element id: id = 'root_0_description'
          // Example of a controlled filed id: id = 'root_description'
          onClick={() => (id.split('_').length >= 3 ? editor.setFocusField(id) : editor.setFocusField(title))}
          onChange={(e) => {
            const { value } = e.target
            const len = value.length
            this.setState({ value, charsUsed: len })
            onChange(value)
          }}
          onBlur={() => { editor.setFocusField('') }}
        />
        <span style={{ fontStyle: 'italic' }} data-testid={`custom-text-widget--description-field__${kebabCase(label)}`}>
          {focusField.toLowerCase() === title.toLowerCase() || focusField.toLowerCase() === id.toLowerCase() ? description : ''}
        </span>

      </>
    )
  }
}
export default observer(CustomTextareaWidget)
