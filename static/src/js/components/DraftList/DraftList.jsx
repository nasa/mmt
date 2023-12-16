import React from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { FaFileDownload } from 'react-icons/fa'
import pluralize from 'pluralize'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import PlaceholderButton from 'react-bootstrap/PlaceholderButton'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import useAppContext from '../../hooks/useAppContext'
import useDraftsQuery from '../../hooks/useDraftsQuery'

import parseError from '../../utils/parseError'
import constructDownloadableFile from '../../utils/constructDownloadableFile'

import Button from '../Button/Button'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import For from '../For/For'
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

  return (
    <Page
      headerActions={
        [
          {
            label: `New ${draftType} Draft`,
            to: 'new'
          }
        ]
      }
      pageType="secondary"
      title={`${providerId} ${draftType} Drafts`}
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

                <Table striped>
                  <thead>
                    <tr>
                      <th>Short Name</th>
                      <th>Entry Title</th>
                      <th className="text-center">Last Modified</th>
                      <th className="text-center">Download</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      loading
                        ? (
                          <For each={[...new Array(5)]}>
                            {
                              (item, i) => (
                                <tr key={`placeholder-row_${i}`}>
                                  <td className="col-md-4">
                                    <Placeholder animation="glow">
                                      <Placeholder xs={6} />
                                    </Placeholder>
                                  </td>
                                  <td className="col-md-4">
                                    <Placeholder animation="glow">
                                      <Placeholder xs={8} />
                                    </Placeholder>
                                  </td>
                                  <td className="col-auto">
                                    <Placeholder animation="glow">
                                      <Placeholder xs={8} />
                                    </Placeholder>
                                  </td>
                                  <td className="col-auto">
                                    <Placeholder animation="glow">
                                      <PlaceholderButton className="btn-sm" xs={10} variant="secondary" size="sm" />
                                    </Placeholder>
                                  </td>
                                </tr>
                              )
                            }
                          </For>
                        )
                        : (
                          <For
                            each={items}
                            empty={
                              (
                                <tr className="text-center">
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
                              )
                            }
                          >
                            {
                              (
                                {
                                  conceptId,
                                  previewMetadata: {
                                    name,
                                    longName
                                  },
                                  revisionDate
                                }
                              ) => {
                                const draftLink = `/drafts/${`${paramDraftType}`}/${conceptId}`

                                return (
                                  <tr key={conceptId}>
                                    <td className="col-md-4">
                                      <Link
                                        className="text-decoration-none text-primary"
                                        to={draftLink}
                                      >
                                        <div>
                                          <span>{name || 'No name provided'}</span>
                                        </div>
                                      </Link>
                                    </td>

                                    <td className="col-md-4">
                                      <Link
                                        className="text-decoration-none text-primary"
                                        to={draftLink}
                                      >
                                        <div>
                                          <span>{longName || 'No longname provided'}</span>
                                        </div>
                                      </Link>
                                    </td>

                                    <td className="col-auto text-center">
                                      {new Date(revisionDate).toLocaleString('en-US', { hour12: false })}
                                    </td>

                                    <td className="col-auto text-center">
                                      <Button
                                        className="d-flex align-items-center justify-content-center"
                                        Icon={FaFileDownload}
                                        onClick={() => handleDownloadClick(conceptId)}
                                        variant="secondary"
                                      >
                                        JSON
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              }
                            }
                          </For>
                        )
                    }
                  </tbody>
                </Table>
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
