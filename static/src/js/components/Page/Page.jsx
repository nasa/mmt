import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'

import PrimaryNavigation from '../PrimaryNavigation/PrimaryNavigation'

import './Page.scss'

/**
 * @typedef {Object} PageProps
 * @property {ReactNode} children The page content.
 * @property {String} title A string of visually hidden text to serve as the page title
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a list of components from an array
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a list custom of items</caption>
 * return (
 *   <Page
 *      each={['Thing', 'Thing', 'Thing']}
 *    >
 *      <div>This is some page content</div>
 *    </Page>
 * )
 */
const Page = ({
  children,
  title
}) => (
  <main className="mb-3">
    <header className="page__header">
      <Container>
        <PrimaryNavigation
          items={
            [
              {
                to: '/manage-collections',
                title: 'Manage Collections',
                version: 'v1.17.3'
              },
              {
                to: '/manage-variables',
                title: 'Manage Variables',
                version: 'v1.17.3'
              },
              {
                to: '/manage-services',
                title: 'Manage Services',
                version: 'v1.17.3'
              },
              {
                to: '/manage-tools',
                title: 'Manage Tools',
                version: 'v1.17.3'
              },
              {
                to: '/manage-cmr',
                title: 'Manage CMR'
              }
            ]
          }
        />
      </Container>
    </header>
    <Container>
      <h2 className="visually-hidden mt-0">{title}</h2>
      {children}
    </Container>
  </main>
)

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Page
