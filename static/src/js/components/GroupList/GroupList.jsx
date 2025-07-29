import { Alert } from 'react-bootstrap'
import {
  FaEdit,
  FaQuestionCircle,
  FaTrash
} from 'react-icons/fa'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import Row from 'react-bootstrap/Row'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import usePermissions from '@/js/hooks/usePermissions'

import { DELETE_GROUP } from '@/js/operations/mutations/deleteGroup'
import { GET_GROUPS } from '@/js/operations/queries/getGroups'

import errorLogger from '@/js/utils/errorLogger'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Table from '@/js/components/Table/Table'

/**
 * Renders a GroupList component
 *
 * @component
 * @example <caption>Render a GroupList</caption>
 * return (
 *   <GroupList />
 * )
 */
const GroupList = ({ isAdminPage }) => {
  const { addNotification } = useNotificationsContext()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(false)

  const { hasSystemGroup } = usePermissions({
    systemGroup: ['create']
  })

  // Pull parameters out of URL
  const [searchParams, setSearchParams] = useSearchParams()
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const name = searchParams.get('name') || ''
  const providers = isAdminPage ? 'CMR' : searchParams.get('providers')
  const encodedMembers = searchParams.get('members') || []
  const decodedMembers = Buffer.from(encodedMembers, 'base64').toString() || '[]'
  const userIds = JSON.parse(decodedMembers)?.map((member) => member.id)

  const limit = 20
  const offset = (activePage - 1) * limit

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const groupVariables = {
    params: {
      excludeTags: ['CMR'],
      limit,
      name,
      offset,
      tags: providers?.split(',') || [],
      userIds: userIds.length > 0 ? userIds : undefined
    }
  }

  // If we are on the admin page, always use the 'CMR' provider
  if (isAdminPage) {
    delete groupVariables.params.excludeTags
  }

  const { data, refetch } = useSuspenseQuery(GET_GROUPS, {
    variables: groupVariables,
    // Providers are required, if a user hasn't selected any then skip the network call
    skip: !isAdminPage && !providers
  })

  const [deleteGroupMutation] = useMutation(DELETE_GROUP, {
    refetchQueries: [{
      query: GET_GROUPS,
      variables: groupVariables
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
      <EllipsisLink to={`${isAdminPage ? '/admin' : ''}/groups/${id}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { id, members } = rowData
    const { count } = members

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
          <div
            title={count > 0 ? 'Can\'t delete groups that have members.' : null}
          >
            <Button
              className="d-flex"
              disabled={count > 0}
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
          </div>
        </Col>
      </Row>
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
      dataKey: 'description',
      title: 'Description',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
    },
    !isAdminPage && {
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
    // Hide the Actions column if the user does not have the correct permission
    (!isAdminPage || hasSystemGroup) && {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const { groups } = data || {}
  const { count, items } = groups || {}

  return (
    <Row className="mt-5">
      <Col sm={12}>
        {
          !providers ? (
            <Alert variant="info" className="mb-4">
              <FaQuestionCircle className="me-2 small" />
              Required fields not selected
            </Alert>
          ) : (
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
                        columns={columns.filter(Boolean)}
                        generateCellKey={({ id }, dataKey) => `column_${dataKey}_${id}`}
                        generateRowKey={({ id }) => `row_${id}`}
                        data={items}
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
          )
        }
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

GroupList.defaultProps = {
  isAdminPage: false
}

GroupList.propTypes = {
  isAdminPage: PropTypes.bool
}

export default GroupList
