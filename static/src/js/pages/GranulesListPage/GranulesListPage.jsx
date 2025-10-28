import React, { Suspense } from 'react'

import { useParams } from 'react-router'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import GranulesList from '@/js/components/GranulesList/GranulesList'
import { useSuspenseQuery } from '@apollo/client'
import { GET_GRANULES } from '@/js/operations/queries/getGranules'

/**
 * Renders a GranulesListPageHeader component
 *
 * @component
 * @example <caption>Render a GranulesListPageHeader</caption>
 * return (
 *   <GranulesListPageHeader />
 * )
 */
const GranulesListPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_GRANULES, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { collection } = data

  const { shortName: name } = collection

  return (
    <PageHeader
      title={`${name} Granules`}
      breadcrumbs={
        [
          {
            label: 'Collections',
            to: '/collections'
          },
          {
            label: conceptId,
            to: `/collections/${conceptId}`
          },
          {
            label: 'Granules',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a GranulesListPage component
 *
 * @component
 * @example <caption>Render a GranulesListPage</caption>
 * return (
 *   <GranulesListPage />
 * )
 */
const GranulesListPage = () => (
  <Page
    pageType="secondary"
    header={<GranulesListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <GranulesList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default GranulesListPage
