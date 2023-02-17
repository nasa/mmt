import React, { FunctionComponent } from 'react'
import ObjectField, { ObjectFieldProps } from 'react-jsonschema-form/lib/components/fields/ObjectField'
import { retrieveSchema } from 'react-jsonschema-form/lib/utils'
import { Col } from 'react-bootstrap'
import { JSONSchema6 } from 'json-schema'
import { kebabCase } from 'lodash'

type ComponentProps = {
  [name: string]: string | JSONSchema6 | object;
};

type LayoutGridSchemaProps = {
  [Key: string]: any
}

/**
 * Custom field component for react-jsonschema-form which provides support for bootstrap grid system.
 * Code is based off:
 * https://github.com/audibene-labs/react-jsonschema-form-layout/blob/master/src/index.js
 */
export default class LayoutGridField extends ObjectField<ObjectFieldProps, never> {
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

  renderRow(layoutGridSchema: LayoutGridSchemaProps) {
    const rows = layoutGridSchema['ui:row']
    const group = layoutGridSchema['ui:group']
    const groupDescription = layoutGridSchema['ui:group-description']

    if (group) {
      const { fields, formContext } = this.props.registry
      const { TitleField } = fields
      const { required, schema } = this.props
      const { description = '' } = schema

      const title = group && typeof group === 'string' ? group : null
      return (
        <fieldset
          className="rjsf-layout-grid-group"
        >
          <span data-testid={`layout-grid-field__row-title-field--${kebabCase(title)}`}>
            {title ? (
              <TitleField
                title={title}
                required={required}
                formContext={formContext}
              />
            ) : null}
          </span>
          { groupDescription ? (
            <div style={{ paddingBottom: 30 }}>
              { description }
            </div>
          ) : null }
          <div className="row" key={JSON.stringify(rows)}>{this.renderChildren(rows)}</div>
        </fieldset>
      )
    }
    return <div className="row" key={JSON.stringify(rows)}>{this.renderChildren(rows)}</div>
  }

  renderCol(layoutGridSchema: LayoutGridSchemaProps) {
    const { children, ...colProps } = layoutGridSchema['ui:col']

    const group = layoutGridSchema['ui:group']
    const groupDescription = layoutGridSchema['ui:group-description']
    if (group) {
      const { fields, formContext } = this.props.registry
      const { TitleField } = fields
      const { required, schema } = this.props
      const { description = '' } = schema
      const title = group && typeof group === 'string' ? group : null

      return (
        <Col {...colProps} key={JSON.stringify(colProps)}>
          <fieldset
            className="rjsf-layout-grid-group"
          >
            <span data-testid={`layout-grid-field__col-title-field--${kebabCase(title)}`}>
              {title ? (
                <TitleField
                  title={title}
                  required={required}
                  formContext={formContext}
                />
              ) : null}
            </span>
            { groupDescription ? (
              <div style={{ paddingBottom: 30 }}>
                { description }
              </div>
            ) : null }
            {this.renderChildren(children)}
          </fieldset>
        </Col>
      )
    }
    const {
      type = '',
      keywordScheme,
      keywordSchemeColumnNames = [],
      keywords,
      ...rest
    } = colProps
    return <Col {...colProps} key={JSON.stringify(colProps)}>{this.renderChildren(children)}</Col>
  }

  renderChildren(childrenLayoutGridSchema: LayoutGridSchemaProps) {
    const { definitions } = this.props.registry
    const schema = retrieveSchema(this.props.schema, definitions)

    return childrenLayoutGridSchema.map((layoutGridSchema: LayoutGridSchemaProps) => (
      <LayoutGridField
        {...this.props}
        key={JSON.stringify(layoutGridSchema)}
        schema={schema}
        layoutGridSchema={layoutGridSchema}
      />
    ))
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
      formData
    } = this.props
    const { definitions, fields } = this.props.registry
    const { SchemaField } = fields
    const schema = retrieveSchema(this.props.schema, definitions)
    let name
    let render
    if (typeof layoutGridSchema === 'string') {
      name = layoutGridSchema
    } else {
      name = layoutGridSchema.name
      render = layoutGridSchema.render
    }
    if (schema.properties[name] && !render) {
      return (
        <span data-testid={`layout-grid-field__schema-field--${kebabCase(name)}`}>
          <SchemaField
            key={JSON.stringify(name)}
            name={name}
            required={this.isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={uiSchema[name]}
            errorSchema={errorSchema[name]}
            idSchema={idSchema[name]}
            formData={formData[name]}
            onChange={this.onPropertyChange(name)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={this.props.registry}
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
          registry={this.props.registry}
        />
      </span>
    )
  }
}
