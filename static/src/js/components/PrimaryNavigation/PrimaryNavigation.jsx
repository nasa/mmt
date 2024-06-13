import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Nav from 'react-bootstrap/Nav'

import For from '../For/For'
import PrimaryNavigationGroup from '../PrimaryNavigationGroup/PrimaryNavigationGroup'

import './PrimaryNavigation.scss'

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
  <section className="bg-light flex-grow-0 flex-shrink-1 overflow-y-auto">
    <For each={items}>
      {
        (item, i) => (
          <Nav
            className={
              classNames([
                'primary-navigation w-full d-flex flex-column m-2',
                {
                  'border-top': i > 0
                }
              ])
            }
            variant="pills"
            as="ul"
          >
            <For each={item}>
              {
                ({
                  children: childItems,
                  title,
                  version,
                  visible
                }) => (
                  <PrimaryNavigationGroup
                    childItems={childItems}
                    key={title}
                    title={title}
                    version={version}
                    visible={visible}
                  />
                )
              }
            </For>
          </Nav>
        )
      }
    </For>
  </section>
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
