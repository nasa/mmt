import React, { Suspense } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import ProviderPermissions from '@/js/components/ProviderPermissions/ProviderPermissions'

import { GET_GROUP } from '@/js/operations/queries/getGroup'

/**
 * Renders a ProviderPermissionHeader component
 *
 * @component
 * @example <caption>Render a ProviderPermissionHeader</caption>
 * return (
 *   <ProviderPermissionHeader />
 * )
 */
const ProviderPermissionHeader = () => {
  const { id } = useParams()

  const { data } = useSuspenseQuery(GET_GROUP, {
    variables: {
      params: {
        id
      }
    }
  })

  const { group = {} } = data
  const { name } = group

  return (
    <PageHeader
      title={`${name} Provider Permissions`}
      breadcrumbs={
        [
          {
            label: 'Groups',
            to: '/groups'
          },
          {
            label: name,
            to: `/groups/${id}`
          },
          {
            label: 'Provider Permissions',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a ProviderPermissionsPage component
 *
 * @component
 * @example <caption>Render a ProviderPermissionsPage</caption>
 * return (
 *   <ProviderPermissionsPage />
 * )
 */
const ProviderPermissionsPage = () => (
  <Page
    pageType="secondary"
    header={<ProviderPermissionHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <ProviderPermissions />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default ProviderPermissionsPage
