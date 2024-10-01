import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { startCase } from 'lodash-es'
import countryList from 'react-select-country-list'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'
import shouldFocusField from '../../utils/shouldFocusField'

/**
 * CustomCountrySelectWidget
 * @typedef {Object} CustomCountrySelectWidget
 * @property {String} label A label of the widget.
 * @property {String} value A country saved to the draft.
 * @property {Boolean} required Is the CustomCountrySelectWidget field required
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {Function} onChange A callback function triggered when the user selects a option.
 */

/**
 * Renders Custom Country Select Widget
 * @param {CustomCountrySelectWidget} props
 */
const CustomCountrySelectWidget = ({
  id,
  label,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { description } = schema

  const { formContext } = registry

  const {
    focusField,
    setFocusField
  } = formContext

  // Pull the data from countryList once
  const countryData = useMemo(() => countryList().getData(), [])

  // Returns country for given country label and country list
  const getSelectOption = (list, aValue) => list.filter((item) => (item.value === aValue))[0]

  // Removes a country from the country list
  const remove = (list, aValue) => list.filter((item) => (item.value !== aValue))

  // Returns first country from the country list
  const getInitialCountrySelection = () => {
    const [selected] = countryData.filter((item) => (item.label === value || item.value === value))

    return selected
  }

  // Returns initial list of countries
  const getInitialCountryList = () => {
    let list = countryData
    const unitedStates = getSelectOption(list, 'US')

    list = remove(list, unitedStates.value)
    list.unshift(unitedStates)

    return list
  }

  // State hook for selectedCountry
  const [selectedCountry, setSelectedCountry] = useState(getInitialCountrySelection())

  // State hook for list of countries
  const [listOfCountries] = useState(getInitialCountryList())

  // Selects a country and propagates onChange
  const selectCountry = (val) => {
    setSelectedCountry(val)
    onChange(val.label)
  }

  // Handles country select event
  const handleChange = (val) => {
    selectCountry(val || {
      label: '',
      value: ''
    })
  }

  const handleBlur = () => {
    setFocusField(null)
    onBlur(id)
  }

  // Uses label for title
  let title = startCase(label.split(/-/)[0])

  // Uses 'ui:title from uiSchema if given'
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  return (
    <CustomWidgetWrapper
      description={description}
      id={id}
      label={label}
      required={required}
      scrollRef={selectScrollRef}
      title={title}
    >
      <Select
        id={id}
        isClearable
        name={`Select-${label}`}
        onBlur={handleBlur}
        onChange={handleChange}
        options={listOfCountries}
        placeholder={`Select ${label}`}
        ref={focusRef}
        value={selectedCountry}
      />
    </CustomWidgetWrapper>
  )
}

CustomCountrySelectWidget.defaultProps = {
  label: null,
  value: null
}

CustomCountrySelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.string
}

export default CustomCountrySelectWidget
