/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { WidgetProps } from '@rjsf/utils'
import MetadataEditor from '../../MetadataEditor'

interface CustomTextWidgetProps extends WidgetProps {
  label: string,
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
  charsUsed: number,
  showDescription: boolean
}

class CustomTextWidget extends React.Component<CustomTextWidgetProps, CustomTextWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  inputScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomTextWidgetProps) {
    super(props)
    const { value = '' } = this.props
    this.state = {
      value: value == null ? '' : value,
      charsUsed: value != null ? value.length : 0,
      showDescription: false
    }
    this.inputScrollRef = React.createRef()
  }

  render() {
    const {
      label = '', schema, required, onChange, disabled, options, id
    } = this.props
    const { title = label, editor } = options
    const { maxLength, description } = schema
    const { value, charsUsed, showDescription } = this.state
    const { focusField = '' } = editor
    const disabledFlag = disabled || false
    let shouldFocus = false

    if (editor?.focusField === id) {
      shouldFocus = true
    } else if (editor.focusField && id.match(/^\w+_\d+$/)) {
      if (id !== '' && id.startsWith(editor?.focusField)) {
        shouldFocus = true
      }
    }
    if (shouldFocus) {
      this.inputScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
      <>
        <div className="widget-header" data-testid={`custom-text-widget__${kebabCase(label)}--text-header`} ref={this.inputScrollRef}>
          {title && (
            <span>
              {title}
              {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', paddingLeft: '5px' }} /> : ''}
            </span>
          )}
          {maxLength && (
            <span>
              {charsUsed}
              /
              {maxLength}
            </span>
          )}
        </div>

        <input
          autoFocus={shouldFocus}
          key={`${id}_${focusField}`}
          id={id}
          name={title}
          disabled={disabledFlag}
          className="custom-text-widget-input"
          data-testid={`custom-text-widget__${kebabCase(label)}--text-input`}
          style={{ minWidth: '100%', height: 37 }}
          type="text"
          value={value}
          maxLength={maxLength}
          onFocus={() => {
            this.setState({ showDescription: true })
          }}
          onChange={(e) => {
            const { value } = e.target
            const len = value.length
            this.setState({ value, charsUsed: len })
            onChange(value)
          }}
          onBlur={() => {
            editor.setFocusField('')
            this.setState({ showDescription: false })
          }}
        />
        <span style={{ fontStyle: 'italic' }} data-testid={`custom-text-widget--description-field__${kebabCase(label)}`}>
          {
            showDescription ? description : ''
          }
        </span>
      </>
    )
  }
}
export default (observer(CustomTextWidget))
