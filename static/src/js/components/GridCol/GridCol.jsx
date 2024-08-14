import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import { uniqueId } from 'lodash-es'

// eslint-disable-next-line import/no-cycle
import GridLayout from '../GridLayout/GridLayout'

/**
 * GridCol
 * @typedef {Object} GridCol
 * @property {Object} layout A layout schema with ui option defined.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 */

/**
 * Renders GridCol
 * @param {GridCol} props
 */
const GridCol = (
  props
) => {
  const {
    layout,
    registry,
    required,
    schema,
    uiSchema
  } = props
  const scrollRef = useRef(null)

  const {
    children,
    controlName,
    ...colProps
  } = layout['ui:col']

  const group = layout['ui:group']
  const groupDescription = layout['ui:group-description']
  const groupClassName = layout['ui:group-classname']
  const groupBoxClassName = layout['ui:group-box-classname']
  const requiredUI = layout['ui:required']

  const renderChildren = () => {
    const { schemaUtils } = registry
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    return children.map((layoutSchema) => (
      <GridLayout
        {...props}
        key={`layoutgridfield--${JSON.stringify(layoutSchema)}`}
        schema={retrievedSchema}
        layout={layoutSchema}
        controlName={controlName}
      />
    ))
  }

  const { description } = schema
  const title = group
  if (group) {
    const { fields, formContext } = registry
    const { TitleField } = fields

    return (
      <Col {...colProps}>
        <fieldset
          // TODO I don't think this scrollRef should be defined in GridCol, in the prototype it was defined at the grid layout level
          ref={scrollRef}
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
              uiSchema={uiSchema}
            />
          </span>
          {
            groupDescription && (
              <div className="description-box mb-3">
                {description}
              </div>
            )
          }
          <div>
            {renderChildren()}
          </div>
        </fieldset>
      </Col>
    )
  }

  return (
    <Col {...colProps}>
      {renderChildren()}
    </Col>
  )
}

GridCol.defaultProps = {
  required: false
}

GridCol.propTypes = {
  layout: PropTypes.shape({
    'ui:col': PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({}),
          PropTypes.string
        ])
      ),
      controlName: PropTypes.string
    }),
    'ui:group': PropTypes.string,
    'ui:group-checkbox': PropTypes.string,
    'ui:group-description': PropTypes.bool,
    'ui:group-classname': PropTypes.string,
    'ui:group-box-classname': PropTypes.string,
    'ui:required': PropTypes.bool
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func,
      TitleField: PropTypes.func
    }),
    formContext: PropTypes.shape({}),
    schemaUtils: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.func
    ]).isRequired
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired
}

export default GridCol
