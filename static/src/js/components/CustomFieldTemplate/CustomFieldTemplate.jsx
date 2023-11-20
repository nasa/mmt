import React from 'react'
import PropTypes from 'prop-types'
import { propTypes } from 'react-bootstrap/esm/Image'

const CustomFieldTemplate = ({
  classNames,
  help,
  errors,
  children
}) => (
  <div data-testid="custom-field-template" className={`metadata-editor-field ${classNames}`}>
		{children}
    {errors}
    {help}
  </div>
)
CustomFieldTemplate.defaultProps = {
  classNames: ''
}

CustomFieldTemplate.propTypes = {
  classNames: PropTypes.string,
  help: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  children: PropTypes.shape({}).isRequired
}

export default CustomFieldTemplate
