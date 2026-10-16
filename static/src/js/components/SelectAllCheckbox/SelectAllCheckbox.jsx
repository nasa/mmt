import React, { useEffect, useRef } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import PropTypes from 'prop-types'

/**
 * @typedef {Object} SelectAllCheckboxProps
 * @property {String} ariaLabel The accessible label for the checkbox
 * @property {Boolean} checked Whether every selectable item is currently selected
 * @property {Boolean} [disabled] Whether the checkbox is disabled
 * @property {Boolean} indeterminate Whether some, but not all, selectable items are selected
 * @property {Function} onChange Callback fired when the checkbox is toggled
 * @property {String} [title] Tooltip text shown when the checkbox is disabled
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
  disabled,
  indeterminate,
  onChange,
  title
}) => {
  const checkboxRef = useRef(null)

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  // Disabled inputs don't reliably fire hover/focus events in every browser, so the tooltip
  // trigger is wired up on a wrapper span instead of the input. The wrapper and OverlayTrigger
  // are always rendered (only the `trigger` prop toggles) so enabling/disabling never swaps the
  // element type at this position, which would otherwise remount the input.
  return (
    <OverlayTrigger
      overlay={
        // eslint-disable-next-line react/no-unstable-nested-components
        (overlayProps) => (
          <Tooltip id="select-all-checkbox-tooltip" {...overlayProps}>
            {title}
          </Tooltip>
        )
      }
      placement="top"
      trigger={disabled && title ? ['hover', 'focus'] : []}
    >
      <span>
        <input
          aria-label={ariaLabel}
          checked={checked}
          className="form-check-input"
          disabled={disabled}
          onChange={onChange}
          ref={checkboxRef}
          type="checkbox"
        />
      </span>
    </OverlayTrigger>
  )
}

SelectAllCheckbox.defaultProps = {
  disabled: false,
  indeterminate: false,
  title: null
}

SelectAllCheckbox.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default SelectAllCheckbox
