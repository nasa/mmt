import { kebabCase } from 'lodash'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CustomDateTimeWidget.css'
import { WidgetProps } from '@rjsf/utils'
import { observer } from 'mobx-react'
import MetadataEditor from '../../MetadataEditor'

interface props {
  onFieldChange: (value: string) => void,
  value: string,
  autoFocus: boolean,
  id: string,
  schema: {
    description: string
  }
}

interface CustomDateTimeWidgetProps extends WidgetProps {
  options: {
    title?: string,
    editor?: MetadataEditor
  }
  label: string,
  required: boolean,
  onChange: (value: string) => void,
  value: string;
  schema: {
    description: string
  }
}
type CustomDateTimeWidgetState = {
  shouldFocus: boolean
}
const CustomWidget = ({
  onFieldChange, value, autoFocus, id, schema
}: props) => {
  const [date, onChange] = React.useState(value ? new Date(value) : null)
  const [showDescription, setDescription] = React.useState(false)

  const dateWithZone = moment(date, 'America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSS')
  const fieldValue = new Date(dateWithZone)

  return (
    <>
      <div className="custom-date-time-widget-description" style={{ paddingLeft: '5px' }} data-testid="custom-date-time-widget--description">
        <span style={{ fontStyle: 'italic', fontSize: '.85rem' }}>
          {showDescription ? schema.description : ''}
        </span>
      </div>
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
        onFocus={() => { setDescription(true) }}
        onBlur={() => { setDescription(false) }}
      />
    </>

  )
}

class CustomDateTimeWidget extends React.Component<CustomDateTimeWidgetProps, CustomDateTimeWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps: { options: { editor: MetadataEditor } }
  render() {
    const {
      required, label, onChange, value, options = {}, id, schema
    } = this.props
    const { title = label, editor } = options

    let focus = false
    if (editor?.focusField === id) {
      focus = true
    }

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
            key={`${id}_${editor?.focusField}`}
            id={id}
            value={value}
            onFieldChange={(value: string) => {
              onChange(value)
            }}
            autoFocus={focus}
            schema={schema}
          />
        </div>
      </div>
    )
  }
}
export default observer(CustomDateTimeWidget)
