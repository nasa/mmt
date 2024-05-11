import React, { Suspense } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import SystemPermissions from '@/js/components/SystemPermissions/SystemPermissions'

import { GET_GROUP } from '@/js/operations/queries/getGroup'

/**
 * Renders a SystemPermissionsHeader component
 *
 * @component
 * @example <caption>Render a SystemPermissionsHeader</caption>
 * return (
 *   <SystemPermissionsHeader />
 * )
 */
const SystemPermissionsHeader = () => {
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
      title={`${name} System Permissions`}
      breadcrumbs={
        [
          {
            label: 'Groups',
            to: '/admin/groups'
          },
          {
            label: name,
            to: `/admin/groups/${id}`
          },
          {
            label: 'System Permissions',
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

/**
 * Renders a SystemPermissionsPage component
 *
 * @component
 * @example <caption>Render a SystemPermissionsPage</caption>
 * return (
 *   <SystemPermissionsPage />
 * )
 */
const SystemPermissionsPage = () => (
  <Page
    pageType="secondary"
    header={<SystemPermissionsHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <SystemPermissions />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default SystemPermissionsPage
