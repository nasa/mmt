import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_TOOL_DRAFTS } from '../../operations/queries/getToolDrafts'

import useDraftsQuery from '../useDraftsQuery'
import AppContext from '../../context/AppContext'

const TestComponent = () => {
  const { drafts, loading, error } = useDraftsQuery({
    draftType: 'Tool',
    limit: 5
  }, {
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

const setup = (overrideMocks) => {
  const mocks = [
    {
      request: {
        query: GET_TOOL_DRAFTS,
        variables: {
          params: {
            conceptType: 'Tool',
            provider: 'TESTPROV',
            limit: 5,
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
                ummMetadata: {
                  Name: 'Tool Draft 1',
                  LongName: 'Tool Draft 1 Long Name'
                },
                previewMetadata: {
                  name: 'Tool Draft 1',
                  longname: 'Tool Draft 1 Long Name'
                }
              },
              {
                conceptId: 'TD1000000001-TESTPROV',
                revisionDate: '2023-11-30 01:00:00',
                ummMetadata: {
                  Name: 'Tool Draft 2',
                  LongName: 'Tool Draft 2 Long Name'
                },
                previewMetadata: {
                  name: 'Tool Draft 2',
                  longname: 'Tool Draft 2 Long Name'
                }
              },
              {
                conceptId: 'TD1000000002-TESTPROV',
                revisionDate: '2023-11-30 02:00:00',
                ummMetadata: {
                  Name: 'Tool Draft 3',
                  LongName: 'Tool Draft 3 Long Name'
                },
                previewMetadata: {
                  name: 'Tool Draft 3',
                  longname: 'Tool Draft 3 Long Name'
                }
              }
            ]
          }
        }
      }
    }
  ]

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'TESTPROV'
        },
        setDraft: vi.fn(),
        setOriginalDraft: vi.fn()
      }
    }
    >
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <TestComponent />
      </MockedProvider>
    </AppContext.Provider>
  )
}

describe('useDraftsQuery', () => {
  describe('when the request has not yet resolved', () => {
    test('loading is set to true', async () => {
      setup()

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
    })
  })

  describe('when the request has resolved', () => {
    test('loading is set to false and the items are displayed', async () => {
      setup()

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
      setup([
        {
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                conceptType: 'Tool',
                provider: 'TESTPROV',
                limit: 5,
                sortKey: ['-revision_date']
              }
            }
          },
          error: new Error('An error occurred')
        }
      ])

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
      expect(screen.getByText('Errored')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error of a specific conceptId not existing', () => {
    test('calls the query again', async () => {
      setup([
        {
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                conceptType: 'Tool',
                provider: 'TESTPROV',
                limit: 5,
                sortKey: ['-revision_date']
              }
            }
          },
          error: new Error('Concept with concept-id [TD1000000004-TESTPROV] and revision-id [1] does not exist.')
        },
        {
          request: {
            query: GET_TOOL_DRAFTS,
            variables: {
              params: {
                conceptType: 'Tool',
                provider: 'TESTPROV',
                limit: 5,
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
                    ummMetadata: {
                      Name: 'Tool Draft 1',
                      LongName: 'Tool Draft 1 Long Name'
                    },
                    previewMetadata: {
                      name: 'Tool Draft 1',
                      longname: 'Tool Draft 1 Long Name'
                    }
                  },
                  {
                    conceptId: 'TD1000000001-TESTPROV',
                    revisionDate: '2023-11-30 01:00:00',
                    ummMetadata: {
                      Name: 'Tool Draft 2',
                      LongName: 'Tool Draft 2 Long Name'
                    },
                    previewMetadata: {
                      name: 'Tool Draft 2',
                      longname: 'Tool Draft 2 Long Name'
                    }
                  },
                  {
                    conceptId: 'TD1000000002-TESTPROV',
                    revisionDate: '2023-11-30 02:00:00',
                    ummMetadata: {
                      Name: 'Tool Draft 3',
                      LongName: 'Tool Draft 3 Long Name'
                    },
                    previewMetadata: {
                      name: 'Tool Draft 3',
                      longname: 'Tool Draft 3 Long Name'
                    }
                  }
                ]
              }
            }
          }
        }
      ])

      expect(screen.getByText('Loading')).toBeInTheDocument()

      // Ensure we wait for both responses
      await waitForResponse()
      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(screen.getByText('Count: 3')).toBeInTheDocument()
      expect(screen.getByText('TD1000000000-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('TD1000000001-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('TD1000000002-TESTPROV')).toBeInTheDocument()
    })
  })
})
