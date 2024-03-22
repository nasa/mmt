import React from 'react'
import PropTypes from 'prop-types'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_COLLECTIONS } from '../../operations/queries/getCollections'
import { GET_VARIABLES } from '../../operations/queries/getVariables'
import useSearchQuery from '../useSearchQuery'
import AppContext from '../../context/AppContext'

const TestComponent = ({ type }) => {
  const { results, loading, error } = useSearchQuery({
    type: type || 'Collections',
    limit: 3,
    offset: 0
  })
  const { items = [], count } = results

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

TestComponent.defaultProps = {
  type: ''
}

TestComponent.propTypes = {
  type: PropTypes.string
}

const setup = (overrideMocks, overrideType) => {
  const mocks = [
    {
      request: {
        query: GET_COLLECTIONS,
        variables: {
          params: {
            limit: 3,
            offset: 0,
            keyword: undefined,
            includeTags: '*',
            sortKey: undefined
          }
        }
      },
      result: {
        data: {
          collections: {
            count: 3,
            items: [
              {
                conceptId: 'C10000000000-TESTPROV',
                shortName: 'Test Short Name 1',
                version: '1',
                revisionId: 1,
                title: 'Test Title 1',
                provider: 'TESTPROV',
                entryTitle: null,
                granules: {
                  count: 3
                },
                tagDefinitions: {
                  items: [{
                    conceptId: 'C100000',
                    description: 'Mock tag description',
                    originatorId: 'test.user',
                    revisionId: '1',
                    tagKey: 'Mock tag key'
                  }]
                },
                tags: { 'test.tag.one': { data: 'Some data' } },
                revisionDate: '2023-11-30 00:00:00'
              },
              {
                conceptId: 'C10000000001-TESTPROV',
                shortName: 'Test Short Name 2',
                version: '1',
                revisionId: 1,
                title: 'Test Title 3',
                provider: 'TESTPROV',
                entryTitle: null,
                granules: {
                  count: 3
                },
                tagDefinitions: {
                  items: [{
                    conceptId: 'C100000',
                    description: 'Mock tag description',
                    originatorId: 'test.user',
                    revisionId: '1',
                    tagKey: 'Mock tag key'
                  }]
                },
                tags: { 'test.tag.one': { data: 'Some data' } },
                revisionDate: '2023-11-30 00:00:00'
              },
              {
                conceptId: 'C10000000002-TESTPROV',
                shortName: 'Test Short Name 3',
                revisionId: 1,
                version: '3',
                tagDefinitions: null,
                title: 'Test Title 1',
                provider: 'TESTPROV',
                entryTitle: null,
                granules: {
                  count: 3
                },
                tags: { 'test.tag.one': { data: 'Some data' } },
                revisionDate: '2023-11-30 00:00:00'
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
        }
      }
    }
    >
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <TestComponent type={overrideType} />
      </MockedProvider>
    </AppContext.Provider>
  )
}

describe('useSearchQuery', () => {
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
      expect(screen.getByText('C10000000000-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('C10000000001-TESTPROV')).toBeInTheDocument()
      expect(screen.getByText('C10000000002-TESTPROV')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test('error is set to true', async () => {
      setup([
        {
          request: {
            query: GET_COLLECTIONS,
            variables: {
              params: {
                limit: 3,
                offset: 0,
                keyword: undefined,
                includeTags: '*',
                sortKey: undefined
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

  describe('when requesting variables', () => {
    test('does not add the includeTags parameter', async () => {
      jest.clearAllMocks()

      setup([
        {
          request: {
            query: GET_VARIABLES,
            variables: {
              params: {
                limit: 3,
                offset: 0,
                keyword: undefined,
                sortKey: undefined,
                provider: undefined
              }
            }
          },
          result: {
            data: {
              variables: {
                count: 3,
                items: [
                  {
                    conceptId: 'V10000000000-TESTPROV',
                    name: 'Test Var Short Name 1',
                    longName: 'Test Var Title 1',
                    providerId: 'TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    revisionId: '1'
                  },
                  {
                    conceptId: 'V10000000001-TESTPROV',
                    name: 'Test Var Short Name 2',
                    longName: 'Test Var Title 2',
                    providerId: 'TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    revisionId: '1'
                  },
                  {
                    conceptId: 'V10000000002-TESTPROV',
                    name: 'Test Var Short Name 3',
                    longName: 'Test Var Title 3',
                    providerId: 'TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    revisionId: '1'
                  }
                ]
              }
            }
          }
        }
      ], 'Variables')

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.getByText('V10000000000-TESTPROV')).toBeInTheDocument()
    })
  })
})
