import React, { Suspense } from 'react'

import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import GroupList from '@/js/components/GroupList/GroupList'
import GroupSearchForm from '@/js/components/GroupSearchForm/GroupSearchForm'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

/**
 * Renders a GroupPageHeader component
 *
 * @component
 * @example <caption>Render a GroupPageHeader</caption>
 * return (
 *   <GroupPageHeader />
 * )
 */
const GroupListPageHeader = () => (
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
    title="Groups"
  />
)

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
    <GroupSearchForm />

    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <GroupList />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default GroupListPage
