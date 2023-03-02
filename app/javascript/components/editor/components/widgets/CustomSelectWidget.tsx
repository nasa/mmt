/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import Select from 'react-select'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { retrieveSchema } from 'react-jsonschema-form/lib/utils'
import MetadataEditor from '../../MetadataEditor'

type CustomSelectWidgetProps = {
  label: string,
  schema: {
    enum: string[]
    items?: {
      enum: string[],
    }
    description?: string
  },
  options: {
    title: string,
    editor: MetadataEditor
  },
  registry: {
    definitions: unknown
  }
  value: string,
  placeholder: string,
  isLoading: boolean,
  required: boolean,
  onChange: (value: string) => void
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
  selectRef: React.RefObject<Select>

  constructor(props: CustomSelectWidgetProps) {
    super(props)
    this.state = { setFocus: false }
    this.selectRef = React.createRef()
  }

  componentDidUpdate() {
    const { label = '', options } = this.props
    const { title = label, editor } = options
    const { focusField = '' } = editor

    if (editor?.focusField) {
      if (title.toLowerCase() === focusField.toLowerCase()) {
        setTimeout(() => {
          // @ts-ignore
          this.selectRef.current?.focus()
        }, 200)
      }
    }
  }
  render() {
    const selectOptions: SelectOptions[] = []
    const {
      required, label = '', onChange, schema, options, registry, isLoading
    } = this.props
    const { setFocus } = this.state
    let {
      placeholder
    } = this.props
    const { definitions } = registry
    const { items = {} } = schema
    const retrievedSchema = retrieveSchema(items, definitions)

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

    if (editor.focusField) {
      if (title.toLowerCase() === focusField.toLowerCase()) {
        setTimeout(() => {
          // @ts-ignore
          this.selectRef.current.focus.bind()
        }, 200)
      }
    }
    if (!placeholder) {
      placeholder = `Select ${title}`
    }
    return (
      <div className="custom-select-widget" data-testid={`custom-select-widget__${kebabCase(label)}`}>
        <div>
          <span>
            {title}
            {required && title ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
          </span>
        </div>
        <div className="custom-select-widget-description" style={{ padding: '5px' }} data-testid={`custom-select-widget__${kebabCase(label)}--description`}>
          <span style={{ fontStyle: 'italic', fontSize: '.85rem' }}>
            {setFocus ? schema.description : null}
          </span>
        </div>
        <div data-testid={`custom-select-widget__${kebabCase(label)}--selector`}>
          {/* Using ts-ignore because since we are using react-select component that does not have
          ref defined and ref is needed for the autofocus. The program does compiler but with typescript
          errors and ts-ignore ignores it just for line after @ts-ignore */}
          <Select
            // @ts-ignore
            ref={this.selectRef}
            data-testid={`custom-select-widget__${kebabCase(label)}--select`}
            defaultValue={existingValue.value ? existingValue : null}
            onFocus={() => { this.setState({ setFocus: true }) }}
            onBlur={() => { this.setState({ setFocus: false }) }}
            options={selectOptions}
            placeholder={placeholder}
            isLoading={isLoading}
            onChange={(e) => {
              const { value } = e
              onChange(value)
            }}
          />
        </div>
      </div>
    )
  }
}
export default observer(CustomSelectWidget)
