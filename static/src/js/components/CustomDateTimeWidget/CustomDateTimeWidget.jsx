import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import enGB from 'date-fns/locale/en-GB'
import { toZonedTime, fromZonedTime } from 'date-fns-tz'

import shouldFocusField from '../../utils/shouldFocusField'
import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

/**
 * CustomDateTimeWidget
 * @typedef {Object} CustomDateTimeWidget
 * @property {Boolean} disable Should disable a field.
 * @property {String} id The id of the widget.
 * @property {String} label The label of the widget.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user selects a date.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomDateTimeWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A Date value saved to the draft.
 */

/**
 * Renders CustomDateTimeWidget
 * @param {CustomDateTimeWidget} props
 */
const CustomDateTimeWidget = ({
  disabled,
  id,
  label,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const [showCalender, setShowCalender] = useState(false)
  const datetimeScrollRef = useRef(null)

  const { description } = schema

  // Greenwich, UK, is located in the Greenwich Mean Time (GMT) zone,
  registerLocale('en-GB', enGB)

  // Parse as a GMT date, as the DatePicker is configured to work in GMT
  // Get a date/time representing local time in a given time zone from the UTC date
  const fieldValue = value ? toZonedTime(value, 'GMT') : null

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  let title = startCase(label.split(/-/)[0])

  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  const handleFocus = () => {
    setShowCalender(true)
  }

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      datetimeScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      handleFocus()
    }
  }, [shouldFocus])

  const handleBlur = () => {
    setFocusField(null)
    setShowCalender(false)
    onBlur(id)
  }

  const handleChange = (newDate) => {
    // Get the UTC date/time from a date representing local time in a given time zone
    const formattedDateTime = fromZonedTime(newDate, 'GMT').toISOString()
    onChange(formattedDateTime)

    handleBlur()
  }

  return (
    <CustomWidgetWrapper
      description={description}
      label={label}
      id={id}
      required={required}
      scrollRef={datetimeScrollRef}
      title={title}
    >
      <DatePicker
        className="w-100 p-2 form-control"
        disabled={disabled}
        dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        dropdownMode="select"
        id={id}
        locale="en-GB" // Use the UK locale, located in the Greenwich Mean Time (GMT) zone,
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        open={showCalender}
        peekNextMonth
        placeholderText="YYYY-MM-DDTHH:MM:SSZ"
        wrapperClassName="d-block"
        selected={fieldValue}
        showMonthDropdown
        showYearDropdown
        showTimeSelect
        timeIntervals={1}
      />
    </CustomWidgetWrapper>
  )
}

CustomDateTimeWidget.defaultProps = {
  disabled: false,
  value: null
}

CustomDateTimeWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
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
  value: PropTypes.string
}

export default CustomDateTimeWidget
