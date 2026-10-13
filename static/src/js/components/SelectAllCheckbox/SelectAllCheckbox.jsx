import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/**
 * @typedef {Object} SelectAllCheckboxProps
 * @property {String} ariaLabel The accessible label for the checkbox
 * @property {Boolean} checked Whether every selectable item is currently selected
 * @property {Boolean} indeterminate Whether some, but not all, selectable items are selected
 * @property {Function} onChange Callback fired when the checkbox is toggled
 */

/**
 * Renders a checkbox that also supports an `indeterminate` visual state, which
 * is a DOM-only property and can't be set declaratively via a JSX attribute.
 * @param {SelectAllCheckboxProps} props
 *
 * @component
 * @example <caption>Renders a `SelectAllCheckbox` component</caption>
 * return (
 *   <SelectAllCheckbox
 *     ariaLabel="Select all"
 *     checked={allSelected}
 *     indeterminate={someSelected}
 *     onChange={handleChange}
 *   />
 * )
 */
const SelectAllCheckbox = ({
  ariaLabel,
  checked,
  indeterminate,
  onChange
}) => {
  const checkboxRef = useRef(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      aria-label={ariaLabel}
      checked={checked}
      className="form-check-input"
      onChange={onChange}
      ref={checkboxRef}
      type="checkbox"
    />
  )
}

SelectAllCheckbox.defaultProps = {
  indeterminate: false
}

SelectAllCheckbox.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}

export default SelectAllCheckbox
