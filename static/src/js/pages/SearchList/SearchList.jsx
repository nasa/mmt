import { capitalize, startCase } from 'lodash-es'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import Row from 'react-bootstrap/Row'
import moment from 'moment'
import pluralize from 'pluralize'
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router'

import { useSuspenseQuery } from '@apollo/client'

import handleSort from '@/js/utils/handleSort'

import { DATE_FORMAT } from '../../constants/dateFormat'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import conceptTypes from '../../constants/conceptTypes'
import typeParamToHumanizedStringMap from '../../constants/typeParamToHumanizedStringMap'
import ummCSchema from '../../schemas/umm/ummCSchema'

import Button from '../../components/Button/Button'
import ControlledPaginatedContent from '../../components/ControlledPaginatedContent/ControlledPaginatedContent'
import CustomModal from '../../components/CustomModal/CustomModal'
import EllipsisLink from '../../components/EllipsisLink/EllipsisLink'
import EllipsisText from '../../components/EllipsisText/EllipsisText'
import For from '../../components/For/For'
import Table from '../../components/Table/Table'

import getTagCount from '../../utils/getTagCount'

/**
 * Renders a `SearchList` component
 *
 * @component
 * @example <caption>Renders a `SearchList` component</caption>
 * return (
 *   <SearchList />
 * )
 */
const SearchList = ({ limit }) => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagModalActiveCollection, setTagModalActiveCollection] = useState(null)
  
  // State for Bulk Update selections
  const [selectedCollections, setSelectedCollections] = useState([])

  const { type: conceptType } = useParams()
  const keywordParam = searchParams.get('keyword')
  const sortKeyParam = searchParams.get('sortKey')
  const providerParam = searchParams.get('provider')
  const formattedType = capitalize(conceptType)
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const offset = (activePage - 1) * limit

  if (!typeParamToHumanizedStringMap[conceptType]) {
    return (
      <Navigate to="/404" replace />
    )
  }

  let params = {
    keyword: keywordParam,
    limit,
    offset,
    provider: providerParam,
    sortKey: sortKeyParam
  }

  if (formattedType === conceptTypes.Collections) {
    const collectionProgressEnum = ummCSchema.definitions.CollectionProgressEnum.enum

    params = {
      ...params,
      includeTags: '*',
      collectionProgresses: collectionProgressEnum
    }
  }

  const { data } = useSuspenseQuery(conceptTypeQueries[formattedType], {
    variables: {
      params
    }
  })

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return Object.fromEntries(currentParams)
    })
  }

  const toggleTagModal = (show, conceptId) => {
    if (show) {
      setShowTagModal(true)
      setTagModalActiveCollection(conceptId)

      return
    }

    setShowTagModal(false)
    setTagModalActiveCollection(null)
  }

  const { [conceptType]: concept } = data
  const { count, items } = concept

  // Derived state to check for multiple providers
  const uniqueProviders = new Set(selectedCollections.map(c => c.provider))
  const hasMultipleProviders = uniqueProviders.size > 1

  // "Select All on Page" Logic
  const isAllCurrentPageSelected = items?.length > 0 && items.every((item) =>
    selectedCollections.some((c) => c.conceptId === item.conceptId)
  )

  const isSomeCurrentPageSelected = items?.length > 0 && items.some((item) =>
    selectedCollections.some((c) => c.conceptId === item.conceptId)
  )

  const handleSelectAllPage = useCallback(() => {
    if (isAllCurrentPageSelected) {
      // Deselect all on current page
      setSelectedCollections((prev) =>
        prev.filter((c) => !items.some((item) => item.conceptId === c.conceptId))
      )
    } else {
      // Select all on current page (saving extra meta just in case)
      setSelectedCollections((prev) => {
        const newSelections = [...prev]
        items.forEach((item) => {
          if (!newSelections.some((c) => c.conceptId === item.conceptId)) {
            newSelections.push({ 
              conceptId: item.conceptId, 
              provider: item.provider,
              shortName: item.shortName,
              version: item.version
            })
          }
        })
        return newSelections
      })
    }
  }, [isAllCurrentPageSelected, items])

  const buildCheckboxCell = useCallback((cellData, rowData) => {
    const { conceptId, provider, shortName, version } = rowData
    const isSelected = selectedCollections.some(c => c.conceptId === conceptId)

    return (
      <input
        type="checkbox"
        className="form-check-input"
        style={{ cursor: 'pointer' }}
        checked={isSelected}
        onChange={() => {
          setSelectedCollections((prev) => {
            const exists = prev.find(c => c.conceptId === conceptId)
            if (exists) {
              return prev.filter(c => c.conceptId !== conceptId)
            }
            return [...prev, { conceptId, provider, shortName, version }]
          })
        }}
        aria-label={`Select collection ${conceptId}`}
      />
    )
  }, [selectedCollections])

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/${conceptType}/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [conceptType])

  const buildEllipsisTextCell = useCallback((cellData) => (
    <EllipsisText>
      {cellData}
    </EllipsisText>
  ), [])

  const buildTagCell = useCallback((cellData, rowData) => {
    const tagCount = getTagCount(cellData)

    if (!tagCount) return <span className="p-1 d-block text-end w-100">0</span>

    return (
      <Button
        className="p-1 fw-bold w-100 justify-content-end text-end"
        naked
        variant="link"
        onClick={
          () => {
            toggleTagModal(true, rowData.conceptId)
          }
        }
      >
        {`${tagCount}`}
      </Button>
    )
  }, [])

  const sortFn = useCallback((key, order) => {
    const currentSearchParams = new URLSearchParams(window.location.search)
    const currentProviderParam = currentSearchParams.get('provider')
    const currentPageParam = currentSearchParams.get('page')
    const currentKeywordParam = currentSearchParams.get('keyword')
    handleSort(
      currentProviderParam,
      currentPageParam,
      currentKeywordParam,
      setSearchParams,
      key,
      order
    )
  }, [setSearchParams])

  const getColumnState = useCallback(() => {
    if (formattedType === conceptTypes.Collections) {
      return [
        {
          align: 'center',
          className: 'col-auto',
          dataAccessorFn: buildCheckboxCell,
          dataKey: 'conceptId',
          title: (
            <input
              type="checkbox"
              className="form-check-input"
              style={{ cursor: 'pointer' }}
              checked={isAllCurrentPageSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = !isAllCurrentPageSelected && isSomeCurrentPageSelected
                }
              }}
              onChange={handleSelectAllPage}
              aria-label="Select all on page"
            />
          )
        },
        {
          className: 'col-auto',
          dataAccessorFn: buildEllipsisLinkCell,
          dataKey: 'shortName',
          sortFn,
          title: 'Short Name'
        },
        {
          align: 'end',
          className: 'col-auto text-nowrap',
          dataKey: 'version',
          title: 'Version'
        },
        {
          className: 'col-auto',
          dataAccessorFn: buildEllipsisTextCell,
          dataKey: 'title',
          sortFn,
          sortKey: 'entryTitle',
          title: 'Entry Title'
        },
        {
          align: 'center',
          className: 'col-auto text-nowrap',
          dataKey: 'provider',
          sortFn,
          title: 'Provider'
        },
        {
          align: 'end',
          className: 'col-auto text-nowrap',
          dataKey: 'granules.count',
          title: 'Granule Count'
        },
        {
          align: 'end',
          className: 'col-auto text-nowrap',
          dataAccessorFn: buildTagCell,
          dataKey: 'tagDefinitions',
          title: 'Tags'
        },
        {
          align: 'end',
          className: 'col-auto text-nowrap',
          dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT),
          dataKey: 'revisionDate',
          sortFn,
          title: 'Last Modified (UTC)'
        }
      ]
    }

    if (formattedType === conceptTypes.Visualizations || formattedType === conceptTypes.Citations) {
      return [
        {
          className: 'col-auto',
          dataAccessorFn: buildEllipsisLinkCell,
          dataKey: 'name',
          sortFn,
          title: 'Short Name'
        },
        {
          align: 'center',
          className: 'col-auto text-nowrap',
          dataKey: 'providerId',
          sortFn,
          title: 'Provider'
        },
        {
          align: 'end',
          className: 'col-auto text-nowrap',
          dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT),
          dataKey: 'revisionDate',
          sortFn,
          title: 'Last Modified (UTC)'
        }
      ]
    }

    return [
      {
        className: 'col-auto',
        dataAccessorFn: buildEllipsisLinkCell,
        dataKey: 'name',
        sortFn,
        title: 'Name'
      },
      {
        className: 'col-auto',
        dataAccessorFn: buildEllipsisTextCell,
        dataKey: 'longName',
        sortFn,
        title: 'Long Name'
      },
      {
        align: 'center',
        className: 'col-auto text-nowrap',
        dataKey: 'providerId',
        sortFn,
        title: 'Provider'
      },
      {
        align: 'end',
        className: 'col-auto text-nowrap',
        dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT),
        dataKey: 'revisionDate',
        sortFn,
        title: 'Last Modified (UTC)'
      }
    ]
  }, [
    formattedType,
    buildCheckboxCell,
    buildEllipsisLinkCell,
    buildEllipsisTextCell,
    buildTagCell,
    sortFn,
    isAllCurrentPageSelected,
    isSomeCurrentPageSelected,
    handleSelectAllPage
  ])

  const [columns, setColumns] = useState(getColumnState())

  useEffect(() => {
    setColumns(getColumnState())
  }, [getColumnState])

  const activeTagModalCollection = items?.find((item) => (
    item.conceptId === tagModalActiveCollection
  ))

  let queryMessages = []

  if (keywordParam) {
    queryMessages = [...queryMessages, `Keyword: \u201C${keywordParam}\u201D`]
  }

  if (providerParam) {
    queryMessages = [...queryMessages, `Provider \u201C${providerParam}\u201D`]
  }

  if (sortKeyParam) {
    const isAscending = sortKeyParam.includes('-')
    queryMessages = [...queryMessages, `sorted by \u201C${startCase(sortKeyParam.replace('-', ''))}\u201D ${isAscending ? '(ascending)' : ''}`]
  }

  const secondaryTitle = queryMessages.join(', ')

  return (
    <>
      <Row>
        <Col sm={12}>
          <ControlledPaginatedContent
            activePage={activePage}
            count={count}
            limit={limit}
            setPage={setPage}
          >
            {
              ({
                firstResultPosition,
                lastResultPosition,
                pagination,
                totalPages
              }) => {
                const hasFilter = !!keywordParam || !!sortKeyParam

                const paginationMessage = `${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} `
                    + `${hasFilter ? 'matching ' : ''}${pluralize(conceptType, concept.count)}`
                    + `${secondaryTitle ? ` for: ${secondaryTitle}` : ''}`

                return (
                  <>
                    <Row className="d-flex justify-content-between align-items-center mb-4">
                      <Col className="flex-grow-1" xs="auto">
                        {
                          !!count && (
                            <span className="text-secondary fw-bolder">{paginationMessage}</span>
                          )
                        }
                      </Col>
                      {
                        totalPages > 1 && (
                          <Col xs="auto">
                            {pagination}
                          </Col>
                        )
                      }
                    </Row>
                    <Table
                      columns={columns}
                      count={count}
                      data={items}
                      generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                      generateRowKey={({ conceptId }) => `row_${conceptId}`}
                      id="search-results-table"
                      limit={limit}
                      noDataMessage="No results"
                      sortKey={sortKeyParam}
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
      
      {/* Bulk Update Sticky Bar Component */}
      {formattedType === conceptTypes.Collections && selectedCollections.length > 0 && (
        <div className="fixed-bottom bg-primary text-white px-4 py-3 shadow-lg d-flex justify-content-between align-items-center" style={{ zIndex: 1040 }}>
          <div className="d-flex align-items-center">
            <span className="fs-5 fw-bold me-4">
              {selectedCollections.length} Collection{selectedCollections.length > 1 ? 's' : ''} Selected
            </span>
            {hasMultipleProviders && (
              <span className="text-warning fw-bold bg-dark px-2 py-1 rounded">
                ⚠️ Selections must belong to a single provider.
              </span>
            )}
          </div>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              className="me-3"
              onClick={() => setSelectedCollections([])}
            >
              Clear
            </Button>
            <Button
              variant={hasMultipleProviders ? 'secondary' : 'success'}
              disabled={hasMultipleProviders}
              onClick={() => navigate('/collections/bulk-actions/edit', { state: { selectedCollections } })}
            >
              Edit
            </Button>
          </div>
        </div>
      )}

      {/* Existing Tag Modal */}
      <CustomModal
        actions={
          [{
            label: 'Close',
            onClick: () => toggleTagModal(false),
            variant: 'primary'
          }]
        }
        header={activeTagModalCollection?.tags && `${Object.keys(activeTagModalCollection.tags).length} ${pluralize('tag', Object.keys(activeTagModalCollection.tags).length)}`}
        message={
          (
            activeTagModalCollection && (
              <>
                <h3 className="fw-bolder h5">{}</h3>
                <ListGroup>
                  <For each={Object.keys(activeTagModalCollection.tags)}>
                    {
                      (tagKey, index) => {
                        const { tagDefinitions } = activeTagModalCollection
                        const { items: tagItems } = tagDefinitions
                        const { description } = tagItems[index]

                        return (
                          <ListGroupItem key={tagKey}>
                            <dl>
                              <dt>Tag Key:</dt>
                              <dd>{tagKey}</dd>
                              <dt>Description:</dt>
                              <dd>
                                {description}
                              </dd>
                            </dl>
                          </ListGroupItem>
                        )
                      }
                    }
                  </For>
                </ListGroup>
              </>
            )
          )
        }
        show={showTagModal}
        size="lg"
        toggleModal={toggleTagModal}
      />
    </>
  )
}

SearchList.defaultProps = {
  limit: 25
}

SearchList.propTypes = {
  limit: PropTypes.number
}

export default SearchList
