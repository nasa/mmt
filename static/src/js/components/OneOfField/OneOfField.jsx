/* eslint-disable react/jsx-pascal-case */
/**
 *
 * This class is taken directly from JSON Schema Form source code.
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/MultiSchemaField.tsx
 * The getMatchingOption in componentDidUpdate was not returning the proper selectedOption,
 * so we had to make an update (noted in comments in that method).
 * Keeping this as a class component
 *
 */
import React from 'react'
import PropTypes from 'prop-types'
import {
  deepEquals,
  ERRORS_KEY,
  getDiscriminatorFieldFromSchema,
  getUiOptions,
  getWidget,
  TranslatableString
} from '@rjsf/utils'
import {
  cloneDeep,
  get,
  isEmpty,
  omit
} from 'lodash-es'
import removeEmpty from '../../utils/removeEmpty'

/** This is a custom 'OneOfField' component based on the JSON Schema Form AnyOfField.  This fixes a bug
 * where selecting one of the options reverts to default.
 *
 * @param props - The `FieldProps` for this template
 */
class OneOfField extends React.Component {
  /** Constructs an `OneOfField` with the given `props` to initialize the initially selected option in state
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props) {
    super(props)
    const {
      formData,
      options,
      registry: { schemaUtils }
    } = this.props
    // Cache the retrieved options in state in case they have $refs to save doing it later
    const retrievedOptions = options.map((opt) => schemaUtils.retrieveSchema(opt, formData))
    const data = removeEmpty(cloneDeep(formData)) || {}

    let selectedOption = this.getMatchingOption(NaN, data, retrievedOptions)

    if (Object.keys(data).length === 0) {
      selectedOption = NaN
    }

    this.state = {
      retrievedOptions,
      selectedOption
    }
  }

  /** React lifecycle method that is called when the props and/or state for this component is updated. It recomputes the
   * currently selected option based on the overall `formData`
   *
   * @param prevProps - The previous `FieldProps` for this template
   * @param prevState - The previous `OneOfFieldState` for this template
   */
  componentDidUpdate(
    prevProps,
    prevState
  ) {
    const { formData, options, idSchema } = this.props
    const { selectedOption } = this.state

    let newState = this.state
    if (!deepEquals(prevProps.options, options)) {
      const {
        registry: { schemaUtils }
      } = this.props
      // Re-cache the retrieved options in state in case they have $refs to save doing it later
      const retrievedOptions = options.map((opt) => schemaUtils.retrieveSchema(opt, formData))
      newState = {
        selectedOption,
        retrievedOptions
      }
    }

    if (!deepEquals(formData, prevProps.formData) && idSchema.$id === prevProps.idSchema.$id) {
      const { retrievedOptions } = newState
      const matchingOption = this.getMatchingOption(
        selectedOption,
        removeEmpty(cloneDeep(formData)),
        retrievedOptions
      )

      if (prevState && matchingOption !== selectedOption) {
        newState = {
          selectedOption: matchingOption,
          retrievedOptions
        }
      }
    }

    if (newState !== this.state) {
      this.setState(newState)
    }
  }

  /** Determines the best matching option for the given `formData` and `options`.
   *
   * @param formData - The new formData
   * @param options - The list of options to choose from
   * @return - The index of the `option` that best matches the `formData`
   */
  getMatchingOption(selectedOption, formData, options) {
    const {
      schema,
      registry: { schemaUtils }
    } = this.props

    const discriminator = getDiscriminatorFieldFromSchema(schema)
    const option = schemaUtils.getClosestMatchingOption(
      formData,
      options,
      selectedOption,
      discriminator
    )

    return option
  }

  /** Callback handler to remember what the currently selected option is. In addition to that the `formData` is updated
     * to remove properties that are not part of the newly selected option schema, and then the updated data is passed to
     * the `onChange` handler.
     *
     * @param option - The new option value being selected
     */
  onOptionChange = (option) => {
    const { selectedOption, retrievedOptions } = this.state
    const { formData, onChange, registry } = this.props
    const { schemaUtils } = registry
    const intOption = option !== undefined ? parseInt(option, 10) : -1
    if (intOption === selectedOption) {
      return
    }

    const newOption = intOption > 0 ? retrievedOptions[intOption] : undefined
    const oldOption = selectedOption >= 0 ? retrievedOptions[selectedOption] : undefined

    let newFormData = schemaUtils.sanitizeDataForNewSchema(newOption, oldOption, formData)

    if (newFormData && newOption) {
      // Call getDefaultFormState to make sure defaults are populated on change. Pass "excludeObjectChildren"
      // so that only the root objects themselves are created without adding undefined children properties
      newFormData = schemaUtils.getDefaultFormState(newOption, newFormData, 'excludeObjectChildren')
    }

    const fieldId = this.getFieldId()
    onChange(newFormData, undefined, fieldId)

    this.setState({ selectedOption: intOption })
  }

  getFieldId() {
    const { idSchema, schema } = this.props

    return `${idSchema.$id}${schema.oneOf ? '__oneof_select' : '__anyof_select'}`
  }

  /** Renders the `OneOfField` selector along with a `SchemaField` for the value of the `formData`
   */
  render() {
    const {
      name,
      baseType,
      disabled = false,
      errorSchema = {},
      formContext,
      onBlur,
      onFocus,
      registry,
      schema,
      uiSchema = {}
    } = this.props

    const {
      widgets, fields, translateString, globalUiOptions, schemaUtils
    } = registry
    const { SchemaField: _SchemaField } = fields
    const { selectedOption, retrievedOptions } = this.state
    const {
      widget = 'select',
      placeholder,
      autofocus,
      autocomplete,
      title = schema.title,
      ...uiOptions
    } = getUiOptions(uiSchema, globalUiOptions)
    const Widget = getWidget({ type: 'number' }, widget, widgets)
    const rawErrors = get(errorSchema, ERRORS_KEY, [])
    const fieldErrorSchema = omit(errorSchema, [ERRORS_KEY])
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions)
    let required = false

    const option = retrievedOptions[selectedOption] || null
    let optionSchema

    if (option) {
      // If the subschema doesn't declare a type, infer the type from the
      // parent schema
      optionSchema = option.type ? option : ({
        ...option,
        type: baseType
      })
    }

    if (uiSchema) {
      required = uiSchema['ui:required'] === true
    }

    const translateEnum = title
      ? TranslatableString.TitleOptionPrefix
      : TranslatableString.OptionPrefix
    const translateParams = title ? [title] : []
    const enumOptions = (retrievedOptions.map((opt, index) => ({
      label: opt.title || translateString(translateEnum, translateParams.concat(String(index + 1))),
      value: index
    })))

    return (
      <div className="panel panel-default panel-body">
        <div className="form-group">
          <Widget
            id={this.getFieldId()}
            name={`${name}${schema.oneOf ? '__oneof_select' : '__anyof_select'}`}
            schema={
              {
                type: 'string',
                default: NaN
              }
            }
            onChange={this.onOptionChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled || isEmpty(enumOptions)}
            multiple={false}
            rawErrors={rawErrors}
            errorSchema={fieldErrorSchema}
            value={selectedOption >= 0 ? selectedOption : undefined}
            options={
              {
                enumOptions,
                ...uiOptions
              }
            }
            registry={registry}
            formContext={formContext}
            placeholder={placeholder}
            autocomplete={autocomplete}
            autofocus={autofocus}
            label={title ?? name}
            hideLabel={!displayLabel}
            required={required}
            uiSchema={uiSchema}
          />
        </div>
        {option !== null && <_SchemaField {...this.props} schema={optionSchema} />}
      </div>
    )
  }
}

OneOfField.defaultProps = {
  baseType: null,
  errorSchema: null,
  formData: null,
  uiSchema: {}
}

OneOfField.propTypes = {
  formData: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
    PropTypes.oneOf([null])
  ]),
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  registry: PropTypes.shape({
    schemaUtils: PropTypes.shape({
      retrieveSchema: PropTypes.func,
      getClosestMatchingOption: PropTypes.func,
      sanitizeDataForNewSchema: PropTypes.func,
      getDefaultFormState: PropTypes.func,
      getDisplayLabel: PropTypes.func
    }),
    widgets: PropTypes.shape({}),
    fields: PropTypes.shape({
      SchemaField: PropTypes.func
    }).isRequired,
    translateString: PropTypes.func,
    globalUiOptions: PropTypes.string
  }).isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string
  }).isRequired,
  schema: PropTypes.shape({
    oneOf: PropTypes.arrayOf(PropTypes.shape({})),
    title: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  baseType: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  errorSchema: PropTypes.shape({}),
  formContext: PropTypes.shape({}).isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  uiSchema: PropTypes.shape({
    'ui:required': PropTypes.bool
  })

}

export default OneOfField
