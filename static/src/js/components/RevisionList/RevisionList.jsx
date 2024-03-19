import React, {
  useEffect,
  useState,
  useCallback
} from 'react'
// Import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router'
import { capitalize, startCase } from 'lodash-es'
import pluralize from 'pluralize'
import commafy from 'commafy'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import { FaBan } from 'react-icons/fa'
import Placeholder from 'react-bootstrap/Placeholder'
import useRevisionsQuery from '../../hooks/useRevisionsQuery'
import Page from '../Page/Page'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Table from '../Table/Table'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import parseError from '../../utils/parseError'

const typeParamToHumanizedNameMap = {
  collections: 'collection',
  services: 'service',
  tools: 'tool',
  variables: 'variable'
}

// Tool with revisions: http://localhost:5173/tools/TL1200000100-MMT_2/revisions
// Service with revisions: http://localhost:5173/services/S1200000097-MMT_2/revisions
// Variable with revisions: http://localhost:5173/variables/V1200000103-MMT_2/revisions
// Collection with revisions: http://localhost:5173/collections/C1200000111-MMT_2/revisions

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
 * Renders a `RevisionList` component
 *
 * @component
 * @example <caption>Renders a `RevisionList` component</caption>
 * return (
 *   <RevisionList />
 * )
 */
const RevisionList = () => {
  const { conceptId, type } = useParams()
  const limit = 20
  const [searchParams, setSearchParams] = useSearchParams()
  const versions = searchParams.get('versions')
  const formattedType = capitalize(type)
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const offset = (activePage - 1) * limit

  const { revisions, error, loading } = useRevisionsQuery({
    conceptId,
    type: formattedType,
    limit,
    offset,
    sortKey: '-revisionDate'
  })

  const setPage = (nextPage) => {
    setSearchParams((currentParams) => {
      currentParams.set('page', nextPage)

      return {
        ...Object.fromEntries(currentParams)
      }
    })
  }

  const { count = 0 } = revisions
  const { items = [] } = revisions

  const buildDescriptionCell = useCallback((cellData) => {
    const isPublishedVersion = (cellData === versions)

    return (
      <EllipsisLink to={`/${type}/${conceptId}/${cellData}`}>
        {cellData}
        {' '}
        -
        {(isPublishedVersion) ? ' Published' : ' Revision'}
      </EllipsisLink>
    )
  }, [])

  // To be done after GQL-32
  const buildActionCell = useCallback(() => (
    'Revert to this version'
  ), [])

  const getColumnState = () => [
    {
      dataKey: 'revisionId',
      title: 'Description',
      className: 'col-auto',
      dataAccessorFn: buildDescriptionCell
    },
    {
      dataKey: 'revisionDate',
      title: 'Revision Date',
      className: 'col-auto',
      dataAccessorFn: (cellData) => cellData.split('T')[0]
    },
    {
      dataKey: 'userId',
      title: 'Action by',
      className: 'col-auto'
    },
    {
      dataKey: 'actions',
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionCell
    }
  ]

  const [columns, setColumns] = useState(getColumnState())

  useEffect(() => {
    setColumns(getColumnState())
  }, [type])

  const pageTitle = loading && items.length === 0
    ? `Loading ${startCase(getHumanizedNameFromTypeParam(type))} Revisions`
    : `${commafy(count)} ${startCase(getHumanizedNameFromTypeParam(type))} ${pluralize('Revisions', count)}`

  return (
    <Page
      pageType="secondary"
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: 'Revision Results',
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
                    const paginationMessage = count > 0
                      ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} `
                        + `${pluralize(type, count)}`
                      : `No matching ${type} found`

                    return (
                      <>
                        {
                          (loading || (!loading && count > 0)) && (
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
                                id="revision-results-table"
                                columns={columns}
                                loading={loading}
                                data={items}
                                generateCellKey={(dataKey, cellData) => `column_${dataKey}_${conceptId}_${cellData}`}
                                generateRowKey={() => `row_${conceptId}`}
                                noDataMessage="No results"
                                count={count}
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
                              <span>{`No ${getHumanizedNameFromTypeParam(type)}s match the current search criteria.`}</span>
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
    </Page>
  )
}

export default RevisionList
