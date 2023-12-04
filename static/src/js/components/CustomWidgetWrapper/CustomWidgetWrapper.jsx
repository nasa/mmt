import React from 'react'
import PropTypes from 'prop-types'

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
  descriptionPlacement,
  headerClassName,
  maxLength,
  required,
  scrollRef,
  title
}) => {
  const descriptionBody = (
    <span className="fs-6 fst-italic">
      {description}
    </span>
  )

  return (
    <>
      <div
        className="d-flex justify-content-between pb-2"
        ref={scrollRef}
      >
        {
          title && (
            <div>
              <span className={headerClassName}>
                {title}
              </span>

              <span>
                {
                  required && (
                    <i
                      className="eui-icon eui-required-o text-success ps-1"
                      role="img"
                      aria-label="Required"
                    />
                  )
                }
              </span>
            </div>
          )
        }
        {
          maxLength && (
            <span>
              {charsUsed}
              /
              {maxLength}
            </span>
          )
        }
      </div>

      {descriptionPlacement === 'top' && descriptionBody}

      {children}

      {descriptionPlacement === 'bottom' && descriptionBody}
    </>
  )
}

CustomWidgetWrapper.defaultProps = {
  description: null,
  descriptionPlacement: 'bottom',
  headerClassName: null,
  maxLength: null,
  charsUsed: null
}

CustomWidgetWrapper.propTypes = {
  charsUsed: PropTypes.number,
  children: PropTypes.node.isRequired,
  description: PropTypes.string,
  descriptionPlacement: PropTypes.string,
  headerClassName: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool.isRequired,
  scrollRef: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired
}

export default CustomWidgetWrapper
