import React, { useCallback, useState } from 'react'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { FaEdit, FaTrash } from 'react-icons/fa'

import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import Table from '@/js/components/Table/Table'

import { GET_COLLECTION_PERMISSIONS } from '@/js/operations/queries/getCollectionPermissions'

import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import errorLogger from '@/js/utils/errorLogger'

import Button from '../Button/Button'
import CustomModal from '../CustomModal/CustomModal'

const PermissionList = () => {
  const { addNotification } = useNotificationsContext()

  const [searchParams, setSearchParams] = useSearchParams()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(false)

  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const limit = 20
  const offset = (activePage - 1) * limit

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const { data, refetch } = useSuspenseQuery(GET_COLLECTION_PERMISSIONS, {
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

  const permissionList = items.map((item) => {
    const {
      catalogItemIdentity,
      conceptId,
      name
    } = item
    const { providerId } = catalogItemIdentity

    return {
      conceptId,
      name,
      providerId
    }
  })

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

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <Row>
        <Col className="col-auto">
          <Button
            className="d-flex"
            Icon={FaEdit}
            iconTitle="Edit Button"
            href={`permissions/${conceptId}/edit`}
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
                setSelectedPermission(rowData)
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
  }, [])

  const columns = [
    {
      dataKey: 'name',
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildLinkCell
    },
    {
      dataKey: 'providerId',
      title: 'Provider',
      className: 'col-auto'
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const [deleteAclMutation] = useMutation(DELETE_ACL)

  const handleDelete = () => {
    const { conceptId } = selectedPermission
    deleteAclMutation({
      variables: {
        conceptId
      },
      onCompleted: () => {
        addNotification({
          message: 'Collection permission was successfully deleted.',
          variant: 'success'
        })

        refetch()
      },
      onError: () => {
        addNotification({
          message: 'Error deleting collection permission',
          variant: 'danger'
        })

        errorLogger('Unable delete collection permission', 'Permission List: deleteAcl Mutation')

        setShowDeleteModal(false)
      }
    })

    setShowDeleteModal(false)
  }

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
                    columns={columns}
                    count={count}
                    data={permissionList}
                    generateCellKey={({ name, providerId }, dataKey) => `column_${dataKey}_${name}_${providerId}`}
                    generateRowKey={({ name, providerId }) => `row_${name}_${providerId}`}
                    id="permission-list-table"
                    limit={limit}
                    noDataMessage="No permissions found"
                    offset={offset}
                    setPage={setPage}
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
        message="Are you sure you want to delete this collection permission?"
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

export default PermissionList
