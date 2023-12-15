import { kebabCase } from 'lodash-es'
import React from 'react'
import PropTypes from 'prop-types'

import ObjectField from '../ObjectField/ObjectField'

/**
 * GridField
 * @typedef {Object} GridField
 * @property {Boolean} disabled Should field be disabled.
 * @property {Object} errorSchema A Object with the list of errors
 * @property {Object} formData An Object with the saved metadata
 * @property {Object} idSchema A idSchema for the field being shown.
 * @property {Object} layout A layout schema with ui option defined.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Boolean} onFocus Should focus a field.
 * @property {Boolean} readonly Is the field readonly.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders GridField
 * @param {GridField} props
 */
class GridField extends ObjectField {
  constructor(props) {
    super(props)
    this.scrollRef = React.createRef()
  }

  render() {
    const { props } = this
    const {
      disabled,
      errorSchema,
      formData,
      idSchema,
      layout,
      onBlur,
      onFocus,
      readonly,
      registry,
      schema,
      uiSchema
    } = props

    const { fields, schemaUtils } = registry
    const { SchemaField } = fields
    const retrievedSchema = schemaUtils.retrieveSchema(schema)

    // Grab the name of the field we want from the ui schema.
    let layoutName
    let render
    if (typeof layout === 'string') {
      layoutName = layout
    } else {
      layoutName = layout.name
      render = layout.render
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

    const { properties = {} } = retrievedSchema // OneOf causes properties to return null

    if (properties[layoutName] && !render) {
      return (
        <span>
          <SchemaField
            disabled={disabled}
            errorSchema={errorSchema[layoutName]}
            formData={(formData)[layoutName]}
            idSchema={idSchema[layoutName]}
            name={layoutName}
            onBlur={onBlur}
            onChange={this.onPropertyChange(layoutName)}
            onFocus={onFocus}
            readonly={readonly}
            registry={registry}
            required={this.isRequired(layoutName)}
            schema={retrievedSchema.properties[layoutName]}
            uiSchema={uiSchema[layoutName]}
          />
        </span>
      )
    }

    //
    // CG: Commented out, will revisit with tests if needed
    // otherwise will remove
    //
    // Handle auto scroll based on focus field.

    // TODO should we remove?
    // const { formContext } = registry
    // const {
    //   focusField
    // } = formContext
    // let shouldFocus = false
    // if (idSchema.$id === focusField) {
    //   shouldFocus = true
    // }

    // useEffect(() => {
    // // This useEffect for shouldFocus lets the refs be in place before trying to use them
    //   if (shouldFocus) {
    //     this.scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    //   }
    // }, [shouldFocus])

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
            errorSchema={errorSchema}
            formData={formData}
            name={layoutName}
            registry={registry}
            schema={schema}
            uiSchema={uiSchema}
          />
        </span>
      )
    }

    return null
  }
}

GridField.defaultProps = {
  formData: {},
  onChange: null,
  onBlur: null,
  onFocus: null,
  disabled: null,
  readonly: null
}

GridField.propTypes = {
  errorSchema: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}),
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
  layout: PropTypes.oneOfType(
    [PropTypes.shape({
      name: PropTypes.string,
      render: PropTypes.func
    }), PropTypes.string]
  ).isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  uiSchema: PropTypes.shape({}).isRequired
}

export default GridField
