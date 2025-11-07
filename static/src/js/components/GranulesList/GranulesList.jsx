import React, { useState } from 'react'
import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'
import moment from 'moment'
import pluralize from 'pluralize'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { GET_GRANULES } from '@/js/operations/queries/getGranules'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import getConceptTypeByConceptId from '../../utils/getConceptTypeByConceptId'
import { DATE_FORMAT } from '../../constants/dateFormat'
import Table from '../Table/Table'

const GranulesList = () => {
  const { conceptId } = useParams()
  const [activePage, setActivePage] = useState(1)

  const limit = 10
  const offset = (activePage - 1) * limit

  const derivedConceptType = getConceptTypeByConceptId(conceptId)

  const { data } = useSuspenseQuery(GET_GRANULES, {
    variables: {
      params: {
        conceptId
      },
      granulesParams: {
        limit,
        offset
      }
    }
  })

  const { [derivedConceptType.toLowerCase()]: concept } = data
  const { granules } = concept
  const { count, items } = granules

  const setPage = (nextPage) => {
    setActivePage(nextPage)
  }

  const columns = [
    {
      dataKey: 'conceptId',
      title: 'Concept Id',
      className: 'col-auto'
    },
    {
      dataKey: 'title',
      title: 'Title',
      className: 'col-auto'
    },
    {
      dataKey: 'revisionDate',
      title: 'Revision Date (UTC)',
      className: 'col-auto',
      dataAccessorFn: (cellData) => {
        if (cellData === null || cellData === undefined) {
          return 'N/A'
        }

        return moment.utc(cellData).format(DATE_FORMAT)
      }
    }
  ]

  return (
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
              totalPages,
              pagination,
              firstResultPosition,
              lastResultPosition
            }) => {
              const paginationMessage = count > 0
                ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} ${pluralize('granule', count)}`
                : 'No granules found'

              return (
                <>
                  <Row className="d-flex justify-content-between align-items-center mb-4">
                    <Col className="mb-4 flex-grow-1" xs="auto">
                      {
                        (!!count) && (
                          <span className="text-secondary fw-bolder">{paginationMessage}</span>
                        )
                      }
                    </Col>
                    <Col className="mb-4 flex-grow-1" xs="auto" />
                    {
                      totalPages > 1 && (
                        <Col xs="auto">
                          {pagination}
                        </Col>
                      )
                    }
                  </Row>
                  <Table
                    id="granule-results-table"
                    columns={columns}
                    data={items}
                    generateCellKey={({ conceptId: granuleConceptId, revisionId }, dataKey) => `column_${dataKey}_${granuleConceptId}_${revisionId}`}
                    generateRowKey={({ conceptId: granuleConceptId, revisionId }) => `row_${granuleConceptId}_${revisionId}`}
                    noDataMessage="No granules found"
                    count={count}
                    setPage={setPage}
                    limit={limit}
                    offset={offset}
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
  )
}

export default GranulesList
