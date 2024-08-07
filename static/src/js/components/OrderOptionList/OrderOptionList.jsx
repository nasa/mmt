import {
  FaEdit,
  FaExclamationCircle,
  FaQuestionCircle,
  FaTrash
} from 'react-icons/fa'
import { Alert } from 'react-bootstrap'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import Row from 'react-bootstrap/Row'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import Table from '@/js/components/Table/Table'

import { DELETE_ORDER_OPTION } from '@/js/operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTIONS } from '@/js/operations/queries/getOrderOptions'

import { DATE_FORMAT } from '@/js/constants/dateFormat'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'

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
  const { addNotification } = useNotificationsContext()
  const { providerIds } = useAvailableProviders()

  const [searchParams, setSearchParams] = useSearchParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrderOption, setSelectedOrderOption] = useState(false)

  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const readableProviders = (providerIds && providerIds.length > 1) ? providerIds.join(', ') : providerIds

  const limit = 20
  const offset = (activePage - 1) * limit

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const { data = {}, refetch } = useSuspenseQuery(GET_ORDER_OPTIONS, {
    skip: (!providerIds || providerIds.length === 0),
    variables: {
      params: {
        limit,
        offset,
        providerId: providerIds
      }
    }
  })

  const [deleteOrderOptionMutation] = useMutation(DELETE_ORDER_OPTION, {
    refetchQueries: [{
      query: GET_ORDER_OPTIONS
    }]
  })

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const handleDelete = () => {
    const { nativeId, providerId } = selectedOrderOption
    deleteOrderOptionMutation({
      variables: {
        nativeId,
        providerId
      },
      onCompleted: () => {
        addNotification({
          message: 'Order option deleted successfully',
          variant: 'success'
        })

        refetch()
      },
      onError: () => {
        addNotification({
          message: 'Error deleting order option',
          variant: 'danger'
        })

        errorLogger('Unable delete order option', 'Order Option List: deleteOrderOption Mutation')
      }
    })

    setShowDeleteModal(false)
  }

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
          <Button
            className="d-flex"
            Icon={FaEdit}
            iconTitle="Edit Button"
            href={`order-options/${conceptId}/edit`}
            variant="primary"
            size="sm"
          >
            Edit
          </Button>
        </Col>
        <Col className="col-auto">
          <Button
            className="d-flex"
            Icon={FaTrash}
            iconTitle="Delete Button"
            onClick={
              () => {
                setSelectedOrderOption(rowData)
                toggleShowDeleteModal(true)
              }
            }
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
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
      dataKey: 'providerId',
      title: 'Provider',
      className: 'col-auto',
      center: true
    },
    {
      dataKey: 'deprecated',
      title: 'Deprecated?',
      className: 'col-auto',
      dataAccessorFn: (cellData) => (cellData ? 'True' : 'False')
    },
    {
      dataKey: 'revisionDate',
      title: 'Last Updated',
      className: 'col-auto',
      dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT)
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const { orderOptions = [] } = data
  const { count = 0, items = [] } = orderOptions

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
                  {
                    (!providerIds || providerIds.length === 0)
                      ? (
                        <Alert variant="info" className="mb-4">
                          <FaQuestionCircle className="me-2 small" />
                          You need providers in order to view Order Options. For assistance,
                          please reach out to the provider administrator or Earthdata Operations (
                          <a href="mailto:support@earthdata.nasa.gov">support@earthdata.nasa.gov</a>
                          ).
                        </Alert>
                      )
                      : (
                        <Alert variant="info" className="mb-4">
                          <FaExclamationCircle className="me-2 small" />
                          You are viewing order options for the following providers:
                          {' '}
                          {readableProviders}
                        </Alert>
                      )
                  }
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
      <CustomModal
        message="Are you sure you want to delete this order option?"
        show={showDeleteModal}
        size="lg"
        toggleModal={toggleShowDeleteModal}
        actions={
          [
            {
              label: 'No',
              variant: 'secondary',
              onClick: () => { toggleShowDeleteModal(false) }
            },
            {
              label: 'Yes',
              variant: 'primary',
              onClick: handleDelete
            }
          ]
        }
      />
    </Row>
  )
}

export default OrderOptionList
