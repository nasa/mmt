import { WidgetProps } from '@rjsf/utils'
import _, { kebabCase } from 'lodash'
import React from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import './Widget.css'

interface CustomCountrySelectWidgetProps extends WidgetProps {
  label: string,
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
  constructor(props: CustomCountrySelectWidgetProps) {
    super(props)
    const { value } = props
    let list = countryList().getData()
    const unitedStates = this.getSelectOption(list, 'US')
    list = this.remove(list, unitedStates.value)
    list.unshift(unitedStates)
    list.unshift({ value: null, label: '✓' })
    const selected = countryList().getData().filter((item) => (item.value === value))[0]
    this.state = { country: selected, filterOptions: list }
    this.onHandleChange = this.onHandleChange.bind(this)
  }

  onHandleChange(val: SelectOptions) {
    this.selectCountry(val)
  }

  getSelectOption(list: SelectOptions[], value: string) {
    return list.filter((item: SelectOptions) => (item.value === value))[0]
  }

  remove(list: SelectOptions[], value: string) {
    return list.filter((item) => (item.value !== value))
  }

  selectCountry(val: SelectOptions) {
    const { onChange } = this.props
    this.setState({ country: val })
    onChange(val.value)
  }

  render() {
    const {
      label, required, id, uiSchema = {}
    } = this.props
    let title = _.startCase(label.split(/-/)[0])
    const { country, filterOptions } = this.state

    if (uiSchema['ui:title']) {
      title = uiSchema['ui:title']
    }

    return (

      <div className="country-select-widget" data-testid={`country-select-widget__${kebabCase(label)}`}>
        <div className="field-label-box">
          <span className="metadata-editor-field-label" data-testid={`country-select-widget__${kebabCase(label)}--title`}>
            {title}
          </span>
          <span>
            {required ? '*' : ''}
          </span>
        </div>
        <div data-testid={`country-select-widget__${kebabCase(label)}--selector`}>
          <Select
            id={id}
            data-testid={`country-select-widget__${kebabCase(label)}--select`}
            name={`Select-${label}`}
            placeholder={`Select ${label}`}
            options={filterOptions}
            onChange={this.onHandleChange}
            value={country}
          />
        </div>
      </div>
    )
  }
}

export default CustomCountrySelectWidget
