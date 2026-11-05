import React from 'react'
import { Link, useParams } from 'react-router'
import Alert from 'react-bootstrap/Alert'
import pluralize from 'pluralize'

import Button from '@/js/components/Button/Button'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

/**
 * Renders a BulkActionsLandingPageHeader component
 *
 * @component
 * @example <caption>Render a BulkActionsLandingPageHeader</caption>
 * return (
 *   <BulkActionsLandingPageHeader />
 * )
 */
const BulkActionsLandingPageHeader = () => (
  <PageHeader
    pageType="secondary"
    title="Bulk Actions"
  />
)

/**
 * Renders a BulkActionsLandingPage component.
 *
 * Landing page for "Bulk Actions" under Collections. Intended to list all bulk-actions
 * (tasks) once that's implemented; for now it only offers a way to continue an active
 * selection into the edit page, or a prompt to go select collections if there isn't one.
 *
 * @component
 * @example <caption>Render a BulkActionsLandingPage</caption>
 * return (
 *   <BulkActionsLandingPage />
 * )
 */
const BulkActionsLandingPage = () => {
  const { type } = useParams()
  const { selectedCollections, selectedProvider } = useCollectionSelectionContext()

  const selectedCount = selectedCollections.length

  return (
    <Page
      pageType="secondary"
      header={<BulkActionsLandingPageHeader />}
    >
      {
        selectedCount > 0
          ? (
            <Alert variant="info" className="d-flex align-items-center justify-content-between">
              <span>
                {`${selectedCount} ${pluralize('collection', selectedCount)} selected from ${selectedProvider}.`}
              </span>
              <Button to={`/${type}/bulk-actions/edit`} as={Link} variant="primary">
                Continue to Configure Bulk Update
              </Button>
            </Alert>
          )
          : (
            <Alert variant="info">
              To start a bulk action, select one or more collections from
              {' '}
              <Alert.Link href={`/${type}`}>All Collections</Alert.Link>
              {' '}
              and click Continue in the selection bar.
            </Alert>
          )
      }
    </Page>
  )
}

export default BulkActionsLandingPage
