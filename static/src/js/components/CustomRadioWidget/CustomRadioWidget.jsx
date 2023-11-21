import React, {
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import CustomWidgetWrapper from '../CustomWidgetWrapper/CustomWidgetWrapper'

import useAccessibleEvent from '../../hooks/useAccessibleEvent'

import './CustomRadioWidget.scss'

const CustomRadioWidget = ({
  label = '',
  id,
  registry,
  required,
  schema,
  uiSchema = {},
  value
}) => {
  const selectScrollRef = useRef(null)
  const focusRef = useRef(null)
  const { formContext } = registry
  const [inputValue, setInputValue] = useState(value)
  const [componentId] = useState('custom-radio-widget')

  const {
    focusField
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
      selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
      focusRef.current?.focus()
    }
  }, [shouldFocus])

  // Sets inputValue to input selected
  const handleChange = (event) => {
    setInputValue(event.target.name)
    focusRef.current?.blur()
  }

  // Needed for this UI implementaion so that users can clear their selection
  const handleClear = () => {
    setInputValue(null)
  }

  // Accessible event props for clicking on the form field icon
  const accessibleEventProps = useAccessibleEvent((event) => {
    handleClear(event)
  })

  return (
    <CustomWidgetWrapper
      label={label}
      description={schema.description}
      scrollRef={selectScrollRef}
      required={required}
      title={title}
    >
      <div className="custom-radio-widget" data-testid={`${componentId}`}>
        <div className="custom-radio-widget-clear-btn" data-testid={`${componentId}--clear-btn`} onClick={handleClear} role="presentation">
          Clear
        </div>

        <input
          type="radio"
          name="true"
          id={id}
          checked={inputValue === 'true'}
          onChange={handleChange}
          data-testid={`${componentId}--value__true`}
        />
        <label htmlFor={id}>True</label>

        <input
          type="radio"
          name="false"
          id={id}
          checked={inputValue === 'false'}
          onChange={handleChange}
          data-testid={`${componentId}--value__false`}
        />
        <label htmlFor={id}>False</label>
      </div>
    </CustomWidgetWrapper>
  )
}

CustomRadioWidget.defaultProps = {
  value: false
}

CustomRadioWidget.propTypes = {
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
    description: PropTypes.string
  }).isRequired,
  uiSchema: PropTypes.shape({
  }).isRequired,
  value: PropTypes.bool
}

export default CustomRadioWidget
