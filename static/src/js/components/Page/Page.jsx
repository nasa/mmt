import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'

import PrimaryNavigation from '../PrimaryNavigation/PrimaryNavigation'

import { getUmmVersionsConfig } from '../../utils/getConfig'

import './Page.scss'

/**
 * @typedef {Object} PageProps
 * @property {ReactNode} children The page content.
 * @property {String} title A string of visually hidden text to serve as the page title
 */

/*
 * Renders a `For` component.
 *
 * The component is used to create a page
 *
 * @param {PageProps} props
 *
 * @component
 * @example <caption>Render a page</caption>
 * return (
 *   <Page title="This is a title">
 *      <div>This is some page content</div>
 *   </Page>
 * )
 */
const Page = ({
  children,
  title
}) => {
  const {
    ummC,
    ummS,
    ummT,
    ummV
  } = getUmmVersionsConfig()

  return (
    <main className="mb-3">
      <header className="page__header">
        <Container>
          <PrimaryNavigation
            items={
              [
                {
                  to: '/manage-collections',
                  title: 'Manage Collections',
                  version: `v${ummC}`
                },
                {
                  to: '/manage-variables',
                  title: 'Manage Variables',
                  version: `v${ummV}`
                },
                {
                  to: '/manage-services',
                  title: 'Manage Services',
                  version: `v${ummS}`
                },
                {
                  to: '/manage-tools',
                  title: 'Manage Tools',
                  version: `v${ummT}`
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
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
}

export default Page
