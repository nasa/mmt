import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

/**
 * CustomTitleFieldTemplate
 * @typedef {Object} CustomTitleFieldTemplate
 * @property {Boolean} required Is the field required.
 * @property {String} title The title of the field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders Custom Title Field Template
 * @param {CustomTitleFieldTemplate} props
 */
const CustomTitleFieldTemplate = ({
  required,
  title,
  uiSchema
}) => {
  const scrollRef = useRef(null)

  // Extract values or use defaults for styling classNames
  const { options = {} } = uiSchema
  const { title: uiTitle } = options

  const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
  const HeadingElement = uiSchema['ui:heading-level'] ? uiSchema['ui:heading-level'] : 'span'
  const headerBoxClassName = uiSchema['ui:header-box-classname'] ? uiSchema['ui:header-box-classname'] : 'h2-box'
  const requiredUI = uiSchema['ui:required']
  const hideHeader = uiSchema['ui:hide-header']

  // Determine the heading text based on uiTitle or formatted title
  let heading = title
  if (uiTitle) {
    heading = uiTitle
  } else {
    const [firstPart] = title.split(/-/)
    heading = startCase(firstPart)
  }

  return (
    <div>
      <div ref={scrollRef} className={headerBoxClassName}>
        {
          !hideHeader && (
            <HeadingElement className={headerClassName}>
              {heading}

              {
                (required || requiredUI) && (
                  <i
                    aria-label="Required"
                    className="eui-icon eui-required-o required-icon text-success ms-1"
                    role="img"
                    title={heading}
                  />
                )
              }
            </HeadingElement>
          )
        }
      </div>
    </div>
  )
}

CustomTitleFieldTemplate.defaultProps = {
  uiSchema: {}
}

CustomTitleFieldTemplate.propTypes = {
  required: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:header-classname': PropTypes.string,
    'ui:header-box-classname': PropTypes.string,
    'ui:heading-level': PropTypes.string,
    'ui:required': PropTypes.bool,
    'ui:hide-header': PropTypes.bool,
    options: PropTypes.shape({
      title: PropTypes.string
    })
  })
}

export default CustomTitleFieldTemplate
