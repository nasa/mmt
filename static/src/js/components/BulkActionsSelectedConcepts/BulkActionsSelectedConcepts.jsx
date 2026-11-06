import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import Table from '@/js/components/Table/Table'

import parseError from '@/js/utils/parseError'

const PAGE_SIZE = 25

/**
 * @typedef {Object} BulkActionsSelectedConceptsProps
 * @property {String[]} conceptIds The concept ids of the selected concepts.
 * @property {Function} onRemove A callback called with a conceptId when its Remove button is clicked.
 * @property {Object} query The GraphQL query to list the given page of concept ids -- shaped `query(params: { conceptId, limit }) { count, items { ... } }`, per getBulkActionsSelectedListAdapter in constants/bulkUpdateFields.js.
 * @property {import('../Table/Table').ColumnDefs[]} columns The Table columns to render per concept, not including the Remove action column this component adds itself.
 * @property {React.ReactNode} noSelectionMessage Shown in place of the table when conceptIds is empty.
 * @property {String} loadingMessage Shown next to the spinner while the current page's concepts are loading.
 */

/**
 * Renders a BulkActionsSelectedConcepts component.
 *
 * Displays the concepts selected for a bulk update, 25 per page, with a Remove action per
 * row. Removal happens immediately (no confirmation) -- the caller surfaces an Undo action
 * via a notification instead.
 *
 * Generic across concept types: the caller supplies the query and columns (see
 * getBulkActionsSelectedListAdapter) instead of hardcoding collections. The query's one
 * top-level field is read positionally, since its name differs per type (`collections` vs
 * `variables`) but the `{ count, items }` shape underneath is always the same.
 *
 * @component
 * @example <caption>Render a BulkActionsSelectedConcepts</caption>
 * return (
 *   <BulkActionsSelectedConcepts
 *     conceptIds={conceptIds}
 *     onRemove={handleRemove}
 *     query={query}
 *     columns={columns}
 *     noSelectionMessage="No collections are selected. Go back to All Collections to select collections to update."
 *     loadingMessage="Loading selected collections…"
 *   />
 * )
 */
const BulkActionsSelectedConcepts = ({
  conceptIds,
  onRemove,
  query,
  columns,
  noSelectionMessage,
  loadingMessage
}) => {
  const [activePage, setActivePage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(conceptIds.length / PAGE_SIZE))

  // Clamp back onto the last valid page, e.g. after removing the last remaining item
  // on what was the final page.
  useEffect(() => {
    if (activePage > totalPages) setActivePage(totalPages)
  }, [activePage, totalPages])

  const pageConceptIds = conceptIds.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE
  )

  const { data, loading, error } = useQuery(query, {
    skip: pageConceptIds.length === 0,
    variables: {
      params: {
        conceptId: pageConceptIds,
        limit: pageConceptIds.length
      }
    }
  })

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <Button
        onClick={() => onRemove(conceptId)}
        size="sm"
        variant="danger"
      >
        Remove
      </Button>
    )
  }, [onRemove])

  const tableColumns = [
    ...columns,
    {
      title: 'Action',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  if (conceptIds.length === 0) {
    return (
      <Alert variant="info">
        {noSelectionMessage}
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center">
        <Spinner animation="border" role="status" size="sm" className="me-2" />
        {loadingMessage}
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

  // One top-level field, name varies by concept type -- read positionally.
  const [rootField] = Object.values(data || {})
  const { items = [] } = rootField || {}

  return (
    <ControlledPaginatedContent
      activePage={activePage}
      count={conceptIds.length}
      limit={PAGE_SIZE}
      setPage={setActivePage}
    >
      {
        ({ pagination }) => (
          <>
            <Table
              id="bulk-actions-selected-concepts-table"
              columns={tableColumns}
              generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
              generateRowKey={({ conceptId }) => `row_${conceptId}`}
              data={items}
              limit={PAGE_SIZE}
              noDataMessage="No selected items found"
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

BulkActionsSelectedConcepts.propTypes = {
  conceptIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  query: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    dataKey: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string
  })).isRequired,
  noSelectionMessage: PropTypes.node.isRequired,
  loadingMessage: PropTypes.string.isRequired
}

export default BulkActionsSelectedConcepts
