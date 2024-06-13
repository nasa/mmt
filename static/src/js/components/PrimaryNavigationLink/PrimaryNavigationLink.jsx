import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { NavLink } from 'react-router-dom'
import NavItem from 'react-bootstrap/NavItem'

/**
 * @typedef {Object} PrimaryNavigationLinkProps
 * @property {Array} [childItems] An optional array of children elements.
 * @property {Boolean} [isChild] An optional boolean to designate the item as a child.
 * @property {String} title The title for the item.
 * @property {String} to The page to link to.
 * @property {String} [version] An optional string to be used for the version.
 * @property {Number} [tabIndex] Sets the tab index on the link
 */

/*
 * Renders a `PrimaryNavigationLink` component.
 *
 * The component is used to create navigation item.
 *
 * @param {PrimaryNavigationLinkProps} props
 *
 * @component
 * @example <caption>Render a list custom of items</caption>
 * return (
 *   <PrimaryNavigationLink
 *      to="/"
 *      title="Home"
 *      childItems={
 *        [
 *          {
 *            title: 'Link title',
 *            to: '/link-location',
 *            version: 'v1.0.0',
 *          }
 *        ]
 *      }
 *   />
 * )
 */
const PrimaryNavigationLink = ({
  title,
  to,
  version,
  visible,
  tabIndex
}) => {
  const location = useLocation()
  const match = location.pathname.startsWith(to)

  if (!visible) return null

  return (
    <li className="d-flex flex-column">
      <NavItem
        className={
          classNames(
            'd-flex flex-row w-100'
          )
        }
      >
        <NavLink
          to={to}
          className={
            classNames([
              'primary-navigation__link nav-link w-100 d-flex align-items-center justify-content-between py-1 ms-2 border-start border-2 rounded-0',
              {
                active: match,
                'border-light-dark link-dark': !match,
                'bg-light text-primary fw-bold border-blue': match
              }
            ])
          }
          tabIndex={tabIndex}
        >
          <div className="d-flex align-items-center">
            <span
              className={
                classNames([
                  'primary-navigation__title me-1 text-nowrap flex-grow-1 flex-shrink-1 align-items-center justify-content-center py-1',
                  {
                    'bg-light text-secondary': !match
                  }
                ])
              }
            >
              {title}
            </span>
            {
              version && (
                <span className={
                  classNames([
                    'primary-navigation__version ms-2 text-secondary font-monospace fw-light',
                    {
                      'text-light': match
                    }
                  ])
                }
                >
                  {version}
                </span>
              )
            }
          </div>
        </NavLink>
      </NavItem>
    </li>
  )
}

PrimaryNavigationLink.defaultProps = {
  version: null,
  visible: true,
  tabIndex: '-1'
}

PrimaryNavigationLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  version: PropTypes.string,
  visible: PropTypes.bool,
  tabIndex: PropTypes.string
}

export default PrimaryNavigationLink
