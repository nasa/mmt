import React, {
  useEffect,
  useState,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { useParams } from 'react-router'
import { capitalize, startCase } from 'lodash-es'
import pluralize from 'pluralize'
import commafy from 'commafy'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'
import useRevisionsQuery from '../../hooks/useRevisionsQuery'
import Page from '../Page/Page'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Table from '../Table/Table'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import parseError from '../../utils/parseError'
import getHumanizedNameFromTypeParam from '../../utils/getHumanizedNameFromTypeParam'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConcept'

/**
 * Renders a `RevisionList` component
 *
 * @component
 * @example <caption>Renders a `RevisionList` component</caption>
 * return (
 *   <RevisionList />
 * )
 */
const RevisionList = ({ limit }) => {
  const { conceptId, type } = useParams()
  const derivedConceptType = getConceptTypeByConceptId(conceptId)
  const [searchParams, setSearchParams] = useSearchParams()
  const activePage = parseInt(searchParams.get('page'), 10) || 1
  const offset = (activePage - 1) * limit

  const { revisions, error, loading } = useRevisionsQuery({
    conceptId,
    type: capitalize(type),
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

  const { count } = revisions
  const { items = [] } = revisions
  let rowCount = 0
  const recordTitle = ((items.length) ? (items[0].shortName || items[0].name) : '')

  const buildDescriptionCell = useCallback((cellData) => {
    rowCount += 1

    return (
      <EllipsisLink to={`/${type}/${conceptId}/revisions/${cellData}`}>
        {[cellData, ' - ', ((rowCount === 1) ? 'Published' : 'Revision')].join('')}
      </EllipsisLink>
    )
  }, [])

  // To be done after GQL-32
  const buildActionCell = useCallback(() => (
    (rowCount === 1)
      ? ' '
      : 'Revert to this revision'
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
      // Change dataKey to 'revisionId' then fix unique key issue (see line 116)
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

  let pageTitle
  if (loading && items.length === 0) {
    pageTitle = `Loading ${startCase(getHumanizedNameFromTypeParam(type, false))} Revisions`
  } else {
    pageTitle = `${commafy(count)} ${startCase(getHumanizedNameFromTypeParam(type, false))} ${pluralize('Revisions', count)}`
  }

  return (
    <Page
      pageType="secondary"
      title={pageTitle}
      breadcrumbs={
        [
          {
            label: `${derivedConceptType}s`,
            to: `/search?type=${derivedConceptType.toLowerCase()}s`
          },
          {
            label: recordTitle,
            to: `/${pluralize(derivedConceptType).toLowerCase()}/${conceptId}/${items.length}`
          },
          {
            label: 'Revision History',
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
                    const paginationMessage = `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} `
                        + `${pluralize('Revision', count)}`

                    return (
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
                              (count || (!loading && !count)) && (
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
                          generateCellKey={({ revisionId }, dataKey) => `column_${dataKey}_${conceptId}_${revisionId}`}
                          generateRowKey={({ revisionId }) => `row_${conceptId}_${revisionId}`}
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
                }
              </ControlledPaginatedContent>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

RevisionList.defaultProps = {
  limit: 20
}

RevisionList.propTypes = {
  limit: PropTypes.number
}

export default RevisionList
