import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import moment from 'moment'
import DatePicker from 'react-datepicker'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

import 'react-datepicker/dist/react-datepicker.css'

/**
 * CustomDateTimeWidget
 * @typedef {Object} CustomDateTimeWidget
 * @property {String} label The label of the widget.
 * @property {String} id The id of the widget.
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

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      datetimeScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      setShowCalender(true)
    }
  }, [shouldFocus])

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
      descriptionPlacement="top"
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
