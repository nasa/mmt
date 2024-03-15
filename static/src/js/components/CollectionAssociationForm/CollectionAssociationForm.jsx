import Form from '@rjsf/core'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import validator from '@rjsf/validator-ajv8'
import camelcaseKeys from 'camelcase-keys'
import { useParams, useSearchParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import {
  Col,
  Placeholder,
  Row
} from 'react-bootstrap'
import collectionAssociation from '../../schemas/collectionAssociation'
import OneOfField from '../OneOfField/OneOfField'
import CustomTitleField from '../CustomTitleField/CustomTitleField'
import GridLayout from '../GridLayout/GridLayout'
import CustomTextWidget from '../CustomTextWidget/CustomTextWidget'
import CustomDateTimeWidget from '../CustomDateTimeWidget/CustomDateTimeWidget'
import CustomSelectWidget from '../CustomSelectWidget/CustomSelectWidget'
import collectionAssociationUiSchema from '../../schemas/uiSchemas/CollectionAssociation'
import CustomFieldTemplate from '../CustomFieldTemplate/CustomFieldTemplate'
import removeEmpty from '../../utils/removeEmpty'
import Button from '../Button/Button'
import useAppContext from '../../hooks/useAppContext'
import { collectionAssociationSearch } from '../../utils/collectionAssociationSearch'
import { GET_COLLECTIONS } from '../../operations/queries/getCollections'
import errorLogger from '../../utils/errorLogger'
import Pagination from '../Pagination/Pagination'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import EllipsisText from '../EllipsisText/EllipsisText'
import Table from '../Table/Table'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'

const CollectionAssociationForm = () => {
  const { conceptId } = useParams()
  const { user } = useAppContext()
  const { providerId } = user

  const [searchFormData, setSearchFormData] = useState({})
  const [focusField, setFocusField] = useState(null)
  const [error, setError] = useState()
  const [searchParams, setSearchParams] = useSearchParams()
  const [collectionLoading, setCollectionLoading] = useState()
  const [showSelectCollection, setShowSelectCollection] = useState(false)
  const [collectionSearchResult, setCollectionSearchResult] = useState({})
  const [collectionConceptIds, setCollectionConceptIds] = useState([])

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

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
      } else {
        currentParams.set('provider', '')
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

  const handleCheckbox = (event) => {
    const { target } = event

    const { value } = target

    if (target.checked) {
      setCollectionConceptIds([...collectionConceptIds, { conceptId: value }])
    } else {
      setCollectionConceptIds(collectionConceptIds.filter((item) => item.conceptId !== value))
    }
  }

  const handleSelectedCollection = () => {
    console.log('selected', collectionConceptIds)
  }

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId: collectionConceptId, shortName, version } = rowData

    if (derivedConceptType === 'Variable') {
      return (
        <div className="d-flex">
          <Button
            className="d-flex"
            // OnClick={
            //   // () => {
            //   //   handleSubmit(
            //   //     collectionConceptId,
            //   //     shortName,
            //   //     version
            //   //   )
            //   // }
            // }
            variant="secondary"
            size="sm"
          >
            Create Association
          </Button>
        </div>
      )
    }

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

      return {
        ...Object.fromEntries(currentParams)
      }
    })
  }

  const { items = [], count } = collectionSearchResult

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
              {
                derivedConceptType !== 'Variable' && (
                  <Button
                    className="d-flex"
                    onClick={
                      () => {
                        handleSelectedCollection()
                      }
                    }
                    variant="primary"
                  >
                    Associate Selected Collections
                  </Button>
                )
              }
            </>
          )
        }
      </div>
    </>
  )
}

export default CollectionAssociationForm