import React, {
  useEffect,
  useCallback,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useSearchParams, Navigate } from 'react-router-dom'
import Placeholder from 'react-bootstrap/Placeholder'
import { capitalize, startCase } from 'lodash-es'
import pluralize from 'pluralize'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import commafy from 'commafy'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import { FaBan } from 'react-icons/fa'

import conceptTypes from '../../constants/conceptTypes'

import parseError from '../../utils/parseError'

import useSearchQuery from '../../hooks/useSearchQuery'

import Page from '../../components/Page/Page'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import CustomModal from '../../components/CustomModal/CustomModal'
import For from '../../components/For/For'
import EllipsisText from '../../components/EllipsisText/EllipsisText'
import EllipsisLink from '../../components/EllipsisLink/EllipsisLink'
import getTagCount from '../../utils/getTagCount'
import ControlledPaginatedContent from '../../components/ControlledPaginatedContent/ControlledPaginatedContent'

const typeParamToHumanizedNameMap = {
  collections: 'collection',
  services: 'service',
  tools: 'tool',
  variables: 'variable'
}

/**
 * Takes a type from the url and returns a humanized singular or plural version
 * @param {String} type The type from the url.
 * @param {Boolean} [plural] A boolean that determines whether or not the string should be plural
 */
const getHumanizedNameFromTypeParam = (type, plural) => {
  const humanizedName = typeParamToHumanizedNameMap[type]

  return plural ? `${humanizedName}s` : humanizedName
}

/**
 * Renders a `SearchPage` component
 *
 * @component
 * @example <caption>Renders a `SearchPage` component</caption>
 * return (
 *   <SearchPage />
 * )
 */
const SearchPage = ({ limit }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagModalActiveCollection, setTagModalActiveCollection] = useState(null)

  const typeParam = searchParams.get('type')
  const keywordParam = searchParams.get('keyword')
  const sortKeyParam = searchParams.get('sortKey')
  const providerParam = searchParams.get('provider')
  const formattedType = capitalize(typeParam)
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const offset = (activePage - 1) * limit

  if (!typeParamToHumanizedNameMap[typeParam]) {
    return (
      <Navigate to="/404" replace />
    )
  }

  const { results, loading, error } = useSearchQuery({
    type: formattedType,
    keyword: keywordParam,
    provider: providerParam,
    limit,
    offset,
    sortKey: sortKeyParam
  })

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return {
        ...Object.fromEntries(currentParams)
      }
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

  const { count } = results
  const { items = [] } = results

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId, revisionId } = rowData

    return (
      <EllipsisLink to={`/${typeParam}/${conceptId}/${revisionId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

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
    let nextSortKey

    if (!order) {
      setSearchParams((currentParams) => {
        currentParams.delete('sortKey')

        return {
          ...Object.fromEntries(currentParams)
        }
      })

      return
    }

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

  const getColumnState = () => {
    if (formattedType === conceptTypes.Collections) {
      return [
        {
          dataKey: 'shortName',
          title: 'Short Name',
          className: 'col-auto',
          dataAccessorFn: buildEllipsisLinkCell,
          sortFn
        },
        {
          dataKey: 'version',
          title: 'Version',
          className: 'col-auto text-nowrap',
          align: 'end'
        },
        {
          dataKey: 'title',
          sortKey: 'entryTitle',
          title: 'Entry Title',
          className: 'col-auto',
          dataAccessorFn: buildEllipsisTextCell,
          sortFn: (_, order) => sortFn('entryTitle', order)
        },
        {
          dataKey: 'provider',
          title: 'Provider',
          className: 'col-auto text-nowrap',
          align: 'center',
          sortFn
        },
        {
          dataKey: 'granules.count',
          title: 'Granule Count',
          className: 'col-auto text-nowrap',
          align: 'end'
        },
        {
          dataKey: 'tagDefinitions',
          title: 'Tags',
          className: 'col-auto text-nowrap',
          dataAccessorFn: buildTagCell,
          align: 'end'
        },
        {
          dataKey: 'revisionDate',
          title: 'Last Modified',
          className: 'col-auto text-nowrap',
          dataAccessorFn: (cellData) => cellData.split('T')[0],
          align: 'end',
          sortFn
        }
      ]
    }

    return [
      {
        dataKey: 'name',
        title: 'Name',
        className: 'col-auto',
        dataAccessorFn: buildEllipsisLinkCell,
        sortFn
      },
      {
        dataKey: 'longName',
        title: 'Long Name',
        className: 'col-auto',
        dataAccessorFn: buildEllipsisTextCell,
        sortFn: (_, order) => sortFn('longName', order)
      },
      {
        dataKey: 'providerId',
        title: 'Provider',
        className: 'col-auto text-nowrap',
        align: 'center',
        sortFn
      },
      {
        dataKey: 'revisionDate',
        title: 'Last Modified',
        className: 'col-auto text-nowrap',
        dataAccessorFn: (cellData) => cellData.split('T')[0],
        align: 'end',
        sortFn
      }
    ]
  }

  const [columns, setColumns] = useState(getColumnState())

  useEffect(() => {
    setColumns(getColumnState())
  }, [typeParam])

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

  let pageTitle = loading && items.length === 0
    ? `Loading ${startCase(getHumanizedNameFromTypeParam(typeParam))} Results`
    : `${commafy(count)} ${startCase(getHumanizedNameFromTypeParam(typeParam))} ${pluralize('Results', count)}`

  if (secondaryTitle) {
    pageTitle += ' for:'
  }

  return (
    <Page
      pageType="secondary"
      title={pageTitle}
      secondaryTitle={secondaryTitle}
      breadcrumbs={
        [
          {
            label: 'Search Results',
            active: true
          }
        ]
      }
    >
      <Row>
        <Col sm={12}>
          {error && <ErrorBanner message={parseError(error)} />}
          {
            !error && (
              <ControlledPaginatedContent
                activePage={activePage}
                count={count}
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
                    // Checks to see if any filters are provided so that they display in the pagination message
                    const hasFilter = !!keywordParam || !!sortKeyParam

                    const paginationMessage = count > 0
                      ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} `
                        + `${hasFilter ? 'matching ' : ''}${pluralize(typeParam, results.count)}`
                      : `No matching ${typeParam} found`

                    return (
                      <>
                        {
                          (loading || (!loading && items.length > 0)) && (
                            <>
                              <Row className="d-flex justify-content-between align-items-center mb-4">
                                <Col className="flex-grow-1" xs="auto">
                                  {
                                    !count && loading && (
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
                                    (!!count || (!loading && !count)) && (
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
                                id="search-results-table"
                                columns={columns}
                                loading={loading}
                                data={items}
                                generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                                generateRowKey={({ conceptId }) => `row_${conceptId}`}
                                noDataMessage="No results"
                                count={count}
                                sortKey={sortKeyParam}
                                limit={limit}
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
                        {
                          !loading && items.length === 0 && (
                            <Alert className="text-center d-flex flex-column align-items-center p-4" variant="light">
                              <FaBan className="display-6 mb-2 text-secondary" />
                              <span>{`No ${getHumanizedNameFromTypeParam(typeParam)}s match the current search criteria.`}</span>
                            </Alert>
                          )
                        }
                      </>
                    )
                  }
                }
              </ControlledPaginatedContent>
            )
          }
        </Col>
      </Row>
      <CustomModal
        show={showTagModal}
        toggleModal={toggleTagModal}
        size="lg"
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
        actions={
          [{
            label: 'Close',
            onClick: () => toggleTagModal(false),
            variant: 'primary'
          }]
        }
      />
    </Page>
  )
}

SearchPage.defaultProps = {
  limit: 25
}

SearchPage.propTypes = {
  limit: PropTypes.number
}

export default SearchPage
