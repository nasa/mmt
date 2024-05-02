import React, {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useParams } from 'react-router-dom'
import { useSuspenseQuery } from '@apollo/client'
import { FaFileDownload } from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import pluralize from 'pluralize'

import moment from 'moment'
import useAppContext from '../../hooks/useAppContext'
import constructDownloadableFile from '../../utils/constructDownloadableFile'

import Table from '../Table/Table'
import Button from '../Button/Button'

import conceptIdTypes from '../../constants/conceptIdTypes'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import EllipsisText from '../EllipsisText/EllipsisText'
import ControlledPaginatedContent from '../ControlledPaginatedContent/ControlledPaginatedContent'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'
import conceptTypeDraftsQueries from '../../constants/conceptTypeDraftsQueries'
import { DATE_FORMAT } from '../../constants/dateFormat'

const DraftList = () => {
  const { user } = useAppContext()
  const { providerId } = user

  const { draftType: paramDraftType } = useParams()

  const draftType = urlValueTypeToConceptTypeMap[paramDraftType]

  const [activePage, setActivePage] = useState(1)

  const limit = 20
  const offset = (activePage - 1) * limit

  const { data } = useSuspenseQuery(conceptTypeDraftsQueries[draftType], {
    variables: {
      params: {
        provider: providerId,
        conceptType: draftType,
        limit,
        offset,
        sortKey: ['-revision_date']
      }
    }
  })

  const { drafts } = data
  const { count, items } = drafts

  const handleDownloadClick = (conceptId, ummMetadata) => {
    const contents = JSON.stringify(ummMetadata, null, 2)
    constructDownloadableFile(contents, conceptId)
  }

  const setPage = (nextPage) => {
    setActivePage(nextPage)
  }

  const buildPrimaryEllipsisLink = useCallback((originalCellData, rowData) => {
    const { conceptId } = rowData

    let cellData = originalCellData

    if (!cellData && draftType === conceptIdTypes.C) cellData = '<Blank Short Name>'
    if (!cellData) cellData = '<Blank Name>'

    return (
      <EllipsisLink to={`/drafts/${`${paramDraftType.toLowerCase()}`}/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [])

  const buildEllipsisTextCell = useCallback((originalCellData) => {
    let cellData = originalCellData

    if (!cellData && draftType === conceptIdTypes.C) cellData = '<Blank Entry Title>'
    if (!cellData) cellData = '<Blank Long Name>'

    return (
      <EllipsisText>
        {cellData}
      </EllipsisText>
    )
  }, [])

  const buildActionsCell = useCallback((cellData, rowData) => {
    const { conceptId, ummMetadata } = rowData

    return (
      <div className="d-flex">
        <Button
          className="d-flex"
          Icon={FaFileDownload}
          iconTitle="Document with an arrow pointing down"
          onClick={() => handleDownloadClick(conceptId, ummMetadata)}
          variant="secondary"
          size="sm"
        >
          Download JSON
        </Button>
      </div>
    )
  }, [])

  const [columns, setColumns] = useState([
    {
      dataKey: 'revisionDate',
      title: 'Last Modified (UTC)',
      className: 'col-auto',
      dataAccessorFn: (cellData) => moment.utc(cellData).format(DATE_FORMAT)
    },
    {
      title: 'Actions',
      className: 'col-auto',
      dataAccessorFn: buildActionsCell
    }
  ])

  useEffect(() => {
    let newColumns = [...columns]

    if (draftType === conceptIdTypes.C) {
      newColumns = [
        {
          dataKey: 'ummMetadata.ShortName',
          title: 'Short Name',
          className: 'col-auto',
          dataAccessorFn: buildPrimaryEllipsisLink
        },
        {
          dataKey: 'ummMetadata.EntryTitle',
          title: 'Entry Title',
          className: 'col-auto',
          dataAccessorFn: buildEllipsisTextCell
        },
        ...newColumns
      ]
    } else {
      newColumns = [
        {
          dataKey: 'ummMetadata.Name',
          title: 'Name',
          className: 'col-auto',
          dataAccessorFn: buildPrimaryEllipsisLink
        },
        {
          dataKey: 'ummMetadata.LongName',
          title: 'Long Name',
          className: 'col-auto',
          dataAccessorFn: buildEllipsisTextCell
        },
        ...newColumns
      ]
    }

    setColumns(newColumns)
  }, [])

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
                ? `Showing ${totalPages > 1 ? `${firstResultPosition}-${lastResultPosition} of` : ''} ${count} ${draftType.toLowerCase()} ${pluralize('draft', count)}`
                : `No ${pluralize(draftType.toLowerCase(), count)} drafts found`

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
                    id="drafts-table"
                    columns={columns}
                    generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                    generateRowKey={({ conceptId }) => `row_${conceptId}`}
                    data={items}
                    noDataMessage={`No ${draftType} drafts exist for the provider ${providerId}`}
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

export default DraftList
