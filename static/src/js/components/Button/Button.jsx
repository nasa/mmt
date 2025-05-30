import React from 'react'
import PropTypes from 'prop-types'
import BootstrapButton from 'react-bootstrap/Button'
import classNames from 'classnames'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Spinner } from 'react-bootstrap'

import './Button.scss'

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
const Button = React.forwardRef(({
  as,
  className,
  children,
  disabled,
  external,
  href,
  Icon,
  iconOnly,
  iconTitle,
  inline,
  loading,
  loadingText,
  naked,
  onClick,
  size,
  title,
  to,
  variant
}, ref) => {
  console.log('🚀 ~ file: Button.jsx:65 ~ loading:', loading)
  // Create an object to pass any conditional properties. These are ultimately spread on the component.
  let conditionalProps = {}

  if (onClick) {
    conditionalProps = {
      ...conditionalProps,
      onClick
    }
  }

  if (as) {
    conditionalProps = {
      ...conditionalProps,
      as
    }
  }

  if (to) {
    conditionalProps = {
      ...conditionalProps,
      to
    }
  }

  if (href) {
    conditionalProps = {
      ...conditionalProps,
      href
    }

    if (external) {
      conditionalProps = {
        ...conditionalProps,
        target: '_blank'
      }
    }
  }

  const buttonText = loading ? loadingText : children

  return (
    <BootstrapButton
      ref={ref}
      className={
        classNames([
          'align-items-center text-nowrap',
          {
            'd-flex': !inline,
            'd-inline-flex p-0': inline,
            'button--naked': naked,
            'px-2': iconOnly && !inline,
            [className]: className
          }
        ])
      }
      size={size}
      variant={variant}
      disabled={disabled}
      aria-busy={loading}
      title={title}
      {...conditionalProps}
    >
      {
        loading && (
          <Spinner
            animation="border"
            as="span"
            className={
              classNames([
                'opacity-75',
                {
                  'me-0': iconOnly,
                  'me-2': !iconOnly && size !== 'lg',
                  'me-3': !iconOnly && size === 'lg'
                }
              ])
            }
            role="status"
            size="sm"
          />
        )
      }
      {
        Icon && !loading && (
          <Icon
            aria-label={iconTitle}
            role="img"
            className={
              classNames([
                {
                  'me-0': iconOnly,
                  'me-2': !iconOnly && size !== 'lg',
                  'me-3': !iconOnly && size === 'lg'
                }
              ])
            }
          />
        )
      }
      {
        iconOnly
          ? (
            <span className="visually-hidden">
              {buttonText}
            </span>
          )
          : buttonText
      }
      {
        external && (
          <FaExternalLinkAlt className="ms-1 small" style={{ opacity: 0.625 }} />
        )
      }
    </BootstrapButton>
  )
})

Button.displayName = 'Button'

Button.defaultProps = {
  as: null,
  children: null,
  className: '',
  disabled: false,
  external: false,
  Icon: undefined,
  iconOnly: false,
  iconTitle: undefined,
  inline: false,
  loading: null,
  loadingText: null,
  href: null,
  naked: false,
  onClick: null,
  size: '',
  title: '',
  to: '',
  variant: ''
}

Button.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.any
  ]),
  className: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  href: PropTypes.string,
  Icon: PropTypes.func,
  iconOnly: PropTypes.bool,
  inline: PropTypes.bool,
  iconTitle: ({ Icon, iconTitle }) => {
    if (!!Icon && !iconTitle) {
      return new Error('An iconTitle is required when rendering an Icon. The iconTitle will be used as the <title> on the <svg>')
    }

    return null
  },
  loading: PropTypes.bool,
  loadingText: ({ loading, loadingText }) => {
    if (loading !== null && !loadingText) {
      return new Error('A loadingText is required when rendering an Button with a loading state. The loadingText will be used as the button label while "loading" is true.')
    }

    return null
  },
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string,
  variant: PropTypes.string
}

export default Button
