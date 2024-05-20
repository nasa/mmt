import React, { useCallback } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import { Col, Row } from 'react-bootstrap'
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
    variables: params
  })

  const { acl } = data
  const { collections } = acl

  const { items, count } = collections || {}

  const sortFn = useCallback((key, order) => {
    let nextSortKey

    if (!order) {
      setSearchParams((currentParams) => {
        currentParams.delete('sortKey')

        return Object.fromEntries(currentParams)
      })

      return
    }

    searchParams.set('sortKey', nextSortKey)

    setSearchParams((currentParams) => {
      if (order === 'ascending') nextSortKey = `-${key}`
      if (order === 'descending') nextSortKey = key

      // Reset the page parameter
      currentParams.delete('page')

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
    <Row>
      <Col md={12}>
        {
          items && (
            <Table
              id="permission-collection-table"
              columns={collectionColumns}
              generateCellKey={({ conceptId: columnConceptId }, dataKey) => `column_${dataKey}_${columnConceptId}`}
              generateRowKey={({ conceptId: rowConceptId }) => `row_${rowConceptId}`}
              data={items}
              limit={20}
              count={count}
              noDataMessage="No collections found"
              sortKey={sortKey}
            />
          )
        }
      </Col>
    </Row>

  )
}

export default PermissionCollectionTable
