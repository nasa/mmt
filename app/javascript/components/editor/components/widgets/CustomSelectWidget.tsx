/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import Select from 'react-select'
import _, { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import {
  UIOptionsType, UiSchema, WidgetProps
} from '@rjsf/utils'
import { JSONSchema7 } from 'json-schema'
import './Widget.css'
import { parseCmrResponse } from '../../utils/cmr_keywords'
import Status from '../../model/Status'
import { MetadataService } from '../../services/MetadataService'

interface CustomUiSchema extends UiSchema {
  'ui:options'?: UIOptionsType
  'ui:service'?: MetadataService,
  'ui:controlled'?: {
    name: string,
    controlName: string[]
  } | Record<string, never>
}

interface CustomSelectWidgetProps extends WidgetProps {
  label: string,
  value: string,
  placeholder: string,
  isLoading: boolean,
  required: boolean,
  onChange: (value: string) => void,
  disabled: boolean,
  uiSchema?: CustomUiSchema
}

type CustomSelectWidgetState = {
  setFocus: boolean
  loading: boolean
}
type SelectOptions = {
  value: string,
  label: string

}

class CustomSelectWidget extends React.Component<CustomSelectWidgetProps, CustomSelectWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  selectScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomSelectWidgetProps) {
    super(props)
    this.selectScrollRef = React.createRef()
    this.state = { setFocus: false, loading: false }

    this.onHandleFocus = this.onHandleFocus.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
    this.onHandleBlur = this.onHandleBlur.bind(this)
  }

  componentDidMount() {
    const { uiSchema = {}, schema } = this.props
    const service = uiSchema['ui:service']
    const controlled = uiSchema['ui:controlled'] || {}
    const { name, controlName } = controlled

    if (name && controlName) {
      this.setState({ loading: true }, () => {
        service.fetchCmrKeywords(name).then((keywords) => {
          const paths = parseCmrResponse(keywords, controlName)
          const enums = paths.map((path: string[]) => (path[0]))
          schema.enum = enums
          this.setState({ loading: false })
        })
          .catch(() => {
            const { registry } = this.props
            const { formContext } = registry
            const { editor } = formContext
            this.setState({ loading: false })
            editor.status = new Status('warning', `Error retrieving ${name} keywords`)
          })
      })
    }
  }

  onHandleFocus() {
    this.setState({ setFocus: true })
  }
  onHandleChange(e) {
    const { onChange } = this.props
    const { value } = e
    onChange(value)
  }
  onHandleBlur() {
    const { registry } = this.props
    const { formContext } = registry
    const { editor } = formContext
    editor.addToVisitedFields(this.identifier)
    editor.setFocusField(null)
    this.setState({ setFocus: false })
  }

  get identifier() {
    let { id } = this.props
    if (id.startsWith('_')) {
      id = id.slice(1)
    }
    return id
  }

  render() {
    const selectOptions: SelectOptions[] = []
    const { setFocus, loading } = this.state
    const {
      required, label, schema, registry, isLoading = loading, disabled, uiSchema = {}
    } = this.props
    let {
      placeholder
    } = this.props
    const { schemaUtils, formContext } = registry
    const { items = {} } = schema
    const retrievedSchema = schemaUtils.retrieveSchema(items as JSONSchema7)
    const { value } = this.props
    const { editor } = formContext
    const id = this.identifier

    let title = _.startCase(label.split(/-/)[0])

    if (uiSchema['ui:title']) {
      title = uiSchema['ui:title']
    }

    selectOptions.push({ value: null, label: '✓' })

    // Extracting ui:options from uiSchema
    const uiOptions = uiSchema['ui:options'] || {}
    const { enumOptions } = uiOptions

    // Be able to override schema enums
    if (enumOptions) {
      (enumOptions as string[]).forEach((enumValue) => {
        selectOptions.push({ value: enumValue, label: enumValue })
      })
    } else {
      // Otherwise, just use the enums in the schema
      const { enum: enums = retrievedSchema?.enum ?? [] } = schema
      enums.forEach((currentEnum: string) => {
        if (currentEnum) {
          selectOptions.push({ value: currentEnum, label: currentEnum })
        }
      })
    }

    const existingValue = value != null ? { value, label: value } : {}
    const { focusField } = editor
    let shouldFocus = false

    if (focusField === id) {
      shouldFocus = true
    } else if (focusField && id.match(/^\w+_\d+$/)) {
      if (id !== '' && id.startsWith(focusField)) {
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
          <span className="metadata-editor-field-label">
            {title}
            {required && title ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
        <div className="widget-description" data-testid={`custom-select-widget__${kebabCase(label)}--description`}>
          <span>
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
            options={selectOptions}
            placeholder={placeholder}
            isLoading={isLoading}
            isDisabled={disabled}
            onFocus={this.onHandleFocus}
            onChange={this.onHandleChange}
            onBlur={this.onHandleBlur}
          />
        </div>
      </div>
    )
  }
}
export default observer(CustomSelectWidget)
