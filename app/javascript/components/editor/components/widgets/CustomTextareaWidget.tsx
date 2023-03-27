/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/require-default-props */
import React from 'react'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { WidgetProps } from '@rjsf/utils'
import './Widget.css'

interface CustomTextAreaWidgetProps extends WidgetProps {
  label: string,
  schema: {
    maxLength: number,
    description: string
  },
  required: boolean,
  options: {
    minHeight?: number,
    title?: string,
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
  charsUsed: number,
  showDescription: boolean
}
class CustomTextareaWidget extends React.Component<CustomTextAreaWidgetProps, CustomTextAreaWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  textareaScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomTextAreaWidgetProps) {
    super(props)
    const { value = '' } = this.props
    this.state = {
      value,
      charsUsed: value.length,
      showDescription: false
    }
    this.textareaScrollRef = React.createRef()
  }

  render() {
    const {
      label, schema, required, onChange, options = {}, id, uiSchema = {}, registry
    } = this.props
    const { title = label } = options
    const { formContext } = registry
    const { editor } = formContext
    const classNames = uiSchema['ui:classNames'] ?? ''
    const { maxLength, description } = schema
    const { value, charsUsed, showDescription } = this.state
    const { focusField } = editor
    let shouldFocus = false

    if (focusField === id) {
      shouldFocus = true
    }
    if (shouldFocus) {
      this.textareaScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
      <>
        <div className="widget-header" data-testid={`custom-text-area-widget__${kebabCase(label)}--text-area-header`} ref={this.textareaScrollRef}>
          <span>
            <span className={classNames}>
              {title}
            </span>
            {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
          {maxLength && (
            <span>
              {charsUsed}
              /
              {maxLength}
            </span>
          )}
        </div>
        <textarea
          autoFocus={shouldFocus}
          key={`${id}_${focusField}`}
          name={title}
          className="custom-textarea-widget-input"
          data-testid={`custom-text-area-widget__${kebabCase(label)}--text-area-input`}
          maxLength={maxLength}
          value={value}
          onFocus={() => { this.setState({ showDescription: true }) }}
          onChange={(e) => {
            const { value } = e.target
            const len = value.length
            this.setState({ value, charsUsed: len })
            onChange(value)
          }}
          onBlur={() => {
            this.setState({ showDescription: false })
          }}
        />
        <span className="widget-description" data-testid={`custom-text-area-widget--description-field__${kebabCase(label)}`}>
          {showDescription ? description : ''}
        </span>

      </>
    )
  }
}

export default observer(CustomTextareaWidget)
