import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash-es'

// eslint-disable-next-line import/no-cycle
import GridCheckboxPanel from '../GridCheckboxPanel/GridCheckboxPanel'
import GridGroupedSinglePanel from '../GridGroupedSinglePanel/GridGroupedSinglePanel'

// eslint-disable-next-line import/no-cycle
import GridLayout from '../GridLayout/GridLayout'

import './GridRow.scss'

/**
 * GridRow
 * @typedef {Object} GridRow
 * @property {Object} formData An Object with the saved metadata
 * @property {Object} layout A layout schema with ui option defined.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders GridRow
 * @param {GridRow} props
 */
const GridRow = (
  props
) => {
  const {
    formData,
    layout,
    onBlur,
    onChange,
    registry,
    required,
    schema,
    idSchema,
    errorSchema,
    uiSchema
  } = props

  const rows = layout['ui:row']
  const group = layout['ui:group']
  const groupCheckbox = layout['ui:group-checkbox']
  const groupDescription = layout['ui:group-description']
  const groupClassName = layout['ui:group-classname']
  const groupBoxClassName = layout['ui:group-box-classname']
  const requiredUI = layout['ui:required']
  const hide = layout['ui:hide']

  const renderChildren = () => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return rows.map((layoutSchema) => (
      <GridLayout
        {...props}
        key={`layoutgridfield--${JSON.stringify(layoutSchema)}`}
        layout={layoutSchema}
        onChange={onChange}
        schema={retrievedSchema}
      />
    ))
  }

  if (hide && hide(formData)) {
    return null
  }

  if (group) {
    const { description } = schema
    const title = group
    const groupSinglePanel = layout['ui:group-single-panel']
    const { fields, formContext } = registry
    const { TitleField } = fields

    return (
      <div className="layout-grid-field__row-fieldset">
        <fieldset
          className="rjsf-layout-grid-group"
        >
          <span>
            <TitleField
              className={groupClassName}
              disabled={false}
              formContext={formContext}
              groupBoxClassName={groupBoxClassName}
              id={uniqueId()}
              idSchema={undefined}
              name={title}
              onBlur={undefined}
              onChange={undefined}
              onFocus={undefined}
              options={undefined}
              readonly={false}
              registry={registry}
              required={required}
              requiredUI={requiredUI}
              schema={undefined}
              title={title}
            />
          </span>
          {
            (groupDescription && description) && (
              <div className="grid-row__group-description mb-4">
                {description}
              </div>
            )
          }

          {
            groupSinglePanel
              ? (
                <GridGroupedSinglePanel
                  layout={layout}
                  registry={registry}
                  idSchema={idSchema}
                  uiSchema={uiSchema}
                  schema={schema}
                  formData={formData || {}}
                  onBlur={onBlur}
                  onChange={onChange}
                  errorSchema={errorSchema}
                />
              )
              : (
                <div className="row">
                  {renderChildren()}
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
        key={`checkboxpanel--' ${JSON.stringify(layout)}`}
        layout={layout}
        errorSchema={errorSchema}
        registry={registry}
        idSchema={idSchema}
        uiSchema={uiSchema}
        schema={schema}
        formData={formData}
        onBlur={onBlur}
        onChange={onChange}
      />
    )
  }

  return (
    <div
      className="row row-children"
      key={`row-children--${JSON.stringify(rows)}`}
    >
      {' '}
      {renderChildren()}
    </div>
  )
}

GridRow.defaultProps = {
  formData: {},
  required: false
}

GridRow.propTypes = {
  formData: PropTypes.shape({}),
  layout: PropTypes.shape({
    'ui:row': PropTypes.arrayOf(PropTypes.shape({})),
    'ui:group': PropTypes.string,
    'ui:group-checkbox': PropTypes.string,
    'ui:group-description': PropTypes.bool,
    'ui:group-classname': PropTypes.string,
    'ui:group-box-classname': PropTypes.string,
    'ui:required': PropTypes.bool,
    'ui:hide': PropTypes.func,
    'ui:group-single-panel': PropTypes.bool
  }).isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
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
  uiSchema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({}).isRequired,
  errorSchema: PropTypes.shape({}).isRequired
}

export default GridRow
