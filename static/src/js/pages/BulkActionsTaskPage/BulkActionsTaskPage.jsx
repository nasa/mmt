import React from 'react'
import { useParams } from 'react-router'
import Alert from 'react-bootstrap/Alert'

import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

/**
 * Renders a BulkActionsTaskPageHeader component
 *
 * @component
 * @example <caption>Render a BulkActionsTaskPageHeader</caption>
 * return (
 *   <BulkActionsTaskPageHeader />
 * )
 */
const BulkActionsTaskPageHeader = () => {
  const { taskId, type } = useParams()

  return (
    <PageHeader
      breadcrumbs={
        [
          {
            label: 'Bulk Actions',
            to: `/${type}/bulk-actions`
          },
          {
            label: taskId,
            active: true
          }
        ]
      }
      pageType="secondary"
      title={`Bulk Action Task: ${taskId}`}
    />
  )
}

/**
 * Renders a BulkActionsTaskPage component.
 *
 * Placeholder status page for a single collection bulk-update task, linked to from the
 * "Bulk Update Submitted" modal's "View Job Status" action.
 *
 * @component
 * @example <caption>Render a BulkActionsTaskPage</caption>
 * return (
 *   <BulkActionsTaskPage />
 * )
 */
const BulkActionsTaskPage = () => {
  const { taskId } = useParams()

  return (
    <Page
      pageType="secondary"
      header={<BulkActionsTaskPageHeader />}
    >
      <Alert variant="info">
        {`Task ${taskId} was submitted. Its status is not available yet -- detailed status reporting for this task is coming soon.`}
      </Alert>
    </Page>
  )
}

export default BulkActionsTaskPage
