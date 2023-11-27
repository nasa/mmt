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
  headerClassName,
  maxLength,
  required,
  scrollRef,
  title
}) => (
  <>
    <div
      className="custom-widget__header"
      ref={scrollRef}
    >
      {
        title && (
          <div className="field-label-box">
            <span className={`metadata-editor-field-label ${headerClassName}`}>
              {title}
            </span>
            <span>
              {
                required && (
                  <i className="eui-icon eui-required-o required-icon" />
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

    {children}

    <span className="custom-widget__description">
      {description}
    </span>
  </>
)

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
