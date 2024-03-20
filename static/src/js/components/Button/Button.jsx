import React from 'react'
import PropTypes from 'prop-types'
import BootstrapButton from 'react-bootstrap/Button'
import classNames from 'classnames'

import './Button.scss'
import { FaExternalLinkAlt } from 'react-icons/fa'

/**
 * @typedef {Object} ButtonProps
 * @property {String} className Class name to apply to the button
 * @property {ReactNode} children The children of the button
 * @property {Boolean} external An optional boolean which sets `target="_blank"` and an external link icon
 * @property {String} href An optional string which triggers the use of an `<a>` tag with the designated href
 * @property {Function} [Icon] An optional icon `react-icons` icon. A iconTitle should be set when setting an icon.
 * @property {Function} [iconOnly] An optional boolean that hides the button content
 * @property {Function} [iconTitle] An optional icon `react-icons` icon
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
 *      iconTitle="Star"
 *   >
 *     Click me!
 *   </Button>
 * )
 */
const Button = ({
  className,
  children,
  external,
  href,
  Icon,
  iconOnly,
  iconTitle,
  naked,
  onClick,
  size,
  variant
}) => {
  // Create an object to pass any conditional properties. These are ultimately spread on the component.
  const conditionalProps = {}

  if (onClick) {
    conditionalProps.onClick = onClick
  }

  if (href) {
    conditionalProps.href = href

    if (external) conditionalProps.target = '_blank'
  }

  return (
    <BootstrapButton
      className={
        classNames([
          'd-flex align-items-center text-nowrap',
          {
            'button--naked': naked,
            [className]: className
          }
        ])
      }
      size={size}
      variant={variant}
      {...conditionalProps}
    >
      {
        Icon && (
          <Icon
            title={iconTitle}
            role="img"
            className={
              classNames([
                {
                  'me-0': iconOnly,
                  'me-1': !iconOnly && size !== 'lg',
                  'me-2': !iconOnly && size === 'lg'
                }
              ])
            }
          />
        )
      }
      {
        iconOnly
          ? (
            <span className="visually-hidden">{children}</span>
          )
          : children
      }
      {
        external && (
          <FaExternalLinkAlt className="ms-1 small" style={{ opacity: 0.625 }} />
        )
      }
    </BootstrapButton>
  )
}

Button.defaultProps = {
  className: '',
  external: false,
  Icon: undefined,
  iconOnly: false,
  iconTitle: undefined,
  href: null,
  naked: false,
  onClick: null,
  size: '',
  variant: ''
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  external: PropTypes.bool,
  href: PropTypes.string,
  Icon: PropTypes.func,
  iconOnly: PropTypes.bool,
  iconTitle: ({ Icon, iconTitle }) => {
    if (!!Icon && !iconTitle) {
      return new Error('An iconTitle is required when rendering an Icon. The iconTitle will be used as the <title> on the <svg>')
    }

    return null
  },
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  variant: PropTypes.string
}

export default Button
