import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

const CustomTitleFieldTemplate = ({
  registry,
  required,
  title,
  uiSchema
}) => {
  const scrollRef = useRef(null)

  const executeScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (title.replace(/ /g, '') === registry?.focusField) {
      setTimeout(() => {
        executeScroll()
      })
    }
  }, [title, registry?.focusField])

  const { uiSchema: { options = {} } = {} } = uiSchema || {}
  const { title: uiTitle } = options
  const headerClassName = uiSchema['ui:header-classname'] ? uiSchema['ui:header-classname'] : 'h2-title'
  const headerBoxClassName = uiSchema['ui:header-box-classname'] ? uiSchema['ui:header-box-classname'] : 'h2-box'
  const requiredUI = uiSchema['ui:required']
  const hideHeader = uiSchema['ui:hide-header']

  const heading = uiTitle || startCase(title.split(/-/)[0])

  return (
    <div>
      <div
        ref={scrollRef}
        className={headerBoxClassName}
      >
        {
          hideHeader ? null : (
            <span className={headerClassName}>
              {heading}
              {
                (required || requiredUI) && (
                  <i
                    data-testid="custom-title-field-template--required"
                    className="eui-icon eui-required-o required-icon"
                  />
                )
              }
            </span>
          )
        }
      </div>
    </div>
  )
}

CustomTitleFieldTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  registry: PropTypes.shape({
    focusField: PropTypes.string
  }),
  uiSchema: PropTypes.shape({
    ui: PropTypes.shape({
      'ui:header-classname': PropTypes.string,
      'ui:header-box-classname': PropTypes.string,
      'ui:required': PropTypes.bool,
      'ui:hide-header': PropTypes.bool
    })
  })
}

CustomTitleFieldTemplate.defaultProps = {
  registry: {},
  uiSchema: {}
}

export default CustomTitleFieldTemplate
