import React, {
  Suspense,
  useCallback,
  useState
} from 'react'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'

import { FaEdit, FaTrash } from 'react-icons/fa'

import Button from '../Button/Button'
import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '../CustomModal/CustomModal'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

import { DELETE_ORDER_OPTION } from '../../operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTIONS } from '../../operations/queries/getOrderOptions'

import { DATE_FORMAT } from '../../constants/dateFormat'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import errorLogger from '../../utils/errorLogger'

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

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const { providerId } = user

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrderOption, setSelectedOrderOption] = useState(false)

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

  const { data, refetch } = useSuspenseQuery(GET_ORDER_OPTIONS, {
    variables: {
      params: {
        providerId,
        limit,
        offset
      }
    }
  })

  const [deleteOrderOptionMutation] = useMutation(DELETE_ORDER_OPTION, {
    refetchQueries: [{
      query: GET_ORDER_OPTIONS,
      variables: {
        params: {
          providerId
        }
      }
    }]
  })

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const handleEdit = (conceptId) => {
    navigate(`/order-options/${conceptId}/edit`)
  }

  const handleDelete = () => {
    const { nativeId } = selectedOrderOption
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
            onClick={() => handleEdit(conceptId)}
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
                toggleShowDeleteModal(true)
                setSelectedOrderOption(rowData)
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
      dataKey: 'deprecated',
      title: 'Deprecated?',
      className: 'col-auto',
      dataAccessorFn: (cellData) => (cellData ? 'True' : 'False')
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
    <Suspense>

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
    </Suspense>

  )
}

export default OrderOptionList
