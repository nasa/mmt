/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react'
import _, { cloneDeep, kebabCase } from 'lodash'
import { Col } from 'react-bootstrap'
import { ObjectFieldProps } from 'react-jsonschema-form/lib/components/fields/ObjectField'
import { observer } from 'mobx-react'
import { FieldProps } from '@rjsf/utils'
import CustomSelectWidget from './widgets/CustomSelectWidget'
import CustomTextWidget from './widgets/CustomTextWidget'
import { MetadataService } from '../services/MetadataService'
import { Node, buildMap, parseCmrResponse } from '../utils/cmr_keywords'
import './ControlledFields.css'
import Status from '../model/Status'

/**
 * Custom field component for handling controlled fields
 */

type ControlledFieldsState = {
  loading: boolean,
  root: Node,
  lastUpdated: Date
}
type ControlledFieldProps = FieldProps

class ControlledFields extends React.Component<ObjectFieldProps, ControlledFieldsState> {
  // eslint-disable-next-line react/static-property-placement
  private scrollRef: React.RefObject<HTMLDivElement>
  constructor(props: ControlledFieldProps) {
    super(props)
    this.state = {
      loading: false, lastUpdated: Date(), root: {}, ...props.formData
    }
    this.scrollRef = React.createRef()
  }

  componentDidMount() {
    const { uiSchema, registry } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const keywords = uiSchema['ui:keywords']

    if (keywords) {
      const lastUpdated = new Date()
      const map = buildMap(cloneDeep(keywords))
      this.setState({ loading: false, root: map, lastUpdated })
    } else {
      const service = uiSchema['ui:service'] as MetadataService
      const keywordScheme = uiSchema['ui:keyword_scheme']
      const names = uiSchema['ui:keyword_scheme_column_names']

      this.setState({ loading: true }, () => {
        service.fetchCmrKeywords(keywordScheme).then((response) => {
          const lastUpdated = new Date()
          const paths = parseCmrResponse(response, names)
          const map = buildMap(paths)
          this.setState({ loading: false, root: map, lastUpdated })
        })
          .catch((error) => {
            setTimeout(() => {
              /* istanbul ignore next */
              editor.status = new Status('warning', error)
            })
          })
      })
    }
  }

  executeScroll = () => this.scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  copyFormDataToChanges(formData: any, changes: any) {
    const { uiSchema } = this.props
    const controlledFields = uiSchema['ui:controlledFields']
    Object.keys(formData).forEach((key) => {
      if (!controlledFields.includes(key)) {
        changes[key] = formData[key]
      }
    })
  }

  clearDescendents(name: string, value: string) {
    const { uiSchema } = this.props
    const fields = uiSchema['ui:controlledFields']
    const pos = fields.indexOf(name)
    const values: any = {}
    values[name] = value
    for (let i = pos + 1; i < fields.length; i += 1) {
      values[fields[i]] = null
    }
    return values
  }

  isRequired(name: string) {
    const { schema } = this.props
    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
  }

  renderField(loading: boolean, name: string, enums: string[]) {
    const {
      formData,
      onChange,
      uiSchema,
      schema,
      registry,
      idSchema
    } = this.props
    const fieldUiSchema = uiSchema[name]
    const widget = fieldUiSchema != null ? fieldUiSchema['ui:widget'] : null
    const fieldSchema = schema.properties[name]
    if (widget === CustomTextWidget) {
      const title = fieldUiSchema['ui:title']
      const enumValue = (enums.length > 0) ? enums[0] : ''
      const existingValue = formData[name]

      let value = existingValue || enumValue
      if (enums.length === 1) {
        const [first] = enums
        const priorValue = formData[name]
        formData[name] = first
        value = formData[name]
        if (priorValue !== value) {
          setTimeout(() => {
            /* istanbul ignore next */
            onChange(formData, null)
          })
        }
      }

      const id = idSchema[name].$id
      const { name: parentName } = this.props
      idSchema[name].$id = id.replace('root', parentName)

      return (
        <span
          key={`controlled-fields__custom-text-widget--${name}-${value}`}
          data-testid={`controlled-fields__custom-text-widget--${kebabCase(name)}`}
        >
          <CustomTextWidget
            id={idSchema[name].$id}
            name={name}
            disabled
            required={this.isRequired(name)}
            label={title}
            value={value}
            onChange={undefined}
            schema={fieldSchema}
            onBlur={undefined}
            onFocus={undefined}
            registry={registry}
            options={undefined}
            uiSchema={uiSchema}
          />
        </span>
      )
    }

    const title = fieldUiSchema != null ? fieldUiSchema['ui:title'] : name
    const value = formData[name]

    const { length: enumsLength } = enums

    if (!this.isRequired(name)) {
      enums.unshift(null)
    }
    let placeholder = `Select ${title}`
    if (enumsLength === 0) {
      placeholder = `No available ${title}`
    }

    const { description } = schema.properties[name]

    const { name: parentName } = this.props
    const id = idSchema[name].$id
    idSchema[name].$id = id.replace('root', parentName)

    return (
      <span
        key={`controlled-fields__custom-select-widget--${name}-${value}`}
        data-testid={`controlled-fields__custom-select-widget--${kebabCase(name)}`}
      >
        <CustomSelectWidget
          name={name}
          required={this.isRequired(name)}
          label={title}
          schema={{ enum: enums, description }}
          uiSchema={uiSchema}
          registry={registry}
          value={loading && !value ? 'Fetching Keywords.....' : value}
          isLoading={loading}
          placeholder={placeholder}
          onChange={(value: any) => {
            const values: object = { [name]: value, ...this.clearDescendents(name, value) }
            this.setState(values, () => {
              const changes: any = _.cloneDeep(this.state)
              delete changes.root
              delete changes.lastUpdated
              this.copyFormDataToChanges(formData, changes)
              onChange(changes, null)
            })
          }}
          onBlur={undefined}
          onFocus={undefined}
          options={undefined}
          disabled={enumsLength === 0}
          id={idSchema[name].$id}
        />
      </span>
    )
  }

  render() {
    const {
      uiSchema,
      formData,
      registry
    } = this.props
    const { formContext } = registry
    const { editor } = formContext
    const uiControlledFields = uiSchema['ui:controlledFields']
    const title = uiSchema['ui:title']
    const { root, loading } = this.state
    let data: any = root
    if (editor?.focusField) {
      if (title === editor.focusField) {
        setTimeout(() => {
          /* istanbul ignore next */
          this.executeScroll()
        }, 200)
      }
    }

    const rows = uiControlledFields.map((field: string, pos: number): ReactNode => {
      let enums: string[]
      if (pos === 0) {
        enums = Object.keys(data) // populate the first list box
      } else if (data) {
        const value = formData[uiControlledFields[pos - 1]]
        data = data[value]
        enums = Object.keys(data || {}) // populate values of next list box based on values of the prior
      } else {
        enums = []
      }
      return (
        <div data-testid={`controlled-fields__row--${kebabCase(field)}`} className="field row" key={JSON.stringify(`${field}-${formData[field]}-${loading}`)}>
          <Col md={12}>
            {this.renderField(loading, field, enums)}
          </Col>
        </div>
      )
    })
    return (
      <div className={`${title}`} ref={this.scrollRef}>
        {rows}
      </div>
    )
  }
}

export default observer(ControlledFields)
