import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import './CustomTitleField.scss'
import shouldFocusField from '../../utils/shouldFocusField'

/**
 * CustomTitleField
 * @typedef {Object} CustomTitleField
 * @property {String} groupBoxClassName A groupBoxClassName defined in the uiSchema.
 * @property {Boolean} required Is the field required.
 * @property {Boolean} requiredUI A boolean value set in the uiSchema.
 * @property {Object} registry An Object that has all the props that are in registry.
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
  registry,
  title,
  uiSchema
}) => {
  const scrollRef = useRef(null)

  const { formContext } = registry

  const {
    focusField
  } = formContext

  const shouldFocus = shouldFocusField(focusField, title)

  useEffect(() => {
    // This useEffect for shouldFocus lets the refs be in place before trying to use them
    if (shouldFocus) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldFocus])

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
  registry: PropTypes.shape({
    formContext: PropTypes.shape({
      focusField: PropTypes.string
    }).isRequired
  }).isRequired,
  title: PropTypes.string.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:hide-header': PropTypes.bool,
    'ui:heading-level': PropTypes.string
  })
}

export default CustomTitleField
