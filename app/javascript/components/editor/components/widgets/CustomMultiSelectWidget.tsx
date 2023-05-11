/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import Select from 'react-select'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { WidgetProps } from '@rjsf/utils'
import { JSONSchema7 } from 'json-schema'
import './Widget.css'

interface CustomMultiSelectWidgetProps extends WidgetProps {
  label: string,
  options: {
    title: string
  }
  value: string[],
  required: boolean,
  onChange: (value: string[]) => void,
}

type SelectOptions = {
  value: string,
  label: string
}

type CustomMultiSelectWidgetState = {
  multiValue: SelectOptions[],
  filterOptions: SelectOptions[],
  onChange: (value: string[]) => void,
  setFocus: boolean,
  isOpen: boolean
}

class CustomMultiSelectWidget extends React.Component<CustomMultiSelectWidgetProps, CustomMultiSelectWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  multiSelectScrollRef: React.RefObject<HTMLDivElement>

  constructor(props: CustomMultiSelectWidgetProps) {
    super(props)
    const {
      schema, registry, value, onChange
    } = props
    const { items = {} } = schema
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(items as JSONSchema7)
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
      onChange,
      setFocus: false,
      isOpen: undefined
    }
    this.onHandleFocus = this.onHandleFocus.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
    this.onHandleBlur = this.onHandleBlur.bind(this)

    this.multiSelectScrollRef = React.createRef()
  }

  onHandleFocus() {
    this.setState({ isOpen: true, setFocus: true })
  }
  onHandleBlur() {
    const { id, registry } = this.props
    const { formContext } = registry
    const { editor } = formContext
    editor.addToVisitedFields(id)
    editor.setFocusField('')
    this.setState({ isOpen: false, setFocus: false })
  }
  onHandleChange(selectedValues: SelectOptions[]) {
    this.setState({ multiValue: selectedValues })
    const result: string[] = []
    selectedValues.forEach((current: SelectOptions) => {
      result.push(current.value)
    })
    const { onChange } = this.state
    onChange(result)
  }

  render() {
    const {
      multiValue, filterOptions, setFocus, isOpen
    } = this.state
    const {
      label, options, required, schema, registry
    } = this.props
    const { id } = this.props
    const { title = label } = options
    const { formContext } = registry
    const { editor } = formContext
    let shouldFocus = false

    if (editor.focusField === id) {
      shouldFocus = true
    }
    if (shouldFocus) {
      this.multiSelectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    return (
      <div className="custom-multi-select-widget" data-testid={`custom-multi-select-widget__${kebabCase(label)}`} ref={this.multiSelectScrollRef}>
        <div>
          <span>
            {title}
            {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
        <div className="widget-description" data-testid={`custom-select-widget__${kebabCase(label)}--description`}>
          <span>
            {setFocus ? schema.description : ''}
          </span>
        </div>
        <div data-testid={`custom-multi-select-widget__${kebabCase(label)}--selector`}>
          <Select
            key={`${id}_${editor?.focusField}`}
            autoFocus={shouldFocus}
            id={id}
            name={`Select-${label}`}
            placeholder={title ? `Select ${title}` : 'Select Values'}
            value={multiValue}
            options={filterOptions}
            onFocus={this.onHandleFocus}
            onChange={this.onHandleChange}
            onBlur={this.onHandleBlur}
            menuIsOpen={isOpen}
            isMulti
          />
        </div>
      </div>
    )
  }
}

export default observer(CustomMultiSelectWidget)
