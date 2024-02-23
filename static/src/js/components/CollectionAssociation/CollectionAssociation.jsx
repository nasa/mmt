import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import BootstrapTable from 'react-bootstrap/Table'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useLazyQuery, useMutation } from '@apollo/client'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useNavigate, useParams } from 'react-router'
import pluralize from 'pluralize'
import BootstrapSelect from 'react-bootstrap/Button'
import camelcaseKeys from 'camelcase-keys'
import Placeholder from 'react-bootstrap/Placeholder'
import { useSearchParams } from 'react-router-dom'
import Button from '../Button/Button'
import Page from '../Page/Page'
import { GET_COLLECTIONS } from '../../operations/queries/getCollections'
import useAppContext from '../../hooks/useAppContext'
import collectionAssociation from '../../schemas/collectionAssociation'
import OneOfField from '../OneOfField/OneOfField'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import parseError from '../../utils/parseError'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import errorLogger from '../../utils/errorLogger'
import { INGEST_DRAFT } from '../../operations/mutations/ingestDraft'
import getUmmVersion from '../../utils/getUmmVersion'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import Table from '../Table/Table'
import removeMetadataKeys from '../../utils/removeMetadataKeys'
import collectionAssociationUiSchema from '../../schemas/uiSchemas/CollectionAssociation'
import { collectionAssociationSearch } from '../../utils/collectionAssociationSearch'
import removeEmpty from '../../utils/removeEmpty'
import './CollectionAssociation.scss'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import EllipsisText from '../EllipsisText/EllipsisText'
import Pagination from '../Pagination/Pagination'

const CollectionAssociation = () => {
  const { conceptId } = useParams()
  const navigate = useNavigate()

  const { user } = useAppContext()
  const { providerId } = user

  const [error, setError] = useState()
  const [fetchedDraft, setFetchedDraft] = useState()
  const [collectionSearchResult, setCollectionSearchResult] = useState({})
  const [showSelectCollection, setShowSelectCollection] = useState(false)
  const [loading, setLoading] = useState()
  const [collectionLoading, setCollectionLoading] = useState()
  const [currentSelectedAssociation, setCurrentSelectedAssociation] = useState({})
  const [searchFormData, setSearchFormData] = useState()
  const limit = 20

  const [ingestDraftMutation] = useMutation(INGEST_DRAFT)
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)
  const [focusField, setFocusField] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const { addNotification } = useNotificationsContext()

  const fields = {
    OneOfField,
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const templates = {
    FieldTemplate: CustomFieldTemplate
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    DateTimeWidget: CustomDateTimeWidget,
    SelectWidget: CustomSelectWidget
  }

  const [getDraft] = useLazyQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft } = getDraftData
      const { ummMetadata } = draft
      const { _private } = ummMetadata
      const { CollectionAssociation: savedAssociation } = _private || {}

      setFetchedDraft(draft)
      setCurrentSelectedAssociation(savedAssociation)
      setLoading(false)
    },
    onError: (getDraftError) => {
      setLoading(false)
      errorLogger('Unable to retrieve draft', 'Collection Association: getDraft Query')

      setError(getDraftError)
    }
  })

  let activePage = parseInt(searchParams.get('page'), 10) || 1
  const sortKeyParam = searchParams.get('sortKey')
  const page = searchParams.get('page')
  const offset = (activePage - 1) * limit

  useEffect(() => {
    activePage = 1
    setLoading(true)
    getDraft()
  }, [])

  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    onCompleted: (getCollectionsData) => {
      setCollectionSearchResult(getCollectionsData.collections)
      setCollectionLoading(false)
    },
    onError: (getCollectionsError) => {
      setCollectionLoading(false)
      errorLogger('Unable to get Collections', 'Collection Association: getCollections Query')
      setError(getCollectionsError)
    }
  })

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId: conceptIdLink } = rowData

    return (
      <EllipsisLink to={`/collections/${conceptIdLink}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  // Handle the submit button when the user clicks on a collection and associates the collection to draft
  const handleSubmit = (
    collectionConceptId,
    shortName,
    version
  ) => {
    const { nativeId } = fetchedDraft || {}
    const { ummMetadata } = fetchedDraft || {}

    const associationDetailDraft = {
      ...ummMetadata,
      _private: {
        CollectionAssociation: {
          collectionConceptId,
          shortName,
          version
        }
      }
    }

    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: associationDetailDraft,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(derivedConceptType)
      },
      onCompleted: () => {
        // Add a success notification
        addNotification({
          message: 'Collection Association was Updated Successfully!',
          variant: 'success'
        })

        navigate(`/drafts/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}`)
      },
      onError: (getIngestError) => {
        setLoading(false)
        errorLogger('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
        setError(getIngestError)
      }
    })
  }

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId: collectionConceptId, shortName, version } = rowData

    return (
      <div className="d-flex">
        <Button
          className="d-flex"
          onClick={
            () => {
              handleSubmit(
                collectionConceptId,
                shortName,
                version
              )
            }
          }
          variant="secondary"
          size="sm"
        >
          Create Association
        </Button>
      </div>
    )
  }, [])

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

  const collectionSearch = () => {
    setCollectionLoading(true)
    setShowSelectCollection(true)

    const searchField = searchParams.get('searchField')
    const searchFieldValue = searchParams.get('searchFieldValue')
    const provider = searchParams.get('provider')

    const params = collectionAssociationSearch(searchField, searchFieldValue)

    getCollections({
      variables: {
        params: {
          limit,
          offset,
          provider,
          sortKey: sortKeyParam,
          ...params
        }
      }
    })
  }

  const handleCollectionSearch = () => {
    const formattedFormData = camelcaseKeys(searchFormData, { deep: true })
    const { searchField, providerFilter } = formattedFormData

    setSearchParams((currentParams) => {
      if (providerFilter) {
        currentParams.set('provider', providerId)
      }

      if (Object.keys(searchField).includes('rangeStart')) {
        const rangeStart = Object.values(searchField).at(0)
        const rangeEnd = Object.values(searchField).at(1)
        const range = `${rangeStart},${rangeEnd}`

        currentParams.set('searchField', 'temporal')
        currentParams.set('searchFieldValue', range)

        return {
          ...Object.fromEntries(currentParams)
        }
      }

      currentParams.set('searchField', Object.keys(searchField))
      currentParams.set('searchFieldValue', Object.values(searchField))

      return {
        ...Object.fromEntries(currentParams)
      }
    })

    collectionSearch()
  }

  useEffect(() => {
    if (sortKeyParam) {
      collectionSearch()
    }
  }, [sortKeyParam])

  // Calls handleCollectionSearch get the next set of collections for pagination
  useEffect(() => {
    if (page) {
      collectionSearch()
    }
  }, [page])

  const handleClear = () => {
    const { ummMetadata } = fetchedDraft
    const { nativeId } = fetchedDraft

    const modifiedMetadata = removeMetadataKeys(ummMetadata, ['_private'])
    setLoading(true)
    ingestDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        metadata: modifiedMetadata,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(derivedConceptType)
      },
      onCompleted: () => {
        setLoading(false)
        setCollectionLoading()
        setCurrentSelectedAssociation(null)
        // Add a success notification
        addNotification({
          message: `Cleared ${conceptId} Association`,
          variant: 'success'
        })
      },
      onError: (getIngestError) => {
        setLoading(false)
        errorLogger('Unable to Ingest Draft', 'Collection Association: ingestDraft Mutation')
        setError(getIngestError)
      }
    })
  }

  const handleChange = (event) => {
    const { formData } = event
    setSearchFormData(
      removeEmpty(formData)
    )
  }

  const { items = [], count } = collectionSearchResult
  const totalPages = Math.ceil(count / limit)

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  const collectionColumns = [
    {
      dataKey: 'entryTitle',
      title: 'Collection',
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
      dataKey: 'provider',
      title: 'Provider',
      className: 'col-auto',
      dataAccessorFn: buildEllipsisTextCell,
      align: 'center',
      sortFn
    },
    {
      dataKey: 'version',
      title: 'Version',
      className: 'col-auto',
      align: 'center'
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ]

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return {
        ...Object.fromEntries(currentParams)
      }
    })
  }

  const currentPageIndex = Math.floor(offset / limit)
  const firstResultIndex = currentPageIndex * limit
  const isLastPage = totalPages === activePage
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  const paginationMessage = count > 0
    ? `Showing Collections ${totalPages > 1 ? `${firstResultIndex + 1}-${lastResultIndex} of` : ''} ${count}`
    : 'No matching Collections found'

  return (
    <Page>
      <h3>Collection Association Search</h3>
      <Row className="m-4">
        <h4>Currently Selected Collection</h4>
        <Col sm={12} className="bg-white rounded">
          <BootstrapTable striped>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Short Name</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentSelectedAssociation?.collectionConceptId || 'No Collection Selected'}</td>
                <td>{currentSelectedAssociation?.shortName}</td>
                <td>{currentSelectedAssociation?.version}</td>
              </tr>
            </tbody>
          </BootstrapTable>
          <BootstrapSelect
            className="mb-3 m-2"
            onClick={handleClear}
            variant="outline-danger"
          >
            Clear Collection Association
          </BootstrapSelect>
        </Col>

        <h4 className="mt-5">Search for Collections</h4>
        <Col sm={12} className="bg-white rounded">
          <Form
            className="bg-white m-2 pt-2"
            schema={collectionAssociation}
            validator={validator}
            fields={fields}
            uiSchema={collectionAssociationUiSchema}
            widgets={widgets}
            templates={templates}
            onChange={handleChange}
            formData={searchFormData}
            formContext={
              {
                focusField,
                setFocusField
              }
            }
          >
            <div
              className="collection-association__search_for_collections mb-3"
            >

              <Button
                onClick={handleCollectionSearch}
                variant="blue-light"
              >
                Search for Collection
              </Button>
            </div>
          </Form>
        </Col>
        {
          showSelectCollection
          && (
            <>
              <Row className="d-flex justify-content-between align-items-center mb-4 mt-5">
                <Col className="mb-4 flex-grow-1" xs="auto">
                  {
                    !count && collectionLoading && (
                      <div className="w-100">
                        <span className="d-block">
                          <Placeholder as="span" animation="glow">
                            <Placeholder xs={8} />
                          </Placeholder>
                        </span>
                      </div>
                    )
                  }
                  {
                    (!!count || (!collectionLoading && !count)) && (
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
                id="collection-association-search"
                columns={collectionColumns}
                loading={collectionLoading}
                data={items}
                error={error}
                generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
                generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
                noDataMessage="No Collections Found."
                limit={limit}
                offset={offset}
                sortKey={sortKeyParam}
              />
            </>
          )
        }
      </Row>
    </Page>
  )
}

export default CollectionAssociation
