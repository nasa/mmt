import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Link,
  useParams,
  useSearchParams
} from 'react-router'
import {
  useApolloClient,
  useLazyQuery,
  useQuery
} from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import pluralize from 'pluralize'
import moment from 'moment'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import For from '@/js/components/For/For'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'
import Table from '@/js/components/Table/Table'

import { DATE_FORMAT } from '@/js/constants/dateFormat'

import useAppContext from '@/js/hooks/useAppContext'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import useCollectionSelectionContext from '@/js/hooks/useCollectionSelectionContext'

import {
  GET_BULK_UPDATE_COLLECTION_TASK
} from '@/js/operations/queries/getBulkUpdateCollectionTask'
import {
  GET_BULK_UPDATE_COLLECTION_TASKS
} from '@/js/operations/queries/getBulkUpdateCollectionTasks'

import downloadBulkUpdateTaskCsv from '@/js/utils/downloadBulkUpdateTaskCsv'
import parseError from '@/js/utils/parseError'

const PAGE_SIZE = 25

const TASK_STATUS_BADGE_VARIANTS = {
  IN_PROGRESS: 'warning',
  COMPLETE: 'success'
}

// ["ALL"] (case-insensitive) is CMR's sentinel for "every collection under this
// provider", not a one-item list -- without this check it would misleadingly show as
// "1 collection" instead of "All".
const isAllConceptIdsSentinel = (conceptIds) => (
  Array.isArray(conceptIds) && conceptIds.length === 1 && conceptIds[0]?.toUpperCase() === 'ALL'
)

const getTotalCollectionsDisplay = (requestJsonBody) => {
  // RequestJsonBody is CMR's stored copy of the request, keyed in kebab-case (how
  // cmr-graphql's datasource POSTs it), not the mutation's camelCase argument names.
  const conceptIds = requestJsonBody?.['concept-ids']

  if (isAllConceptIdsSentinel(conceptIds)) return 'All'

  return Array.isArray(conceptIds) ? conceptIds.length : '—'
}

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
    title="Bulk Actions History"
  />
)

/**
 * Renders a BulkActionsJobHistoryCsvButton component.
 *
 * The job-history list doesn't include collectionStatuses (only the single-task detail
 * query does), so building the CSV for one row means fetching that task's detail first.
 * Pulled out into its own component so each row's fetch and loading state stay scoped to
 * that row's button, instead of one shared loading state for the whole table.
 *
 * @component
 * @example <caption>Render a BulkActionsJobHistoryCsvButton</caption>
 * return (
 *   <BulkActionsJobHistoryCsvButton taskId={taskId} providerId={providerId} />
 * )
 */
const BulkActionsJobHistoryCsvButton = ({ taskId, providerId }) => {
  const apolloClient = useApolloClient()

  const [fetchTask, { loading }] = useLazyQuery(GET_BULK_UPDATE_COLLECTION_TASK, {
    variables: {
      params: {
        providerId,
        taskId
      }
    },
    onCompleted: (data) => {
      downloadBulkUpdateTaskCsv({
        apolloClient,
        task: data.bulkUpdateCollectionTask
      })
    }
  })

  return (
    <Button
      onClick={() => fetchTask()}
      disabled={loading}
      loading={loading}
      loadingText="Preparing…"
      size="sm"
      variant="dark"
    >
      CSV Report
    </Button>
  )
}

BulkActionsJobHistoryCsvButton.propTypes = {
  taskId: PropTypes.string.isRequired,
  providerId: PropTypes.string.isRequired
}

/**
 * Renders a BulkActionsJobHistory component.
 *
 * Lists every bulk-update task for a chosen provider, newest first. Scoped to one
 * provider at a time because bulkUpdateCollectionTasks only takes a providerId -- there's
 * no cross-provider listing upstream. Sorting and pagination are also done client-side,
 * since CMR doesn't support either for this query.
 *
 * @component
 * @example <caption>Render a BulkActionsJobHistory</caption>
 * return (
 *   <BulkActionsJobHistory />
 * )
 */
const BulkActionsJobHistory = () => {
  const { type: conceptType } = useParams()
  const [searchParams] = useSearchParams()
  const { providerId, setProviderId } = useAppContext()
  const { providerIds } = useAvailableProviders()

  const [activePage, setActivePage] = useState(1)

  // "Back to All Jobs" (BulkActionsTaskPage) appends ?providerId= to return to the same
  // provider context a task was viewed under. Sync it into the app-wide provider context
  // once on arrival -- the dropdown and the query below both read providerId from there,
  // not from the URL, so this is the one point where the URL can override it.
  useEffect(() => {
    const urlProviderId = searchParams.get('providerId')

    if (urlProviderId && urlProviderId !== providerId) {
      setProviderId(urlProviderId)
    }
    // Deliberately empty deps -- this is a one-time sync from the URL on arrival, not a
    // reaction to providerId changing afterward (e.g. via the dropdown below).
  }, [])

  const { data, loading, error } = useQuery(GET_BULK_UPDATE_COLLECTION_TASKS, {
    skip: !providerId,
    // Job statuses change over time (PENDING -> COMPLETE) -- without this, switching back
    // to a provider already viewed this session would show that stale cached list instead
    // of the server's current one.
    fetchPolicy: 'network-only',
    variables: {
      params: { providerId }
    }
  })

  const items = [...(data?.bulkUpdateCollectionTasks?.items || [])]
    .sort((a, b) => moment.utc(b.createdAt).valueOf() - moment.utc(a.createdAt).valueOf())

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

  // Clamp back onto the last valid page, e.g. after switching to a provider with fewer jobs.
  useEffect(() => {
    if (activePage > totalPages) setActivePage(totalPages)
  }, [activePage, totalPages])

  const pageItems = items.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  )

  // Switching provider is a new list -- always start from its first page rather than
  // whatever page happened to be active for the previous provider.
  useEffect(() => {
    setActivePage(1)
  }, [providerId])

  const buildJobIdCell = (taskId) => (
    <Link to={`/${conceptType}/bulk-actions/${taskId}?providerId=${providerId}`}>
      {taskId}
    </Link>
  )

  const buildStatusCell = (status) => (
    <Badge bg={TASK_STATUS_BADGE_VARIANTS[status] || 'secondary'}>{status}</Badge>
  )

  const buildCreatedAtCell = (createdAt) => moment.utc(createdAt).format(DATE_FORMAT)

  const buildCsvReportCell = (cellData, { taskId }) => (
    <BulkActionsJobHistoryCsvButton taskId={taskId} providerId={providerId} />
  )

  const columns = [
    {
      dataKey: 'taskId',
      title: 'Job ID',
      className: 'col-auto',
      dataAccessorFn: buildJobIdCell
    },
    {
      dataKey: 'status',
      title: 'Status',
      className: 'col-auto',
      dataAccessorFn: buildStatusCell
    },
    {
      dataKey: 'requestJsonBody',
      title: 'Total Collections',
      className: 'col-auto',
      dataAccessorFn: getTotalCollectionsDisplay
    },
    {
      dataKey: 'createdAt',
      title: 'Created At',
      className: 'col-auto',
      dataAccessorFn: buildCreatedAtCell
    },
    {
      title: 'Logs',
      className: 'col-auto',
      dataAccessorFn: buildCsvReportCell
    }
  ]

  return (
    <>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Form.Group controlId="bulk-actions-job-history-provider">
                <Form.Label className="fw-bold">Select Provider Context</Form.Label>
                <Form.Select
                  value={providerId || ''}
                  onChange={(event) => setProviderId(event.target.value)}
                >
                  <For each={providerIds}>
                    {(id) => (<option key={id} value={id}>{id}</option>)}
                  </For>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header className="fw-bold">
          {providerId ? `Job History: ${providerId}` : 'Job History'}
        </Card.Header>
        <Card.Body>
          {
            loading && (
              <div className="d-flex align-items-center">
                <Spinner animation="border" role="status" size="sm" className="me-2" />
                Loading job history…
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
            !loading && !error && items.length === 0 && (
              <Alert variant="info">No bulk update jobs found for this provider.</Alert>
            )
          }

          {
            !loading && !error && items.length > 0 && (
              <ControlledPaginatedContent
                activePage={activePage}
                count={items.length}
                limit={PAGE_SIZE}
                setPage={setActivePage}
              >
                {
                  ({ pagination }) => (
                    <>
                      <Table
                        id="bulk-actions-job-history-table"
                        columns={columns}
                        generateCellKey={({ taskId }, dataKey) => `column_${dataKey}_${taskId}`}
                        generateRowKey={({ taskId }) => `row_${taskId}`}
                        data={pageItems}
                        limit={PAGE_SIZE}
                        noDataMessage="No bulk update jobs found for this provider."
                      />
                      {
                        totalPages > 1 && (
                          <div className="d-flex justify-content-center mt-2">
                            {pagination}
                          </div>
                        )
                      }
                    </>
                  )
                }
              </ControlledPaginatedContent>
            )
          }
        </Card.Body>
      </Card>
    </>
  )
}

/**
 * Renders a BulkActionsLandingPage component.
 *
 * Landing page for "Bulk Actions" under Collections. Shows a banner to continue an active
 * collection selection into the edit page when one exists, plus a job-history table for
 * whichever provider the user picks there. The two use separate provider concepts on
 * purpose -- a user can have an active selection under one provider while browsing
 * another provider's job history.
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
      <p className="text-secondary">View past bulk updates and monitor pending jobs.</p>

      {
        selectedCount > 0 && (
          <Alert variant="info" className="d-flex align-items-center justify-content-between">
            <span>
              {`${selectedCount} ${pluralize('collection', selectedCount)} selected from ${selectedProvider}.`}
            </span>
            <Button to={`/${type}/bulk-actions/edit`} as={Link} variant="primary">
              Continue to Configure Bulk Update
            </Button>
          </Alert>
        )
      }

      <BulkActionsJobHistory />
    </Page>
  )
}

export default BulkActionsLandingPage
