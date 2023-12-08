import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

/**
 * CustomTitleFieldTemplate
 * @typedef {Object} CustomTitleFieldTemplate
 * @property {Object} registry An Object that has all the props that are in registry.
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

  // Do not think this is needed anymore.
  // Function to scroll into view
  // const executeScroll = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  // // Effect to scroll into view when focusField changes
  // useEffect(() => {
  //   if (title.replace(/ /g, '') === registry?.focusField) {
  //     setTimeout(() => {
  //       executeScroll()
  //     })
  //   }
  // }, [title, registry?.focusField])

  // Extract values or use defaults for styling classNames
  const { options = {} } = uiSchema
  const { title: uiTitle } = options
  const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
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
          hideHeader ? null
            : (
              <span className={headerClassName}>
                {heading}
                {required || requiredUI ? <i title={heading} className="eui-icon eui-required-o required-icon" role="img" aria-label="Required" /> : ''}
              </span>
            )
        }
      </div>
    </div>
  )
}

CustomTitleFieldTemplate.defaultProps = {
  registry: {},
  uiSchema: {}
}

CustomTitleFieldTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  registry: PropTypes.shape({
    focusField: PropTypes.string
  }),
  uiSchema: PropTypes.shape({
    'ui:header-classname': PropTypes.string,
    'ui:header-box-classname': PropTypes.string,
    'ui:required': PropTypes.bool,
    'ui:hide-header': PropTypes.bool,
    options: PropTypes.shape({
      title: PropTypes.string
    })
  })
}

export default CustomTitleFieldTemplate
