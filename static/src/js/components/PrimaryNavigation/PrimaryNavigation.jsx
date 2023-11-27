import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import Badge from 'react-bootstrap/Badge'

import { For } from '../For/For'

import './PrimaryNavigation.scss'

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
  <nav className="primary-navigation pt-3">
    <ul className="d-flex flex-row flex-wrap list-unstyled">
      <For each={items}>
        {
          ({
            title,
            to,
            version
          }) => (
            <li key={title} className="d-block fw-bold me-4">
              <NavLink
                className={
                  ({ isActive }) => classNames([
                    'd-flex align-items-start flex-grow-0 text-decoration-none text-uppercase py-2 px-0 text-white primary-navigation__item ',
                    {
                      'border-bottom border-pink border-4': isActive
                    }
                  ])
                }
                to={to}
              >
                <span className="primary-navigation__title d-block me-1 text-nowrap">{title}</span>
                {
                  version && (
                    <Badge className="primary-navigation__badge flex-grow-0">{version}</Badge>
                  )
                }
              </NavLink>
            </li>
          )
        }
      </For>
    </ul>
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
