import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import shouldFocusField from '../../utils/shouldFocusField'

import './CustomTextWidget.scss'

/**
 * CustomTextWidget
 * @typedef {Object} CustomTextWidget
 * @property {Boolean} disable A boolean value to disable the text field.
 * @property {String} label The label of the widget.
 * @property {String} id The id of the widget.
 * @property {String} placeholder A placeholder text for the text field.
 * @property {Boolean} onBlur Should blur a field.
 * @property {Function} onChange A callback function triggered when the user inputs a text.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {Boolean} required Is the CustomSelectWidget field required
 * @property {Object} schema A UMM Schema for the widget being previewed.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 * @property {String} value A text value saved to the draft.
 */

/**
 * Renders Custom Text Widget
 * @param {CustomTextWidget} props
 */
const CustomTextWidget = ({
  disabled,
  label,
  id,
  placeholder,
  onBlur,
  onChange,
  registry,
  required,
  schema,
  uiSchema,
  value
}) => {
  const [showDescription, setShowDescription] = useState(false)
  const [charsUsed, setCharsUsed] = useState(value?.length)

  const inputScrollRef = useRef(null)
  const focusRef = useRef(null)

  const { formContext } = registry
  const {
    focusField,
    setFocusField
  } = formContext

  const { maxLength, description } = schema

  const fieldType = uiSchema['ui:type']
  const headerClassName = uiSchema['ui:header-classname']

  let title = startCase(label.split(/-/)[0])
  if (uiSchema['ui:title']) {
    title = uiSchema['ui:title']
  }

  const shouldFocus = shouldFocusField(focusField, id)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      inputScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  // Handling focusing the field
  const handleFocus = () => {
    setShowDescription(true)
  }

  // Handle the value changing in the field
  const handleChange = (event) => {
    const { value: newValue } = event.target

    if (newValue === '') {
      setCharsUsed(0)
      onChange(undefined)

      return
    }

    setCharsUsed(newValue.length)
    onChange(newValue)
  }

  // Handle the field losing focus
  const handleBlur = () => {
    setFocusField(null)

    setShowDescription(false)
    onBlur(id)
  }

  return (
    <CustomWidgetWrapper
      charsUsed={charsUsed}
      description={showDescription ? description : null}
      headerClassName={headerClassName}
      label={label}
      maxLength={maxLength}
      required={required}
      scrollRef={inputScrollRef}
      title={title}
    >
      <input
        className="custom-text-widget__input"
        defaultValue={value}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={title}
        onBlur={handleBlur}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        ref={focusRef}
        type={fieldType && fieldType === 'number' ? 'number' : 'text'}
      />
    </CustomWidgetWrapper>
  )
}

CustomTextWidget.defaultProps = {
  disabled: false,
  value: '',
  placeholder: null,
  onBlur: null
}

CustomTextWidget.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
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
    'ui:header-classname': PropTypes.string,
    'ui:title': PropTypes.string,
    'ui:type': PropTypes.string
  }).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func
}

export default CustomTextWidget
