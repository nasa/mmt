/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-duplicates */
/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import { Component } from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import {
  deepEquals,
  ERRORS_KEY,
  FieldProps,
  FormContextType,
  getDiscriminatorFieldFromSchema,
  getUiOptions,
  getWidget,
  RJSFSchema,
  StrictRJSFSchema,
  TranslatableString
} from '@rjsf/utils'
import { removeEmpty } from '../../utils/json_utils'

/** Type used for the state of the `OneOfField` component */
type OneOfFieldState<S extends StrictRJSFSchema = RJSFSchema> = {
  /** The currently selected option */
  selectedOption: number;
  // userSelectedOption
  /* The option schemas after retrieving all $refs */
  retrievedOptions: S[];
};

/** This is a custom 'OneOfField' component based on the JSON Schema Form AnyOfField.  This fixes a bug
 * where selecting one of the options reverts to default.
 *
 * @param props - The `FieldProps` for this template
 */
class OneOfField<T = unknown, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = unknown> extends Component<
  FieldProps<T, S, F>,
  OneOfFieldState<S>
> {
  /** Constructs an `OneOfField` with the given `props` to initialize the initially selected option in state
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props: FieldProps<T, S, F>) {
    super(props)
    const {
      formData,
      options,
      registry: { schemaUtils }
    } = this.props
    // cache the retrieved options in state in case they have $refs to save doing it later
    const retrievedOptions = options.map((opt: S) => schemaUtils.retrieveSchema(opt, formData))

    this.state = {
      retrievedOptions,
      selectedOption: this.getMatchingOption(NaN, removeEmpty(formData as object), retrievedOptions)
    }
  }

  /** React lifecycle method that is called when the props and/or state for this component is updated. It recomputes the
   * currently selected option based on the overall `formData`
   *
   * @param prevProps - The previous `FieldProps` for this template
   * @param prevState - The previous `OneOfFieldState` for this template
   */
  componentDidUpdate(prevProps: Readonly<FieldProps<T, S, F>>, prevState: Readonly<OneOfFieldState>) {
    const { formData, options, idSchema } = this.props
    const { selectedOption } = this.state
    let newState = this.state
    if (!deepEquals(prevProps.options, options)) {
      const {
        registry: { schemaUtils }
      } = this.props
      // re-cache the retrieved options in state in case they have $refs to save doing it later
      const retrievedOptions = options.map((opt: S) => schemaUtils.retrieveSchema(opt, formData))
      newState = { selectedOption, retrievedOptions }
    }
    if (!deepEquals(formData, prevProps.formData) && idSchema.$id === prevProps.idSchema.$id) {
      const { retrievedOptions } = newState
      const matchingOption = this.getMatchingOption(selectedOption, removeEmpty(formData as object), retrievedOptions)

      if (prevState && matchingOption !== selectedOption) {
        newState = { selectedOption: matchingOption, retrievedOptions }
      }
    }
    /** The code below commented out caused a bug where it would revert the option selected in some cases.  */

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
  getMatchingOption(selectedOption: number, formData: T | undefined, options: S[]) {
    const {
      schema,
      registry: { schemaUtils }
    } = this.props

    const discriminator = getDiscriminatorFieldFromSchema<S>(schema)
    const option = schemaUtils.getClosestMatchingOption(formData, options, selectedOption, discriminator)
    return option
  }

  /** Callback handler to remember what the currently selected option is. In addition to that the `formData` is updated
   * to remove properties that are not part of the newly selected option schema, and then the updated data is passed to
   * the `onChange` handler.
   *
   * @param option - The new option value being selected
   */
  onOptionChange = (option?: string) => {
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
      newFormData = schemaUtils.getDefaultFormState(newOption, newFormData, 'excludeObjectChildren') as T
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
      uiSchema
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
    } = getUiOptions<T, S, F>(uiSchema, globalUiOptions)
    const Widget = getWidget<T, S, F>({ type: 'number' }, widget, widgets)
    const rawErrors = get(errorSchema, ERRORS_KEY, [])
    const fieldErrorSchema = omit(errorSchema, [ERRORS_KEY])
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions)

    const option = retrievedOptions[selectedOption] || null
    let optionSchema: S

    if (option) {
      // If the subschema doesn't declare a type, infer the type from the
      // parent schema
      optionSchema = option.type ? option : ({ ...option, type: baseType })
    }

    const translateEnum: TranslatableString = title
      ? TranslatableString.TitleOptionPrefix
      : TranslatableString.OptionPrefix
    const translateParams = title ? [title] : []
    const enumOptions = (retrievedOptions.map((opt: { title?: string }, index: number) => ({
      label: opt.title || translateString(translateEnum, translateParams.concat(String(index + 1))),
      value: index
    })))

    return (
      <div className="panel panel-default panel-body">
        <div className="form-group">
          <Widget
            id={this.getFieldId()}
            name={`${name}${schema.oneOf ? '__oneof_select' : '__anyof_select'}`}
            schema={{ type: 'string', default: NaN } as S}
            onChange={this.onOptionChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled || isEmpty(enumOptions)}
            multiple={false}
            rawErrors={rawErrors}
            errorSchema={fieldErrorSchema}
            value={selectedOption >= 0 ? Object.values(enumOptions).at(selectedOption).label : undefined}
            options={{ enumOptions, ...uiOptions }}
            registry={registry}
            formContext={formContext}
            placeholder={placeholder}
            autocomplete={autocomplete}
            autofocus={autofocus}
            label={title ?? name}
            hideLabel={!displayLabel}
          />
        </div>
        {option !== null && <_SchemaField {...this.props} schema={optionSchema!} />}
      </div>
    )
  }
}

export default OneOfField
