import React, { useCallback } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import Button from 'react-bootstrap/Button'

import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

/**
 * Renders a RevisionList component
 *
 * @component
 * @example <caption>Render a RevisionList</caption>
 * return (
 *   <RevisionList />
 * )
 */
const RevisionList = () => {
  const { conceptId, type } = useParams()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data
  const { revisions } = concept
  const { count, items } = revisions

  const buildDescriptionCell = useCallback((cellData, rowData) => {
    const published = rowData.revisionId === concept.revisionId

    return (
      (published) ? (
        <EllipsisLink to={`/${type}/${conceptId}`}>
          {[rowData.revisionId, ' - Published'].join('')}
        </EllipsisLink>
      )
        : (
          <EllipsisLink to={`/${type}/${conceptId}/revisions/${rowData.revisionId}`}>
            {[rowData.revisionId, ' - Revision'].join('')}
          </EllipsisLink>
        )
    )
  }, [])

  const buildActionCell = useCallback((cellData, rowData) => (
    rowData?.revisionId !== concept?.revisionId && (
      <Button
        className="btn btn-link"
        type="button"
        variant="link"
        onClick={() => console.log('Revert!')}
      >
        Revert to this revision
      </Button>
    )
  ), [])

  const columns = [
    {
      dataKey: 'revisionId',
      title: 'Description',
      className: 'col-auto',
      dataAccessorFn: buildDescriptionCell
    },
    {
      dataKey: 'revisionDate',
      title: 'Revision Date',
      className: 'col-auto',
      dataAccessorFn: (cellData) => cellData.split('T')[0]
    },
    {
      dataKey: 'userId',
      title: 'Action by',
      className: 'col-auto'
    },
    {
      dataKey: 'published',
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionCell
    }
  ]

  return (
    <Table
      id="revision-results-table"
      columns={columns}
      data={items}
      generateCellKey={({ revisionId }, dataKey) => `column_${dataKey}_${conceptId}_${revisionId}`}
      generateRowKey={({ revisionId }) => `row_${conceptId}_${revisionId}`}
      noDataMessage="No results"
      count={count}
      limit={10}
    />

  )
}

export default RevisionList
