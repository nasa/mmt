import Form from '@rjsf/core'
import pluralize from 'pluralize'

import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import {
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom'
import {
  useLazyQuery,
  useMutation,
  useQuery
} from '@apollo/client'
import { camelCase, cloneDeep } from 'lodash-es'

import moment from 'moment'

import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'

import Button from '@/js/components/Button/Button'
import CustomDateTimeWidget from '@/js/components/CustomDateTimeWidget/CustomDateTimeWidget'
import CustomFieldTemplate from '@/js/components/CustomFieldTemplate/CustomFieldTemplate'
import CustomSelectWidget from '@/js/components/CustomSelectWidget/CustomSelectWidget'
import CustomTextWidget from '@/js/components/CustomTextWidget/CustomTextWidget'
import CustomTitleField from '@/js/components/CustomTitleField/CustomTitleField'
import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import GridLayout from '@/js/components/GridLayout/GridLayout'
import LoadingBanner from '@/js/components/LoadingBanner/LoadingBanner'
import OneOfField from '@/js/components/OneOfField/OneOfField'
import Pagination from '@/js/components/Pagination/Pagination'
import Table from '@/js/components/Table/Table'

import collectionAssociation from '@/js/schemas/collectionAssociation'
import collectionAssociationUiSchema from '@/js/schemas/uiSchemas/CollectionAssociation'

import collectionAssociationSearch from '@/js/utils/collectionAssociationSearch'
import errorLogger from '@/js/utils/errorLogger'
import getConceptTypeByConceptId from '@/js/utils/getConceptTypeByConceptId'

import removeEmpty from '@/js/utils/removeEmpty'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'

import { CREATE_ASSOCIATION } from '@/js/operations/mutations/createAssociation'
import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import conceptIdTypes from '@/js/constants/conceptIdTypes'
import conceptTypeQueries from '@/js/constants/conceptTypeQueries'

/**
 * Renders a CollectionAssociationForm component
 *
 * @component
 * @example <caption>Render a CollectionAssociationForm</caption>
 * return (
 *   <CollectionAssociationForm />
 * )
 */
const CollectionAssociationForm = ({ metadata }) => {
  const { conceptId } = useParams()

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const [searchFormData, setSearchFormData] = useState({})
  const [focusField, setFocusField] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [collectionLoading, setCollectionLoading] = useState()
  const [showSelectCollection, setShowSelectCollection] = useState(false)
  const [collectionSearchResult, setCollectionSearchResult] = useState({})
  const [collectionConceptIds, setCollectionConceptIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchedDraft, setFetchedDraft] = useState()

  useEffect(() => {
    setFetchedDraft(metadata)
    setLoading(false)
    setCollectionLoading(false)
  }, [metadata])

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const limit = 20
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const sortKeyParam = searchParams.get('sortKey')
  const page = searchParams.get('page')
  const offset = (activePage - 1) * limit

  const fields = {
    OneOfField,
    TitleField: CustomTitleField,
    layout: GridLayout
  }

  const widgets = {
    TextWidget: CustomTextWidget,
    DateTimeWidget: CustomDateTimeWidget,
    SelectWidget: CustomSelectWidget
  }

  const templates = {
    FieldTemplate: CustomFieldTemplate
  }

  const handleChange = (event) => {
    const { formData } = event
    setSearchFormData(
      removeEmpty(formData)
    )
  }

  const uiSchema = cloneDeep(collectionAssociationUiSchema)
  const schema = cloneDeep(collectionAssociation)

  const { data: serviceData } = useQuery(conceptTypeQueries.Services, {
    variables: {
      params: {
        limit,
        offset
      }
    }
  }, { skip: derivedConceptType !== conceptIdTypes.O })

  if (derivedConceptType === conceptIdTypes.O) {
    const { required } = schema
    required.push('ServiceField')

    const rows = uiSchema['ui:layout_grid']['ui:row']
    rows.unshift(
      {
        'ui:row': [
          {
            'ui:col': {
              md: 12,
              children: ['ServiceField']
            }
          }
        ]
      }
    )

    uiSchema.ServiceField['ui:options'].enumOptions = serviceData?.services.items?.map(
      (service) => service.name
    ).sort()
  }

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(searchFormData, schema)

  // Query to retrieve collections
  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    onCompleted: (getCollectionsData) => {
      setCollectionSearchResult(getCollectionsData.collections)
      setCollectionLoading(false)
    },
    onError: () => {
      setCollectionLoading(false)
      errorLogger('Unable to get Collections', 'Collection Association: getCollections Query')
      setCollectionSearchResult(null)
    }
  })

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
    const { searchField } = formattedFormData

    setSearchParams((currentParams) => {
      if (Object.keys(searchField).includes('rangeStart')) {
        const rangeStart = moment.utc(Object.values(searchField).at(0)).format('YYYY-MM-DDTHH:mm:ss.SSS')
        const rangeEnd = moment.utc(Object.values(searchField).at(1)).format('YYYY-MM-DDTHH:mm:ss.SSS')
        const range = `${rangeStart},${rangeEnd}`

        currentParams.set('searchField', 'temporal')
        currentParams.set('searchFieldValue', range)

        return Object.fromEntries(currentParams)
      }

      currentParams.set('searchField', Object.keys(searchField))
      currentParams.set('searchFieldValue', Object.values(searchField))

      return Object.fromEntries(currentParams)
    })

    collectionSearch()
  }

  // Calls handleCollectionSearch get the next set of collections for pagination
  useEffect(() => {
    if (page) {
      collectionSearch()
    }
  }, [page])

  // Handles checkbox selection. If selected, then adds the value to collectionConceptIds state variable
  const handleCheckbox = (event) => {
    const { target } = event

    const { value } = target

    if (target.checked) {
      setCollectionConceptIds([...collectionConceptIds, value])
    } else {
      setCollectionConceptIds(collectionConceptIds.filter((item) => item !== value))
    }
  }

  const [createAssociationMutation] = useMutation(CREATE_ASSOCIATION)

  // Handles selected collection association button by calling CREATE_ASSOCIATION mutation
  const handleAssociateSelectedCollection = () => {
    let variables = {
      conceptId,
      associatedConceptIds: collectionConceptIds
    }

    if (derivedConceptType === conceptIdTypes.O) {
      const serviceItems = serviceData?.services.items
      const { ServiceField: name } = searchFormData
      const serviceConceptId = serviceItems?.filter((service) => service.name === name)[0].conceptId
      const associatedConceptData = collectionConceptIds.map((collectionConceptId) => ({
        concept_id: collectionConceptId,
        data: { order_option: conceptId }
      }))
      variables = {
        conceptId: serviceConceptId,
        associatedConceptData
      }
    }

    createAssociationMutation({
      variables,
      onCompleted: () => {
        setLoading(true)
        if (derivedConceptType === conceptIdTypes.O) {
          navigate(`/order-options/${conceptId}`)
        } else {
          navigate(`/${pluralize(camelCase(derivedConceptType)).toLowerCase()}/${conceptId}/collection-association`)
        }

        addNotification({
          message: 'Created association successfully',
          variant: 'success'
        })
      },
      onError: () => {
        setLoading(false)
        errorLogger('Unable to create association', 'Collection Association Form: createAssociationForm')
        addNotification({
          message: 'Error updating association',
          variant: 'danger'
        })
      }
    })
  }

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

  // Creates an action cell based on the current concept type
  const buildActionsCell = useCallback((cellData, rowData) => {
    let disabled = false
    let checked = null

    const { conceptId: collectionConceptId } = rowData
    const { associationDetails } = fetchedDraft
    const { collections } = associationDetails || {}

    // Checks if collection is already associated to the record.
    if (collections) {
      const associatedCollection = collections.filter(
        (item) => item.conceptId === collectionConceptId
      )
      if (associatedCollection[0]?.conceptId === collectionConceptId) {
        disabled = true
        checked = true
      }
    }

    return (
      <div className="d-flex m-2">
        <input
          className="form-check-input"
          type="checkbox"
          disabled={disabled}
          checked={checked}
          id="flexCheckCheckedDisabled"
          value={collectionConceptId}
          onClick={handleCheckbox}
        />
      </div>
    )
  })

  useEffect(() => {
    if (sortKeyParam) {
      collectionSearch()
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

      return Object.fromEntries(currentParams)
    })
  }, [])

  const collectionColumns = [
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    },
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
    }

  ]

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  if (loading) {
    return (
      <LoadingBanner />
    )
  }

  const { items = [], count } = collectionSearchResult || {}

  const totalPages = Math.ceil(count / limit)

  const currentPageIndex = Math.floor(offset / limit)
  const firstResultIndex = currentPageIndex * limit
  const isLastPage = totalPages === activePage
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  const paginationMessage = count > 0
    ? `Showing Collections ${totalPages > 1 ? `${firstResultIndex + 1}-${lastResultIndex} of` : ''} ${count}`
    : 'No matching Collections found'

  return (
    <>
      <Form
        className="bg-white m-2 pt-2"
        schema={schema}
        validator={validator}
        fields={fields}
        uiSchema={uiSchema}
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
            className="mt-3"
            disabled={validationErrors.length > 0}
            onClick={handleCollectionSearch}
            variant="primary"
          >
            Search for Collection
          </Button>
        </div>
      </Form>
      <div>
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
              {
                (!collectionLoading && items.length > 0) && (
                  <Alert className="fst-italic fs-6" variant="warning">
                    {' '}
                    <i className="eui-icon eui-fa-info-circle" />
                    Disabled rows in the results below represent collections that are
                    already associated with this record.
                  </Alert>
                )
              }
              <Table
                className="m-5"
                id="collection-association-search"
                columns={collectionColumns}
                loading={collectionLoading}
                data={items}
                generateCellKey={({ conceptId: conceptIdCell }, dataKey) => `column_${dataKey}_${conceptIdCell}`}
                generateRowKey={({ conceptId: conceptIdRow }) => `row_${conceptIdRow}`}
                noDataMessage="No Collections Found."
                limit={limit}
                offset={offset}
                sortKey={sortKeyParam}
              />
              <Button
                className="d-flex mt-4"
                disabled={validationErrors.length > 0}
                onClick={handleAssociateSelectedCollection}
                variant="primary"
              >
                Associate Selected Collections
              </Button>
            </>
          )
        }
      </div>
    </>
  )
}

CollectionAssociationForm.defaultProps = {
  metadata: {}
}

CollectionAssociationForm.propTypes = {
  metadata: PropTypes.shape({})
}

export default CollectionAssociationForm
