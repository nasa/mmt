import { useSuspenseQuery } from '@apollo/client'

import React, { Suspense } from 'react'

import { useParams } from 'react-router'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import Permission from '@/js/components/Permission/Permission'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

/**
 * Renders a PermissionListPageHeader component
 *
 * @component
 * @example <caption>Render a PermissionPageHeader</caption>
 * return (
 *   <PermissionPageHeader />
 * )
 */
const PermissionPageHeader = () => {
  const { conceptId } = useParams()

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    variables: {
      conceptId
    }
  })

  const { acl } = data
  const { name } = acl

  return (
    <PageHeader
      breadcrumbs={
        [
          {
            label: 'Collection Permissions',
            to: '/permissions'
          },
          {
            label: name,
            active: true
          }
        ]
      }
      pageType="secondary"
      title={name}
    />
  )
}

/**
 * Renders a PermissionPage component
 *
 * @component
 * @example <caption>Render a PermissionPage</caption>
 * return (
 *   <PermissionPage />
 * )
 */
const PermissionPage = () => (
  <Page
    pageType="secondary"
    header={<PermissionPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <Permission />
      </Suspense>
    </ErrorBoundary>
  </Page>

)

export default PermissionPage
