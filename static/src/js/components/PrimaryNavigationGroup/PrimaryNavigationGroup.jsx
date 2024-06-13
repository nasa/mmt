import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import classNames from 'classnames'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'

import useAccessibleEvent from '@/js/hooks/useAccessibleEvent'
import toKebabCase from '@/js/utils/toKebabCase'

import For from '../For/For'
import PrimaryNavigationLink from '../PrimaryNavigationLink/PrimaryNavigationLink'

/**
 * @typedef {Object} PrimaryNavigationGroupProps
 * @property {Array} [childItems] An optional array of children elements.
 * @property {String} title The title for the item.
 * @property {String} [version] An optional string to display a version.
 * @property {Boolean} [visible] An optional boolean that controls visibility of an item
 */

/*
 * Renders a `PrimaryNavigationGroup` component.
 *
 * The component is used to display a group of navigation items.
 *
 * @param {PrimaryNavigationGroupProps} props
 *
 * @component
 * @example <caption>Render a list navigation group</caption>
 * return (
 *   <PrimaryNavigationGroup
 *      title="Collections"
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
const PrimaryNavigationGroup = ({
  childItems,
  title,
  version,
  visible
}) => {
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)

  const handleAccessibleMenuToggleEvents = useAccessibleEvent((event) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  })

  useEffect(() => {
    const childMatch = childItems.some((childItem) => {
      const { to: childTo } = childItem

      return location.pathname.startsWith(childTo)
    })

    if (childMatch) setIsOpen(true)
  }, [childItems])

  if (visible !== undefined && !visible) return null

  return (
    <li className="d-flex flex-column">
      <NavItem
        className={
          classNames(
            'primary-navigation__group-item d-flex flex-row w-100 align-items-center rounded py-1'
          )
        }
        {...handleAccessibleMenuToggleEvents}
        tabIndex={0}
        aria-label={`${isOpen ? 'Close' : 'Open'} menu`}
        aria-controls={`navigation-section-${toKebabCase(title)}`}
      >
        <div
          id={`navigation-section-${toKebabCase(title)}`}
          className={
            classNames([
              'primary-navigation__link p-2 w-100 d-flex align-items-center justify-content-between pe-0'
            ])
          }
          aria-expanded={isOpen}
        >
          <div className="d-flex align-items-center">
            <span
              className={
                classNames([
                  'primary-navigation__title me-1 text-nowrap flex-grow-1 flex-shrink-1 align-items-center justify-content-center fw-bold'
                ])
              }
            >
              {title}
            </span>
            {
              version && (
                <span className={
                  classNames([
                    'primary-navigation__version ms-2 text-secondary font-monospace fw-light'
                  ])
                }
                >
                  {version}
                </span>
              )
            }
          </div>
        </div>
        {
          (childItems && childItems.length > 0) && (
            <div
              className="primary-navigation__dropdown-button small p-2 m-0"
            >
              {isOpen ? <FaChevronUp aria-label="Close icon" /> : <FaChevronDown aria-label="Open icon" />}
            </div>
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
        aria-hidden={!isOpen}
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
              as="ul"
            >
              <For each={childItems}>
                {
                  ({
                    title: childTitle,
                    to: childTo,
                    visible: childVisible
                  }) => (
                    <PrimaryNavigationLink
                      key={`${childTo}-${childTitle}`}
                      title={childTitle}
                      to={childTo}
                      visible={childVisible}
                      tabIndex={isOpen ? '0' : '-1'}
                    />
                  )
                }
              </For>
            </Nav>
          )
        }
      </div>
    </li>
  )
}

PrimaryNavigationGroup.defaultProps = {
  version: null,
  visible: true
}

PrimaryNavigationGroup.propTypes = {
  childItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      visible: PropTypes.bool
    }).isRequired
  ).isRequired,
  title: PropTypes.string.isRequired,
  version: PropTypes.string,
  visible: PropTypes.bool
}

export default PrimaryNavigationGroup
