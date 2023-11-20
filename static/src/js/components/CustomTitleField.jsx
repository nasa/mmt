import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

const CustomTitleField = (props) => {
  const {
    title,
    requiredUI,
    registry,
    className,
    groupBoxClassName,
    uiSchema
  } = props

  const scrollRef = useRef(null)

  const executeScroll = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })

  const { focusField } = registry.formContext
  useEffect(() => {
    if (title.replace(/ /g, '') === focusField) {
      setTimeout(() => {
        executeScroll()
      })
    }
  }, [title, focusField])

  let { required } = props
  if (requiredUI) {
    required = requiredUI
  }

  let heading = title
  if (uiSchema['ui:title']) {
    heading = uiSchema['ui:title']
  } else {
    const [firstPart] = title.split(/-/)
    heading = startCase(firstPart)
  }

  const hideHeader = uiSchema['ui:hide-header']

  return (
    <div>
      <div ref={scrollRef} data-testid="custom-title-field--heading" className={groupBoxClassName}>
        {
          hideHeader ? null : (
            <span className={`${className}`}>
              {heading}
              {required === true ? <i data-testid="custom-title-field--required" className="eui-icon eui-required-o required-icon" /> : ''}
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
  uiSchema: PropTypes.shape({
  })
}

export default CustomTitleField
