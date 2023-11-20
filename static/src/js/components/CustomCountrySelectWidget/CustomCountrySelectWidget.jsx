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
  const getSelectOption = (list, aValue) => list.filter((item) => (item.value === aValue))[0]
  const remove = (list, aValue) => list.filter((item) => (item.value !== aValue))

  const getInitialCountrySelection = () => {
    const [selected] = countryList().getData().filter((item) => (item.value === value))

    return selected
  }

  const getInitialCountryList = () => {
    let cList = countryList().getData()
    const unitedStates = getSelectOption(cList, 'US')

    cList = remove(cList, unitedStates.value)
    cList.unshift(unitedStates)
    cList.unshift({
      value: null,
      label: '✓'
    })

    return cList
  }

  const [selectedCountry, setSelectedCountry] = useState(getInitialCountrySelection())
  const [listOfCountries] = useState(getInitialCountryList())

  const selectCountry = (val) => {
    setSelectedCountry(val)
    onChange(val.value)
  }

  const handleChange = (val) => {
    selectCountry(val)
  }

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  return (
    <div>
      <div className="field-label-box">
        <span className="metadata-editor-field-label">
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
