import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'
import { kebabCase, toLower } from 'lodash'

import progressCircleTypes from '../../constants/progressCircleTypes'

import './ProgressField.scss'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'

/**
 * @typedef {Object} ProgressFieldProps
 * @property {Object} fieldInfo Status of the field being displayed.
 */

/**
 * Renders a ProgressField component
 *
 * @component
 * @example <caption>Render a ProgressField</caption>
 * return (
 *   <ProgressField
 *      fieldInfo={fieldInfo}
 *   />
 * )
 */
const ProgressField = ({
  fieldInfo,
  formName
}) => {
  const navigate = useNavigate()

  const {
    fieldName,
    message,
    isRequired,
    status
  } = fieldInfo

  // Progress circle icons for the form field
  const progressIcon = () => {
    // TODO change these icons to have tooltips instead of tiles
    switch (status) {
      case progressCircleTypes.Invalid:
        return (
          <i
            title={message}
            className="eui-icon eui-fa-minus-circle progress-field__icon--invalid-circle"
            role="img"
            aria-label={message}
          />
        )

      case progressCircleTypes.NotStarted:
        if (isRequired) {
          return (
            <i
              title={message}
              className="eui-icon eui-required-o progress-field__icon--not-started-required-circle"
              role="img"
              aria-label={message}
            />
          )
        }

        return (
          <i
            title={fieldName}
            className="eui-icon eui-fa-circle-o progress-field__icon--not-started-not-required-circle"
            role="img"
            aria-label={fieldName}
          />
        )

      case progressCircleTypes.Pass:
        if (isRequired) {
          return (
            <i
              title={`${fieldName} - Required field complete`}
              className="eui-icon eui-required icon-green progress-field__icon--pass-required-circle"
              role="img"
              aria-label={`${fieldName} - Required field complete`}
            />
          )
        }

        return (
          <i
            title={message}
            className="eui-icon eui-fa-circle icon-grey progress-field__icon--pass-not-required-circle"
            role="img"
            aria-label={message}
          />
        )

      case progressCircleTypes.Error:
        return (
          <i
            title={message}
            className="eui-icon eui-fa-minus-circle progress-field__icon--error-circle"
            role="img"
            aria-label={message}
          />
        )

      default:
        return (
          <span>Status Unknown</span>
        )
    }
  }

  // Handle clicking on a field icon
  const handleCircleClick = () => {
    // TODO navigate to form field
    // console.log(`Navigate to ${formName} - ${fieldName}`)
    navigate(`${kebabCase(toLower(formName))}/${fieldName}`)
  }

  // Accessible event props for clicking on the form field icon
  const accessibleEventProps = useAccessibleEvent((event) => {
    handleCircleClick(event)
  })

  return (
    <span
      className="progress-field__field-circle"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...accessibleEventProps}
    >
      {progressIcon()}
    </span>
  )
}

ProgressField.propTypes = {
  fieldInfo: PropTypes.shape({
    fieldName: PropTypes.string,
    message: PropTypes.string,
    isRequired: PropTypes.bool,
    status: PropTypes.string
  }).isRequired,
  formName: PropTypes.string.isRequired
}

export default ProgressField
