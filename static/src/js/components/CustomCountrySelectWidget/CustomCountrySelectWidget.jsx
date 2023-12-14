import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { startCase } from 'lodash'
import countryList from 'react-select-country-list'

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
  onChange,
  required,
  uiSchema,
  value
}) => {
  // Pull the data from countryList once
  const countryData = useMemo(() => countryList().getData(), [])

  // Returns country for given country label and country list
  const getSelectOption = (list, aValue) => list.filter((item) => (item.value === aValue))[0]

  // Removes a country from the country list
  const remove = (list, aValue) => list.filter((item) => (item.value !== aValue))

  // Returns first country from the country list
  const getInitialCountrySelection = () => {
    const [selected] = countryData.filter((item) => (item.value === value))

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
    onChange(val.value)
  }

  // Handles country select event
  const handleChange = (val) => {
    selectCountry(val || {
      label: '',
      value: ''
    })
  }

  // Uses label for title
  let title = startCase(label.split(/-/)[0])

  // Uses 'ui:title from uiSchema if given'
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  return (
    <div>
      <div>
        <span>
          {title}
        </span>

        <span>
          {/* // TODO This should be an icon */}
          {required ? '*' : ''}
        </span>
      </div>

      <div>
        <Select
          id={id}
          isClearable
          name={`Select-${label}`}
          onChange={handleChange}
          options={listOfCountries}
          placeholder={`Select ${label}`}
          value={selectedCountry}
        />
      </div>
    </div>
  )
}

CustomCountrySelectWidget.defaultProps = {
  label: null,
  value: null
}

CustomCountrySelectWidget.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.string
}

export default CustomCountrySelectWidget
