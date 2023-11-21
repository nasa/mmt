import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { startCase } from 'lodash'
import countryList from 'react-select-country-list'

const CustomCountrySelectWidget = ({
  label,
  value,
  required,
  id,
  uiSchema,
  onChange
}) => {
  // Returns country for given country label and country list
  const getSelectOption = (list, aValue) => list.filter((item) => (item.value === aValue))[0]
  // Removes a country from the country list
  const remove = (list, aValue) => list.filter((item) => (item.value !== aValue))
  // Returns first country from the country list
  const getInitialCountrySelection = () => {
    const [selected] = countryList().getData().filter((item) => (item.value === value))

    return selected
  }

  // Returns initial list of countries
  const getInitialCountryList = () => {
    let cList = countryList().getData()
    const unitedStates = getSelectOption(cList, 'US')

    cList = remove(cList, unitedStates.value)
    cList.unshift(unitedStates)

    return cList
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
    selectCountry(val)
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
          {required ? '*' : ''}
        </span>
      </div>

      <div>
        <Select
          id={id}
          name={`Select-${label}`}
          placeholder={`Select ${label}`}
          options={listOfCountries}
          onChange={handleChange}
          value={selectedCountry}
          isClearable
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
  label: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default CustomCountrySelectWidget
