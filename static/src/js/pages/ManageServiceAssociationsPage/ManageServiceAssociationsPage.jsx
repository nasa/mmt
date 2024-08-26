import React, { Suspense } from 'react'

import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import { GET_SERVICE_ASSOCIATIONS } from '@/js/operations/queries/getServiceAssociations'

import ManageServiceAssociations from '@/js/components/ManageServiceAssociations/ManageServiceAssociations'

/**
 * Renders a ManageServiceAssociationsPageHeader component
 *
 * @component
 * @example <caption>Render a ManageServiceAssociationsPageHeader</caption>
 * return (
 *   <ManageServiceAssociationsPageHeader />
 * )
 */
const ManageServiceAssociationsPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_SERVICE_ASSOCIATIONS, {
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
      title={`${shortName} Service Associations`}
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
            label: 'Service Associations',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a ManageServiceAssociationsPage component
 *
 * @component
 * @example <caption>Render a ManageServiceAssociationsPage</caption>
 * return (
 *   <ManageServiceAssociationsPage />
 * )
 */
const ManageServiceAssociationsPage = () => (
  <Page
    pageType="secondary"
    header={<ManageServiceAssociationsPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <ManageServiceAssociations />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ManageServiceAssociationsPage
