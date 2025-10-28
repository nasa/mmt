import React, { useMemo } from 'react'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import moment from 'moment'

import { GET_GRANULES } from '@/js/operations/queries/getGranules'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'

import { DATE_FORMAT } from '../../constants/dateFormat'

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
const GranulesList = () => {
  const { conceptId } = useParams()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(GET_GRANULES, {
    variables: {
      params: {
        conceptId
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data
  const { granules } = concept
  const { count, items } = granules

  const sortedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => new Date(b.revisionDate) - new Date(a.revisionDate))

    return sorted
  }, [items])

  const columns = [
    {
      dataKey: 'conceptId',
      title: 'Concept Id',
      className: 'col-auto'
    },
    {
      dataKey: 'title',
      title: 'Title',
      className: 'col-auto'
    },

    {
      dataKey: 'revisionDate',
      title: 'Revision Date (UTC)',
      className: 'col-auto',
      dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT)
    }
  ]

  return (
    <Table
      id="granule-results-table"
      columns={columns}
      data={sortedItems}
      generateCellKey={({ revisionId }, dataKey) => `column_${dataKey}_${conceptId}_${revisionId}`}
      generateRowKey={({ revisionId }) => `row_${conceptId}_${revisionId}`}
      noDataMessage="No results"
      count={count}
      limit={10}
    />

  )
}

export default GranulesList
