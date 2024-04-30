import classNames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

/**
 * @typedef {Object} CustomMenu
 * @property {ReactNode} children An array of react-bootstrap dropdown
 * @property {Object} style A style object provided by react-bootstrap
 * @property {String} [className] An optional classname
 * @property {Function} labelledBy A aria-labelledby attribute provided by react-bootstrap
 */

/*
 * Renders a `CustomMenu` component.
 *
 * This component renders an menu for a custom dropdown
 *
 * @param {CustomMenu} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <CustomMenu>
 *     <DropdownItem>A dropdown item</DropdownItem>
 *   </CustomMenu>
 * )
 */
const CustomMenu = React.forwardRef(
  ({
    children,
    style,
    className,
    'aria-labelledby': labelledBy
  }, ref) => (
    <div
      ref={ref}
      style={style}
      className={
        classNames([
          'shadow',
          {
            [className]: className
          }
        ])
      }
      aria-labelledby={labelledBy}
    >
      <div className="mb-0">
        {children}
      </div>
    </div>
  )
)

CustomMenu.displayName = 'CustomMenu'

CustomMenu.propTypes = {
  children: PropTypes.shape().isRequired,
  className: PropTypes.string,
  style: PropTypes.shape().isRequired,
  'aria-labelledby': PropTypes.string.isRequired
}

CustomMenu.defaultProps = {
  className: null
}

export default CustomMenu
