import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom'
import { GraphQLError } from 'graphql'

import { GET_GRANULES } from '@/js/operations/queries/getGranules'
import GranulesList from '../GranulesList'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

const createGranulesMock = (offset = 0) => ({
  request: {
    query: GET_GRANULES,
    variables: {
      params: {
        conceptId: 'C1200000104-MMT_2'
      },
      granulesParams: {
        limit: 10,
        offset
      }
    }
  },
  result: {
    data: {
      collection: {
        shortName: '10099-2',
        granules: {
          count: 15,
          items: Array(Math.min(10, 15 - offset)).fill(null).map((_, index) => ({
            conceptId: `G120048463${5 + index + offset}-CMR_ONLY`,
            title: `test_granule${1 + index + offset}`,
            revisionDate: `2025-04-29T18:${18 + index + offset}:54.983Z`
          }))
        }
      }
    }
  }
})

/**
 * Sets up the test environment for GranulesList component.
 *
 * @param {Array} mocks - Apollo Client mocks for GraphQL queries.
 *   Default mocks:
 *   - First mock: Initial query for the first page (offset 0), triggered by useSuspenseQuery
 *   - Second mock: Subsequent query with the same parameters (offset 0), also triggered by useSuspenseQuery
 *     This second query is part of React Suspense's design to ensure fresh data after the initial load
 *   - Third mock: Query for the second page when pagination is clicked (offset 10)
 *
 * This setup reflects the expected behavior of useSuspenseQuery with React Suspense,
 * where two queries are made for the initial data load to ensure data freshness.
 */
const setup = (mocks = [createGranulesMock(0), createGranulesMock(0), createGranulesMock(10)]) => {
  const user = userEvent.setup()

  render(
    <MemoryRouter initialEntries={['/collections/C1200000104-MMT_2/granules']}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Routes>
          <Route
            path="/:type/:conceptId/granules"
            element={
              (
                <ErrorBoundary>
                  <Suspense fallback="Loading...">
                    <GranulesList />
                  </Suspense>
                </ErrorBoundary>
              )
            }
          />
        </Routes>
      </MockedProvider>
    </MemoryRouter>
  )

  return { user }
}

describe('GranulesList component', () => {
  describe('when granules are returned', () => {
    test('renders initial granule list', async () => {
      setup([createGranulesMock(0)])

      // Check initial render
      await screen.findByText('Showing 1-10 of 15 granules')

      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(11)

      expect(within(rows[1]).getByRole('cell', { name: 'G1200484635-CMR_ONLY' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'test_granule1' })).toBeInTheDocument()
      expect(within(rows[1]).getByRole('cell', { name: 'Tuesday, April 29, 2025 6:18 PM' })).toBeInTheDocument()

      expect(within(rows[10]).getByRole('cell', { name: 'G12004846314-CMR_ONLY' })).toBeInTheDocument()
      expect(within(rows[10]).getByRole('cell', { name: 'test_granule10' })).toBeInTheDocument()
      expect(within(rows[10]).getByRole('cell', { name: 'Tuesday, April 29, 2025 6:27 PM' })).toBeInTheDocument()
    })

    test('updates granule list when pagination is clicked', async () => {
      const { user } = setup()

      // Check for the presence of the first granule
      await waitFor(() => {
        expect(screen.getByText('G1200484635-CMR_ONLY')).toBeInTheDocument()
      })

      // Find all "Next" buttons and click the first one
      const nextButtons = screen.getAllByRole('button', { name: /next/i })
      expect(nextButtons.length).toBeGreaterThan(0)
      await user.click(nextButtons[0])

      // Wait for the second page to load
      await waitFor(() => {
        expect(screen.getByText('Showing 11-15 of 15 granules')).toBeInTheDocument()
      })

      // Check that a granule from the second page is present
      expect(screen.getByText('G12004846315-CMR_ONLY')).toBeInTheDocument()

      // Check that a granule from the first page is no longer present
      expect(screen.queryByText('G1200484635-CMR_ONLY')).not.toBeInTheDocument()
    })
  })

  describe('when no granules are found', () => {
    test('renders no granules message', async () => {
      setup([{
        request: createGranulesMock().request,
        result: {
          data: {
            collection: {
              shortName: '10099-2',
              granules: {
                count: 0,
                items: [],
                __typename: 'GranuleList'
              },
              __typename: 'Collection'
            }
          }
        }
      }])

      await screen.findByText('No granules found')
    })
  })

  describe('when a granule has no revision date', () => {
    test('renders N/A for missing revision date', async () => {
      const mockWithNoRevisionDate = {
        request: {
          query: GET_GRANULES,
          variables: {
            params: {
              conceptId: 'C1200000104-MMT_2'
            },
            granulesParams: {
              limit: 10,
              offset: 0
            }
          }
        },
        result: {
          data: {
            collection: {
              shortName: '10099-2',
              granules: {
                count: 1,
                items: [
                  {
                    conceptId: 'G1200484635-CMR_ONLY',
                    title: 'test_granule1',
                    revisionDate: null
                  }
                ]
              }
            }
          }
        }
      }

      setup([mockWithNoRevisionDate])

      // Wait for the granule list to load
      await screen.findByText('Showing 1 granule')

      // Check that the granule is displayed with N/A for the revision date
      expect(screen.getByText('G1200484635-CMR_ONLY')).toBeInTheDocument()
      expect(screen.getByText('test_granule1')).toBeInTheDocument()
      expect(screen.getByText('N/A')).toBeInTheDocument()

      // Verify that the date column header is still present
      expect(screen.getByText('Revision Date (UTC)')).toBeInTheDocument()
    })
  })

  describe('when an error occurs', () => {
    test('renders error message', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

      setup([{
        request: createGranulesMock().request,
        error: new GraphQLError('An error occurred')
      }])

      await screen.findByText(/An error occurred/)
    })
  })
})
