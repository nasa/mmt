import {
  Alert,
  Col,
  Row
} from 'react-bootstrap'
import { camelCase, capitalize, trimEnd } from 'lodash-es'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import React, { useCallback, useState } from 'react'

import pluralize from 'pluralize'

import Button from '@/js/components/Button/Button'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Pagination from '@/js/components/Pagination/Pagination'
import Table from '@/js/components/Table/Table'

import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

import useAccessibleEvent from '@/js/hooks/useAccessibleEvent'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'

import errorLogger from '@/js/utils/errorLogger'

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
  const { conceptId, type } = useParams()

  const { addNotification } = useNotificationsContext()

  const [searchParams, setSearchParams] = useSearchParams()
  const [collectionConceptIds, setCollectionConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const formattedType = capitalize(trimEnd(type, 's'))

  const limit = 20
  const activePage = parseInt(searchParams.get('page'), 10) || 1
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

  const { data, refetch } = useSuspenseQuery(conceptTypeQueries[formattedType], {
    variables: params
  })

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION, {
    refetchQueries: [{
      query: conceptTypeQueries[formattedType],
      variables: params
    }],
    onCompleted: () => {
      setShowDeleteModal(false)

      // Add a success notification
      addNotification({
        message: 'Collection Associations Deleted Successfully!',
        variant: 'success'
      })

      setCollectionConceptIds([])
    },
    onError: () => {
      addNotification({
        message: 'Error disassociating collection',
        variant: 'danger'
      })

      errorLogger(`Unable to disassociate collection record for ${formattedType}`, 'Manage Collection Association: deleteAssociation Mutation')
    }
  })

  // Handles deleting selected collection
  // if no collections selected, returns an error notification
  const handleDeleteAssociation = () => {
    deleteAssociationMutation({
      variables: {
        conceptId,
        associatedConceptIds: collectionConceptIds
      }
    })
  }

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

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  // Handles checkbox selections, if checked add the conceptId to the state variable
  // and pops the added conceptId from the array.
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
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  // Accessible event props for the delete link
  const accessibleEventProps = useAccessibleEvent(() => {
    toggleShowDeleteModal(true)
  })

  // Handle refresh, calls getMetadata to get the list of association
  // TODO: See if we can get rid of this refresh button.
  const handleRefreshPage = () => {
    refetch()
  }

  const refreshAccessibleEventProps = useAccessibleEvent(() => {
    handleRefreshPage()
  })

  const { [camelCase(formattedType)]: concept } = data

  const { collections: associatedCollections } = concept

  const { items = [], count } = associatedCollections

  const totalPages = Math.ceil(count / limit)

  const currentPageIndex = Math.floor(offset / limit)
  const firstResultIndex = currentPageIndex * limit
  const isLastPage = totalPages === activePage
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  const paginationMessage = count > 0
    ? `Showing ${totalPages > 1 ? `Collection Associations ${firstResultIndex + 1}-${lastResultIndex} of ${count}` : `${count} ${pluralize('Collection Association', count)}`}`
    : 'No Collection Associations found'

  return (
    <div className="mt-4">
      <Alert className="fst-italic fs-6" variant="warning">
        <i className="eui-icon eui-fa-info-circle" />
        {' '}
        Association operations may take some time. If you are not seeing what you expect below,
        please
        {' '}
        <span
          className="text-decoration-underline"
          style={
            {
              color: 'blue',
              cursor: 'pointer'
            }
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...refreshAccessibleEventProps}
        >
          refresh the page
        </span>
      </Alert>
      <Row className="d-flex justify-content-between align-items-center mb-4 mt-5">
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
              <Pagination
                setPage={setPage}
                activePage={activePage}
                totalPages={totalPages}
              />
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
        offset={offset}
      />
      <Button
        className="mt-4"
        variant="danger"
        disabled={collectionConceptIds.length === 0}
        // eslint-disable-next-line react/jsx-props-no-spreading
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
              onClick: handleDeleteAssociation
            }
          ]
        }
      />
    </div>
  )
}

export default ManageCollectionAssociation
