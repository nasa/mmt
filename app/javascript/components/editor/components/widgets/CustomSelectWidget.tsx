/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import Select from 'react-select'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { WidgetProps } from '@rjsf/utils'
import { JSONSchema7 } from 'json-schema'
import MetadataEditor from '../../MetadataEditor'

interface CustomSelectWidgetProps extends WidgetProps {
  label: string,
  options: {
    title: string,
    editor: MetadataEditor
  },
  value: string,
  placeholder: string,
  isLoading: boolean,
  required: boolean,
  onChange: (value: string) => void,
  disabled: boolean
}

type CustomSelectWidgetState = {
  setFocus: boolean
}
type SelectOptions = {
  value: string,
  label: string

}

class CustomSelectWidget extends React.Component<CustomSelectWidgetProps, CustomSelectWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  selectScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomSelectWidgetProps) {
    super(props)
    this.selectScrollRef = React.createRef()
    this.state = { setFocus: false }
  }

  render() {
    const selectOptions: SelectOptions[] = []
    const { setFocus } = this.state
    const {
      required, label = '', onChange, schema, options, registry, isLoading, disabled, id
    } = this.props
    let {
      placeholder
    } = this.props
    const { schemaUtils } = registry
    const { items = {} } = schema
    const retrievedSchema = schemaUtils.retrieveSchema(items as JSONSchema7)

    const { value } = this.props
    const { title = label, editor } = options
    const listOfEnums = schema.enum ? schema.enum : []

    if (listOfEnums.length === 0 && retrievedSchema.enum) {
      retrievedSchema.enum.forEach((currentEnum: string) => {
        listOfEnums.push(currentEnum)
      })
    }
    selectOptions.push({ value: null, label: '✓' })

    listOfEnums.forEach((currentEnum: string) => {
      if (currentEnum) {
        selectOptions.push({ value: currentEnum, label: currentEnum })
      }
    })
    const existingValue = value != null ? { value, label: value } : {}
    const { focusField = '' } = editor
    let shouldFocus = false

    if (editor?.focusField === id) {
      shouldFocus = true
    } else if (editor.focusField && id.match(/^\w+_\d+$/)) {
      if (id !== '' && id.startsWith(editor?.focusField)) {
        shouldFocus = true
      }
    }
    if (shouldFocus) {
      this.selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (!placeholder) {
      placeholder = `Select ${title}`
    }

    return (
      <div className="custom-select-widget" data-testid={`custom-select-widget__${kebabCase(label)}`} ref={this.selectScrollRef}>
        <div>
          <span>
            {title}
            {required && title ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
          </span>
        </div>
        <div className="custom-select-widget-description" data-testid={`custom-select-widget__${kebabCase(label)}--description`}>
          <span style={{ fontStyle: 'italic', fontSize: '.85rem' }}>
            {setFocus ? schema.description : null}
          </span>
        </div>
        <div data-testid={`custom-select-widget__${kebabCase(label)}--selector`}>
          <Select
            key={`${id}_${focusField}`}
            autoFocus={shouldFocus}
            id={id}
            data-testid={`custom-select-widget__${kebabCase(label)}--select`}
            defaultValue={existingValue.value ? existingValue : null}
            // @ts-ignore
            options={selectOptions}
            placeholder={placeholder}
            isLoading={isLoading}
            isDisabled={disabled}
            onChange={(e) => {
              const { value } = e
              onChange(value)
            }}
            onFocus={() => { this.setState({ setFocus: true }) }}
            onBlur={() => {
              editor.setFocusField('')
              this.setState({ setFocus: false })
            }}
          />
        </div>
      </div>
    )
  }
}
export default observer(CustomSelectWidget)
