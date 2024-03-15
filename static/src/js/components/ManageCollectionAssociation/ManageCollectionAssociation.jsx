import { useLazyQuery, useMutation } from '@apollo/client'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import pluralize from 'pluralize'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'
import errorLogger from '../../utils/errorLogger'
import parseError from '../../utils/parseError'
import Page from '../Page/Page'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import toLowerKebabCase from '../../utils/toLowerKebabCase'
import Button from '../Button/Button'
import Table from '../Table/Table'
import conceptTypes from '../../constants/conceptTypes'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import EllipsisText from '../EllipsisText/EllipsisText'
import { DELETE_ASSOCIATION } from '../../operations/mutations/deleteAssociation'
import CustomModal from '../CustomModal/CustomModal'
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
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  useEffect(() => {
    getMetadata()
    setLoading(true)
    setTableLoading(true)
  }, [])

  useEffect(() => {
    if (sortKeyParam) {
      setTableLoading(true)
      getMetadata()
    }
  }, [sortKeyParam])

  const [deleteAssociationMutation] = useMutation(DELETE_ASSOCIATION)

  const handleDeleteAssociation = () => {
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
        console.log(deleteAssociationError)
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

  const handleCheckbox = (event) => {
    const { target } = event
    const { value } = target

    if (target.checked) {
      setCollectionConceptIds([...collectionConceptIds, { conceptId: value }])
    } else {
      setCollectionConceptIds(collectionConceptIds.filter((item) => item.conceptId !== value))
    }
  }

  console.log('collectionConceptIds', collectionConceptIds)
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

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  // Accessible event props for the delete link
  const accessibleEventProps = useAccessibleEvent(() => {
    setShowDeleteModal(true)
  })

  const handleRefreshPage = () => {
    setTableLoading(true)
    getMetadata()
  }

  const handleAddingCollectionAssociation = () => {
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

  return (
    <Page
      title={`${name} Collection Associations` || '<Blank Name>'}
      pageType="secondary"
    >
      <Button
        onClick={handleAddingCollectionAssociation}
        variant="blue-light"
      >
        Add Collection Associations
      </Button>
      <div className="mt-4">
        <span className="fst-italic fs-6">
          <i className="eui-icon eui-fa-info-circle" />
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
        </span>
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
        columns={associatedCollectionColumns}
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
                    onClick: () => { setShowDeleteModal(false) }
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
    </Page>
  )
}

export default ManageCollectionAssociation
