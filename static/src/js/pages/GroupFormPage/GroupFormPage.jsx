import React, { Suspense } from 'react'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import GroupForm from '../../components/GroupForm/GroupForm'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'

import { GET_GROUP } from '../../operations/queries/getGroup'

/**
 * Renders a GroupFormPageHeader component
 *
 * @component
 * @example <caption>Render a GroupFormPageHeader</caption>
 * return (
 *   <GroupFormPageHeader />
 * )
 */
const GroupFormPageHeader = () => {
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

  const pageTitle = id === 'new' ? 'New Group' : `Edit ${name}`

  return (
    <PageHeader
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: 'Groups',
            to: '/groups'
          },
          (
            id !== 'new' && {
              label: name,
              to: `/groups/${id}`
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

/**
 * Renders a GroupFormPage component
 *
 * @component
 * @example <caption>Render a GroupFormPage</caption>
 * return (
 *   <GroupFormPage />
 * )
 */
const GroupFormPage = () => (
  <Page
    pageType="secondary"
    header={<GroupFormPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <GroupForm />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default GroupFormPage
