import { kebabCase } from 'lodash'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import isRequired from '../../utils/isRequired'
import onPropertyChange from '../../utils/onPropertyChange'
import onKeyChange from '../../utils/onKeyChange'

const GridField = (props) => {
  const {
    uiSchema,
    registry,
    formData,
    schema,
    idSchema,
    errorSchema,
    onChange,
    onBlur,
    onFocus,
    disabled,
    readonly
  } = props

  const scrollRef = useRef(null)

  const { fields, schemaUtils } = registry
  const { SchemaField } = fields
  const retrievedSchema = schemaUtils.retrieveSchema(schema)

  // Grab the name of the field we want from the ui schema.
  let layoutName
  let render
  if (typeof uiSchema === 'string') {
    layoutName = uiSchema
  } else {
    layoutName = uiSchema.name
    render = uiSchema.render
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

GridField.defaultProps = {
  onChange: null,
  onBlur: null,
  onFocus: null,
  disabled: null,
  readonly: null
}

GridField.propTypes = {
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
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
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    required: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.string)]),
    properties: PropTypes.shape({})
  }).isRequired,
  uiSchema: PropTypes.shape({
    name: PropTypes.string,
    render: PropTypes.func
  }).isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool
}

export default GridField