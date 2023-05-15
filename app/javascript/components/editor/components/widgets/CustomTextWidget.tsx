/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { WidgetProps } from '@rjsf/utils'
import './Widget.css'

interface CustomTextWidgetProps extends WidgetProps {
  label: string,
  options: {
    title?: string
  },
  schema: {
    maxLength: number,
    description: string
  },
  required: boolean,
  onChange: (value: string) => void,
  value: string,
  disabled: boolean,
  id: string,
  uiSchema: object
}

type CustomTextWidgetState = {
  value: string,
  charsUsed: number,
  showDescription: boolean
}

class CustomTextWidget extends React.Component<CustomTextWidgetProps, CustomTextWidgetState> {
  // eslint-disable-next-line react/static-property-placement
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
    this.onHandleFocus = this.onHandleFocus.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
    this.onHandleBlur = this.onHandleBlur.bind(this)
  }

  onHandleFocus() {
    this.setState({ showDescription: true })
  }
  onHandleChange(e) {
    const { onChange } = this.props
    const { value } = e.target
    const len = value.length
    this.setState({ value, charsUsed: len })
    onChange(value)
  }
  onHandleBlur() {
    const { registry } = this.props
    const { formContext } = registry
    const { editor } = formContext
    editor.addToVisitedFields(this.identifier)
    editor.setFocusField(null)
    this.setState({ showDescription: false })
  }

  get identifier() {
    let { id } = this.props
    if (id.startsWith('_')) {
      id = id.slice(1)
    }

    return id
  }

  render() {
    const {
      label = '', schema, required, disabled, options = {}, registry, uiSchema
    } = this.props
    const { title = label } = options
    const { formContext } = registry
    const { editor } = formContext
    const { maxLength, description } = schema
    const { value, charsUsed, showDescription } = this.state
    const { focusField } = editor
    const disabledFlag = disabled || false
    const fieldType = uiSchema ? uiSchema['ui:type'] : null
    let shouldFocus = false
    const id = this.identifier

    if (focusField === id) {
      shouldFocus = true
    } else if (focusField && id.match(/^\w+_\d+$/)) {
      if (id !== '' && id.startsWith(focusField)) {
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
              {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
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
          type={fieldType && fieldType === 'number' ? 'number' : 'text'}
          value={value}
          maxLength={maxLength}
          onFocus={this.onHandleFocus}
          onChange={this.onHandleChange}
          onBlur={
            this.onHandleBlur
          }
        />
        <span className="widget-description" data-testid={`custom-text-widget--description-field__${kebabCase(label)}`}>
          {
            showDescription ? description : ''
          }
        </span>
      </>
    )
  }
}
export default (observer(CustomTextWidget))
