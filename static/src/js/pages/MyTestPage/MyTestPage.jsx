import React, { Suspense, useState } from 'react'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import KmsConceptVersionSelector from '@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector'

/**
 * Renders a ProvidersPageHeader component
 *
 * @component
 * @example <caption>Render a ProvidersPageHeader</caption>
 * return (
 *   <ProvidersPageHeader />
 * )
 */
const MyTestPageHeader = () => (
  <PageHeader
    title="My Test"
    breadcrumbs={
      [
        {
          label: 'My Test',
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
const MyTestPage = () => {
  const [setSelectedVersion] = useState(null)

  const onVersionSelect = (versionInfo) => {
    setSelectedVersion(versionInfo)
    console.log('Selected version:', versionInfo)
    // You can perform additional actions with the selected version here
  }

  return (
    <Page
      pageType="secondary"
      header={<MyTestPageHeader />}
    >
      <ErrorBoundary>
        <Suspense fallback="Loading...">
          <KmsConceptVersionSelector onVersionSelect={onVersionSelect} />
        </Suspense>
      </ErrorBoundary>
    </Page>
  )
}

export default MyTestPage
