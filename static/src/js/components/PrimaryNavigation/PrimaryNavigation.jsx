import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useMatch } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'

import { For } from '../For/For'

import './PrimaryNavigation.scss'

const PrimaryNavigationLink = ({
  title,
  to,
  version
}) => {
  const match = useMatch(to)

  return (
    <NavItem className="d-flex flex-row w-100">
      <NavLink
        to={to}
        className={
          classNames([
            'nav-link w-100',
            {
              active: !!match,
              'link-dark': !match
            }
          ])
        }
      >
        <span className="primary-navigation__title me-1 text-nowrap flex-grow-1 flex-shrink-0 align-items-center justify-content-center">{title}</span>
        {
          version && (
            <span className={
              classNames([
                'ms-1 text-secondary small',
                {
                  'text-light': !!match
                }
              ])
            }
            >
              {version}
            </span>
          )
        }
      </NavLink>
    </NavItem>
  )
}

PrimaryNavigationLink.defaultProps = {
  version: null
}

PrimaryNavigationLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  version: PropTypes.string
}

/**
 * @typedef {Object} PrimaryNavigationItem
 * @property {String} title The title for the item.
 * @property {String} to The page to link to.
 * @property {String} version? An optional string to be used for the version.
 */

/**
 * @typedef {Object} PrimaryNavigationProps
 * @property {PrimaryNavigationItem[]} items The page content.
 */

/*
 * Renders a `PrimaryNavigation` component.
 *
 * The component is used to create a list of React Router navigation items
 * that additionally display an optional version.
 *
 * @param {PrimaryNavigationProps} props
 *
 * @component
 * @example <caption>Render a list custom of items</caption>
 * return (
 *   <PrimaryNavigation
 *      items={
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
const PrimaryNavigation = ({
  items
}) => (
  <nav className="primary-navigation bg-light w-100">
    <Nav className="d-flex flex-column p-2" variant="pills">
      <For each={items}>
        {
          ({
            title,
            to,
            version
          }) => (
            <PrimaryNavigationLink key={title} to={to} version={version} title={title} />
          )
        }
      </For>
    </Nav>
  </nav>
)

PrimaryNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      version: PropTypes.string
    }).isRequired
  ).isRequired
}

export default PrimaryNavigation
