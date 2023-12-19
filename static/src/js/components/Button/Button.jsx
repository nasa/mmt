import React from 'react'
import PropTypes from 'prop-types'
import BootstrapButton from 'react-bootstrap/Button'
import classNames from 'classnames'

import './Button.scss'

/**
 * @typedef {Object} ButtonProps
 * @property {String} className Class name to apply to the button
 * @property {ReactNode} children The children of the button
 * @property {Function} [Icon] An optional icon `react-icons` icon
 * @property {Boolean} [naked] An optional boolean passed to render a button with no background or border
 * @property {Function} onClick A callback function to be called when the button is clicked
 * @property {String} [size] An optional string passed to React Bootstrap to change the size of the button
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
  naked,
  onClick,
  size,
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
  naked: false,
  size: '',
  variant: ''
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  Icon: PropTypes.func,
  naked: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  variant: PropTypes.string
}

export default Button
