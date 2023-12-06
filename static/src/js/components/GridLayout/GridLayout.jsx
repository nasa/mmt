import React from 'react'
import PropTypes from 'prop-types'

import GridControlledField from '../GridControlledField/GridControlledField'

// eslint-disable-next-line import/no-cycle
import GridRow from '../GridRow/GridRow'
// eslint-disable-next-line import/no-cycle
import GridCol from '../GridCol/GridCol'

import GridField from '../GridField/GridField'

import './GridLayout.scss'

/**
 * GridLayout
 * @typedef {Object} GridLayout
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Object} idSchema A idSchema for the field being shown.
 * @property {Object} formData An Object with the saved metadata
 * @property {Object} errorSchema A Object with the list of errors
 * @property {String} controlName A name that is defined in the schema
 */

/**
 * Renders GridLayout
 * @param {GridLayout} props
 */
const GridLayout = (props) => {
  const {
    registry,
    uiSchema,
    controlName
  } = props
  let { layout } = props
  if (!layout) {
    layout = uiSchema['ui:layout_grid']
  }

  if (layout['ui:col']) {
    return (
      <GridCol
        {...props}
        layout={layout}
      />
    )
  }

  if (layout['ui:row']) {
    return (
      <GridRow
        {...props}
        layout={layout}
      />
    )
  }

  if (controlName) {
    const fieldName = layout
    const fieldUiSchema = uiSchema[fieldName] ?? {}

    return (
      <GridControlledField
        {...props}
        layout={layout}
        registry={registry}
        controlName={controlName}
        uiSchema={fieldUiSchema}
        name={fieldName}
        onSelectValue={uiSchema['ui:onHandleChange']}
        mapping={uiSchema['ui:controlled']}
      />
    )
  }

  // Renders a field, i.e., firstName
  // 'ui:row': [
  //    { 'ui:col': { md: 6, children: ['firstName'] } },
  //  ]
  return (
    <div>
      <GridField {...props} uiSchema={uiSchema} layout={layout} />
    </div>
  )
}

GridLayout.defaultProps = {
  layout: null,
  required: false,
  onChange: null,
  controlName: null,
  formData: {}
}

GridLayout.propTypes = {
  controlName: PropTypes.string,
  onChange: PropTypes.func,
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}),
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  layout: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string
  ]),
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired,
    getUiOptions: PropTypes.func,
    schemaUtils: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.func
    ]).isRequired,
    fields: PropTypes.shape({
      TitleField: PropTypes.func,
      SchemaField: PropTypes.func
    })
  }).isRequired,
  required: PropTypes.bool,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    required: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    properties: PropTypes.shape({})
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:layout_grid': PropTypes.shape({}),
    'ui:onHandleChange': PropTypes.shape({}),
    'ui:controlled': PropTypes.shape({})
  }).isRequired
}

export default GridLayout
