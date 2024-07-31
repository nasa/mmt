import { capitalize, startCase } from 'lodash-es'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import moment from 'moment'
import pluralize from 'pluralize'
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import Row from 'react-bootstrap/Row'
import {
  Navigate,
  useParams,
  useSearchParams
} from 'react-router-dom'

import { useSuspenseQuery } from '@apollo/client'

import handleSort from '@/js/utils/handleSort'

import { DATE_FORMAT } from '../../constants/dateFormat'
import conceptTypeQueries from '../../constants/conceptTypeQueries'
import conceptTypes from '../../constants/conceptTypes'
import typeParamToHumanizedStringMap from '../../constants/typeParamToHumanizedStringMap'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagModalActiveCollection, setTagModalActiveCollection] = useState(null)

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
    params = {
      ...params,
      includeTags: '*'
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
    handleSort(currentProviderParam, setSearchParams, key, order)
  }, [])

  const getColumnState = () => {
    if (formattedType === conceptTypes.Collections) {
      return [
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
          sortFn: (_, order) => sortFn('entryTitle', order),
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
  }

  const [columns, setColumns] = useState(getColumnState())

  useEffect(() => {
    setColumns(getColumnState())
  }, [conceptType])

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
                // Checks to see if any filters are provided so that they display in the pagination message
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
