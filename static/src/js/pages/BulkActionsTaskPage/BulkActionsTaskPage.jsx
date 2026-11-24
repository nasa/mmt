import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router'
import { useApolloClient, useQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import Button from '@/js/components/Button/Button'
import BulkActionsTaskCollectionDetails from '@/js/components/BulkActionsTaskCollectionDetails/BulkActionsTaskCollectionDetails'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

import useAppContext from '@/js/hooks/useAppContext'

import {
  GET_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/queries/getBulkUpdateCollectionTask'

import downloadBulkUpdateTaskCsv from '@/js/utils/downloadBulkUpdateTaskCsv'
import parseError from '@/js/utils/parseError'

// Per-collection statuses that count as "done" for percent complete -- a collection
// either lands in one of these or stays PENDING. SKIPPED is grouped into the Failed tile
// for display, but still counts toward completion, so a task where every collection was
// skipped reads as 100% rather than stuck at 0%.
const TERMINAL_STATUSES = ['UPDATED', 'FAILED', 'SKIPPED']

/**
 * Renders a BulkActionsTaskPageHeader component
 *
 * @component
 * @example <caption>Render a BulkActionsTaskPageHeader</caption>
 * return (
 *   <BulkActionsTaskPageHeader />
 * )
 */
const BulkActionsTaskPageHeader = ({ backToAllJobsPath }) => {
  const { taskId } = useParams()

  return (
    <>
      <Link to={backToAllJobsPath} className="d-inline-block mb-2">Back to All Jobs</Link>
      <PageHeader
        pageType="secondary"
        title={`Job Status: ${taskId}`}
      />
    </>
  )
}

BulkActionsTaskPageHeader.propTypes = {
  backToAllJobsPath: PropTypes.string.isRequired
}

/**
 * Renders a BulkActionsTaskPage component.
 *
 * Shows a bulk-update task's overall progress and the status of every collection it
 * covered, with an expandable error/skip reason per collection. Linked to from the "Bulk
 * Update Submitted" modal's "View Job Status" action and from the Bulk Actions landing
 * page's job history table -- both append `?providerId=`, since `bulkUpdateCollectionTask`
 * requires a provider and this route doesn't otherwise carry one. Falls back to the
 * global provider context if that query param is missing (e.g. a bookmarked bare URL).
 *
 * @component
 * @example <caption>Render a BulkActionsTaskPage</caption>
 * return (
 *   <BulkActionsTaskPage />
 * )
 */
const BulkActionsTaskPage = () => {
  const navigate = useNavigate()
  const apolloClient = useApolloClient()
  const [downloadingCsv, setDownloadingCsv] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { taskId, type: conceptType } = useParams()
  const [searchParams] = useSearchParams()
  const { providerId: appContextProviderId } = useAppContext()

  const providerId = searchParams.get('providerId') || appContextProviderId

  const backToAllJobsPath = `/${conceptType}/bulk-actions${providerId ? `?providerId=${providerId}` : ''}`

  const {
    data, loading, error, refetch
  } = useQuery(GET_BULK_UPDATE_COLLECTION_TASK, {
    skip: !providerId,
    variables: {
      params: {
        providerId,
        taskId
      }
    }
  })

  const task = data?.bulkUpdateCollectionTask

  const handleRetryFailed = () => {
    const { requestJsonBody, collectionStatuses = [] } = task

    const failedConceptIds = collectionStatuses
      .filter(({ status }) => status === 'FAILED')
      .map(({ conceptId }) => conceptId)

    // RequestJsonBody is CMR's stored copy of the request, keyed in kebab-case (how
    // cmr-graphql's datasource POSTs it), not the mutation's camelCase argument names.
    const {
      'update-field': updateField,
      'update-type': updateType,
      'find-value': findValue,
      'update-value': updateValue
    } = requestJsonBody || {}

    navigate(`/${conceptType}/bulk-actions/edit`, {
      state: {
        retry: {
          conceptIds: failedConceptIds,
          providerId,
          updateField,
          updateType,
          findValue,
          updateValue
        }
      }
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)

    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true)

    try {
      await downloadBulkUpdateTaskCsv({
        apolloClient,
        task
      })
    } finally {
      setDownloadingCsv(false)
    }
  }

  return (
    <Page
      pageType="secondary"
      header={<BulkActionsTaskPageHeader backToAllJobsPath={backToAllJobsPath} />}
    >
      {
        !providerId && (
          <Alert variant="danger">
            A provider is required to look up this task. Return to
            {' '}
            <Link to={`/${conceptType}/bulk-actions`}>Bulk Actions</Link>
            {' '}
            and open this job from there.
          </Alert>
        )
      }

      {
        loading && (
          <div className="d-flex align-items-center">
            <Spinner animation="border" role="status" size="sm" className="me-2" />
            Loading task status…
          </div>
        )
      }

      {
        error && (
          <Alert variant="danger">
            {`${parseError(error)} Try refreshing the page.`}
          </Alert>
        )
      }

      {
        task && (() => {
          const { statusMessage, collectionStatuses = [] } = task

          const total = collectionStatuses.length
          const countByStatus = collectionStatuses.reduce((counts, { status: statusForCount }) => (
            {
              ...counts,
              [statusForCount]: (counts[statusForCount] || 0) + 1
            }
          ), {})

          const updated = countByStatus.UPDATED || 0
          const skipped = countByStatus.SKIPPED || 0
          const failed = (countByStatus.FAILED || 0) + skipped
          const pending = countByStatus.PENDING || 0

          const completedCount = TERMINAL_STATUSES
            .reduce((sum, terminalStatus) => sum + (countByStatus[terminalStatus] || 0), 0)
          const percentComplete = total === 0 ? 0 : Math.round((completedCount / total) * 100)

          const hasFailures = failed > 0

          return (
            <>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <p className="text-secondary mb-0">Monitor the progress of your bulk update.</p>
                <div className="d-flex gap-2">
                  {
                    hasFailures && (
                      <Button onClick={handleRetryFailed} variant="warning">
                        New Bulk Update from Failed
                      </Button>
                    )
                  }
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    loading={refreshing}
                    loadingText="Refreshing…"
                    variant="secondary"
                  >
                    Refresh
                  </Button>
                  <Button
                    onClick={handleDownloadCsv}
                    disabled={downloadingCsv}
                    loading={downloadingCsv}
                    loadingText="Preparing…"
                    variant="dark"
                  >
                    Download CSV
                  </Button>
                </div>
              </div>

              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Overall Progress</span>
                  <span className="fw-bold text-primary">{`${percentComplete}% Complete`}</span>
                </Card.Header>
                <Card.Body>
                  {
                    statusMessage && (
                      <p className="text-secondary">{statusMessage}</p>
                    )
                  }
                  <Row className="text-center">
                    <Col>
                      <div className="h4 mb-0">{total}</div>
                      <div className="small text-uppercase text-secondary">Total</div>
                    </Col>
                    <Col className="border-start">
                      <div className="h4 mb-0 text-success">{updated}</div>
                      <div className="small text-uppercase text-success">Updated</div>
                    </Col>
                    <Col className="border-start">
                      <div className="h4 mb-0 text-danger">{failed}</div>
                      <div className="small text-uppercase text-danger">Failed</div>
                    </Col>
                    <Col className="border-start">
                      <div className="h4 mb-0 text-warning">{pending}</div>
                      <div className="small text-uppercase text-warning">Pending</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Collection Details</span>
                  <span className="fw-bold text-primary">{`${total} Items`}</span>
                </Card.Header>
                <Card.Body>
                  <BulkActionsTaskCollectionDetails
                    conceptType={conceptType}
                    collectionStatuses={collectionStatuses}
                  />
                </Card.Body>
              </Card>
            </>
          )
        })()
      }
    </Page>
  )
}

export default BulkActionsTaskPage
