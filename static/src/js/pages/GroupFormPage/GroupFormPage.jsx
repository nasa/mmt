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
const GroupFormPageHeader = ({ isAdmin }) => {
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

  const newTitle = `New ${isAdmin ? 'System ' : ''}Group`
  const pageTitle = id === 'new' ? newTitle : `Edit ${name}`
  const title = `${isAdmin ? 'System ' : ''}Groups`

  return (
    <PageHeader
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: title,
            to: `${isAdmin ? '/admin' : ''}/groups`
          },
          (
            id !== 'new' && {
              label: name,
              to: `${isAdmin ? '/admin' : ''}/groups/${id}`
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
  isAdmin: false
}

GroupFormPageHeader.propTypes = {
  isAdmin: PropTypes.bool
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
const GroupFormPage = ({ isAdmin }) => (
  <Page
    pageType="secondary"
    header={<GroupFormPageHeader isAdmin={isAdmin} />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <GroupForm isAdmin={isAdmin} />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

GroupFormPage.defaultProps = {
  isAdmin: false
}

GroupFormPage.propTypes = {
  isAdmin: PropTypes.bool
}

export default GroupFormPage
