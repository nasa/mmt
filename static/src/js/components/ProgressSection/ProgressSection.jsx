import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'
import { kebabCase, toLower } from 'lodash'

import ProgressField from '../ProgressField/ProgressField'
import For from '../For/For'

import progressCircleTypes from '../../constants/progressCircleTypes'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'

import './ProgressSection.scss'

/**
 * @typedef {Object} ProgressSectionProps
 * @property {String} displayName Name of the form section.
 * @property {Array} fields List of fields within the form section.
 * @property {Object} status Status of the form section being displayed.
 */

/**
 * Renders a ProgressSection component
 *
 * @component
 * @example <caption>Render a ProgressSection</caption>
 * return (
 *   <ProgressSection
 *      displayName={displayName}
 *      fields={fields}
 *      status={status}
 *   />
 * )
 */
const ProgressSection = ({
  displayName,
  fields,
  status
}) => {
  const navigate = useNavigate()

  // Progress circle icons for the form section
  const progressSectionIcon = () => {
    switch (status) {
      case progressCircleTypes.Pass:
        return (
          <i
            className="eui-icon eui-check progress-section__section-icon--pass-circle"
            role="img"
            aria-label={displayName}
          />
        )
      case progressCircleTypes.NotStarted:
      case progressCircleTypes.Error:
      case progressCircleTypes.Invalid:
        return (
          <i
            className="eui-icon eui-fa-circle-o progress-section__section-icon--invalid-circle"
            role="img"
            aria-label={displayName}
          />
        )
      default:
        return (
          <span>Status Unknown</span>
        )
    }
  }

  // Handle clicking on a section
  const handleSectionClick = () => {
    navigate(`${kebabCase(toLower(displayName))}`)
  }

  // Accessible event props for clicking on the form section
  const accessibleEventProps = useAccessibleEvent((event) => {
    handleSectionClick(event)
  })

  return (
    <div key={JSON.stringify(fields)}>
      <div className="progress-section__section-circle">
        {progressSectionIcon()}
      </div>

      <div>
        <div
          className="progress-section__section-label"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...accessibleEventProps}
        >
          {displayName}
        </div>

        <div>
          <For each={fields}>
            {
              (field, index) => (
                <span key={`${JSON.stringify(field)}-${index}`}>
                  <ProgressField
                    fieldInfo={field}
                    formName={displayName}
                  />
                </span>
              )
            }
          </For>
        </div>
      </div>
    </div>
  )
}

ProgressSection.propTypes = {
  displayName: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  status: PropTypes.string.isRequired
}

export default ProgressSection
