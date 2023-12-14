import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaInfoCircle } from 'react-icons/fa'
import { OverlayTrigger, Popover } from 'react-bootstrap'

import './CustomWidgetWrapper.scss'
import pluralize from 'pluralize'
import commafy from 'commafy'

/**
 * CustomWidgetWrapper
 * @typedef {Object} CustomWidgetWrapper
 * @property {Number} charsUsed Number of character used.
 * @property {String} description A description of the field.
 * @property {String} headerClassName A headerClassName defined in the uiSchema.
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
  charsUsed,
  children,
  description,
  headerClassName,
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
                <label className={`custom-widget-wrapper__label text-gray-700 ${headerClassName}`} htmlFor={id}>
                  {title}
                </label>
              )
            }
            {
              required && (
                <span>
                  <i
                    className="eui-icon eui-required-o text-success ps-1"
                    role="img"
                    aria-label="Required"
                  />
                </span>
              )
            }
          </div>
          {
            description && (
              <div className="ms-2">
                <OverlayTrigger
                  show={showHelp}
                  trigger={['hover', 'focus']}
                  placement="top"
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
                >
                  <button
                    className="custom-widget-wrapper__help focus-ring d-flex align-items-center text-primary small"
                    tabIndex={0}
                    type="button"
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
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
              {commafy(charsUsed)}
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
  description: null,
  headerClassName: null,
  maxLength: null,
  charsUsed: null
}

CustomWidgetWrapper.propTypes = {
  charsUsed: PropTypes.number,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  headerClassName: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool.isRequired,
  scrollRef: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired
}

export default CustomWidgetWrapper
