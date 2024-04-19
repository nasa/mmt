import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  Col,
  Placeholder,
  Row
} from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import moment from 'moment'

import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Page from '../Page/Page'
import Table from '../Table/Table'

import useAppContext from '../../hooks/useAppContext'

import { GET_ORDER_OPTIONS } from '../../operations/queries/getOrderOptions'

import errorLogger from '../../utils/errorLogger'
import parseError from '../../utils/parseError'
import { DATE_FORMAT } from '../../constants/dateFormat'

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

  const [orderOptionList, setOrderOptionList] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const activePage = parseInt(searchParams.get('page'), 10) || 1

  const limit = 20
  const offset = (activePage - 1) * limit

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const [getOrderOptions] = useLazyQuery(GET_ORDER_OPTIONS, {
    variables: {
      params: {
        providerId,
        limit,
        offset
      }
    },
    onCompleted: (getData) => {
      const { orderOptions } = getData

      setOrderOptionList(orderOptions)
      setLoading(false)
    },
    onError: (getError) => {
      errorLogger('Unable to get Order Options', 'Order Options: getOrderOptions')
      setError(getError)
      setLoading(false)
    }
  })

  useEffect(() => {
    setLoading(true)
    getOrderOptions()
  }, [activePage])

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/order-options/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

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
    }
  ]

  const { count, items = [] } = orderOptionList || {}

  return (
    <Page
      title={`${providerId} Order Options`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: 'Order Options',
            to: '/order-options',
            active: true
          }
        ]
      }
    >
      <Row>
        <Col sm={12}>
          {error && <ErrorBanner message={parseError(error)} />}
          {
            !error && (
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
                        <Row className="d-flex justify-content-between align-items-center mb-4">
                          <Col className="mb-4 flex-grow-1" xs="auto">
                            {
                              !count && loading && (
                                <div className="w-100">
                                  <span className="d-block">
                                    <Placeholder as="span" animation="glow">
                                      <Placeholder xs={8} />
                                    </Placeholder>
                                  </span>
                                </div>
                              )
                            }
                            {
                              (!!count || (!loading && !count)) && (
                                <span className="text-secondary fw-bolder">{paginationMessage}</span>
                              )
                            }
                          </Col>
                          <Col className="mb-4 flex-grow-1" xs="auto" />
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
                          loading={loading}
                          data={items}
                          error={error}
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
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

export default OrderOptionList
