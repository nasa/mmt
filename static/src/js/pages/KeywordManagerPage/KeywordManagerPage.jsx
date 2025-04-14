import React, { Suspense } from 'react'
import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

// Placeholder component for the keyword management tree
const KeywordManagementTree = () => (
  <div>Keyword Management Tree to be inserted here</div>
)

const KeywordManagerPageHeader = () => (
  <PageHeader
    breadcrumbs={
      [
        {
          label: 'Keyword Manager',
          to: '/keywords',
          active: true
        }
      ]
    }
    pageType="secondary"
    // To be added to/amended
    primaryActions={
      [{
        icon: FaPlus,
        iconTitle: 'A plus icon',
        title: 'Publish New Keyword Version',
        to: 'new',
        variant: 'success'
      }]
    }
    title="Keyword Manager"
  />
)

const KeywordManagerPage = () => (
  <Page
    pageType="secondary"
    header={<KeywordManagerPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <KeywordManagementTree />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default KeywordManagerPage
