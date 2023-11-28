/* eslint-disable import/no-cycle */
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import GridLayout from './GridLayout'
import GridTitle from './GridTitle'

/**
 * GridCol
 * @typedef {Object} GridCol
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} layout A layout schema with ui option defined.
 */

/**
 * Renders GridCol
 * @param {GridCol} props
 */
const GridCol = (
  props
) => {
  const {
    registry,
    schema,
    required,
    uiSchema,
    onChange,
    layout
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
        uiSchema={uiSchema}
        layout={layoutSchema}
        onChange={onChange}
        controlName={controlName}
      />
    ))
  }

  const { description } = schema
  const title = group
  if (group) {
    return (
      <Col {...colProps} key={`col--${JSON.stringify(colProps)}`}>
        <fieldset
          ref={scrollRef}
          className="rjsf-layout-grid-group"
        >
          <span>
            <GridTitle
              title={title}
              className={groupClassName}
              groupBoxClassName={groupBoxClassName}
              required={requiredUI ?? required}
              registry={registry}
            />
          </span>
          {
            groupDescription ? (
              <div className="description-box">
                {description}
              </div>
            ) : null
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
  registry: PropTypes.shape({
    fields: PropTypes.shape({
      SchemaField: PropTypes.func
    }),
    schemaUtils: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.func]).isRequired
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string

  }).isRequired,
  layout: PropTypes.shape({
    'ui:col': PropTypes.shape({
      children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])),
      controlName: PropTypes.string
    }),
    'ui:group': PropTypes.string,
    'ui:group-checkbox': PropTypes.string,
    'ui:group-description': PropTypes.string,
    'ui:group-classname': PropTypes.string,
    'ui:group-box-classname': PropTypes.string,
    'ui:required': PropTypes.bool
  }).isRequired,
  uiSchema: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired

}

export default GridCol
