import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import fetchCmrKeywords from '../../utils/fetchCmrKeywords'
import parseCmrInstrumentsResponse from '../../utils/parseCmrInstrumentsResponse'
import './InstrumentField.scss'

/** This is custom field found with Collections >> acquisitionInformation
 *
 * @typedef {Object} InstrumentField
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} uiSchema uiSchema for the field being shown.
 * @property {Object} formData Saved Draft
 */
const InstrumentField = ({ onChange, uiSchema, formData }) => {
  const { ShortName, LongName } = formData
  const [shortName, setShortName] = useState(ShortName || '')
  const [longName, setLongName] = useState(LongName || '')
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [shouldFocus, setShouldFocus] = useState(false)
  const [longNameMap, setLongNameMap] = useState({})

  const getMapKey = (keywordObject) => {
    const {
      category = '',
      type = '',
      subtype = '',
      // eslint-disable-next-line camelcase
      short_name = ''
    } = keywordObject

    return category.concat(type).concat(subtype).concat(short_name)
  }

  useEffect(() => {
    const fetchData = async () => {
      const controlled = uiSchema['ui:controlled']
      const { name, controlName } = controlled

      setLoading(true)
      const keywordsJson = await fetchCmrKeywords(name)
      const keywordObjects = parseCmrInstrumentsResponse(keywordsJson, controlName)

      keywordObjects.forEach((keywordObj) => {
        if (keywordObj.short_name && keywordObj.long_name) {
          setLongNameMap((prevMap) => ({
            ...prevMap,
            [getMapKey(keywordObj)]: keywordObj.long_name
          }))
        }
      })

      setLoading(false)
      setKeyword(keywordObjects)
    }

    fetchData()
  }, [])

  const onHandleMouseDown = (keywordObject) => {
    const valueShortName = keywordObject.short_name
    const valueLongName = longNameMap[getMapKey(keywordObject)] || ''
    setShortName(valueShortName)
    setLongName(valueLongName)
    setShowMenu(false)
    setShouldFocus(false)

    const data = {
      ShortName: valueShortName,
      LongName: valueLongName
    }

    onChange(data)
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
    setShortName('')
    setLongName('')
    setShowMenu(false)
    setShouldFocus(false)

    const data = {
      ShortName: '',
      LongName: ''
    }
    onChange(data)
  }

  const displaySelectOption = (keywordObject) => (

    <button
      type="button"
      className="instrument-field-select-option"
      onMouseDown={() => onHandleMouseDown(keywordObject)}
    >
      {keywordObject.short_name}
    </button>

  )

  const displayClearOption = () => (
    <button
      type="button"
      className="instrument-field-clear-option"
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
  }, ...keyword.map((currentEnum) => ({
    value: currentEnum.short_name,
    label: currentEnum
  }))]

  const Option = ({ ...data }) => {
    const keywordObject = data.children

    if (!keywordObject.category) {
      return displayClearOption()
    }

    return displaySelectOption(keywordObject)
  }

  return (
    <div className="instrument-field mb-4">
      {/* Short Name field */}
      Short Name
      <i className="eui-icon eui-required-o text-success required-icon ms-2" />
      <div className="mt-1">
        <Select
          id="shortName"
          key={`instrument_short-name--${shouldFocus}`}
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
        Long Name
        <input
          className="instrument-field-text-field"
          name="longName"
          placeholder="No available Long Name"
          disabled
          value={longName}
        />
      </div>
    </div>
  )
}

InstrumentField.defaultProps = {
  formData: {}
}

InstrumentField.propTypes = {
  formData: PropTypes.shape({
    ShortName: PropTypes.string,
    LongName: PropTypes.string
  }),
  uiSchema: PropTypes.shape({
    'ui:controlled': PropTypes.shape({
      name: PropTypes.string.isRequired,
      controlName: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  }).isRequired,
  onChange: PropTypes.func.isRequired
}

export default InstrumentField
