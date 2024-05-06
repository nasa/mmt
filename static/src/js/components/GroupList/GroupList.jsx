import React, { useCallback, useState } from 'react'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useSearchParams } from 'react-router-dom'

import { FaEdit, FaTrash } from 'react-icons/fa'

import Button from '../Button/Button'
import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '../CustomModal/CustomModal'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import Table from '../Table/Table'

import { DELETE_GROUP } from '../../operations/mutations/deleteGroup'
import { GET_GROUPS } from '../../operations/queries/getGroups'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import errorLogger from '../../utils/errorLogger'

/**
 * Renders a GroupList component
 *
 * @component
 * @example <caption>Render a GroupList</caption>
 * return (
 *   <GroupList />
 * )
 */
const GroupList = () => {
  const { user } = useAppContext()

  const { addNotification } = useNotificationsContext()

  const { providerId } = user

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(false)

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

  const { data, refetch } = useSuspenseQuery(GET_GROUPS, {
    variables: {
      params: {
        tags: [providerId]
      }
    }
  })

  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{
      query: GET_GROUPS,
      variables: {
        params: {
          tags: [providerId]
        }
      }
    }]
  })

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const handleDelete = () => {
    const { id } = selectedGroup
    deleteGroupMutation({
      variables: {
        id
      },
      onCompleted: () => {
        addNotification({
          message: 'Group deleted successfully',
          variant: 'success'
        })

        refetch()
      },
      onError: () => {
        addNotification({
          message: 'Error deleting group',
          variant: 'danger'
        })

        errorLogger('Unable delete group', 'Group List: deleteGroup Mutation')
      }
    })

    setShowDeleteModal(false)
  }

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <EllipsisLink to={`/groups/${id}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { id } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Button
            className="d-flex"
            Icon={FaEdit}
            iconTitle="Edit Button"
            href={`groups/${id}/edit`}
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
                setSelectedGroup(rowData)
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
      dataKey: 'description',
      title: 'Description',
      className: 'col-auto'
    },
    {
      dataKey: 'tag',
      title: 'Provider',
      className: 'col-auto'
    },
    {
      dataKey: 'members',
      title: 'Members',
      className: 'col-auto',
      dataAccessorFn: (members) => members.count
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const { groups } = data
  const { count, items } = groups

  // We don't have real paging with EDL groups, so split up the returned groups using offset and limit
  const activeItems = items.slice(offset, offset + limit)

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
                ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} groups`
                : 'No groups found'

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
                    id="group-table"
                    columns={columns}
                    generateCellKey={({ id }, dataKey) => `column_${dataKey}_${id}`}
                    generateRowKey={({ id }) => `row_${id}`}
                    data={activeItems}
                    noDataMessage="No groups found"
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
        message="Are you sure you want to delete this group?"
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

export default GroupList
