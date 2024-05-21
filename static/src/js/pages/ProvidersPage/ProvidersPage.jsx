import React, { Suspense } from 'react'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import Providers from '@/js/components/Providers/Providers'

/**
 * Renders a ProvidersPageHeader component
 *
 * @component
 * @example <caption>Render a ProvidersPageHeader</caption>
 * return (
 *   <ProvidersPageHeader />
 * )
 */
const ProvidersPageHeader = () => (
  <PageHeader
    title="My Providers"
    breadcrumbs={
      [
        {
          label: 'My Providers',
          active: true
        }
      ]
    }
    pageType="secondary"
  />
)

/**
 * Renders a ProvidersPage component
 *
 * @component
 * @example <caption>Render a ProvidersPage</caption>
 * return (
 *   <ProvidersPage />
 * )
 */
const ProvidersPage = () => (
  <Page
    pageType="secondary"
    header={<ProvidersPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <Providers />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ProvidersPage
