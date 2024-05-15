import React, { useCallback } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

const PermissionCollectionTable = () => {
  const { conceptId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  let params = {
    conceptId
  }

  const sortKey = searchParams.get('sortKey')

  if (sortKey) {
    params = {
      ...params,
      collectionParams: {
        sortKey
      }
    }
  }

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    variables: params,
    fetchPolicy: 'no-cache'
  })

  const { acl } = data
  const { catalogItemIdentity } = acl
  const { collectionIdentifier } = catalogItemIdentity
  const { collections } = collectionIdentifier

  const { items } = collections

  const sortFn = useCallback((key, order) => {
    let nextSortKey

    searchParams.set('sortKey', nextSortKey)

    setSearchParams((currentParams) => {
      if (order === 'ascending') nextSortKey = `-${key}`
      if (order === 'descending') nextSortKey = key

      // Set the sort key
      currentParams.set('sortKey', nextSortKey)

      return Object.fromEntries(currentParams)
    })
  }, [])

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId: collectionConceptId } = rowData

    return (
      <EllipsisLink to={`/collections/${collectionConceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])
  const collectionColumns = [
    {
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell,
      dataKey: 'title',
      sortFn: (_, order) => sortFn('entryTitle', order),
      sortKey: 'entryTitle',
      title: 'Collection'
    },
    {
      className: 'col-auto',
      dataKey: 'shortName',
      sortFn: (_, order) => sortFn('shortName', order),
      title: 'Short Name'
    },
    {
      className: 'col-auto',
      dataKey: 'version',
      title: 'Version'
    }
  ]

  return (
    <Table
      id="permission-collection-table"
      columns={collectionColumns}
      generateCellKey={({ conceptId: columnConceptId }, dataKey) => `column_${dataKey}_${columnConceptId}`}
      generateRowKey={({ conceptId: rowConceptId }) => `row_${rowConceptId}`}
      data={items}
      limit={20}
      count={20}
      noDataMessage="No collections found"
      sortKey={sortKey}
    />
  )
}

export default PermissionCollectionTable
