import { kebabCase } from 'lodash'
import React from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'

type CustomCountrySelectWidgetProps = {
  label: string,
  options: {
    title: string
  }
  value: string,
  required: boolean,
  onChange: (value: string) => void,
}

type SelectOptions = {
  value: string,
  label: string
}

type CustomCountrySelectWidgetState = {
  country: SelectOptions
  filterOptions: SelectOptions[]
}

class CustomCountrySelectWidget extends React.Component<CustomCountrySelectWidgetProps, CustomCountrySelectWidgetState> {
  constructor(props:CustomCountrySelectWidgetProps) {
    super(props)
    const { value } = props
    let list = countryList().getData()
    const unitedStates = this.getSelectOption(list, 'US')
    list = this.remove(list, unitedStates.value)
    list.unshift(unitedStates)
    list.unshift({ value: null, label: '✓' })
    const selected = countryList().getData().filter((item) => (item.value === value))[0]
    this.state = { country: selected, filterOptions: list }
  }

  getSelectOption(list:SelectOptions[], value:string) {
    return list.filter((item:SelectOptions) => (item.value === value))[0]
  }

  remove(list:SelectOptions[], value:string) {
    return list.filter((item) => (item.value !== value))
  }

  selectCountry(val: SelectOptions) {
    const { onChange } = this.props
    this.setState({ country: val })
    onChange(val.value)
  }

  render() {
    const { label, options, required } = this.props
    const { title = label } = options
    const { country, filterOptions } = this.state

    return (

      <div className="country-select-widget" data-testid={`country-select-widget__${kebabCase(label)}`}>
        <div>
          <span data-testid={`country-select-widget__${kebabCase(label)}--title`}>
            {title ?? 'Values'}
            {required ? '*' : ''}
          </span>
        </div>
        <div data-testid={`country-select-widget__${kebabCase(label)}--selector`}>
          <Select
            data-testid={`country-select-widget__${kebabCase(label)}--select`}
            name={`Select-${label}`}
            placeholder={`Select ${label}`}
            options={filterOptions}
            onChange={(val:SelectOptions) => this.selectCountry(val)}
            value={country}
          />
        </div>
      </div>
    )
  }
}

export default CustomCountrySelectWidget
