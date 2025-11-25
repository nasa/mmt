import React, { Suspense } from 'react'

import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import { GET_CITATION_ASSOCIATIONS } from '@/js/operations/queries/getCitationAssociations'

import ManageCitationAssociations from '@/js/components/ManageCitationAssociations/ManageCitationAssociations'

/**
 * Renders a ManageServiceAssociationsPageHeader component
 *
 * @component
 * @example <caption>Render a ManageServiceAssociationsPageHeader</caption>
 * return (
 *   <ManageServiceAssociationsPageHeader />
 * )
 */
const ManageCitationAssociationsPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_CITATION_ASSOCIATIONS, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { collection } = data

  const { shortName } = collection

  return (
    <PageHeader
      title={`${shortName} Citation Associations`}
      breadcrumbs={
        [
          {
            label: 'Collections',
            to: '/collections'
          },
          {
            label: shortName,
            to: `/collections/${conceptId}`
          },
          {
            label: 'Citation Associations',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a ManageCitationAssociationsPage component
 *
 * @component
 * @example <caption>Render a ManageCitationAssociationsPage</caption>
 * return (
 *   <ManageCitationAssociationsPage />
 * )
 */
const ManageCitationAssociationsPage = () => (
  <Page
    pageType="secondary"
    header={<ManageCitationAssociationsPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <ManageCitationAssociations />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ManageCitationAssociationsPage
