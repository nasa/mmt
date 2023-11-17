import React from 'react'
import PropTypes from 'prop-types'

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
              {required ? <i className="eui-icon eui-required-o required-icon" /> : ''}
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
