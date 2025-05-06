import { capitalize, trimEnd } from 'lodash-es'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import Button from 'react-bootstrap/Button'
import React, { useCallback } from 'react'

import moment from 'moment'

import { DATE_FORMAT } from '@/js/constants/dateFormat'
import conceptTypeQueries from '@/js/constants/conceptTypeQueries'
import restoreRevisionMutations from '@/js/constants/restoreRevisionMutations'

import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

import useNotificationsContext from '../../hooks/useNotificationsContext'
import errorLogger from '../../utils/errorLogger'

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

  const { addNotification } = useNotificationsContext()

  const formattedType = capitalize(trimEnd(type, 's'))

  const { data } = useSuspenseQuery(conceptTypeQueries[formattedType], {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [formattedType.toLowerCase()]: concept } = data
  const { revisions, revisionId: conceptRevisionId } = concept
  const { count, items } = revisions

  const buildDescriptionCell = useCallback((cellData, rowData) => {
    const { revisionId: rowDataRevisionId } = rowData
    const isPublished = rowDataRevisionId === conceptRevisionId

    let descriptionCellContent

    if (isPublished) {
      descriptionCellContent = (
        <EllipsisLink to={`/${type}/${conceptId}`}>
          {[rowDataRevisionId, ' - Published'].join('')}
        </EllipsisLink>
      )
    } else {
      descriptionCellContent = (
        <EllipsisLink to={`/${type}/${conceptId}/revisions/${rowDataRevisionId}`}>
          {[rowDataRevisionId, ' - Revision'].join('')}
        </EllipsisLink>
      )
    }

    return descriptionCellContent
  }, [])

  const [restoreMutation] = useMutation(restoreRevisionMutations[formattedType], {
    refetchQueries: [{
      query: conceptTypeQueries[formattedType],
      variables: {
        params: {
          conceptId
        }
      }
    }]
  })

  const handleRevert = (revisionId) => {
    restoreMutation({
      variables: {
        conceptId,
        revisionId
      },
      onCompleted: () => {
        addNotification({
          message: `${formattedType} revision created successfully`,
          variant: 'success'
        })
      },
      onError: () => {
        addNotification({
          message: `Error creating ${formattedType.toLowerCase()} revision`,
          variant: 'danger'
        })

        errorLogger('Error reverting record', 'handleRevert: restoreMutation')
      }
    })
  }

  const buildActionCell = useCallback((cellData, rowData) => {
    const { revisionId: rowDataRevisionId } = rowData
    const { revisionId: currRevisionId } = concept
    const isPublished = rowDataRevisionId === currRevisionId

    let actionCellContent

    if (!isPublished) {
      actionCellContent = (
        <Button
          className="btn btn-link"
          type="button"
          variant="link"
          onClick={() => { handleRevert(rowDataRevisionId) }}
        >
          Revert to this revision
        </Button>
      )
    } else {
      actionCellContent = null
    }

    return actionCellContent
  })

  const columns = [
    {
      dataKey: 'revisionId',
      title: 'Description',
      className: 'col-auto',
      dataAccessorFn: buildDescriptionCell
    },
    {
      dataKey: 'revisionDate',
      title: 'Revision Date (UTC)',
      className: 'col-auto',
      dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT)
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
