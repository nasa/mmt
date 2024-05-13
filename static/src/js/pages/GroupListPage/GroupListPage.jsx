import React, { Suspense } from 'react'

import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import LoadingTable from '../../components/LoadingTable/LoadingTable'
import GroupList from '../../components/GroupList/GroupList'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import useAppContext from '../../hooks/useAppContext'

/**
 * Renders a GroupPageHeader component
 *
 * @component
 * @example <caption>Render a GroupPageHeader</caption>
 * return (
 *   <GroupPageHeader />
 * )
 */
const GroupListPageHeader = () => {
  const { user } = useAppContext()
  const { providerId } = user

  return (
    <PageHeader
      breadcrumbs={
        [
          {
            label: 'Groups',
            to: '/groups'
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [{
          icon: FaPlus,
          iconTitle: 'A plus icon',
          title: 'New Group',
          to: 'new',
          variant: 'success'
        }]
      }
      title={`${providerId} Groups`}
    />
  )
}

/**
 * Renders a GroupListPage component
 *
 * @component
 * @example <caption>Render a GroupListPage</caption>
 * return (
 *   <GroupListPage />
 * )
 */
const GroupListPage = () => (
  <Page
    pageType="secondary"
    header={<GroupListPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <GroupList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default GroupListPage
