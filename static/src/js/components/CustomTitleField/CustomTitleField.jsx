import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import './CustomTitleField.scss'

/**
 * CustomTitleField
 * @typedef {Object} CustomTitleField
 * @property {String} groupBoxClassName A groupBoxClassName defined in the uiSchema.
 * @property {Boolean} required Is the field required.
 * @property {Boolean} requiredUI A boolean value set in the uiSchema.
 * @property {String} title The title of the field.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders Custom Title Field
 * @param {CustomTitleField} props
 */
const CustomTitleField = ({
  groupBoxClassName,
  required,
  requiredUI,
  title,
  uiSchema
}) => {
  const scrollRef = useRef(null)

  // Determine the required status for the title
  const isRequired = requiredUI || required

  // Process the title for display
  let heading = title
  if (uiSchema['ui:title']) {
    heading = uiSchema['ui:title']
  } else {
    const [firstPart] = title.split(/-/)
    heading = startCase(firstPart)
  }

  // Check if the header should be hidden based on the UI schema
  const hideHeader = uiSchema['ui:hide-header']

  const HeadingLevel = uiSchema['ui:heading-level'] || 'span'

  return (
    <div>
      <div ref={scrollRef} className={`custom-title-field__${groupBoxClassName}`}>
        {
          !hideHeader && (
            <HeadingLevel className="custom-title-field__heading">
              {heading}

              {
                isRequired && (
                  <i
                    aria-label="Required"
                    className="eui-icon eui-required-o text-success ps-1"
                    role="img"
                    title={heading}
                  />
                )
              }
            </HeadingLevel>
          )
        }
      </div>
    </div>
  )
}

CustomTitleField.defaultProps = {
  groupBoxClassName: 'h1-box',
  required: false,
  requiredUI: false,
  uiSchema: {}
}

CustomTitleField.propTypes = {
  groupBoxClassName: PropTypes.string,
  required: PropTypes.bool,
  requiredUI: PropTypes.bool,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:hide-header': PropTypes.bool,
    'ui:heading-level': PropTypes.string
  })
}

export default CustomTitleField
