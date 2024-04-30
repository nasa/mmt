import React, { useCallback } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Link, useSearchParams } from 'react-router-dom'
import moment from 'moment'

import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

import { GET_ORDER_OPTIONS } from '../../operations/queries/getOrderOptions'

import { DATE_FORMAT } from '../../constants/dateFormat'

import useAppContext from '../../hooks/useAppContext'

/**
 * Renders a OrderOptionList component
 *
 * @component
 * @example <caption>Render a OrderOptionList</caption>
 * return (
 *   <OrderOptionList />
 * )
 */
const OrderOptionList = () => {
  const { user } = useAppContext()

  const { providerId } = user

  const [searchParams, setSearchParams] = useSearchParams()

  const activePage = parseInt(searchParams.get('page'), 10) || 1

  const limit = 20
  const offset = (activePage - 1) * limit

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const { data } = useSuspenseQuery(GET_ORDER_OPTIONS, {
    variables: {
      params: {
        providerId,
        limit,
        offset
      }
    }
  })

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/order-options/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Link to={`/order-options/${conceptId}/edit`}>Edit</Link>
        </Col>
      </Row>
    )
  })

  const columns = [
    {
      dataKey: 'name',
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell
    },
    {
      dataKey: 'scope',
      title: 'Scope',
      className: 'col-auto'
    },
    {
      dataKey: 'deprecated',
      title: 'Deprecated?',
      className: 'col-auto',
      dataAccessorFn: (cellData) => (cellData || 'false')
    },
    {
      dataKey: 'revisionDate',
      title: 'Last Updated',
      className: 'col-auto',
      dataAccessorFn: (cellData) => moment(cellData).format(DATE_FORMAT)
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]
  const { orderOptions } = data
  const { count, items } = orderOptions

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
                ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} order options`
                : 'No order option found'

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
                    id="order-option-table"
                    columns={columns}
                    generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                    generateRowKey={({ conceptId }) => `row_${conceptId}`}
                    data={items}
                    noDataMessage="No order options found"
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

export default OrderOptionList
