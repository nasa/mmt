/* eslint-disable react/state-in-constructor */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { FunctionComponent } from 'react'
import { Col } from 'react-bootstrap'
import { has, kebabCase, uniqueId } from 'lodash'
import {
  ErrorSchema, FieldProps, GenericObjectType, getUiOptions
} from '@rjsf/utils'
import { observer } from 'mobx-react'
import MetadataEditor from '../MetadataEditor'

type ComponentProps = {
  [name: string]: any
};

interface LayoutGridSchemaProps extends FieldProps {
  [Key: string]: any
}

/** Type used for the state of the `ObjectField` component */
type LayoutGridSchemaState = {
  /** Flag indicating whether an additional property key was modified */
  wasPropertyKeyModified: boolean;
  /** The set of additional properties */
  additionalProperties: object;
};

/**
 * Custom field component for react-jsonschema-form which provides support for bootstrap grid system.
 * Code is based off:
 * https://github.com/audibene-labs/react-jsonschema-form-layout/blob/master/src/index.js
 */
class LayoutGridField extends React.Component<FieldProps, LayoutGridSchemaState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  private scrollRef: React.RefObject<HTMLFieldSetElement>
  constructor(props: LayoutGridSchemaProps) {
    super(props)
    this.scrollRef = React.createRef()
  }
  onPropertyChange = (name: string, addedByAdditionalProperties = false) => (value: any | undefined, newErrorSchema?: ErrorSchema, id?: string) => {
    const { formData, onChange, errorSchema } = this.props
    if (value === undefined && addedByAdditionalProperties) {
      // Don't set value = undefined for fields added by
      // additionalProperties. Doing so removes them from the
      // formData, which causes them to completely disappear
      // (including the input field for the property name). Unlike
      // fields which are "mandated" by the schema, these fields can
      // be set to undefined by clicking a "delete field" button, so
      // set empty values to the empty string.
      // eslint-disable-next-line no-param-reassign
      value = '' as unknown as any
    }
    const newFormData = { ...formData, [name]: value } as unknown as any
    onChange(
      newFormData,
      errorSchema
      && errorSchema && {
        ...errorSchema,
        [name]: newErrorSchema
      },
      id
    )
  }

  getAvailableKey = (preferredKey: string, formData?: any) => {
    const { uiSchema } = this.props
    const { duplicateKeySuffixSeparator = '-' } = getUiOptions(uiSchema)

    let index = 0
    let newKey = preferredKey
    while (has(formData, newKey)) {
      // eslint-disable-next-line no-plusplus
      newKey = `${preferredKey}${duplicateKeySuffixSeparator}${++index}`
    }
    return newKey
  }

  onKeyChange = (oldValue: any) => (value: string, newErrorSchema: ErrorSchema) => {
    if (oldValue === value) {
      return
    }
    const { formData, onChange, errorSchema } = this.props

    // eslint-disable-next-line no-param-reassign
    value = this.getAvailableKey(value, formData)
    const newFormData: GenericObjectType = {
      ...(formData as GenericObjectType)
    }
    const newKeys: GenericObjectType = { [oldValue]: value }
    const keyValues = Object.keys(newFormData).map((key) => {
      const newKey = newKeys[key] || key
      return { [newKey]: newFormData[key] }
    })
    const renamedObj = Object.assign({}, ...keyValues)

    onChange(
      renamedObj,
      errorSchema
      && errorSchema && {
        ...errorSchema,
        [value]: newErrorSchema
      }
    )
  }
  executeScroll = () => this.scrollRef.current.scrollIntoView({ behavior: 'smooth' })

  isRequired(name: string) {
    const { schema } = this.props
    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
  }

  renderField(layoutGridSchema: LayoutGridSchemaProps) {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      disabled,
      readonly,
      onBlur,
      onFocus,
      formData = {}
    } = this.props
    const { registry, schema: s } = this.props
    const { fields, schemaUtils } = registry
    const { SchemaField } = fields
    const schema = schemaUtils.retrieveSchema(s)
    let name
    let render
    if (typeof layoutGridSchema === 'string') {
      name = layoutGridSchema
    } else {
      name = layoutGridSchema.name
      render = layoutGridSchema.render
    }
    let { name: parentName } = this.props
    const pos = parentName.lastIndexOf('-')
    if (pos > -1) {
      parentName = parentName.substring(0, pos)
    }

    if (idSchema) {
      if (idSchema[name]) {
        const childIdSchema = idSchema[name]
        const keys = Object.keys(childIdSchema)
        keys.forEach((key) => {
          if (key === '$id') {
            childIdSchema[key] = childIdSchema[key].replace('root', parentName)
          } else if (childIdSchema && childIdSchema[key] && childIdSchema[key].$id) {
            childIdSchema[key].$id = childIdSchema[key].$id.replace('root', parentName)
          }
        })
      } else {
        idSchema.$id = name
      }
    }
    if (schema.properties[name] && !render) {
      return (
        <span data-testid={`layout-grid-field__schema-field--${kebabCase(name)}`}>
          <SchemaField
            key={JSON.stringify(name)}
            name={name}
            required={this.isRequired(name)}
            schema={schema.properties[name] as any}
            uiSchema={uiSchema[name]}
            errorSchema={errorSchema[name]}
            idSchema={idSchema[name] ? idSchema[name] : idSchema}
            formData={formData[name]}
            onChange={this.onPropertyChange(name)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
            onKeyChange={this.onKeyChange(name)}
          />
        </span>
      )
    }
    let UIComponent: FunctionComponent<ComponentProps> = render

    UIComponent = render

    return (
      <span data-testid={`layout-grid-field__schema-field--${kebabCase(name)}`}>
        <UIComponent
          {...this.props}
          name={name}
          formData={formData}
          errorSchema={errorSchema}
          uiSchema={uiSchema}
          schema={schema}
          registry={registry}
        />
      </span>
    )
  }
  renderCol(layoutGridSchema: LayoutGridSchemaProps) {
    const { children, ...colProps } = layoutGridSchema['ui:col']

    const group = layoutGridSchema['ui:group']
    const groupDescription = layoutGridSchema['ui:group-description']
    if (group) {
      const { registry, idSchema, options } = this.props
      const { editor } = options
      const { fields, formContext } = registry
      const { TitleField } = fields
      const { required, schema } = this.props
      const { description = '' } = schema
      const title = group && typeof group === 'string' ? group : null
      if (idSchema.$id === editor.focusField) {
        setTimeout(() => {
          this.executeScroll()
        })
      }
      return (
        <Col {...colProps} key={JSON.stringify(colProps)}>
          <fieldset
            ref={this.scrollRef}
            className="rjsf-layout-grid-group"
          >
            <span data-testid={`layout-grid-field__col-title-field--${kebabCase(title)}`}>
              {title ? (
                <TitleField
                  name={title}
                  title={title}
                  required={required}
                  formContext={formContext}
                  onBlur={() => undefined}
                  onFocus={() => undefined}
                  options={undefined}
                  idSchema={undefined}
                  id={uniqueId()}
                  onChange={undefined}
                  schema={undefined}
                  readonly={false}
                  disabled={false}
                  registry={undefined}
                />
              ) : null}
            </span>
            {groupDescription ? (
              <div style={{ paddingBottom: 30 }}>
                {description}
              </div>
            ) : null}
            <div style={{ borderLeft: 'solid 5px rgb(240,240,240', paddingLeft: 8 }}>
              {this.renderChildren(children)}
            </div>
          </fieldset>
        </Col>
      )
    }

    return (
      <Col {...colProps}>
        {' '}
        {this.renderChildren(children)}
      </Col>
    )
  }

  renderRow(layoutGridSchema: LayoutGridSchemaProps) {
    const rows = layoutGridSchema['ui:row']
    const group = layoutGridSchema['ui:group']
    const groupDescription = layoutGridSchema['ui:group-description']

    if (group) {
      const { registry } = this.props
      const { fields, formContext } = registry
      const { TitleField } = fields
      const { required, schema } = this.props
      const { description = '' } = schema

      const title = group && typeof group === 'string' ? group : null
      return (
        <div style={{ marginBottom: -5 }}>
          <fieldset
            className="rjsf-layout-grid-group"
          >
            <span data-testid={`layout-grid-field__row-title-field--${kebabCase(title)}`}>
              {title ? (
                <TitleField
                  name={title}
                  title={title}
                  required={required}
                  formContext={formContext}
                  onBlur={() => undefined}
                  onFocus={() => undefined}
                  options={undefined}
                  idSchema={undefined}
                  id={uniqueId()}
                  onChange={undefined}
                  schema={undefined}
                  readonly={false}
                  disabled={false}
                  registry={undefined}
                />
              ) : null}
            </span>
            {groupDescription ? (
              <div style={{ paddingBottom: 30 }}>
                {description}
              </div>
            ) : null}
            <div className="row" key={JSON.stringify(rows)}>{this.renderChildren(rows)}</div>
          </fieldset>
        </div>
      )
    }
    return <div style={{ marginBottom: -5 }} className="row" key={JSON.stringify(rows)}>{this.renderChildren(rows)}</div>
  }

  renderChildren(childrenLayoutGridSchema: LayoutGridSchemaProps) {
    const { registry, schema: s } = this.props
    const { schemaUtils } = registry
    const schema = schemaUtils.retrieveSchema(s)

    return childrenLayoutGridSchema.map((layoutGridSchema: LayoutGridSchemaProps) => (
      <LayoutGridField
        {...this.props}
        key={JSON.stringify(layoutGridSchema)}
        schema={schema}
        layoutGridSchema={layoutGridSchema}
      />
    ))
  }
  render() {
    const { uiSchema } = this.props
    let { layoutGridSchema } = this.props
    if (!layoutGridSchema) layoutGridSchema = uiSchema['ui:layout_grid']

    if (layoutGridSchema['ui:row']) {
      return this.renderRow(layoutGridSchema)
    } if (layoutGridSchema['ui:col']) {
      return this.renderCol(layoutGridSchema)
    }
    return this.renderField(layoutGridSchema)
  }
}
export default observer(LayoutGridField)
