import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaInfoCircle } from 'react-icons/fa'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import pluralize from 'pluralize'
import commafy from 'commafy'
import classNames from 'classnames'

import './CustomWidgetWrapper.scss'

/**
 * CustomWidgetWrapper
 * @typedef {Object} CustomWidgetWrapper
 * @property {Boolean} centered Optional field to edit styling when a label is centered
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
  centered,
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
    <div>
      <div
        className="mb-1"
        ref={scrollRef}
      >
        <div className={
          classNames([
            'd-flex align-items-center',
            {
              'justify-content-center': centered,
              'justify-content-between': !centered
            }
          ])
        }
        >
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
                    className="eui-icon eui-required-o text-success ps-2"
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
                    {!centered && 'Help'}
                  </button>
                </OverlayTrigger>
              </div>
            )
          }
        </div>
      </div>
      {children}
      {
        maxLength && (
          <div className="d-flex justify-content-end mt-1 small text-secondary" style={{ minHeight: '1.5rem' }}>
            <span>
              {commafy(charactersUsed)}
              /
              {commafy(maxLength)}
              {' '}
              {pluralize('character', maxLength)}
            </span>
          </div>
        )
      }
    </div>
  )
}

CustomWidgetWrapper.defaultProps = {
  centered: false,
  charactersUsed: null,
  description: null,
  maxLength: null,
  required: null,
  scrollRef: null,
  title: null
}

CustomWidgetWrapper.propTypes = {
  centered: PropTypes.bool,
  charactersUsed: PropTypes.number,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  id: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  scrollRef: PropTypes.shape({}),
  title: PropTypes.string
}

export default CustomWidgetWrapper
