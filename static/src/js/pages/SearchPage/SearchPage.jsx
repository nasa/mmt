import React, {
  useEffect,
  useCallback,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useSearchParams, Navigate } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'
import { capitalize, startCase } from 'lodash-es'
import pluralize from 'pluralize'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import commafy from 'commafy'

import conceptTypes from '../../constants/conceptTypes'

import parseError from '../../utils/parseError'

import useSearchQuery from '../../hooks/useSearchQuery'

import Page from '../../components/Page/Page'
import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import Table from '../../components/Table/Table'
import Button from '../../components/Button/Button'
import Pagination from '../../components/Pagination/Pagination'
import CustomModal from '../../components/CustomModal/CustomModal'
import For from '../../components/For/For'
import EllipsisText from '../../components/EllipsisText/EllipsisText'
import EllipsisLink from '../../components/EllipsisLink/EllipsisLink'

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

  if (humanizedName) {
    return plural ? `${humanizedName}s` : humanizedName
  }
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
  const currentPageIndex = Math.floor(offset / limit)
  const totalPages = Math.ceil(count / limit)
  const isLastPage = totalPages === activePage
  const firstResultIndex = currentPageIndex * limit
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  // Checks to see if any filters are provided so that they display in the pagination message
  const hasFilter = !!keywordParam || !!sortKeyParam

  const paginationMessage = count > 0
    ? `Showing ${totalPages > 1 ? `${firstResultIndex + 1}-${lastResultIndex} of` : ''} ${count} `
      + `${hasFilter ? 'matching ' : ''}${pluralize(typeParam, results.count)}`
    : `No matching ${typeParam} found`

  let queryMessage = ''

  if (keywordParam) {
    queryMessage += `for: Keyword: "${keywordParam}"`
  }

  if (sortKeyParam) {
    const isAscending = sortKeyParam.includes('-')
    queryMessage += `${queryMessage.length ? ',' : ''} sorted by "${startCase(sortKeyParam.replace('-', ''))}" ${isAscending ? '(ascending)' : ''}`
  }

  const buildEllipsisLinkCell = useCallback((cellData, rowData) => {
    const { conceptId } = rowData

    return (
      <EllipsisLink to={`/collections/${conceptId}`}>
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
    if (!cellData) return <span className="p-1 d-block text-end w-100">0</span>

    const tagKeys = Object.keys(cellData)
    const tagCount = tagKeys.length

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
          dataKey: 'tags',
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

  return (
    <Page
      pageType="secondary"
      title={`${commafy(count)} ${startCase(getHumanizedNameFromTypeParam(typeParam))} Results`}
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
              <>
                <Row className="d-flex justify-content-between align-items-center mb-4">
                  <Col className="mb-4 flex-grow-1" xs="auto">
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
                        <>
                          <span className="text-secondary fw-bolder">{paginationMessage}</span>
                          <span className="text-secondary">
                            {' '}
                            {queryMessage}
                          </span>
                        </>
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
                  id="search-results-table"
                  columns={columns}
                  loading={loading}
                  data={items}
                  generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                  generateRowKey={({ conceptId }) => `row_${conceptId}`}
                  noDataMessage="No results"
                  count={count}
                  activePage={activePage}
                  setPage={setPage}
                  limit={limit}
                  offset={offset}
                  sortKey={sortKeyParam}
                />
              </>
            )
          }
        </Col>
      </Row>
      {
        totalPages > 1 && (
          <Row>
            <Col xs="12" className="pt-4 d-flex align-items-center justify-content-center">
              <div>
                <Pagination
                  setPage={setPage}
                  activePage={activePage}
                  totalPages={totalPages}
                />
              </div>
            </Col>
          </Row>
        )
      }
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
                      (tagKey) => (
                        <ListGroupItem key={tagKey}>
                          <dl>
                            <dt>Tag Key:</dt>
                            <dd>{tagKey}</dd>
                            <dt>Data:</dt>
                            <dd>{activeTagModalCollection.tags[tagKey].data}</dd>
                          </dl>
                        </ListGroupItem>
                      )
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
  limit: 20
}

SearchPage.propTypes = {
  limit: PropTypes.number
}

export default SearchPage
