import React from 'react'
import PropTypes from 'prop-types'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_COLLECTION_REVISIONS } from '../../operations/queries/getCollectionRevisions'
import { GET_VARIABLES } from '../../operations/queries/getVariables'
import useRevisionsQuery from '../useRevisionsQuery'
import AppContext from '../../context/AppContext'

const TestComponent = ({ type }) => {
  const { revisions, loading, error } = useRevisionsQuery({
    type: type || 'Collections',
    conceptId: 'TEST1002-MMT_2',
    limit: 3,
    offset: 0,
    sortKey: '-revisionDate'
  })
  const { items = [], count } = revisions

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
              items.map(({ conceptId, revisionId }) => (
                <li key={revisionId}>{conceptId}</li>
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
        query: GET_COLLECTION_REVISIONS,
        variables: {
          params: {
            conceptId: 'TEST1002-MMT_2',
            allRevisions: true,
            limit: 3,
            offset: 0,
            sortKey: '-revisionDate'
          }
        }
      },
      result: {
        data: {
          collections: {
            count: 2,
            items: [
              {
                conceptId: 'TEST1002-MMT_2',
                shortName: 'Collection Short Name 2',
                version: 'Collection Long Name 2',
                title: 'Collection title',
                entryTitle: 'Collection Entry Title',
                revisionId: 2,
                revisionDate: '2023-11-30 00:00:00',
                userId: 'admin'
              },
              {
                conceptId: 'TEST1001-MMT_2',
                shortName: 'Collection Short Name 1',
                version: 'Collection Long Name 1',
                title: 'Collection title',
                entryTitle: 'Collection Entry Title',
                revisionId: 1,
                revisionDate: '2023-11-30 00:00:00',
                userId: 'admin'
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

describe('useRevisionQuery', () => {
  describe('when the request has resolved', () => {
    test('loading is set to false and the items are displayed', async () => {
      setup()

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.getByText('Count: 2')).toBeInTheDocument()
      expect(screen.getByText('TEST1002-MMT_2')).toBeInTheDocument()
      expect(screen.getByText('TEST1001-MMT_2')).toBeInTheDocument()
    })
  })

  describe('when requesting variables', () => {
    test('loading is set to false and items are displayed', async () => {
      jest.clearAllMocks()

      setup([
        {
          request: {
            query: GET_VARIABLES,
            variables: {
              params: {
                conceptId: 'TEST1002-MMT_2',
                allRevisions: true,
                limit: 3,
                offset: 0,
                sortKey: '-revisionDate'
              }
            }
          },
          result: {
            data: {
              variables: {
                count: 2,
                items: [
                  {
                    conceptId: 'TEST1002-MMT_2',
                    name: 'Test Var Short Name 2',
                    longName: 'Test Var Title 2',
                    providerId: 'TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    revisionId: 2,
                    userId: 'admin'
                  },
                  {
                    conceptId: 'TEST1001-MMT_2',
                    name: 'Test Var Short Name 1',
                    longName: 'Test Var Title 1',
                    providerId: 'TESTPROV',
                    revisionDate: '2023-11-30 00:00:00',
                    revisionId: 1,
                    userId: 'admin'
                  }
                ]
              }
            }
          }
        }
      ], 'Variables')

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()

      expect(screen.getByText('TEST1002-MMT_2')).toBeInTheDocument()
    })
  })

  describe('when the collectiobn_revisions request results in an error', () => {
    test('error is set to true', async () => {
      setup([
        {
          request: {
            query: GET_COLLECTION_REVISIONS,
            variables: {
              params: {
                conceptId: 'TEST1000-MMT_2',
                allRevisions: true,
                limit: 3,
                offset: 0,
                sortKey: '-revisionDate'
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

  describe('when the variables request results in an error', () => {
    test('error is set to true', async () => {
      setup([
        {
          request: {
            query: GET_VARIABLES,
            variables: {
              params: {
                conceptId: 'TEST1002-MMT_2',
                allRevisions: true,
                limit: 3,
                offset: 0,
                sortKey: '-revisionDate'
              }
            }
          },
          error: new Error('An error occurred')
        }
      ], 'Variables')

      expect(screen.getByText('Loading')).toBeInTheDocument()

      await waitForResponse()
      screen.debug()

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
      expect(screen.queryByText('Count')).not.toBeInTheDocument()
      expect(screen.getByText('Errored')).toBeInTheDocument()
    })
  })
})
