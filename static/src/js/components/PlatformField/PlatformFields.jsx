import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
// Import Status from '../../model/Status'
import parseCmrResponse from '../../utils/parseCmrResponse'
import './PlatformField.scss'

class PlatformField extends React.Component {
  constructor(props) {
    super(props)
    const { formData } = this.props
    this.state = {
      loading: false,
      type: formData?.Type || '',
      shortName: formData?.ShortName || '',
      longName: formData?.LongName || '',
      keyword: [],
      showMenu: false,
      shouldFocus: false
    }

    this.onHandleMouseDown = this.onHandleMouseDown.bind(this)
    this.onHandleFocus = this.onHandleFocus.bind(this)
    this.onHandleBlur = this.onHandleBlur.bind(this)
    this.onHandleClear = this.onHandleClear.bind(this)
  }

  componentDidMount() {
    const { uiSchema = {} } = this.props
    const service = uiSchema['ui:service']
    const controlled = uiSchema['ui:controlled'] || {}
    const { name, controlName } = controlled
    if (name && controlName) {
      this.setState({ loading: true }, () => {
        service.fetchCmrKeywords(name).then((keywords) => {
          const paths = parseCmrResponse(keywords, controlName)
          const newPaths = []
          paths.forEach((path) => {
            let newPath = ''
            path.forEach((value, index) => {
              newPath += `>${value}`
              if (index === 3) {
                this.longNameMap[path[2]] = value
              }

              if (!newPaths.includes(newPath.slice(1))) {
                newPaths.push(newPath.slice(1))
              }
            })
          })

          this.setState({
            loading: false,
            keyword: newPaths
          })
        })
          .catch(() => {
            const { registry } = this.props
            const { formContext } = registry
            const { editor } = formContext
            this.setState({ loading: false })
            editor.status = new Status('warning', `Error retrieving ${name} keywords`)
          })
      })
    }
  }

  onHandleMouseDown(values) {
    const { onChange } = this.props
    const [type, shortName] = values
    const longName = this.longNameMap[shortName] || ''
    this.setState({
      type,
      shortName,
      longName,
      showMenu: false,
      shouldFocus: false
    })

    const data = {
      Type: type,
      ShortName: shortName,
      LongName: longName
    }
    onChange(data)
    if (longName === '') {
      this.setState({ longName: 'No available Long Name' })
    }
  }

  onHandleFocus() {
    this.setState({
      showMenu: true,
      shouldFocus: true
    })
  }

  onHandleBlur() {
    this.setState({
      showMenu: false,
      shouldFocus: false
    })
  }

  onHandleClear() {
    const { onChange } = this.props
    this.setState({
      type: '',
      shortName: '',
      longName: '',
      showMenu: false,
      shouldFocus: false
    })

    onChange(null)
  }

  displayTitle(value) {
    return (
      <div
        className="platform-field-select-title"
        data-testid={`platform-field-select-title__${value}`}
      >
        {value}
      </div>
    )
  }

  displaySelectOption(value) {
    return (
      <div
        className="platform-field-select-option"
        data-testid={`platform-field-select-option__${value}`}
        onMouseDown={() => { this.onHandleMouseDown(value) }}
      >
        {value[1]}
      </div>
    )
  }

  displayClearOption() {
    return (
      <div
        className="platform-field-clear-option"
        data-testid="platform-field-clear-option"
        onClick={() => { this.onHandleClear() }}
      >
        Select Short Name
      </div>
    )
  }

  render() {
    const selectOptions = []
    const {
      loading, type, shortName, longName, keyword, showMenu, shouldFocus
    } = this.state
    const {
      isLoading = loading
    } = this.props
    const existingValue = {
      value: shortName,
      label: shortName
    }

    const enums = keyword
    selectOptions.push({
      value: '',
      label: ''
    })

    enums.forEach((currentEnum) => {
      selectOptions.push({
        value: currentEnum,
        label: currentEnum
      })
    })

    const Option = (props) => {
      const {
        ...data
      } = props
      const paths = data.value.split('>')
      const value = paths.splice(1)
      if (paths[0] === '') {
        return (this.displayClearOption())
      }

      if (value.length > 2) {
        return null
      }

      if (value.length === 1) {
        return (this.displayTitle(value[0]))
      }

      return (this.displaySelectOption(value))
    }

    return (
      <div className="platform-field" data-testid="platform-field">
        {/* Short Name field */}
        Short Name
        <i className="eui-icon eui-required-o required-icon" />
        <div data-testid="platform-field__short-name--selector">
          <Select
            id="shortName"
            key={`platform_short-name--${shouldFocus}`}
            autoFocus={shouldFocus}
            placeholder="Select Short Name"
            options={selectOptions}
            isLoading={isLoading}
            components={{ Option }}
            value={existingValue.value ? existingValue : null}
            onFocus={this.onHandleFocus}
            onBlur={this.onHandleBlur}
            menuIsOpen={showMenu}
          />
        </div>

        {/* Type field */}
        <div style={{ marginTop: '8px' }}>
          Type
          <input
            className="platForm-field-text-field"
            data-testid="platform-field__type"
            name="type"
            placeholder="No available Type"
            disabled
            value={type}
          />
        </div>

        {/* Long Name field */}
        <div>
          Long Name
          <input
            className="platForm-field-text-field"
            data-testid="platform-field__long-name"
            name="longName"
            placeholder="No available Long Name"
            disabled
            value={longName}
          />
        </div>
      </div>
    )
  }
}

// PropTypes
PlatformField.propTypes = {
  formData: PropTypes.shape({
    Type: PropTypes.string,
    ShortName: PropTypes.string,
    LongName: PropTypes.string
  }),
  uiSchema: PropTypes.shape({
    'ui:service': PropTypes.func,
    'ui:controlled': PropTypes.shape({
      name: PropTypes.string,
      controlName: PropTypes.string
    })
  }),
  registry: PropTypes.shape({
    formContext: PropTypes.object
  }),
  onChange: PropTypes.func,
  isLoading: PropTypes.bool
}

export default PlatformField
