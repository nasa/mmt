import React from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { FaFileDownload } from 'react-icons/fa'
import pluralize from 'pluralize'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import Row from 'react-bootstrap/Row'
import Table from '../Table/Table'

import useAppContext from '../../hooks/useAppContext'
import useDraftsQuery from '../../hooks/useDraftsQuery'

import parseError from '../../utils/parseError'
import constructDownloadableFile from '../../utils/constructDownloadableFile'

import Button from '../Button/Button'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import Page from '../Page/Page'

import { DOWNLOAD_DRAFT } from '../../operations/queries/getDownloadDraft'

const DraftList = ({ draftType }) => {
  const { user } = useAppContext()
  const { providerId } = user
  const { draftType: paramDraftType } = useParams()

  const { drafts, error, loading } = useDraftsQuery({ draftType })
  const { count, items = [] } = drafts

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

  // Building a Table using Data in items
  const renderRows = items.length
    ? (items.map((item) => {
      const { conceptId, revisionDate, previewMetadata: { name, longName } } = item
      const draftLink = `/drafts/${`${paramDraftType}`}/${conceptId}`

      return (
        <tr key={`${paramDraftType}/${conceptId}`}>
          <td className="col-md-4">
            <Link to={draftLink}>
              {name || '<Blank Name>'}
            </Link>
          </td>
          <td className="col-md-4">
            {longName || '<Untitled Record>'}
          </td>
          <td className="col-auto">
            {new Date(revisionDate).toISOString().split('T')[0]}
          </td>
          <td className="col-auto">
            <div className="d-flex">
              <Button
                className="d-flex"
                Icon={FaFileDownload}
                onClick={() => handleDownloadClick(conceptId)}
                variant="secondary"
                size="sm"
              >
                Download JSON
              </Button>
            </div>
          </td>
        </tr>
      )
    })
    )
    : (
      [
        <tr key={`${paramDraftType}`} className="text-center">
          <td colSpan={4}>
            No
            {' '}
            {draftType}
            {' '}
            drafts exist for the provider
            {' '}
            <strong>{providerId}</strong>
            .
          </td>
        </tr>
      ]
    )

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
                {
                  loading
                    ? (
                      <span className="d-block mb-3">
                        <Placeholder as="span" animation="glow">
                          <Placeholder xs={2} />
                        </Placeholder>
                      </span>
                    )
                    : (
                      <span className="d-block mb-3">
                        Showing
                        {' '}
                        {count > 0 && 'all'}
                        {' '}
                        {count}
                        {' '}
                        {draftType}
                        {' '}
                        {pluralize('Draft', count)}
                      </span>
                    )
                }
                <Table
                  headers={['Short Name', 'Entry Title', 'Last Modified', 'Actions']}
                  loading={loading}
                  renderRows={renderRows}
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
