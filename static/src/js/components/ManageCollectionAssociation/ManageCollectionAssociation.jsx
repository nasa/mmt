import { Col, Row } from 'react-bootstrap'
import { camelCase } from 'lodash-es'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import React, { useCallback, useState } from 'react'

import pluralize from 'pluralize'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Table from '@/js/components/Table/Table'

import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

import useAccessibleEvent from '@/js/hooks/useAccessibleEvent'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'

import errorLogger from '@/js/utils/errorLogger'
import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'

/**
 * Renders a ManageCollectionAssociation component
 *
 * @component
 * @example <caption>Render a ManageCollectionAssociation</caption>
 * return (
 *   <ManageCollectionAssociation />
 * )
 */
const ManageCollectionAssociation = () => {
  const { conceptId } = useParams()

  const { addNotification } = useNotificationsContext()

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  // Variables for deletion mutation
  const [collectionConceptIds, setCollectionConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Variables for pagination
  const [searchParams, setSearchParams] = useSearchParams()
  const [activePage, setActivePage] = useState(1)
  const limit = 20
  const offset = (activePage - 1) * limit

  let params = {
    params: {
      conceptId
    },
    collectionsParams: {
      limit,
      offset
    }
  }

  const sortKey = searchParams.get('sortKey')

  if (sortKey) {
    params = {
      ...params,
      collectionsParams: {
        limit,
        offset,
        sortKey
      }
    }
  }

  const { data, refetch } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: params,
    fetchPolicy: 'network-only'
  })

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION, {
    onCompleted: () => {
      setShowDeleteModal(false)

      // Add a success notification
      addNotification({
        message: 'Collection Associations Deleted Successfully!',
        variant: 'success'
      })

      setCollectionConceptIds([])
      refetch() // Refetch the data to update the associated collections list
    },
    onError: () => {
      setShowDeleteModal(false)
      addNotification({
        message: 'Error disassociating collection',
        variant: 'danger'
      })

      errorLogger(`Unable to disassociate collection record for ${derivedConceptType}`, 'Manage Collection Association: deleteAssociation Mutation')
    }
  })

  // Handles deleting selected collection
  const handleDeleteAssociation = () => {
    setIsDeleting(true)
    deleteAssociationMutation({
      variables: {
        conceptId,
        associatedConceptIds: collectionConceptIds
      }
    }).finally(() => {
      setIsDeleting(false)
    })
  }

  const sortFn = useCallback((key, order) => {
    let nextSortKey

    searchParams.set('sortKey', nextSortKey)

    setSearchParams((currentParams) => {
      if (order === 'ascending') nextSortKey = `-${key}`
      if (order === 'descending') nextSortKey = key

      // Set the sort key
      currentParams.set('sortKey', nextSortKey)

      return Object.fromEntries(currentParams)
    })

    setActivePage(1) // Reset to first page when sorting
  }, [])

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  // Adds or removes checked collections from collectionConceptIds array
  // which is provided to the deleteMutation
  const handleCheckbox = (event) => {
    const { target } = event
    const { value } = target

    if (target.checked) {
      setCollectionConceptIds([...collectionConceptIds, value])
    } else {
      setCollectionConceptIds(collectionConceptIds.filter((item) => item !== value))
    }
  }

  // Renders a checkbox for each row
  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId: collectionConceptId } = rowData

    return (
      <div className="d-flex m-2">
        <input
          className="form-check-input"
          id="flexCheckDefault"
          onClick={handleCheckbox}
          type="checkbox"
          value={collectionConceptId}
        />
      </div>
    )
  })

  const columns = [
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    },
    {
      dataKey: 'shortName',
      title: 'Short Name',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell,
      sortFn: (_, order) => sortFn('shortName', order)
    },
    {
      dataKey: 'version',
      title: 'Version',
      className: 'col-auto',
      align: 'center'
    },
    {
      dataKey: 'provider',
      title: 'Provider',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: buildEllipsisTextCell,
      sortFn: (_, order) => sortFn('provider', order)
    }
  ]

  const setPage = (nextPage) => {
    setActivePage(nextPage)
  }

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  // Accessible event props for the delete link
  const accessibleEventProps = useAccessibleEvent(() => {
    toggleShowDeleteModal(true)
  })

  const { [camelCase(derivedConceptType)]: concept } = data

  const { collections: associatedCollections } = concept

  const { items = [], count } = associatedCollections

  return (
    <div>
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
              ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} Collection ${pluralize('Association', count)}`
              : 'No collection associations found'

            return (
              <>
                <Row className="d-flex justify-content-between align-items-center mb-4">
                  <Col className="mb-4 flex-grow-1" xs="auto">
                    {
                      (!!count) && (
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
                  className="m-5"
                  columns={columns}
                  data={items}
                  generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
                  generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
                  id="associated-collections"
                  limit={count}
                  noDataMessage="No collection associations found."
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
      <Button
        className="mt-4"
        variant="danger"
        disabled={collectionConceptIds.length === 0 || isDeleting}
        {...accessibleEventProps}
      >
        Delete Selected Associations
      </Button>
      <CustomModal
        message="Are you sure you want to delete the selected collection associations?"
        show={showDeleteModal}
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
              onClick: handleDeleteAssociation,
              disabled: isDeleting
            }
          ]
        }
      />
    </div>
  )
}

export default ManageCollectionAssociation
