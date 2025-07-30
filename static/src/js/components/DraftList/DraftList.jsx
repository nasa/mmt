import React, { useCallback, useState } from 'react'

import { FaFileDownload } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useSuspenseQuery } from '@apollo/client'
import moment from 'moment'
import pluralize from 'pluralize'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { DATE_FORMAT } from '@/js/constants/dateFormat'
import conceptTypeDraftsQueries from '@/js/constants/conceptTypeDraftsQueries'
import constructDownloadableFile from '@/js/utils/constructDownloadableFile'
import urlValueTypeToConceptTypeStringMap from '@/js/constants/urlValueToConceptStringMap'

import Button from '@/js/components/Button/Button'
import ControlledPaginatedContent from '@/js/components/ControlledPaginatedContent/ControlledPaginatedContent'
import EllipsisLink from '@/js/components/EllipsisLink/EllipsisLink'
import EllipsisText from '@/js/components/EllipsisText/EllipsisText'
import Table from '@/js/components/Table/Table'

const DraftList = () => {
  const { draftType: paramDraftType } = useParams()

  const draftType = urlValueTypeToConceptTypeStringMap[paramDraftType]

  const [activePage, setActivePage] = useState(1)

  const limit = 20
  const offset = (activePage - 1) * limit

  const { data } = useSuspenseQuery(conceptTypeDraftsQueries[draftType], {
    variables: {
      params: {
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

    if (!cellData && draftType === 'Collection') cellData = '<Blank Short Name>'
    if (!cellData) cellData = '<Blank Name>'

    return (
      <EllipsisLink to={`/drafts/${`${paramDraftType.toLowerCase()}`}/${conceptId}`}>
        {cellData}
      </EllipsisLink>
    )
  }, [draftType, paramDraftType])

  const buildEllipsisTextCell = useCallback((originalCellData) => {
    let cellData = originalCellData

    if (!cellData && draftType === 'Collection') cellData = '<Blank Entry Title>'
    if (!cellData) cellData = '<Blank Long Name>'

    return (
      <EllipsisText>
        {cellData}
      </EllipsisText>
    )
  }, [draftType])

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

  const collectionColumns = [
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
    }
  ]

  // For 'generic' schemas as opposed to umm
  const genericColumns = [
    {
      dataKey: 'ummMetadata.Name',
      title: 'Name',
      className: 'col-auto',
      dataAccessorFn: buildPrimaryEllipsisLink
    }
  ]

  const defaultColumns = [
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
    }
  ]
  const commonColumns = [
    {
      dataKey: 'providerId',
      className: 'col-auto',
      title: 'Provider'
    },
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
  ]

  const getColumns = () => {
    switch (draftType) {
      case 'Collection':
        return [...collectionColumns, ...commonColumns]
      case 'Visualization':
      case 'Citation':
        return [...genericColumns, ...commonColumns]
      default:
        return [...defaultColumns, ...commonColumns]
    }
  }

  const columns = getColumns()

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
                    noDataMessage={`No ${draftType} drafts exist`}
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
