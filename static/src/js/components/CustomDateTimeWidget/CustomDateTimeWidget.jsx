import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router'
import { startCase } from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import 'react-datepicker/dist/react-datepicker.css'

const CustomDateTimeWidget = ({
  label,
  id,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const {
    conceptId,
    sectionName,
    fieldName
  } = useParams()
  const navigate = useNavigate()
  const [date, onChangeDate] = React.useState(value ? new Date(value) : null)
  const [showDescription, setShowDescription] = useState(false)
  const [showCalender, setShowCalender] = useState(false)
  const datetimeScrollRef = useRef(null)

  const { description } = schema

  const dateWithZone = moment(date, 'America/New_York').format('YYYY-MM-DDTHH:mm:ss.SSS')
  const fieldValue = new Date(dateWithZone)

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  let title = startCase(label.split(/-/)[0])

  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  let shouldFocus = false
  if (focusField === id) {
    shouldFocus = true
  } else if (focusField && id.match(/^\w+_\d+$/)) {
    if (id !== '' && id.startsWith(focusField)) {
      shouldFocus = true
    }
  }

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      datetimeScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      setShowCalender(true)
    }
  }, [shouldFocus])

  useEffect(() => {
    if (fieldName) {
      // If a fieldName was pulled from the URL, then remove it from the URL. This will happen after the field is focused.
      navigate(`../${conceptId}/${sectionName}`, { replace: true })
    }
  }, [fieldName])

  const handleFocus = () => {
    setShowDescription(true)
    setShowCalender(true)
  }

  const handleChange = (event) => {
    // If a date is selected, this will convert the date to ISO string and set the onChange
    if (event) {
      onChangeDate(event)
      let formattedDateTime = event.toISOString()
      formattedDateTime = `${formattedDateTime.substring(0, 10)}T00:00:00.000Z`
      onChange(formattedDateTime)
    } else {
      onChange(null)
    }
  }

  const handleBlur = () => {
    setFocusField(null)

    setShowDescription(false)
    setShowCalender(false)
    onBlur(id)
  }

  return (
    <CustomWidgetWrapper
      description={showDescription ? description : null}
      label={label}
      required={required}
      title={title}
      scrollRef={datetimeScrollRef}
    >
      <DatePicker
        className="w-100 p-2"
        id={id}
        placeholderText="YYYY-MM-DDTHH:MM:SSZ"
        dateFormat="yyyy-MM-dd'T'00:00:00.000'Z'"
        dropdownMode="select"
        showMonthDropdown
        showYearDropdown
        peekNextMonth
        selected={
          value
            ? new Date(fieldValue.toLocaleString('en-US', {
              timeZone: 'GMT'
            })) : null
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        open={showCalender}
      />
    </CustomWidgetWrapper>
  )
}

CustomDateTimeWidget.defaultProps = {
  value: null
}

CustomDateTimeWidget.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string,
      setFocusField: PropTypes.func
    }).isRequired
  }).isRequired,
  required: PropTypes.bool.isRequired,
  schema: PropTypes.shape({
    description: PropTypes.string,
    maxLength: PropTypes.number
  }).isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
}

export default CustomDateTimeWidget
