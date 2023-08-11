/* eslint-disable react/jsx-no-bind */
import _, { kebabCase } from 'lodash'
import moment from 'moment'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './CustomDateTimeWidget.css'
import { WidgetProps } from '@rjsf/utils'
import { observer } from 'mobx-react'
import './Widget.css'

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

  function onHandleChange(fieldValue: Date) {
    if (fieldValue) {
      onChange(fieldValue)
      let formatedDateTime = fieldValue.toISOString()
      formatedDateTime = `${formatedDateTime.substring(0, 10)}T00:00:00.000Z`
      onFieldChange(formatedDateTime)
    } else {
      onFieldChange(null)
    }
  }
  function onHandleFocus() { setDescription(true) }
  function onHandleBlur() { /* istanbul ignore next */ setDescription(false) }

  return (
    <>
      <div className="custom-date-time-widget-description" data-testid="custom-date-time-widget--description">
        <span>
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
        onFocus={onHandleFocus}
        onChange={onHandleChange}
        onBlur={onHandleBlur}
      />
    </>

  )
}

class CustomDateTimeWidget extends React.Component<CustomDateTimeWidgetProps, CustomDateTimeWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  render() {
    const {
      required, label, onChange, value, id, schema, registry, uiSchema = {}
    } = this.props
    let title = _.startCase(label.split(/-/)[0])
    const { formContext } = registry
    const { editor } = formContext

    if (uiSchema['ui:title']) {
      title = uiSchema['ui:title']
    }

    let focus = false
    if (editor?.focusField === id) {
      focus = true
    }
    if (focus) {
      // this.selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
      <div className="custom-date-time-widget" data-testid={`custom-date-time-widget__${kebabCase(label)}`}>
        <div className="custom-date-time-widget-label">
          <span className="metadata-editor-field-label">
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
