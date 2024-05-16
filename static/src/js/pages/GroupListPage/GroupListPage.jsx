import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FaPlus } from 'react-icons/fa'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import GroupList from '@/js/components/GroupList/GroupList'
import GroupSearchForm from '@/js/components/GroupSearchForm/GroupSearchForm'
import LoadingTable from '@/js/components/LoadingTable/LoadingTable'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import usePermissions from '@/js/hooks/usePermissions'

/**
 * Renders a GroupPageHeader component
 *
 * @component
 * @example <caption>Render a GroupPageHeader</caption>
 * return (
 *   <GroupPageHeader />
 * )
 */
const GroupListPageHeader = ({ isAdmin }) => {
  const { hasSystemGroup } = usePermissions({
    systemGroup: ['create']
  })

  const title = `${isAdmin ? 'System ' : ''}Groups`

  return (
    <PageHeader
      breadcrumbs={
        [
          {
            label: title,
            to: `${isAdmin ? '/admin' : ''}/groups`
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [{
          icon: FaPlus,
          iconTitle: 'A plus icon',
          title: `New ${isAdmin ? 'System ' : ''}Group`,
          to: 'new',
          variant: 'success',
          visible: !isAdmin || hasSystemGroup
        }]
      }
      title={title}
    />
  )
}

GroupListPageHeader.defaultProps = {
  isAdmin: false
}

GroupListPageHeader.propTypes = {
  isAdmin: PropTypes.bool
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
const GroupListPage = ({ isAdmin }) => (
  <Page
    pageType="secondary"
    header={<GroupListPageHeader isAdmin={isAdmin} />}
  >
    <GroupSearchForm isAdmin={isAdmin} />

    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <GroupList isAdmin={isAdmin} />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupListPage.defaultProps = {
  isAdmin: false
}

GroupListPage.propTypes = {
  isAdmin: PropTypes.bool
}

export default GroupListPage
