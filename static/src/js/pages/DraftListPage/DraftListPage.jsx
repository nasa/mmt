import React, { Suspense } from 'react'

import { FaPlus } from 'react-icons/fa'

import { useParams } from 'react-router'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import DraftList from '../../components/DraftList/DraftList'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import useAppContext from '../../hooks/useAppContext'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'

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

  const { user } = useAppContext()
  const { providerId } = user

  const conceptType = urlValueTypeToConceptTypeMap[draftType]

  return (
    <PageHeader
      title={`${providerId} ${conceptType} Drafts`}
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
