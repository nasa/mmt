import React from 'react'
import PropTypes from 'prop-types'
import toTitleCase from '@/js/utils/toTitleCase'
import Button from '../Button/Button'

/**
 * CustomFieldTemplate
 * @typedef {Object} CustomFieldTemplate
 * @property {String} className custom className for the div
 * @property {Boolean} disable Should disable a field
 * @property {Object} help An object that has the form information
 * @property {Object} error An object that has the form errors
 * @property {Object} children An object that has the form fields
 */

/**
 * Renders Custom Field Template
 * @param {CustomFieldTemplate} props
 */
const CustomFieldTemplate = ({
  children,
  classNames,
  disabled,
  errors,
  help,
  label,
  onChange,
  uiSchema
}) => {
  const clear = uiSchema['ui:clear']

  const handleClick = () => {
    onChange({})
  }

  return (
    <div className={`custom-field-template ${classNames}`}>
      {children}
      {errors}
      {help}
      {
        clear && (
          <div className="d-flex justify-content-end">
            <Button
              title={label}
              className="d-flex justify-content-end"
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={handleClick}
            >
              Clear
              {' '}
              {(toTitleCase(label))}
            </Button>
          </div>
        )
      }
    </div>
  )
}

CustomFieldTemplate.defaultProps = {
  classNames: '',
  disabled: false,
  errors: null,
  label: null,
  uiSchema: {}
}

CustomFieldTemplate.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.shape({}).isRequired,
  classNames: PropTypes.string,
  errors: PropTypes.shape({}),
  help: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  uiSchema: PropTypes.shape({
    'ui:clear': PropTypes.bool
  })
}

export default CustomFieldTemplate
