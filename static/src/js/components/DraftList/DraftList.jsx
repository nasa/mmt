import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { FaFileDownload } from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Placeholder from 'react-bootstrap/Placeholder'
import pluralize from 'pluralize'

import useAppContext from '../../hooks/useAppContext'
import useDraftsQuery from '../../hooks/useDraftsQuery'

import parseError from '../../utils/parseError'
import constructDownloadableFile from '../../utils/constructDownloadableFile'

import Table from '../Table/Table'
import Pagination from '../Pagination/Pagination'
import Button from '../Button/Button'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Page from '../Page/Page'

import { DOWNLOAD_DRAFT } from '../../operations/queries/getDownloadDraft'
import conceptIdTypes from '../../constants/conceptIdTypes'
import EllipsisLink from '../EllipsisLink/EllipsisLink'
import EllipsisText from '../EllipsisText/EllipsisText'

const DraftList = ({ draftType }) => {
  const { user } = useAppContext()
  const { providerId } = user
  const { draftType: paramDraftType } = useParams()
  const [activePage, setActivePage] = useState(1)

  const limit = 20
  const offset = (activePage - 1) * limit

  const { drafts, error, loading } = useDraftsQuery({
    draftType,
    offset,
    limit
  })
  const { count, items = [] } = drafts

  const totalPages = Math.ceil(count / limit)

  const noDataMessage = `No ${draftType} drafts exist for the provider ${providerId}`

  const [downloadDraft] = useLazyQuery(DOWNLOAD_DRAFT, {
    onCompleted: (getDraftData) => {
      const { draft: fetchedDraft } = getDraftData
      const { conceptId } = fetchedDraft
      const { ummMetadata } = fetchedDraft

      const contents = JSON.stringify(ummMetadata, null, 2)
      constructDownloadableFile(contents, conceptId)
    }
  })

  const handleDownloadClick = (conceptId) => {
    downloadDraft({
      variables: {
        params: {
          conceptId,
          conceptType: draftType
        }
      }
    })
  }

  const setPage = (nextPage) => {
    setActivePage(nextPage)
  }

  // // Building a Table using Data in items
  // const data = (items.map((item) => {
  //   const {
  //     conceptId,
  //     revisionDate,
  //     ummMetadata
  //   } = item
  //   const {
  //     ShortName,
  //     EntryTitle,
  //     Name,
  //     LongName
  //   } = ummMetadata || {}

  //   const draftLink = `/drafts/${`${paramDraftType}`}/${conceptId}`

  //   return (
  //     {
  //       key: conceptId,
  //       cells:
  //         [
  //           {
  //             value:
  //             (
  //               <Link to={draftLink}>
  //                 {Name || ShortName || '<Blank Name>'}
  //               </Link>
  //             )
  //           },
  //           {
  //             value:
  //             (
  //               LongName || EntryTitle || '<Untitled Record>'
  //             )
  //           },
  //           {
  //             value:
  //             (
  //               new Date(revisionDate).toISOString().split('T')[0]
  //             )
  //           },
  //           {
  //             value:
  //             (
  //               <div className="d-flex">
  //                 <Button
  //                   className="d-flex"
  //                   Icon={FaFileDownload}
  //                   onClick={() => handleDownloadClick(conceptId)}
  //                   variant="secondary"
  //                   size="sm"
  //                 >
  //                   Download JSON
  //                 </Button>
  //               </div>
  //             )
  //           }
  //         ]
  //     }
  //   )
  // })
  // )
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
    const { conceptId } = rowData

    return (
      <div className="d-flex">
        <Button
          className="d-flex"
          Icon={FaFileDownload}
          iconTitle="Document with an arrow pointing down"
          onClick={() => handleDownloadClick(conceptId)}
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
      title: 'Last Modified',
      className: 'col-auto',
      dataAccessorFn: (cellData) => cellData.split('T')[0]
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

  const currentPageIndex = Math.floor(offset / limit)
  const firstResultIndex = currentPageIndex * limit
  const isLastPage = totalPages === activePage
  const lastResultIndex = firstResultIndex + (isLastPage ? count % limit : limit)

  const paginationMessage = count > 0
    ? `Showing ${totalPages > 1 ? `${firstResultIndex + 1}-${lastResultIndex} of` : ''} ${count} ${draftType.toLowerCase()} ${pluralize('draft', count)}`
    : `No ${pluralize(draftType.toLowerCase(), count)} drafts found`

  return (
    <Page
      title={`${providerId} ${draftType} Drafts`}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${draftType} Drafts`,
            to: `/drafts/${draftType}s`,
            active: true
          }
        ]
      }
      headerActions={
        [
          {
            label: `New ${draftType} Draft`,
            to: 'new'
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
                        <span className="text-secondary fw-bolder">{paginationMessage}</span>
                      )
                    }
                  </Col>
                  <Col className="mb-4 flex-grow-1" xs="auto" />
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
                  id="drafts-table"
                  columns={columns}
                  generateCellKey={({ conceptId }, dataKey) => `column_${dataKey}_${conceptId}`}
                  generateRowKey={({ conceptId }) => `row_${conceptId}`}
                  loading={loading}
                  data={items}
                  error={error}
                  noDataMessage={noDataMessage}
                  count={count}
                  setPage={setPage}
                  limit={limit}
                  offset={offset}
                />
              </>
            )
          }
        </Col>
      </Row>
    </Page>
  )
}

DraftList.propTypes = {
  draftType: PropTypes.string.isRequired
}

export default DraftList
