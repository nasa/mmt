import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

/**
 * CustomTitleField
 * @typedef {Object} CustomTitleField
 * @property {String} title The title of the field.
 * @property {Boolean} required Is the field required.
 * @property {Boolean} requiredUI A boolean value set in the uiSchema.
 * @property {Object} registry An Object that has all the props that are in registry.
 * @property {String} className A className defined in the uiSchema.
 * @property {String} groupBoxClassName A groupBoxClassName defined in the uiSchema.
 * @property {Object} uiSchema A uiSchema for the field being shown.
 */

/**
 * Renders Custom Title Field
 * @param {CustomTitleField} props
 */
const CustomTitleField = ({
  title,
  required,
  requiredUI,
  registry,
  className,
  groupBoxClassName,
  uiSchema
}) => {
  const scrollRef = useRef(null)

  // Function to execute smooth scroll
  const executeScroll = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  const { focusField } = registry.formContext

  // Effect to scroll into view when the focused field changes
  // Check if the current title corresponds to the focused field and Scroll into view with a delay for better user experience
  useEffect(() => {
    if (title.replace(/ /g, '') === focusField) {
      setTimeout(() => {
        executeScroll()
      })
    }
  }, [title, focusField])

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

  return (
    <div>
      <div ref={scrollRef} data-testid="custom-title-field--heading" className={groupBoxClassName}>
        {
          hideHeader ? null : (
            <span className={`${className}`}>
              {heading}
              {isRequired && <i className="eui-icon eui-required-o required-icon" />}
            </span>
          )
        }
      </div>
    </div>
  )
}

CustomTitleField.propTypes = {
  title: PropTypes.string.isRequired,
  requiredUI: PropTypes.bool,
  required: PropTypes.bool,
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string
    })
  }).isRequired,
  className: PropTypes.string,
  groupBoxClassName: PropTypes.string,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:hide-header': PropTypes.bool
  })
}

CustomTitleField.defaultProps = {
  requiredUI: false,
  required: false,
  className: '',
  groupBoxClassName: '',
  uiSchema: {}
}

export default CustomTitleField
