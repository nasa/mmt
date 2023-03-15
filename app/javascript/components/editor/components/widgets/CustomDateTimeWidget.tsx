import { kebabCase } from 'lodash'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CustomDateTimeWidget.css'
import { WidgetProps } from '@rjsf/utils'
import withRouter from '../withRouter'

interface props {
  onFieldChange: (value: string) => void,
  value: string,
  autoFocus: boolean,
  id: string
}

interface CustomDateTimeWidgetProps extends WidgetProps {
  options: {
    title?: string
  }
  label: string,
  required: boolean,
  onChange: (value: string) => void,
  value: string;
  router: RouterType,
}

const CustomWidget = ({
  onFieldChange, value, autoFocus, id
}: props) => {
  const [date, onChange] = React.useState(value ? new Date(value) : null)
  const dateWithZone = moment(date, 'America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSS')

  const fieldValue = new Date(dateWithZone)

  return (
    <DatePicker
      id={id}
      autoFocus={autoFocus}
      placeholderText="YYYY-MM-DDTHH:MM:SSZ"
      dateFormat="yyyy-MM-dd'T'00:00:00.000'Z'"
      dropdownMode="select"
      showMonthDropdown
      showYearDropdown
      peekNextMonth
      selected={value
        ? new Date(fieldValue.toLocaleString('en-US', {
          timeZone: 'GMT'
        })) : null}
      onChange={(fieldValue: Date) => {
        onChange(fieldValue)
        let formatedDateTime = fieldValue.toISOString()
        formatedDateTime = `${formatedDateTime.substring(0, 10)}T00:00:00.000Z`
        onFieldChange(formatedDateTime)
      }}
    />
  )
}

class CustomDateTimeWidget extends React.Component<CustomDateTimeWidgetProps, never> {
  focus(title: string, route: string) {
    const { id } = this.props
    if (title.toLowerCase() === route.replace(/_/g, ' ').toLowerCase() && id === 'root') {
      return true
    }
    return false
  }
  render() {
    const {
      required, label, onChange, value, router, options = {}, id
    } = this.props
    const { title = label } = options
    const { params } = router
    const { fieldName } = params
    return (
      <div className="custom-date-time-widget" data-testid={`custom-date-time-widget__${kebabCase(label)}`}>
        <div className="dateTimeWidgetLabel">
          <span>
            {title}
            {required ? '*' : ''}
          </span>
        </div>
        <div data-testid={`custom-date-time-widget__${kebabCase(label)}--input-field`}>
          <CustomWidget
            id={id}
            value={value}
            onFieldChange={(value: string) => {
              onChange(value)
            }}
            autoFocus={fieldName ? this.focus(label, fieldName) : false}
          />
        </div>
      </div>
    )
  }
}
export default withRouter(CustomDateTimeWidget)
