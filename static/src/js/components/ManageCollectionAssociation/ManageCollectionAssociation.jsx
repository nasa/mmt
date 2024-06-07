import { useMutation, useSuspenseQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Alert } from 'react-bootstrap'
import { camelCase } from 'lodash-es'

import pluralize from 'pluralize'

import Button from '@/js/components/Button/Button'
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

  // Const [error, setError] = useState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [collectionConceptIds, setCollectionConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  let params = {
    params: {
      conceptId
    }
  }

  const sortKey = searchParams.get('sortKey')

  if (sortKey) {
    params = {
      ...params,
      collectionsParams: {
        sortKey
      }
    }
  }

  const { data, refetch } = useSuspenseQuery(conceptTypeQueries[derivedConceptType], {
    variables: params
  })

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION, {
    refetchQueries: [{
      query: conceptTypeQueries[derivedConceptType],
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

      errorLogger(`Unable to disassociate collection record for ${derivedConceptType}`, 'Manage Collection Association: deleteAssociation Mutation')
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

  const { [camelCase(derivedConceptType)]: concept } = data

  const { collections: associatedCollections } = concept

  const { items, count } = associatedCollections

  return (
    <>
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
      </div>
      <div className="mt-4">
        <span>
          Showing
          {' '}
          {count}
          {' '}
          {pluralize('collection association', count)}
        </span>
      </div>
      <Table
        className="m-5"
        id="associated-collections"
        columns={columns}
        data={items}
        generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
        generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
        noDataMessage="No collection associations found."
        limit={count}
      />

      <Button
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
    </>
  )
}

export default ManageCollectionAssociation
