import React from 'react'
import Select from 'react-select'
import { kebabCase } from 'lodash'
import { retrieveSchema } from 'react-jsonschema-form/lib/utils'

type CustomMultiSelectWidgetProps = {
  label: string,
  schema: {
    items: {
      $ref: unknown
      enum: string[]
    }
  },
  options: {
    title: string
  }
  value: string[],
  required: boolean,
  onChange: (value: string[]) => void,
  registry: {
    definitions: unknown
  }
}

type SelectOptions = {
  value: string,
  label: string
}

type CustomMultiSelectWidgetState = {
  multiValue: SelectOptions[],
  filterOptions: SelectOptions[],
  onChange: (value: string[]) => void
}

class CustomMultiSelectWidget extends React.Component<CustomMultiSelectWidgetProps, CustomMultiSelectWidgetState> {
  constructor(props: CustomMultiSelectWidgetProps) {
    super(props)
    const {
      schema, registry, value, onChange
    } = props
    const { definitions } = registry
    const { items = {} } = schema
    const retrievedSchema = retrieveSchema(items, definitions)
    const selectOptions: SelectOptions[] = []
    const listOfEnums = retrievedSchema.enum || []
    listOfEnums.forEach((currentEnum: string) => {
      selectOptions.push({ value: currentEnum, label: currentEnum })
    })
    const existingValues: SelectOptions[] = []
    value.forEach((currentValue: string) => {
      if (currentValue != null) {
        existingValues.push({ value: currentValue, label: currentValue })
      }
    })
    this.state = {
      multiValue: existingValues,
      filterOptions: selectOptions,
      onChange
    }
    this.handleMultiChange = this.handleMultiChange.bind(this)
  }

  handleMultiChange(selectedValues: SelectOptions[]) {
    this.setState({ multiValue: selectedValues })
    const result: string[] = []
    selectedValues.forEach((current: SelectOptions) => {
      result.push(current.value)
    })
    const { onChange } = this.state
    onChange(result)
  }

  render() {
    const { multiValue, filterOptions } = this.state
    const { label, options, required } = this.props
    const { title = label } = options
    return (
      <div className="custom-multi-select-widget" data-testid={`custom-multi-select-widget__${kebabCase(label)}`}>
        <div>
          <span>
            {title ?? 'Values'}
            {required ? <i className="eui-icon eui-required-o" style={{ color: 'green', padding: '5px' }} /> : ''}
          </span>
        </div>
        <div data-testid={`custom-multi-select-widget__${kebabCase(label)}--selector`}>
          <Select
            name={`Select-${label}`}
            placeholder={`Select ${label}`}
            value={multiValue}
            options={filterOptions}
            onChange={this.handleMultiChange}
            isMulti
          />
        </div>
      </div>
    )
  }
}

export default CustomMultiSelectWidget
