import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import fetchCmrKeywords from '../../utils/fetchCmrKeywords'
import getKeywords from '../../utils/getKeywords'
import './DataCenterField.scss'
import '../CustomWidgetWrapper/CustomWidgetWrapper.scss'

/** A Data Center ShortName/LongName picker.
 *
 * @typedef {Object} DataCenterField
 * @property {Function} onChange A callback function triggered when the user picks a ShortName.
 * @property {Object} formData The current { ShortName, LongName } value.
 */
const DataCenterField = ({ onChange, formData }) => {
  const shortName = formData?.ShortName || ''
  const longName = formData?.LongName || ''
  const [loading, setLoading] = useState(false)
  const [shortNames, setShortNames] = useState([])
  const [providersResponse, setProvidersResponse] = useState(null)
  const [showMenu, setShowMenu] = useState(false)
  const [shouldFocus, setShouldFocus] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const response = await fetchCmrKeywords('providers')
      const names = getKeywords(response, 'short_name', {}, ['short_name']).sort()

      setProvidersResponse(response)
      setShortNames(names)
      setLoading(false)
    }

    fetchData()
  }, [])

  const onHandleMouseDown = (value) => {
    setShowMenu(false)
    setShouldFocus(false)

    const [matchedLongName = ''] = getKeywords(
      providersResponse,
      'long_name',
      { short_name: value },
      ['short_name', 'long_name']
    )

    onChange({
      ShortName: value,
      LongName: matchedLongName
    })
  }

  const onHandleFocus = () => {
    setShowMenu(true)
    setShouldFocus(true)
  }

  const onHandleBlur = () => {
    setShowMenu(false)
    setShouldFocus(false)
  }

  const onHandleClear = () => {
    setShowMenu(false)
    setShouldFocus(false)

    onChange({
      ShortName: '',
      LongName: ''
    })
  }

  const displaySelectOption = (value) => (
    <button
      type="button"
      className="data-center-field-select-option"
      onMouseDown={() => onHandleMouseDown(value)}
    >
      {value}
    </button>
  )

  const displayClearOption = () => (
    <button
      type="button"
      className="data-center-field-clear-option"
      onClick={onHandleClear}
    >
      Clear Short Name
    </button>
  )

  const existingValue = {
    value: shortName,
    label: shortName
  }

  const selectOptions = [{
    value: '',
    label: ''
  }, ...shortNames.map((currentEnum) => ({
    value: currentEnum,
    label: currentEnum
  }))]

  const Option = ({ ...data }) => {
    if (!data.value) {
      return displayClearOption()
    }

    return displaySelectOption(data.value)
  }

  return (
    <div className="data-center-field mb-4">
      {/* Short Name field */}
      <span className="custom-widget-wrapper__label text-gray-700">Short Name</span>
      <i className="eui-icon eui-required-o text-success required-icon ms-2" />
      <div className="mt-1">
        <Select
          id="dataCenterShortName"
          key={`data-center_short-name--${shouldFocus}`}
          autoFocus={shouldFocus}
          placeholder="Select Short Name"
          options={selectOptions}
          isLoading={loading}
          components={{ Option }}
          value={existingValue.value ? existingValue : null}
          onFocus={onHandleFocus}
          onBlur={onHandleBlur}
          menuIsOpen={showMenu}
        />
      </div>

      {/* Long Name field */}
      <div className="mt-2">
        <span className="custom-widget-wrapper__label text-gray-700">Long Name</span>
        <input
          className="data-center-field-text-field"
          name="longName"
          placeholder="No available Long Name"
          disabled
          value={longName}
        />
      </div>
    </div>
  )
}

DataCenterField.defaultProps = {
  formData: {}
}

DataCenterField.propTypes = {
  formData: PropTypes.shape({
    ShortName: PropTypes.string,
    LongName: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired
}

export default DataCenterField
