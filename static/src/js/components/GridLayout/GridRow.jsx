/* eslint-disable import/no-cycle */
import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'
import GridLayout from './GridLayout'
import GridGroupedSinglePanel from './GridGroupedSinglePanel'
import GridCheckboxPanel from './GridCheckboxPanel'

const GridRow = (
  props
) => {
  const {
    uiSchema,
    registry,
    schema,
    formData,
    required,
    onChange
  } = props

  const rows = uiSchema['ui:row']
  const group = uiSchema['ui:group']
  const groupCheckbox = uiSchema['ui:group-checkbox']
  const groupDescription = uiSchema['ui:group-description']
  const groupClassName = uiSchema['ui:group-classname']
  const groupBoxClassName = uiSchema['ui:group-box-classname']
  const requiredUI = uiSchema['ui:required']
  const hide = uiSchema['ui:hide']

  // Render children rows
  //  {
  //     'ui:row': [
  //       { 'ui:col': { md: 6, children: ['firstName'] } },
  //       { 'ui:col': { md: 6, children: ['lastName'] } }
  //     ]
  // },

  const renderChildren = () => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return rows.map((layoutSchema) => (
      <GridLayout
        {...props}
        key={`layoutgridfield--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        layoutGridSchema={layoutSchema}
        onChange={onChange}
      />
    ))
  }

  if (hide && hide(formData)) {
    return null
  }

  if (group) {
    const { fields, formContext } = registry
    const { TitleField } = fields
    const { description = '' } = schema
    const title = group
    const groupSinglePanel = uiSchema['ui:group-single-panel']

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
                <GridGroupedSinglePanel
                  layoutGridSchema={uiSchema}
                  key={`groupedpanel--${JSON.stringify(uiSchema)}`}
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
      <GridCheckboxPanel
        layoutGridSchema={uiSchema}
        key={`checkboxpanel--' ${JSON.stringify(uiSchema)}`}
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

GridRow.defaultProps = {
  controlName: null,
  disabled: false,
  id: null,
  label: null,
  layoutGridSchema: null,
  placeholder: null,
  required: false
}

GridRow.propTypes = {
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
  uiSchema: PropTypes.shape({
    'ui:row': PropTypes.arrayOf(
      PropTypes.shape({})
    ),
    'ui:group': PropTypes.string,
    'ui:group-checkbox': PropTypes.string,
    'ui:group-description': PropTypes.string,
    'ui:group-classname': PropTypes.string,
    'ui:group-box-classname': PropTypes.string,
    'ui:required': PropTypes.bool,
    'ui:hide': PropTypes.func,
    'ui:group-single-panel': PropTypes.string
  }).isRequired
}

export default GridRow
