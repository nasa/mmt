import React, { Suspense } from 'react'
import { useParams } from 'react-router'
import { FaPlus } from 'react-icons/fa'

import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'

import DraftList from '@/js/components/DraftList/DraftList'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

/**
 * Renders a DraftPageHeader component
 *
 * @component
 * @example <caption>Render a DraftPageHeader</caption>
 * return (
 *   <DraftPageHeader />
 * )
 */
const DraftListPageHeader = () => {
  const { draftType } = useParams()

  const conceptType = urlValueTypeToConceptTypeStringMap[draftType]

  return (
    <PageHeader
      title={`${conceptType} Drafts`}
      breadcrumbs={
        [
          {
            label: `${conceptType} Drafts`,
            to: `/drafts/${conceptType}s`,
            active: true
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [
          {
            icon: FaPlus,
            iconTitle: 'A plus icon',
            title: 'New Draft',
            to: 'new',
            variant: 'success'
          }
        ]
      }
    />
  )
}

/**
 * Renders a DraftListPage component
 *
 * @component
 * @example <caption>Render a DraftListPage</caption>
 * return (
 *   <DraftListPage />
 * )
 */
const DraftListPage = () => (
  <Page
    pageType="secondary"
    header={<DraftListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <DraftList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default DraftListPage
