import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'

import { For } from '../For/For'

import './PrimaryNavigation.scss'

const PrimaryNavigationLink = ({
  title,
  to,
  version,
  isChild
}) => {
  const location = useLocation()
  const match = location.pathname.startsWith(to)

  return (
    <NavItem className="d-flex flex-row w-100">
      <NavLink
        to={to}
        className={
          classNames([
            'primary-navigation__link nav-link w-100',
            {
              active: match,
              'bg-light text-primary fw-bold': match && isChild,
              'link-dark': !match,
              'py-1 ps-4': isChild
            }
          ])
        }
      >
        <span
          className={
            classNames([
              'primary-navigation__title me-1 text-nowrap flex-grow-1 flex-shrink-0 align-items-center justify-content-center',
              {
                'bg-light text-secondary': !match && isChild,
                'fw-bold': !isChild
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
      </NavLink>
    </NavItem>
  )
}

PrimaryNavigationLink.defaultProps = {
  isChild: false,
  version: null
}

PrimaryNavigationLink.propTypes = {
  isChild: PropTypes.bool,
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
  <Nav className="primary-navigation bg-light w-100 d-flex flex-column p-2" variant="pills" as="nav">
    <For each={items}>
      {
        ({
          title,
          to,
          version,
          children
        }) => (
          <React.Fragment key={`${to}-${title}`}>
            <PrimaryNavigationLink
              to={to}
              version={version}
              title={title}
            />
            {
              children && children.length > 0 && (
                <Nav
                  className={
                    classNames({
                      'mb-1': children && children.length > 0
                    })
                  }
                  variant="pills"
                >
                  <For each={children}>
                    {
                      ({
                        title: childTitle,
                        to: childTo
                      }) => (
                        <PrimaryNavigationLink
                          key={`${childTo}-${childTitle}`}
                          isChild
                          title={childTitle}
                          to={childTo}
                        />
                      )
                    }
                  </For>
                </Nav>
              )
            }
          </React.Fragment>
        )
      }
    </For>
  </Nav>
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
