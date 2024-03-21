import { useLazyQuery, useMutation } from '@apollo/client'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import pluralize from 'pluralize'
import { Alert } from 'react-bootstrap'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import errorLogger from '../../utils/errorLogger'
import parseError from '../../utils/parseError'
import Page from '../../components/Page/Page'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import LoadingBanner from '../../components/LoadingBanner/LoadingBanner'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'
import conceptTypes from '../../constants/conceptTypes'
import EllipsisLink from '../../components/EllipsisLink/EllipsisLink'
import EllipsisText from '../../components/EllipsisText/EllipsisText'
import { DELETE_ASSOCIATION } from '../../operations/mutations/deleteAssociation'
import CustomModal from '../../components/CustomModal/CustomModal'
import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import useNotificationsContext from '../../hooks/useNotificationsContext'

const ManageCollectionAssociation = () => {
  const { conceptId } = useParams()

  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()

  const [fetchedDraft, setFetchedDraft] = useState()
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState()
  const [error, setError] = useState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [collectionConceptIds, setCollectionConceptIds] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const limit = 20

  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const sortKeyParam = searchParams.get('sortKey')
  const offset = (activePage - 1) * limit

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const [getMetadata] = useLazyQuery(conceptTypeQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId
      },
      collectionsParams: {
        limit,
        sortKey: sortKeyParam
      }
    },
    onCompleted: (getData) => {
      const fetchedData = getData[toLowerKebabCase(derivedConceptType)]

      setFetchedDraft(fetchedData)
      setLoading(false)
      setTableLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      setTableLoading(false)

      errorLogger('Unable to get draft', 'Manage Collection Association: getMetadata Query')
      setError(getDraftError)
    }
  })

  useEffect(() => {
    getMetadata()
    setLoading(true)
    setTableLoading(true)
  }, [])

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION)

  // Handles deleting selected collection
  // if no collections selected, returns an error notification
  const handleDeleteAssociation = () => {
    if (collectionConceptIds.length === 0) {
      setShowDeleteModal(false)
      addNotification({
        message: 'Please select a collection to disassociate',
        variant: 'danger'
      })

      return
    }

    deleteAssociationMutation({
      variables: {
        conceptId,
        collectionConceptIds,
        conceptType: derivedConceptType
      },
      onCompleted: () => {
        setShowDeleteModal(false)
        setTableLoading(true)
        getMetadata()

        // Add a success notification
        addNotification({
          message: 'Collection Associations Deleted Successfully!',
          variant: 'success'
        })
      },
      onError: (deleteAssociationError) => {
        addNotification({
          message: 'Error disassociating collection',
          variant: 'danger'
        })

        errorLogger(`Unable to disassociate collection record for ${derivedConceptType}`, 'Manage Collection Association: deleteAssociation Mutation')
        setError(deleteAssociationError)
      }
    })
  }

  useEffect(() => {
    if (sortKeyParam) {
      getMetadata()
    }
  }, [sortKeyParam])

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

      return {
        ...Object.fromEntries(currentParams)
      }
    })
  }, [])

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId: conceptIdLink } = rowData

    return (
      <EllipsisLink to={`/collections/${conceptIdLink}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  // Handles checkbox selections, if checked add the conceptId to the state variable
  // and pops the added conceptId from the array.
  const handleCheckbox = (event) => {
    const { target } = event
    const { value } = target

    if (target.checked) {
      setCollectionConceptIds([...collectionConceptIds, { conceptId: value }])
    } else {
      setCollectionConceptIds(collectionConceptIds.filter((item) => item.conceptId !== value))
    }
  }

  // Renders a checkbox for each row
  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId: collectionConceptId } = rowData

    return (
      <div className="d-flex m-2">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexCheckDefault"
          value={collectionConceptId}
          onClick={handleCheckbox}
        />
      </div>
    )
  })

  const associatedCollectionColumns = [
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    },
    {
      dataKey: 'entryTitle',
      title: 'Entry Title',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell
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

  const variableCollectionColumns = [
    {
      dataKey: 'entryTitle',
      title: 'Entry Title',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisLinkCell
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
    setTableLoading(true)
    getMetadata()
  }

  // Handles navigating to collection association search page
  const handleCollectionAssociation = () => {
    navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/collection-association-search`)
  }

  const refreshAccessibleEventProps = useAccessibleEvent(() => {
    handleRefreshPage()
  })

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  const { name, collections: associatedCollections } = fetchedDraft || {}

  const { items, count } = associatedCollections || {}

  let associationColumns = associatedCollectionColumns
  if (derivedConceptType === 'Variable') {
    associationColumns = variableCollectionColumns
  }

  return (
    <Page
      title={`${name} Collection Associations` || '<Blank Name>'}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: derivedConceptType,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: conceptId,
            to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`
          },
          {
            label: 'Collection Association',
            active: true
          }
        ]
      }
    >
      {
        derivedConceptType !== conceptTypes.Variable && (
          <Button
            onClick={handleCollectionAssociation}
            variant="primary"
          >
            Add Collection Associations
          </Button>
        )
      }
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
          Collection Association
        </span>
      </div>
      <Table
        className="m-5"
        id="associated-collections"
        columns={associationColumns}
        loading={tableLoading}
        data={items || []}
        error={error}
        generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
        generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
        noDataMessage="No Collection Associations found."
        limit={limit}
        offset={offset}
      />
      {
        (items && derivedConceptType !== conceptTypes.Variable) && (
          <>
            <Button
              variant="danger"
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
      {/* Only render the Update Collection Association button if the concept type is Variable */}
      {
        (items && derivedConceptType === conceptTypes.Variable) && (
          <Button
            variant="primary"
            onClick={handleCollectionAssociation}
          >
            Update Collection Associations
          </Button>
        )
      }
    </Page>
  )
}

export default ManageCollectionAssociation
