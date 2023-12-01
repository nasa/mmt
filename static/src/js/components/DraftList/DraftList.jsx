import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import { capitalize } from 'lodash'
import { FaFileDownload } from 'react-icons/fa'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import Placeholder from 'react-bootstrap/Placeholder'
import PlaceholderButton from 'react-bootstrap/PlaceholderButton'

import useAppContext from '../../hooks/useAppContext'
import useDraftsQuery from '../../hooks/useDraftsQuery'
import parseError from '../../utils/parseError'

import Page from '../Page/Page'
import For from '../For/For'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import draftConceptTypes from '../../constants/draftConceptTypes'

// TODO Needs tests

const DraftList = ({ draftType }) => {
  const currentDraftType = draftConceptTypes[draftConceptTypes[capitalize(draftType)]]

  const { user: { providerId } } = useAppContext()

  const { drafts, error, loading } = useDraftsQuery({ draftType })
  const { count, items = [] } = drafts

  return (
    <Page
      title={`${providerId} ${currentDraftType} Drafts`}
      pageType="secondary"
      headerActions={
        [
          {
            label: `New ${currentDraftType} Draft`,
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
                                  <td className="col-md-4">{name || 'No name provided'}</td>
                                  <td className="col-md-4">{longName || 'No longname provided'}</td>
                                  <td className="col-auto text-center">{new Date(revisionDate).toLocaleString('en-US', { hour12: false })}</td>
                                  <td className="col-auto text-center">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <Link className="d-flex align-items-center btn btn-sm btn-secondary text-white" to="/">
                                        <FaFileDownload className="me-2" />
                                        JSON
                                      </Link>
                                    </div>
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
