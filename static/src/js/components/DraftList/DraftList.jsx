import React from 'react'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { capitalize } from 'lodash-es'
import { FaFileDownload } from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import Placeholder from 'react-bootstrap/Placeholder'
import PlaceholderButton from 'react-bootstrap/PlaceholderButton'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { useLazyQuery } from '@apollo/client'

import useAppContext from '../../hooks/useAppContext'
import useDraftsQuery from '../../hooks/useDraftsQuery'

import parseError from '../../utils/parseError'
import constructDownloadableFile from '../../utils/constructDownloadableFile'

import Button from '../Button/Button'
import draftConceptTypes from '../../constants/draftConceptTypes'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import For from '../For/For'
import Page from '../Page/Page'

import { DOWNLOAD_DRAFT } from '../../operations/queries/getDownloadDraft'

const DraftList = ({ draftType }) => {
  const currentDraftType = draftConceptTypes[draftConceptTypes[capitalize(draftType)]]

  const { user: { providerId } } = useAppContext()
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

  const createDownloadDraftParams = (conceptId) => ({
    variables: {
      params: {
        conceptId,
        conceptType: draftType
      }
    }
  })

  return (
    <Page
      headerActions={
        [
          {
            label: `New ${currentDraftType} Draft`,
            to: 'new'
          }
        ]
      }
      pageType="secondary"
      title={`${providerId} ${currentDraftType} Drafts`}
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
                        {currentDraftType}
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
                                    {currentDraftType}
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
                              ) => (
                                <tr key={conceptId}>
                                  <td className="col-md-4">
                                    <Link
                                      className="text-decoration-none text-primary"
                                      to={`/drafts/${`${paramDraftType}`}/${conceptId}`}
                                    >
                                      <div>
                                        <span>{name || 'No name provided'}</span>
                                      </div>
                                    </Link>
                                  </td>

                                  <td className="col-md-4">
                                    <Link
                                      className="text-decoration-none text-primary"
                                      to={`/drafts/${`${paramDraftType}`}/${conceptId}`}
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
                                      variant="secondary"
                                      className="d-flex align-items-center justify-content-center"
                                      onClick={
                                        () => {
                                          console.log('clicked it!!!!!!')
                                          downloadDraft(createDownloadDraftParams(conceptId))
                                        }
                                      }
                                      Icon={FaFileDownload}
                                    >
                                      JSON
                                    </Button>
                                  </td>
                                </tr>
                              )
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
