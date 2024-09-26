import React, { useCallback } from 'react'
import pluralize from 'pluralize'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import Table from '@/js/components/Table/Table'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import Pagination from '../Pagination/Pagination'

const PermissionCollectionTable = () => {
  const { conceptId } = useParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const limit = 20
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const offset = (activePage - 1) * limit

  let params = {
    conceptId,
    collectionParams: {
      limit,
      offset
    }
  }

  const sortKey = searchParams.get('sortKey')

  if (sortKey) {
    params = {
      ...params,
      collectionParams: {
        limit,
        offset,
        sortKey
      }
    }
  }

  const { data } = useSuspenseQuery(GET_COLLECTION_PERMISSION, {
    variables: params
  })

  const { acl } = data
  const { collections } = acl

  const { items, count } = collections

  const sortFn = useCallback((key, order) => {
    let nextSortKey

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

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

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

  const totalPages = Math.ceil(count / limit)

  const currentPageIndex = Math.floor(offset / limit)
  const firstResultIndex = currentPageIndex * limit
  const isLastPage = totalPages === activePage
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  const paginationMessage = `Showing ${totalPages > 1 ? `Collection Associations ${firstResultIndex + 1}-${lastResultIndex} of ${count}` : `${count} ${pluralize('Collection Association', count)}`}`

  return (
    <Row className="d-flex justify-content-between align-items-center mb-4 mt-5">
      <Col className="mb-4 mt-4 flex-grow-1" xs="auto">
        {
          (!!count) && (
            <span className="text-secondary fw-bolder">{paginationMessage}</span>
          )
        }
      </Col>
      {
        totalPages > 1 && (
          <Col xs="auto">
            <Pagination
              setPage={setPage}
              activePage={activePage}
              totalPages={totalPages}
            />
          </Col>
        )
      }
      <Col md={12}>
        {
          items && (
            <Table
              columns={collectionColumns}
              count={count}
              data={items}
              generateCellKey={({ conceptId: columnConceptId }, dataKey) => `column_${dataKey}_${columnConceptId}`}
              generateRowKey={({ conceptId: rowConceptId }) => `row_${rowConceptId}`}
              id="permission-collection-table"
              limit={20}
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
