import React, { useEffect, useRef } from 'react'
import AsyncSelect from 'react-select/async'
import PropTypes from 'prop-types'
import { debounce, startCase } from 'lodash-es'

import useMMTCookie from '@/js/hooks/useMMTCookie'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'
import shouldFocusField from '../../utils/shouldFocusField'

/**
 * Custom MultiValueLabel component
 * @param {Object} data MultiValue data object
 */
const MultiValueLabel = (data) => {
  const { label, id } = data

  return (
    <div role="presentation">
      <div style={{ padding: '3px 3px 3px 6px' }}>
        {label}
        {' '}
        <strong>{id}</strong>
      </div>
    </div>
  )
}

/**
 * CustomAsyncMultiSelectWidget
 * @typedef {Object} CustomAsyncMultiSelectWidget
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user selects an option.
 * @property {String} placeholder A placeholder text for the multiselect.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomAsyncMultiSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value An option is saved to the draft.
 */

/**
 * Renders Custom Multi Select Widget
 * @param {CustomAsyncMultiSelectWidget} props
 */
const CustomAsyncMultiSelectWidget = ({
  id,
  label,
  onBlur,
  onChange,
  placeholder,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const { mmtJwt } = useMMTCookie()

  const multiSelectScrollRef = useRef(null)
  const focusRef = useRef(null)

  const selectOptions = []
  const {
    description
  } = schema
  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      multiSelectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  const handleChange = (event) => {
    const result = []
    event.forEach((current) => {
      result.push(current.value)
    })

    onChange(result)
  }

  const handleBlur = () => {
    setFocusField(null)

    onBlur(id)
  }

  // If the value already has data, this will store it as an object for react-select
  const existingValues = value.filter(Boolean).map((currentValue) => ({
    value: currentValue,
    label: currentValue.label,
    id: currentValue.id
  }))

  // Loads the options from the search options endpoint. Uses `debounce` to avoid an API call for every keystroke
  const loadOptions = debounce((inputValue, callback) => {
    if (inputValue.length >= 3) {
      const { 'ui:search': searchOptions } = uiSchema
      const {
        endpoint,
        host,
        parameter
      } = searchOptions

      // Call the API to retrieve values
      fetch(`${host}${endpoint}?${parameter}=${inputValue}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${mmtJwt}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          const options = data.map((edlUser) => ({
            value: edlUser,
            label: edlUser.label,
            id: edlUser.id
          }))

          // Use the callback function to set the values as select options
          callback(options)
        })
    }
  }, 1000)

  return (
    <CustomWidgetWrapper
      description={description}
      id={id}
      label={label}
      required={required}
      scrollRef={multiSelectScrollRef}
      title={title}
    >
      <AsyncSelect
        autoFocus={shouldFocus}
        id={id}
        isClearable
        isMulti
        key={`${id}_${focusField}`}
        loadingMessage={
          (data) => {
            const { inputValue } = data

            // Don't show the 'Loading' text until there are 3 characters typed
            if (inputValue.length >= 3) return 'Loading...'

            return 'Please enter 3 or more characters'
          }
        }
        loadOptions={loadOptions}
        menuShouldScrollIntoView
        noOptionsMessage={() => 'Please enter 3 or more characters'}
        onBlur={handleBlur}
        onChange={handleChange}
        options={selectOptions}
        placeholder={placeholder || `Select ${title}`}
        value={existingValues}
        components={
          {
            // eslint-disable-next-line react/prop-types
            MultiValueLabel: (props) => MultiValueLabel(props.data)
          }
        }
        formatOptionLabel={MultiValueLabel}
      />
    </CustomWidgetWrapper>
  )
}

CustomAsyncMultiSelectWidget.defaultProps = {
  placeholder: '',
  uiSchema: {
    'ui:title': null
  },
  value: []
}

CustomAsyncMultiSelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number,
    enum: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:search': PropTypes.shape({
      endpoint: PropTypes.string,
      host: PropTypes.string,
      parameter: PropTypes.string
    })
  }),
  value: PropTypes.arrayOf(PropTypes.shape({}))
}

export default CustomAsyncMultiSelectWidget
