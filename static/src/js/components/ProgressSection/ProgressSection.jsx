import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router'

import Button from '../Button/Button'
import For from '../For/For'
import ProgressField from '../ProgressField/ProgressField'
import Button from '../Button/Button'

import progressCircleTypes from '../../constants/progressCircleTypes'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import toKebabCase from '../../utils/toKebabCase'

import toLowerKebabCase from '../../utils/toLowerKebabCase'

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

  const { templateType, id } = useParams()

  // Progress circle icons for the form section
  const progressSectionIcon = () => {
    switch (status) {
      case progressCircleTypes.Pass:
        return (
          <i
            aria-label={displayName}
            className="eui-icon eui-check progress-section__section-icon--pass-circle"
            role="img"
          />
        )
      case progressCircleTypes.NotStarted:
      case progressCircleTypes.Error:
      case progressCircleTypes.Invalid:
        return (
          <i
            aria-label={displayName}
            className="eui-icon eui-fa-circle-o progress-section__section-icon--invalid-circle"
            role="img"
          />
        )
      default:
        return (
          <span>Status Unknown</span>
        )
    }
  }

  // Handle clicking on a section
  const handleSectionClick = (event) => {
    if (templateType) {
      navigate(`/templates/${templateType}/${id}/${toKebabCase(displayName)}`)
    } else {
      navigate(toKebabCase(displayName))
    }

    event.stopPropagation()
  }

  // Accessible event props for clicking on the form section
  const accessibleEventProps = useAccessibleEvent((event) => {
    handleSectionClick(event)
  })

  return (
    <div
      key={displayName}
      className="progress-section p-2 rounded"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...accessibleEventProps}
    >
      <div className="progress-section__section-circle">
        {progressSectionIcon()}
      </div>

      <div className="d-flex flex-column align-items-start">
        <Button
          className="progress-section__section-label m-0 p-0 fw-bold text-decoration-none"
          naked
          variant="link"
          as="span"
        >
          {displayName}
        </Button>

        <div className="d-block">
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
