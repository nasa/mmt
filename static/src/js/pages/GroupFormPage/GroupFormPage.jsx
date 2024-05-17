import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import GroupForm from '@/js/components/GroupForm/GroupForm'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import { GET_GROUP } from '@/js/operations/queries/getGroup'

/**
 * Renders a GroupFormPageHeader component
 *
 * @component
 * @example <caption>Render a GroupFormPageHeader</caption>
 * return (
 *   <GroupFormPageHeader />
 * )
 */
const GroupFormPageHeader = ({ isAdminPage }) => {
  const { id = 'new' } = useParams()

  const { data } = useSuspenseQuery(GET_GROUP, {
    skip: id === 'new',
    variables: {
      params: {
        id
      }
    }
  })

  const { group } = data || {}
  const { name } = group || {}

  const newTitle = `New ${isAdminPage ? 'System ' : ''}Group`
  const pageTitle = id === 'new' ? newTitle : `Edit ${name}`
  const title = `${isAdminPage ? 'System ' : ''}Groups`

  return (
    <PageHeader
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: title,
            to: `${isAdminPage ? '/admin' : ''}/groups`
          },
          (
            id !== 'new' && {
              label: name,
              to: `${isAdminPage ? '/admin' : ''}/groups/${id}`
            }
          ),
          {
            label: pageTitle,
            active: true
          }
        ]
      }
      pageType="secondary"
    />
  )
}

GroupFormPageHeader.defaultProps = {
  isAdminPage: false
}

GroupFormPageHeader.propTypes = {
  isAdminPage: PropTypes.bool
}

/**
 * Renders a GroupFormPage component
 *
 * @component
 * @example <caption>Render a GroupFormPage</caption>
 * return (
 *   <GroupFormPage />
 * )
 */
const GroupFormPage = ({ isAdminPage }) => (
  <Page
    pageType="secondary"
    header={<GroupFormPageHeader isAdminPage={isAdminPage} />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <GroupForm isAdminPage={isAdminPage} />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupFormPage.defaultProps = {
  isAdminPage: false
}

GroupFormPage.propTypes = {
  isAdminPage: PropTypes.bool
}

export default GroupFormPage
