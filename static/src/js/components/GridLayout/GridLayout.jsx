/* eslint-disable import/no-cycle */
import React from 'react'
import PropTypes from 'prop-types'

import GridControlledField from './GridControlledField'

import './GridLayout.scss'
import GridRow from './GridRow'
import GridField from './GridField'
import GridCol from './GridCol'

const GridLayout = (props) => {
  const {
    onChange,
    registry,
    schema,
    uiSchema = {},
    idSchema,
    layoutGridSchema,
    formData,
    errorSchema,
    controlName
  } = props
  let layoutSchema = layoutGridSchema
  if (!layoutSchema) {
    layoutSchema = uiSchema['ui:layout_grid']
  }

  if (layoutSchema['ui:col']) {
    layoutSchema['ui:controlled'] = uiSchema['ui:controlled']

    return (
      <GridCol {...props} uiSchema={layoutSchema} />
    )
  }

  if (layoutSchema['ui:row']) {
    layoutSchema['ui:controlled'] = uiSchema['ui:controlled']

    return (
      <GridRow {...props} uiSchema={layoutSchema} />
    )
  }

  if (controlName) {
    const fieldName = layoutSchema
    const fieldUiSchema = uiSchema[fieldName] ?? {}

    return (
      <GridControlledField
        registry={registry}
        uiSchema={fieldUiSchema}
        schema={schema}
        key={`controlledfield--${controlName}`}
        name={fieldName}
        controlName={controlName}
        formData={formData}
        idSchema={idSchema}
        onChange={onChange}
        errorSchema={errorSchema}
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
    <GridField {...props} uiSchema={layoutSchema} />
  )
}

GridLayout.defaultProps = {
  layoutGridSchema: null,
  required: false,
  onChange: null,
  controlName: null
}

GridLayout.propTypes = {
  controlName: PropTypes.string,
  onChange: PropTypes.func,
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  layoutGridSchema: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
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

export default GridLayout
