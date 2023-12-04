import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

// eslint-disable-next-line import/no-cycle
import GridLayout from './GridLayout'
import GridGroupedSinglePanel from './GridGroupedSinglePanel'
import GridCheckboxPanel from './GridCheckboxPanel'

/**
 * GridRow
 * @typedef {Object} GridRow
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Object} layout A layout schema with ui option defined.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} formData An Object with the saved metadata
 * @property {Boolean} required Is the field required
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 */

/**
 * Renders GridRow
 * @param {GridRow} props
 */
const GridRow = (
  props
) => {
  const {
    uiSchema,
    layout,
    registry,
    schema,
    formData,
    required,
    onChange
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
        layout={layoutSchema}
        key={`layoutgridfield--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        onChange={onChange}
      />
    ))
  }

  if (hide && hide(formData)) {
    return null
  }

  if (group) {
    const { description = '' } = schema
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
              ? (<GridGroupedSinglePanel layoutGridSchema={uiSchema} />)
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
        layoutGridSchema={uiSchema}
        key={`checkboxpanel--' ${JSON.stringify(uiSchema)}`}
      />
    )
  }

  return (
    <div
      className="row row-children pb-3"
      key={`row-children--${JSON.stringify(rows)}`}
    >
      {' '}
      {renderChildren()}
    </div>
  )
}

GridRow.defaultProps = {
  required: false
}

GridRow.propTypes = {
  formData: PropTypes.shape({}).isRequired,
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
  layout: PropTypes.shape({
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
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default GridRow
