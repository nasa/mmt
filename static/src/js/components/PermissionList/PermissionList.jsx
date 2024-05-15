import React, { useCallback } from 'react'

import { GET_ACLS } from '@/js/operations/queries/getAcls'
import { useSuspenseQuery } from '@apollo/client'
import { Col, Row } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'

import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

const PermissionList = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const limit = 20
  const offset = (activePage - 1) * limit

  const { data } = useSuspenseQuery(GET_ACLS, {
    variables: {
      params: {
        identityType: 'catalog_item',
        limit,
        offset
      }
    }
  })

  const { acls } = data
  const { count, items } = acls

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const buildLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/permissions/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const columns = [
    {
      dataKey: 'name',
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildLinkCell
    },
    {
      title: 'Actions',
      className: 'col-auto'
    }
  ]

  return (
    <Row>
      <Col sm={12}>
        <ControlledPaginatedContent
          activePage={activePage}
          count={count}
          limit={limit}
          setPage={setPage}
        >
          {
            ({
              totalPages,
              pagination,
              firstResultPosition,
              lastResultPosition
            }) => {
              const paginationMessage = count > 0
                ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} permissions`
                : 'No permission found'

              return (
                <>
                  <Row className="d-flex justify-content-between align-items-center">
                    <Col className="mb-4 flex-grow-1" xs="auto">
                      {
                        (!!count) && (
                          <span className="text-secondary fw-bolder">{paginationMessage}</span>
                        )
                      }
                    </Col>
                    {
                      totalPages > 1 && (
                        <Col xs="auto">
                          {pagination}
                        </Col>
                      )
                    }
                  </Row>
                  <Table
                    id="permission-list-table"
                    columns={columns}
                    generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                    generateRowKey={({ conceptId }) => `row_${conceptId}`}
                    data={items}
                    noDataMessage="No permissions found"
                    count={count}
                    setPage={setPage}
                    limit={limit}
                    offset={offset}
                  />

                  {
                    totalPages > 1 && (
                      <Row>
                        <Col xs="12" className="pt-4 d-flex align-items-center justify-content-center">
                          <div>
                            {pagination}
                          </div>
                        </Col>
                      </Row>
                    )
                  }
                </>
              )
            }
          }
        </ControlledPaginatedContent>
      </Col>
    </Row>
  )
}

export default PermissionList
