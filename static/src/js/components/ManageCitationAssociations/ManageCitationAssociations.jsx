import { useMutation, useSuspenseQuery } from '@apollo/client'
import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { Alert } from 'react-bootstrap'

import pluralize from 'pluralize'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Button from '@/js/components/Button/Button'
import CustomModal from '@/js/components/CustomModal/CustomModal'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Table from '@/js/components/Table/Table'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'

import useAccessibleEvent from '@/js/hooks/useAccessibleEvent'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'
import { GET_CITATION_ASSOCIATIONS } from '@/js/operations/queries/getCitationAssociations'

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
const ManageCitationAssociations = () => {
  const { addNotification } = useNotificationsContext()
  const { conceptId } = useParams()

  const [activePage, setActivePage] = useState(1)
  const limit = 10
  const offset = (activePage - 1) * limit

  const [citationConceptIds, setCitationConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const params = {
    params: {
      conceptId
    },
    citationParams: {
      limit,
      offset
    }
  }

  const { data, refetch } = useSuspenseQuery(GET_CITATION_ASSOCIATIONS, {
    variables: params
  })

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION, {
    refetchQueries: [{
      query: GET_CITATION_ASSOCIATIONS,
      variables: params
    }],
    onCompleted: () => {
      setShowDeleteModal(false)

      // Add a success notification
      addNotification({
        message: 'Service Associations Deleted Successfully!',
        variant: 'success'
      })

      setCitationConceptIds([])
    },
    onError: () => {
      addNotification({
        message: 'Error disassociating citation',
        variant: 'danger'
      })

      errorLogger(`Unable to disassociate citation record for ${conceptId}`, 'Manage Citation Association: deleteAssociation Mutation')
    }
  })

  // Handles deleting selected citation/s
  // if no citation selected, button is disabled
  const handleDeleteAssociation = () => {
    deleteAssociationMutation({
      variables: {
        conceptId,
        associatedConceptIds: citationConceptIds
      }
    })
  }

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
      setCitationConceptIds([...citationConceptIds, value])
    } else {
      setCitationConceptIds(citationConceptIds.filter((item) => item !== value))
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

  const setPage = (nextPage) => {
    setActivePage(nextPage)
  }

  const columns = [
    {
      title: 'Selections',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    },
    {
      dataKey: 'name',
      title: 'Citation Name',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
    },
    {
      dataKey: 'identifier',
      title: 'Identifier',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
    },
    {
      dataKey: 'identifierType',
      title: 'Type',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
    },
    {
      dataKey: 'providerId',
      title: 'Provider',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell
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

  const { citations } = collection

  const { items: citationsList, count: citationsCount } = citations

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
      <Row>
        <Col sm={12}>
          <ControlledPaginatedContent
            activePage={activePage}
            count={citationsCount}
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
                const paginationMessage = citationsCount > 0
                  ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${citationsCount} ${pluralize('citation association', citationsCount)}`
                  : 'No citations found'

                return (
                  <>
                    <Row className="d-flex justify-content-between align-items-center mb-4">
                      <Col className="mb-4 flex-grow-1" xs="auto">
                        {
                          (!!citationsCount) && (
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
                      id="associated-collections"
                      columns={columns}
                      data={citationsList}
                      generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
                      generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
                      noDataMessage="No citation associations found"
                      count={citationsCount}
                      setPage={setPage}
                      limit={limit}
                      offset={offset}
                    />
                    <Button
                      className="mt-4"
                      variant="danger"
                      disabled={citationConceptIds.length === 0}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...accessibleEventProps}
                    >
                      Delete Selected Associations
                    </Button>
                    <CustomModal
                      message="Are you sure you want to delete the selected citation associations?"
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
      </Row>
    </>
  )
}

export default ManageCitationAssociations
