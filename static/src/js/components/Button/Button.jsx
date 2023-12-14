import React from 'react'
import PropTypes from 'prop-types'
import BootstrapButton from 'react-bootstrap/Button'
import classNames from 'classnames'

import './Button.scss'

/**
 * @typedef {Object} ButtonProps
 * @property {ReactNode} children The children of the button
 * @property {Boolean} [disabled] An optional boolean to that disables the button
 * @property {Function} [Icon] An optional icon `react-icons` icon
 * @property {Function} onClick A callback function to be called when the button is clicked
 * @property {String} [size] An optional string passed to React Bootstrap to change the size of the button
 * @property {Boolean} [naked] An optional boolean passed to render a button with no background or border
 * @property {String} [variant] An optional string passed to React Bootstrap to change the variant
 */

/*
 * Renders a `Button` component.
 *
 * The component is renders a button, optionally displaying an icon
 *
 * @param {ButtonProps} props
 *
 * @component
 * @example <caption>Render a button with an icon</caption>
 * return (
 *   <Button
 *      size="sm"
 *      variant="primary"
 *      Icon={FaStar}
 *   >
 *     Click me!
 *   </Button>
 * )
 */
const Button = ({
  className,
  children,
  Icon,
  onClick,
  size,
  naked,
  variant
}) => (
  <BootstrapButton
    className={
      classNames([
        'd-flex align-items-center',
        {
          'button--naked': naked,
          [className]: className
        }
      ])
    }
    onClick={onClick}
    size={size}
    variant={variant}
  >
    {
      Icon && (
        <Icon className="me-1" />
      )
    }
    {children}
  </BootstrapButton>
)

Button.defaultProps = {
  className: '',
  Icon: null,
  size: '',
  naked: false,
  variant: ''
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  Icon: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  naked: PropTypes.bool,
  variant: PropTypes.string
}

export default Button
