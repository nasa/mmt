import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { useQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import BootstrapTable from 'react-bootstrap/Table'
import Spinner from 'react-bootstrap/Spinner'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'

import {
  GET_COLLECTIONS_SHORT_NAME_VERSION
} from '@/js/operations/queries/getCollectionsShortNameVersion'

import parseError from '@/js/utils/parseError'

const PAGE_SIZE = 25

const STATUS_BADGE_VARIANTS = {
  UPDATED: 'success',
  FAILED: 'danger',
  PENDING: 'warning',
  SKIPPED: 'secondary'
}

/**
 * @typedef {Object} BulkActionsTaskCollectionDetailsProps
 * @property {String} conceptType The route `:type` segment, used to link each row's Concept ID to its collection permalink.
 * @property {Object[]} collectionStatuses The task's per-collection statuses, shaped `[{ conceptId, status, statusMessage }]`.
 */

/**
 * Renders a BulkActionsTaskCollectionDetails component.
 *
 * Shows every collection in a bulk-update task, 25 per page, with its status and an
 * expandable error/skip detail row. Uses bespoke react-bootstrap Table markup instead of
 * the shared Table component, since that one only supports a single row per item and has
 * no way to inject the extra, full-width detail row underneath.
 *
 * A conceptId no longer resolvable by GET_COLLECTIONS_SHORT_NAME_VERSION (e.g. a deleted
 * collection) still gets a row here, just without shortName/version.
 *
 * @component
 * @example <caption>Render a BulkActionsTaskCollectionDetails</caption>
 * return (
 *   <BulkActionsTaskCollectionDetails conceptType="collections" collectionStatuses={collectionStatuses} />
 * )
 */
const BulkActionsTaskCollectionDetails = ({ conceptType, collectionStatuses }) => {
  const [activePage, setActivePage] = useState(1)
  const [expandedConceptIds, setExpandedConceptIds] = useState(new Set())

  const totalPages = Math.max(1, Math.ceil(collectionStatuses.length / PAGE_SIZE))

  // Clamp back onto the last valid page, e.g. if collectionStatuses shrinks after a refresh.
  useEffect(() => {
    if (activePage > totalPages) setActivePage(totalPages)
  }, [activePage, totalPages])

  const pageStatuses = collectionStatuses.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  )

  const pageConceptIds = pageStatuses.map(({ conceptId }) => conceptId)

  const { data, loading, error } = useQuery(GET_COLLECTIONS_SHORT_NAME_VERSION, {
    skip: pageConceptIds.length === 0,
    variables: {
      params: {
        conceptId: pageConceptIds,
        limit: pageConceptIds.length
      }
    }
  })

  const toggleExpanded = (conceptId) => {
    setExpandedConceptIds((current) => {
      const next = new Set(current)

      if (next.has(conceptId)) {
        next.delete(conceptId)
      } else {
        next.add(conceptId)
      }

      return next
    })
  }

  if (collectionStatuses.length === 0) {
    return (
      <Alert variant="info">No collections were part of this task.</Alert>
    )
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <Spinner animation="border" role="status" size="sm" className="me-2" />
        Loading collection details…
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        {`${parseError(error)} Try refreshing the page.`}
      </Alert>
    )
  }

  const collectionsByConceptId = new Map(
    (data?.collections?.items || []).map((item) => [item.conceptId, item])
  )

  return (
    <ControlledPaginatedContent
      activePage={activePage}
      count={collectionStatuses.length}
      limit={PAGE_SIZE}
      setPage={setActivePage}
    >
      {
        ({ pagination }) => (
          <>
            <BootstrapTable bordered striped responsive="md" size="sm">
              <thead>
                <tr>
                  <th>Concept ID</th>
                  <th>Short Name</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {
                  pageStatuses.map(({ conceptId, status, statusMessage }) => {
                    const { shortName, version } = collectionsByConceptId.get(conceptId) || {}
                    const isExpanded = expandedConceptIds.has(conceptId)

                    return (
                      // A React.Fragment (not a second-level array push) keeps each row and
                      // its optional expanded detail row adjacent as one table-row group.
                      // eslint-disable-next-line react/jsx-key
                      <React.Fragment key={conceptId}>
                        <tr>
                          <td>
                            <Link to={`/${conceptType}/${conceptId}`}>{conceptId}</Link>
                          </td>
                          <td>{shortName}</td>
                          <td>{version}</td>
                          <td>
                            <Badge bg={STATUS_BADGE_VARIANTS[status] || 'secondary'}>
                              {status}
                            </Badge>
                          </td>
                          <td>
                            {
                              statusMessage && (
                                <Button
                                  onClick={() => toggleExpanded(conceptId)}
                                  size="sm"
                                  variant="outline-secondary"
                                >
                                  {isExpanded ? 'Hide Error' : 'View Error'}
                                </Button>
                              )
                            }
                          </td>
                        </tr>
                        {
                          isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-0 border-top-0">
                                <Alert variant="danger" className="m-2 mb-2">
                                  {
                                    status === 'FAILED' && (
                                      <Alert.Heading className="h6">Validation Error</Alert.Heading>
                                    )
                                  }
                                  {statusMessage}
                                </Alert>
                              </td>
                            </tr>
                          )
                        }
                      </React.Fragment>
                    )
                  })
                }
              </tbody>
            </BootstrapTable>
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

BulkActionsTaskCollectionDetails.propTypes = {
  conceptType: PropTypes.string.isRequired,
  collectionStatuses: PropTypes.arrayOf(PropTypes.shape({
    conceptId: PropTypes.string.isRequired,
    status: PropTypes.string,
    statusMessage: PropTypes.string
  })).isRequired
}

export default BulkActionsTaskCollectionDetails
