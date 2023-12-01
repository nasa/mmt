import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'

import { GET_TOOL_DRAFTS } from '../../operations/queries/getToolDrafts'

import useDraftsQuery from '../useDraftsQuery'
import AppContext from '../../context/AppContext'

afterEach(() => {
  jest.clearAllMocks()
})

const TestComponent = () => {
  const { drafts, loading, error } = useDraftsQuery({ draftType: 'Tool' }, {
    variables: {
      conceptType: 'Tool',
      provider: 'TESTPROV',
      sortKey: ['-revision_date']
    }
  })
  const { items = [], count } = drafts

  return (
    <div>
      {
        loading && (
          <span>Loading</span>
        )
      }
      {
        error && (
          <span>Errored</span>
        )
      }
      {
        count && (
          <span>
            Count:
            {' '}
            {count}
          </span>
        )
      }
      {
        items.length > 0 && (
          <ul>
            {
              items.map(({ conceptId }) => (
                <li key={conceptId}>{conceptId}</li>
              ))
            }
          </ul>
        )
      }
    </div>
  )
}

describe('useDraftsQuery', () => {
  describe('when the token does not exist', () => {
    test('loading is set to true', async () => {
      render(
        <AppContext.Provider value={
          {
            user: {
              providerId: 'TESTPROV'
            }
          }
        }
        >
          <MockedProvider
            mocks={
              [
                {
                  request: {
                    query: GET_TOOL_DRAFTS,
                    variables: {
                      params: {
                        conceptType: 'Tool',
                        provider: 'TESTPROV',
                        limit: undefined,
                        sortKey: ['-revision_date']
                      }
                    }
                  },
                  result: {
                    data: {
                      drafts: {
                        count: 3,
                        items: [
                          {
                            conceptId: 'TD1000000000-TESTPROV',
                            revisionDate: '2023-11-30 00:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 1',
                              longName: 'Tool Draft 1 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000001-TESTPROV',
                            revisionDate: '2023-11-30 01:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 2',
                              longName: 'Tool Draft 2 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000002-TESTPROV',
                            revisionDate: '2023-11-30 02:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 3',
                              longName: 'Tool Draft 3 Long Name'
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          >
            <TestComponent />
          </MockedProvider>
        </AppContext.Provider>
      )

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
    })
  })

  describe('when the request has not yet resolved', () => {
    test('loading is set to true', async () => {
      render(
        <AppContext.Provider value={
          {
            user: {
              token: 'TEST_TOKEN',
              providerId: 'TESTPROV'
            }
          }
        }
        >
          <MockedProvider
            mocks={
              [
                {
                  request: {
                    query: GET_TOOL_DRAFTS,
                    variables: {
                      params: {
                        conceptType: 'Tool',
                        provider: 'TESTPROV',
                        limit: undefined,
                        sortKey: ['-revision_date']
                      }
                    }
                  },
                  result: {
                    data: {
                      drafts: {
                        count: 3,
                        items: [
                          {
                            conceptId: 'TD1000000000-TESTPROV',
                            revisionDate: '2023-11-30 00:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 1',
                              longName: 'Tool Draft 1 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000001-TESTPROV',
                            revisionDate: '2023-11-30 01:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 2',
                              longName: 'Tool Draft 2 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000002-TESTPROV',
                            revisionDate: '2023-11-30 02:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 3',
                              longName: 'Tool Draft 3 Long Name'
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          >
            <TestComponent />
          </MockedProvider>
        </AppContext.Provider>
      )

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
    })
  })

  describe('when the request has resolved', () => {
    test('loading is set to false and the items are displayed', async () => {
      render(
        <AppContext.Provider value={
          {
            user: {
              token: 'TEST_TOKEN',
              providerId: 'TESTPROV'
            }
          }
        }
        >
          <MockedProvider
            mocks={
              [
                {
                  request: {
                    query: GET_TOOL_DRAFTS,
                    variables: {
                      params: {
                        conceptType: 'Tool',
                        provider: 'TESTPROV',
                        limit: undefined,
                        sortKey: ['-revision_date']
                      }
                    }
                  },
                  result: {
                    data: {
                      drafts: {
                        count: 3,
                        items: [
                          {
                            conceptId: 'TD1000000000-TESTPROV',
                            revisionDate: '2023-11-30 00:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 1',
                              longName: 'Tool Draft 1 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000001-TESTPROV',
                            revisionDate: '2023-11-30 01:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 2',
                              longName: 'Tool Draft 2 Long Name'
                            }
                          },
                          {
                            conceptId: 'TD1000000002-TESTPROV',
                            revisionDate: '2023-11-30 02:00:00',
                            previewMetadata: {
                              name: 'Tool Draft 3',
                              longName: 'Tool Draft 3 Long Name'
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          >
            <TestComponent />
          </MockedProvider>
        </AppContext.Provider>
      )

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(screen.getByText('Count: 3')).toBeInTheDocument()
      expect(screen.getByText('TD1000000000-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('TD1000000001-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('TD1000000002-TESTPROV')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test('error is set to true', async () => {
      render(
        <AppContext.Provider value={
          {
            user: {
              token: 'TEST_TOKEN',
              providerId: 'TESTPROV'
            }
          }
        }
        >
          <MockedProvider
            mocks={
              [
                {
                  request: {
                    query: GET_TOOL_DRAFTS,
                    variables: {
                      params: {
                        conceptType: 'Tool',
                        provider: 'TESTPROV',
                        limit: undefined,
                        sortKey: ['-revision_date']
                      }
                    }
                  },
                  error: new Error('An error occurred')
                }
              ]
            }
          >
            <TestComponent />
          </MockedProvider>
        </AppContext.Provider>
      )

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
      expect(screen.getByText('Errored')).toBeInTheDocument()
    })
  })
})
