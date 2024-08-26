import { useMutation, useSuspenseQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
  Alert,
  Col,
  Row
} from 'react-bootstrap'

import pluralize from 'pluralize'

import Button from '@/js/components/Button/Button'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Table from '@/js/components/Table/Table'

import useAccessibleEvent from '@/js/hooks/useAccessibleEvent'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'
import { GET_SERVICE_ASSOCIATIONS } from '@/js/operations/queries/getServiceAssociations'

import errorLogger from '@/js/utils/errorLogger'

/**
 * Renders a ManageServiceAssociations component
 *
 * @component
 * @example <caption>Render a ManageServiceAssociations</caption>
 * return (
 *   <ManageServiceAssociations />
 * )
 */
const ManageServiceAssociations = () => {
  const { addNotification } = useNotificationsContext()
  const { conceptId } = useParams()
  const navigate = useNavigate()

  const [serviceConceptIds, setServiceConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const params = {
    params: {
      conceptId
    }
  }

  const { data, refetch } = useSuspenseQuery(GET_SERVICE_ASSOCIATIONS, {
    variables: params
  })

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION, {
    refetchQueries: [{
      query: GET_SERVICE_ASSOCIATIONS,
      variables: params
    }],
    onCompleted: () => {
      setShowDeleteModal(false)

      // Add a success notification
      addNotification({
        message: 'Service Associations Deleted Successfully!',
        variant: 'success'
      })

      setServiceConceptIds([])
    },
    onError: () => {
      addNotification({
        message: 'Error disassociating service',
        variant: 'danger'
      })

      errorLogger(`Unable to disassociate service record for ${conceptId}`, 'Manage Service Association: deleteAssociation Mutation')
    }
  })

  // Handles deleting selected service/s
  // if no services selected, button is disabled
  const handleDeleteAssociation = () => {
    deleteAssociationMutation({
      variables: {
        conceptId,
        associatedConceptIds: serviceConceptIds
      }
    })
  }

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  const buildOrderOptionCell = useCallback((cellData) => {
    const { items: orderOptionList } = cellData

    const orderOptionNames = []

    orderOptionList?.map((orderOption) => {
      const { name, conceptId: orderOptionConceptId } = orderOption
      orderOptionNames.push(
        <Button
          inline
          naked
          key={orderOptionConceptId}
          type="button"
          variant="link"
          onClick={
            () => {
              navigate(`/order-options/${orderOptionConceptId}`)
            }
          }
        >
          {name}
        </Button>
      )

      return null
    })

    return (
      <Row>
        <Col>
          {orderOptionNames}
        </Col>
      </Row>
    )
  }, [])

  // Handles checkbox selections, if checked add the conceptId to the state variable
  // and pops the added conceptId from the array.
  const handleCheckbox = (event) => {
    const { target } = event
    const { value } = target

    if (target.checked) {
      setServiceConceptIds([...serviceConceptIds, value])
    } else {
      setServiceConceptIds(serviceConceptIds.filter((item) => item !== value))
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
      title: 'Selections',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    },
    {
      dataKey: 'longName',
      title: 'Service Name',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
    },
    {
      dataKey: 'orderOptions',
      title: 'Associated Order Option',
      className: 'col-auto',
      align: 'center',
      dataAccessorFn: buildOrderOptionCell
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

  const { collection } = data

  const { services } = collection

  const { items: servicesList, count: servicesCount } = services

  return (
    <>
      <div>
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
      <div className="mt-4 mb-2">
        <span>
          Showing
          {' '}
          {servicesCount}
          {' '}
          {pluralize('service association', servicesCount)}
        </span>
      </div>
      <Table
        id="associated-collections"
        columns={columns}
        data={servicesList}
        generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
        generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
        noDataMessage="No service associations found"
        limit={servicesCount}
      />

      <Button
        className="mt-4"
        variant="danger"
        disabled={serviceConceptIds.length === 0}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...accessibleEventProps}
      >
        Delete Selected Associations
      </Button>
      <CustomModal
        message="Are you sure you want to delete the selected service associations?"
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

export default ManageServiceAssociations
