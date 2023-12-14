import React from 'react'
import PropTypes from 'prop-types'

/**
 * CustomFieldTemplate
 * @typedef {Object} CustomFieldTemplate
 * @property {String} className custom className for the div
 * @property {Object} help An object that has the form information
 * @property {Object} error An object that has the form errors
 * @property {Object} children An object that has the form fields
 */

/**
 * Renders Custom Field Template
 * @param {CustomFieldTemplate} props
 */
const CustomFieldTemplate = ({
  classNames,
  help,
  errors,
  children
}) => (
  <div
    data-testid="custom-field-template"
    className={`custom-field-template ${classNames}`}
  >
    {children}
    {errors}
    {help}
  </div>
)

CustomFieldTemplate.defaultProps = {
  classNames: ''
}

CustomFieldTemplate.propTypes = {
  children: PropTypes.shape({}).isRequired,
  classNames: PropTypes.string,
  errors: PropTypes.shape({}).isRequired,
  help: PropTypes.shape({}).isRequired
}

export default CustomFieldTemplate
