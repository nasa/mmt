import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'

import { kebabCase, uniqueId } from 'lodash'

import LayoutGridFieldGroupedSinglePanel from './LayoutGridFieldGroupedSinglePanel'
import LayoutGridFieldCheckboxPanel from './LayoutGridFieldCheckboxPanel'
import LayoutGridFieldControlledField from './LayoutGridFieldControlledField'

import isRequired from '../../utils/isRequired'
import onPropertyChange from '../../utils/onPropertyChange'
import onKeyChange from '../../utils/onKeyChange'

import './LayoutGridField.scss'

const LayoutGridField = (props) => {
  const {
    onChange,
    registry,
    schema,
    uiSchema = {},
    idSchema,
    controlName,
    layoutGridSchema,
    required,
    formData,
    errorSchema,
    onBlur,
    onFocus,
    disabled,
    readonly
  } = props

  const scrollRef = useRef(null)

  // Render children rows
  //  {
  //     'ui:row': [
  //       { 'ui:col': { md: 6, children: ['firstName'] } },
  //       { 'ui:col': { md: 6, children: ['lastName'] } }
  //     ]
  // },
  const renderChildren = (rows, rowControlName = undefined) => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return rows.map((layoutSchema) => (
      <LayoutGridField
        {...props}
        key={`layoutgridfield--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        layoutGridSchema={layoutSchema}
        controlName={rowControlName}
        onChange={onChange}
      />
    ))
  }

  // Renders a row
  //  {
  //   'ui:row': [
  //     { 'ui:col': { md: 6, children: ['firstName'] } },
  //   ]
  // },
  const renderRow = (layoutSchema) => {
    const rows = layoutSchema['ui:row']
    const group = layoutSchema['ui:group']
    const groupCheckbox = layoutSchema['ui:group-checkbox']
    const groupDescription = layoutSchema['ui:group-description']
    const groupClassName = layoutSchema['ui:group-classname']
    const groupBoxClassName = layoutSchema['ui:group-box-classname']
    const requiredUI = layoutSchema['ui:required']
    const hide = layoutSchema['ui:hide']

    if (hide && hide(formData)) {
      return null
    }

    if (group) {
      const { fields, formContext } = registry
      const { TitleField } = fields
      const { description = '' } = schema
      const title = group
      const groupSinglePanel = layoutSchema['ui:group-single-panel']

      return (
        <div className="layout-grid-field__row-fieldset">
          <fieldset
            className="rjsf-layout-grid-group"
          >
            <span>
              {
                TitleField && (
                  <TitleField
                    name={title}
                    title={title}
                    className={groupClassName}
                    groupBoxClassName={groupBoxClassName}
                    required={required}
                    requiredUI={requiredUI}
                    formContext={formContext}
                    onBlur={undefined}
                    onFocus={undefined}
                    options={undefined}
                    idSchema={undefined}
                    id={uniqueId()}
                    onChange={undefined}
                    schema={undefined}
                    readonly={false}
                    disabled={false}
                    registry={registry}
                  />
                )
              }
            </span>
            {
              groupDescription && (
                <div className="layout-grid-field__description-box">
                  {description}
                </div>
              )
            }

            {
              groupSinglePanel
                ? (
                  <LayoutGridFieldGroupedSinglePanel
                    {...props}
                    layoutGridSchema={layoutSchema}
                    key={`groupedpanel--${JSON.stringify(layoutSchema)}`}
                  />
                )
                : (
                  <div className="row" key={`row--${JSON.stringify(rows)}`}>
                    {renderChildren(rows)}
                  </div>
                )
            }
          </fieldset>
        </div>
      )
    }

    if (groupCheckbox) {
      return (
        <LayoutGridFieldCheckboxPanel
          {...props}
          layoutGridSchema={layoutSchema}
          key={`checkboxpanel--' ${JSON.stringify(layoutSchema)}`}
        />
      )
    }

    return (
      <div
        className="row row-children"
        key={`row-children--${JSON.stringify(rows)}`}
      >
        {' '}
        {renderChildren(rows)}
      </div>
    )
  }

  // Renders a Col
  // { 'ui:col': { md: 6, children: ['firstName'] } },
  const renderCol = (layoutSchema) => {
    const {
      children,
      colControlName,
      ...colProps
    } = layoutSchema['ui:col']

    const group = layoutSchema['ui:group']
    const groupDescription = layoutSchema['ui:group-description']
    const groupClassName = layoutSchema['ui:group-classname']
    const groupBoxClassName = layoutSchema['ui:group-box-classname']
    const requiredUI = layoutSchema['ui:required']

    // Need to pull out controlName as it isn't a valid property that can be
    // passed to Col
    const { controlName: _controlName, ...properColProps } = colProps

    if (group) {
      const { fields } = registry
      const { TitleField } = fields
      const { description } = schema
      const title = group

      return (
        <Col {...properColProps} key={`col--${JSON.stringify(colProps)}`}>
          <fieldset
            ref={scrollRef}
            className="rjsf-layout-grid-group"
          >
            <span>
              {
                TitleField && (
                  <TitleField
                    name={title}
                    title={title}
                    className={groupClassName}
                    groupBoxClassName={groupBoxClassName}
                    required={required}
                    requiredUI={requiredUI}
                    onBlur={undefined}
                    onFocus={undefined}
                    options={undefined}
                    idSchema={undefined}
                    id={uniqueId()}
                    onChange={undefined}
                    schema={undefined}
                    readonly={false}
                    disabled={false}
                    registry={registry}
                  />
                )
              }
            </span>
            {
              groupDescription ? (
                <div className="description-box">
                  {description}
                </div>
              ) : null
            }
            <div>
              {renderChildren(children, controlName)}
            </div>
          </fieldset>
        </Col>
      )
    }

    return (
      <Col {...properColProps}>
        {' '}
        {renderChildren(children, controlName)}
      </Col>
    )
  }

  // Renders a field, i.e., firstName
  // 'ui:row': [
  //    { 'ui:col': { md: 6, children: ['firstName'] } },
  //  ]
  const renderField = (layoutSchema) => {
    const { fields, schemaUtils } = registry
    const { SchemaField } = fields
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    // Grab the name of the field we want from the ui schema.
    let layoutName
    let render
    if (typeof layoutSchema === 'string') {
      layoutName = layoutSchema
    } else {
      layoutName = layoutSchema.name
      render = layoutSchema.render
    }

    const pos = layoutName.lastIndexOf('-')
    if (pos > -1) {
      layoutName = layoutName.substring(0, pos)
    }

    // Populate the child Ids used for autofocus.
    if (idSchema[layoutName]) {
      const childIdSchema = idSchema[layoutName]
      const keys = Object.keys(childIdSchema)
      keys.forEach((key) => {
        if (key === '$id') {
          childIdSchema[key] = childIdSchema[key].replace('root_', '')
        } else {
          childIdSchema[key].$id = childIdSchema[key].$id.replace('root_', '')
        }
      })
    }

    // CG: Don't think is necessary 10/17/23
    // else {
    //   console.log('using this for ', idSchema)
    //   idSchema.$id = name
    // }

    const { properties = {} } = retrievedSchema // OneOf causes properties to return null

    if (properties[layoutName] && !render) {
      return (
        <span>
          <SchemaField
            key={`schemafield-${layoutName}`}
            name={layoutName}
            required={isRequired(layoutName, retrievedSchema)}
            schema={retrievedSchema.properties[layoutName]}
            uiSchema={uiSchema[layoutName]}
            errorSchema={errorSchema[layoutName]}
            idSchema={idSchema[layoutName]}
            formData={(formData || {})[layoutName]}
            onChange={onPropertyChange(layoutName, formData, onChange, errorSchema)}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={registry}
            disabled={disabled}
            readonly={readonly}
            onKeyChange={onKeyChange(layoutName, formData, onChange, errorSchema)}
          />
        </span>
      )
    }

    // Handle auto scroll based on focus field.

    const { formContext } = registry
    const {
      focusField
    } = formContext
    let shouldFocus = false
    if (idSchema.$id === focusField) {
      shouldFocus = true
    }

    useEffect(() => {
      // This useEffect for shouldFocus lets the refs be in place before trying to use them
      if (shouldFocus) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }, [shouldFocus])

    // Used for inline render's in the UI layotu file.
    //     'ui:row': [
    //       {
    //         name: 'password',
    //         render: () => (
    //           <div>My Custom Component</div>
    //         )
    //       },
    //       { name: 'age' }
    //     ]
    // }
    if (render) {
      const UIComponent = render

      return (
        <span data-testid={`layout-grid-field__schema-field--${kebabCase(layoutName)}`}>
          <UIComponent
            {...props}
            name={layoutName}
            formData={formData}
            errorSchema={errorSchema}
            uiSchema={uiSchema}
            schema={schema}
            registry={registry}
          />
        </span>
      )
    }

    return (
      <span data-testid={`layout-grid-field__schema-field--${kebabCase(layoutName)}__NOT-FOUND`} />
    )
  }

  //
  // Render
  //

  let layoutSchema = layoutGridSchema
  if (!layoutSchema) {
    layoutSchema = uiSchema['ui:layout_grid']
  }

  if (layoutSchema['ui:row']) {
    return renderRow(layoutSchema)
  }

  if (layoutSchema['ui:col']) {
    return renderCol(layoutSchema)
  }

  if (controlName) {
    return (
      <LayoutGridFieldControlledField
        {...props}
        key={`controlledfield--${controlName}`}
        layoutGridSchema={layoutSchema}
        controlName={controlName}
      />
    )
  }

  return renderField(layoutSchema)
}

LayoutGridField.defaultProps = {
  controlName: null,
  disabled: false,
  id: null,
  label: null,
  layoutGridSchema: null,
  placeholder: null,
  required: false
}

LayoutGridField.propTypes = {
  controlName: PropTypes.string,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
  id: PropTypes.string,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  label: PropTypes.string,
  layoutGridSchema: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  readonly: PropTypes.bool.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired,
    getUiOptions: PropTypes.func,
    schemaUtils: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired,
    fields: PropTypes.shape({
      TitleField: PropTypes.func,
      SchemaField: PropTypes.func
    })
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
    properties: PropTypes.shape({})
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default LayoutGridField
