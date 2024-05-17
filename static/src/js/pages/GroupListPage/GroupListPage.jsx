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
const GroupListPageHeader = ({ isAdminPage }) => {
  const { hasSystemGroup } = usePermissions({
    systemGroup: ['create']
  })

  const title = `${isAdminPage ? 'System ' : ''}Groups`

  return (
    <PageHeader
      breadcrumbs={
        [
          {
            label: title,
            to: `${isAdminPage ? '/admin' : ''}/groups`
          }
        ]
      }
      pageType="secondary"
      primaryActions={
        [{
          icon: FaPlus,
          iconTitle: 'A plus icon',
          title: `New ${isAdminPage ? 'System ' : ''}Group`,
          to: 'new',
          variant: 'success',
          visible: !isAdminPage || hasSystemGroup
        }]
      }
      title={title}
    />
  )
}

GroupListPageHeader.defaultProps = {
  isAdminPage: false
}

GroupListPageHeader.propTypes = {
  isAdminPage: PropTypes.bool
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
const GroupListPage = ({ isAdminPage }) => (
  <Page
    pageType="secondary"
    header={<GroupListPageHeader isAdminPage={isAdminPage} />}
  >
    <GroupSearchForm isAdminPage={isAdminPage} />

    <ErrorBoundary>
      <Suspense fallback={<LoadingTable />}>
        <GroupList isAdminPage={isAdminPage} />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupListPage.defaultProps = {
  isAdminPage: false
}

GroupListPage.propTypes = {
  isAdminPage: PropTypes.bool
}

export default GroupListPage
