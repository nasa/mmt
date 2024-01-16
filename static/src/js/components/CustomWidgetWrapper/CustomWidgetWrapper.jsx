import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaInfoCircle } from 'react-icons/fa'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import pluralize from 'pluralize'
import commafy from 'commafy'

import './CustomWidgetWrapper.scss'

/**
 * CustomWidgetWrapper
 * @typedef {Object} CustomWidgetWrapper
 * @property {Number} charactersUsed Number of character used.
 * @property {ReactNode} children The widget content.
 * @property {String} description A description of the field.
 * @property {String} id The id of the widget.
 * @property {Number} maxLength Max number of character defined for a field in the schema.
 * @property {Boolean} required Is the field required.
 * @property {HTMLDivElement} scrollRef A ref to scroll to.
 * @property {String} title A title of the field.
 */

/**
 * Renders Custom Widget Wrapper
 * @param {CustomWidgetWrapper} props
 */
const CustomWidgetWrapper = ({
  charactersUsed,
  children,
  description,
  id,
  maxLength,
  required,
  scrollRef,
  title
}) => {
  const [showHelp, setShowHelp] = useState(false)

  const handleOnMouseEnter = () => {
    setShowHelp(true)
  }

  const handleOnMouseLeave = () => {
    setShowHelp(false)
  }

  return (
    <>
      <div
        className="mb-1"
        ref={scrollRef}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            {
              title && (
                <label
                  className="custom-widget-wrapper__label text-gray-700"
                  htmlFor={id}
                >
                  {title}
                </label>
              )
            }
            {
              required && (
                <span>
                  <i
                    aria-label="Required"
                    className="eui-icon eui-required-o text-success ps-1"
                    role="img"
                  />
                </span>
              )
            }
          </div>
          {
            description && (
              <div className="ms-2">
                <OverlayTrigger
                  overlay={
                    (
                      <Popover
                        id={`help-test_${title}`}
                        onMouseEnter={handleOnMouseEnter}
                        onMouseLeave={handleOnMouseLeave}
                      >
                        <Popover.Header>{title}</Popover.Header>
                        <Popover.Body>
                          {/* TODO look at the description for urls and make them clickable */}
                          {description}
                        </Popover.Body>
                      </Popover>
                    )
                  }
                  placement="top"
                  show={showHelp}
                  trigger={['hover', 'focus']}
                >
                  <button
                    className="custom-widget-wrapper__help focus-ring d-flex align-items-center text-primary small"
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                    tabIndex={0}
                    type="button"
                  >
                    <FaInfoCircle className="me-1" />
                    Help
                  </button>
                </OverlayTrigger>
              </div>
            )
          }
        </div>
      </div>
      {children}

      <div className="d-flex justify-content-end mt-1 small text-secondary" style={{ minHeight: '1.5rem' }}>
        {
          maxLength && (
            <span>
              {commafy(charactersUsed)}
              /
              {commafy(maxLength)}
              {' '}
              {pluralize('character', maxLength)}
            </span>
          )
        }
      </div>

    </>
  )
}

CustomWidgetWrapper.defaultProps = {
  charactersUsed: null,
  description: null,
  maxLength: null
}

CustomWidgetWrapper.propTypes = {
  charactersUsed: PropTypes.number,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  required: PropTypes.bool.isRequired,
  scrollRef: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired
}

export default CustomWidgetWrapper
