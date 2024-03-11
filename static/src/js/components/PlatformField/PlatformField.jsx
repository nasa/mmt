import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

/** This is custom field found with Collections >> acquisitionInformation
 *
 * @typedef {Object} PlatformField
 * @property {Boolean} loading
 * @property {Function} onChange
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */
const PlatformField = ({
  formData,
  registry,
  onChange,
  uiSchema
}) => {
  const { Type = '', ShortName = '', LongName = '' } = formData
  const [longNameMap, setLongNameMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [shouldFocus, setShouldFocus] = useState(false)
  const [typeState, setTypeState] = useState(Type)
  const [shortNameState, setShortNameState] = useState(ShortName)
  const [longNameState, setLongNameState] = useState(LongName)
  const [selectOptions, setSelectOptions] = useState([])

  const existingValue = {
    value: shortNameState,
    label: shortNameState
  }

  // UseEffect(() => {
  //   const controlled = uiSchema['ui:controlled'] || {}
  //   const { name, controlName } = controlled
  //   if (name && controlName) {
  //     setLoading(true)
  //     service.fetchCmrKeywords(name).then((keywords) => {
  //       const paths = parseCmrResponse(keywords, controlName)
  //       const newPaths = []
  //       // Creating a '>' delimiter map for the platform keywords.
  //       // For example: if the values from the parseCmrResponse are
  //       //                basis="Air-based Platform",
  //       //                Category="Jet", shortName="A340-600"
  //       //                LongName="Airbus A340-600"
  //       // the '>' delimited path would for this case would be
  //       //                Air-based Platforms>Jet>A340-600>Airbus A340-600
  //       // This path is being used in the render to display the Short Names (A340-600)
  //       // and based on the selected Short Name it will auto populate the Type (JET)
  //       // and Long Name (Airbus A340-600) field
  //       paths.forEach((path) => {
  //         let newPath = ''
  //         path.forEach((value, index) => {
  //           newPath += `>${value}`
  //           if (index === 3) {
  //             longNameMap[path[2]] = value
  //           }

  //           if (!newPaths.includes(newPath.slice(1))) {
  //             newPaths.push(newPath.slice(1))
  //           }
  //         })
  //       })

  //       setLoading(false)
  //       setKeyword(newPaths)
  //     })
  //       .catch(() => {
  //         const { formContext } = registry
  //         const { editor } = formContext
  //         setLoading(false)
  //         // editor.status = new Status('warning', `Error retrieving ${name} keywords`)
  //       })
  //   }
  // }, [])

  const onHandleMouseDown = (values) => {
    console.log('clicked')
    const [type, shortName] = values
    const longName = longNameMap[shortName] || ''

    const data = {
      Type: type,
      ShortName: shortName,
      LongName: longName
    }

    // OnChange(data)
    // if (longName === '') {
    //   this.setState({ longName: 'No available Long Name' })
    // }
  }

  const onHandleFocus = () => {
    setShowMenu(true)
    setShouldFocus(true)
  }

  const onHandleBlur = () => {
    setShowMenu(true),
    setShouldFocus(false)
  }

  const onHandleClear = () => {
    setTypeState('')
    setShortNameState('')
    setLongNameState('')
    setShowMenu(false)
    setShouldFocus(false)
    onChange(null)
  }

  const displayTitle = (value) => (
    <div
      className="platform-field-select-title"
      data-testid={`platform-field-select-title__${value}`}
    >
      {value}
    </div>
  )

  const displaySelectOption = (value) => (
    <div
      className="platform-field-select-option"
      data-testid={`platform-field-select-option__${value}`}
      onMouseDown={() => { onHandleMouseDown(value) }}
    >
      {value[1]}
    </div>
  )

  const displayClearOption = () => (
    <div
      className="platform-field-clear-option"
      data-testid="platform-field-clear-option"
      onClick={() => { onHandleClear() }}
    >
      Select Short Name
    </div>
  )

  const renderSelectOptions = () => {
    setLoading(true)
    const enums = keyword
  }

  const Option = (props) => {
    const {
      ...data
    } = props
    const paths = data.value.split('>')
    const value = paths.splice(1)
    if (paths[0] === '') {
      return (displayClearOption())
    }

    if (value.length > 2) {
      return null
    }

    if (value.length === 1) {
      return (displayTitle(value[0]))
    }

    return (displaySelectOption(value))
  }

  return (
    <div className="platform-field" data-testid="platform-field">
      HERERHERHEHRE
      {/* Short Name field */}
      {/* Short Name
      <i className="eui-icon eui-required-o required-icon" />
      <div data-testid="platform-field__short-name--selector">
        <Select
          id="shortName"
          key={`platform_short-name--${shouldFocus}`}
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
      </div> */}

      {/* Type field */}
      {/* <div style={{ marginTop: '8px' }}>
        Type
        <input
          className="platForm-field-text-field"
          data-testid="platform-field__type"
          name="type"
          placeholder="No available Type"
          disabled
          value={Type}
        />
      </div> */}

      {/* Long Name field */}
      {/* <div>
        Long Name
        <input
          className="platForm-field-text-field"
          data-testid="platform-field__long-name"
          name="longName"
          placeholder="No available Long Name"
          disabled
          value={LongName}
        />
    </div> */}
    </div>
  )
}

PlatformField.defaultProps = {

}

PlatformField.propTypes = {

}

export default PlatformField
