import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Placeholder from 'react-bootstrap/Placeholder'

import parseError from '../../utils/parseError'
import useDraftsQuery from '../../hooks/useDraftsQuery'
import useAppContext from '../../hooks/useAppContext'
import urlValueTypeToConceptTypeMap from '../../constants/urlValueToConceptTypeMap'

import ErrorBanner from '../../components/ErrorBanner/ErrorBanner'
import Page from '../../components/Page/Page'
import For from '../../components/For/For'
import ManageSection from '../../components/ManageSection/ManageSection'

import './ManagePage.scss'

/**
 * Renders a `ManagePage` component
 * @component
 * @example <caption>Renders a `ManagePage` component</caption>
 * return (
 *   <ManagePage />
 * )
 */
const ManagePage = () => {
  const { user: { providerId } } = useAppContext()
  const { type } = useParams()

  const currentType = urlValueTypeToConceptTypeMap[type]

  const { drafts, loading, error } = useDraftsQuery({
    draftType: currentType,
    limit: 5
  })

  const { items = [] } = drafts || {}

  return (
    <Page title={`Manage ${currentType}`}>
      <Row className="manage-page__sections">
        <For
          each={
            [
              {
                title: `Create ${currentType} Record`,
                sections: [
                  {
                    key: 'create-record',
                    children: <Link className="btn btn-primary fw-bold" to={`/drafts/${type}/new`}>Create New Record</Link>,
                    separate: true
                  },
                  {
                    key: 'or-search',
                    children: (
                      <>
                        <strong>OR</strong>
                        {' '}
                        use the
                        {' '}
                        {/* TODO need to add the tooltip highlight */}
                        <Button className="p-0 align-baseline" variant="link">search</Button>
                        {' '}
                        in the top right corner to find published tools to clone or edit.
                      </>
                    ),
                    separate: true
                  }
                ]
              },
              {
                title: `${providerId} ${currentType} Drafts`,
                sections: [
                  {
                    key: 'drafts',
                    children: (
                      <>
                        {error && <ErrorBanner message={parseError(error)} />}
                        {
                          !error && (
                            <ListGroup className="border-0  mt-3 border border-top" variant="flush">
                              {
                                loading
                                  ? (
                                    <For each={[...new Array(5)]}>
                                      {
                                        (item, i) => (
                                          <ListGroup.Item key={`placeholder_${i}`} className="mb-0">
                                            <Placeholder animation="glow" role="presentation" aria-hidden="true">
                                              <Placeholder xs={11} size="sm" />
                                              <Placeholder xs={9} size="sm" />
                                            </Placeholder>
                                          </ListGroup.Item>
                                        )
                                      }
                                    </For>
                                  )
                                  : (
                                    <For
                                      each={items.slice(0, 5)}
                                      empty={
                                        (
                                          <Alert className="my-3 text-center" variant="light">
                                            No
                                            {' '}
                                            {currentType}
                                            {' '}
                                            drafts exist for the provider
                                            {' '}
                                            <strong>{providerId}</strong>
                                            .
                                          </Alert>
                                        )
                                      }
                                    >
                                      {
                                        ({
                                          conceptId,
                                          ummMetadata,
                                          revisionDate
                                        }) => {
                                          const {
                                            ShortName, EntryTitle, Name, LongName
                                          } = ummMetadata || {}

                                          return (
                                            <ListGroup.Item key={conceptId} action className="mb-0">
                                              <Link
                                                className="text-decoration-none text-primary"
                                                to={`/drafts/${type}/${conceptId}`}
                                              >
                                                <div>
                                                  <span className="text-black d-block d-xl-inline">{new Date(revisionDate).toLocaleString('en-US', { hour12: false })}</span>
                                                  <span className="d-none d-xl-inline"> | </span>
                                                  <span>{Name || ShortName || '<Blank Name>'}</span>
                                                </div>
                                                <div>
                                                  <span className="text-secondary">{LongName || EntryTitle || '<Untitled Record>'}</span>
                                                </div>
                                              </Link>
                                            </ListGroup.Item>
                                          )
                                        }
                                      }
                                    </For>
                                  )
                              }
                            </ListGroup>
                          )
                        }
                      </>
                    )
                  },
                  {
                    key: 'view-all-drafts',
                    children: (
                      <div className="d-flex border-top border-gray-200 justify-content-center">
                        <Link className="mt-3 align-baseline btn btn-light btn-sm" to={`/drafts/${type}`}>
                          View All
                          {' '}
                          {currentType}
                          {' '}
                          Drafts
                        </Link>
                      </div>
                    )
                  }
                ]
              }
            ]
          }
        >
          {
            ({ title, sections }) => (
              <ManageSection
                key={title}
                className="manage-page__section"
                title={title}
                sections={sections}
              />
            )
          }
        </For>
      </Row>
    </Page>
  )
}

export default ManagePage
