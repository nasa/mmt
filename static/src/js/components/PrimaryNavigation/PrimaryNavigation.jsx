import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import For from '../For/For'
import Button from '../Button/Button'

import './PrimaryNavigation.scss'

/**
 * @typedef {Object} PrimaryNavigationLinkProps
 * @property {Array} [childItems] An optional array of children elements.
 * @property {Boolean} [isChild] An optional boolean to designate the item as a child.
 * @property {String} title The title for the item.
 * @property {String} to The page to link to.
 * @property {String} [version] An optional string to be used for the version.
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
  childItems,
  isChild,
  title,
  to,
  version,
  visible
}) => {
  const location = useLocation()
  const match = location.pathname.startsWith(to)
  const [isOpen, setIsOpen] = useState(false)

  const childMatch = childItems.some((childItem) => {
    const { to: childTo } = childItem

    return location.pathname.startsWith(childTo)
  })

  useEffect(() => {
    if (!match && childMatch) setIsOpen(true)
  }, [match, childMatch])

  if (!visible) return null

  return (
    <div className="d-flex flex-column">
      <NavItem
        className={
          classNames(
            'd-flex flex-row w-100',
            {
              'bg-primary rounded': !isChild && match
            }
          )
        }
      >
        <NavLink
          to={to}
          className={
            classNames([
              'primary-navigation__link nav-link w-100 d-flex align-items-center justify-content-between pe-0',
              {
                active: match,
                'py-1 ms-3 border-start border-2 rounded-0': isChild,
                'border-light-dark': isChild && !match,
                'bg-light text-primary fw-bold border-blue': match && isChild,
                'link-dark': !match
              }
            ])
          }
        >
          <div className="d-flex align-items-center">
            <span
              className={
                classNames([
                  'primary-navigation__title me-1 text-nowrap flex-grow-1 flex-shrink-1 align-items-center justify-content-center',
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
          </div>
        </NavLink>
        {
          (childItems && childItems.length > 0) && (
            <Button
              className="primary-navigation__dropdown-button small p-1 m-0"
              onClick={
                (event) => {
                  setIsOpen(!isOpen)
                  event.stopPropagation()
                }
              }
              iconOnly
              Icon={isOpen ? FaChevronUp : FaChevronDown}
              iconTitle={isOpen ? 'Close icon' : 'Open icon'}
              variant="light"
              naked
            />
          )
        }
      </NavItem>
      <div
        className={
          classNames([
            {
              'visually-hidden': !isOpen
            }
          ])
        }
      >
        {
          childItems && childItems.length > 0 && (
            <Nav
              className={
                classNames([
                  'd-flex flex-column',
                  {
                    'mb-1': childItems && childItems.length > 0
                  }
                ])
              }
              variant="pills"
            >
              <For each={childItems}>
                {
                  ({
                    title: childTitle,
                    to: childTo,
                    visible: childVisible
                  }) => (
                    <PrimaryNavigationLink
                      isChild
                      key={`${childTo}-${childTitle}`}
                      title={childTitle}
                      to={childTo}
                      visible={childVisible}
                    />
                  )
                }
              </For>
            </Nav>
          )
        }
      </div>
    </div>
  )
}

PrimaryNavigationLink.defaultProps = {
  childItems: [],
  isChild: false,
  version: null,
  visible: true
}

PrimaryNavigationLink.propTypes = {
  childItems: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  isChild: PropTypes.bool,
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  version: PropTypes.string,
  visible: PropTypes.bool
}

/**
 * @typedef {Object} PrimaryNavigationItem
 * @property {Array} [children] An optional array of children elements.
 * @property {String} title The title for the item.
 * @property {String} to The page to link to.
 * @property {String} [version] An optional string to be used for the version.
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
          children: childItems,
          title,
          to,
          version,
          visible
        }) => (
          <PrimaryNavigationLink
            childItems={childItems}
            key={title}
            title={title}
            to={to}
            version={version}
            visible={visible}
          />
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
      version: PropTypes.string,
      visible: PropTypes.bool
    }).isRequired
  ).isRequired
}

export default PrimaryNavigation
