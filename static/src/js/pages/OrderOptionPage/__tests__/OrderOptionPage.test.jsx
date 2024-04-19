import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'
import AppContext from '../../../context/AppContext'
import OrderOptionPage from '../OrderOptionPage'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary'

const setup = ({ overrideMocks = false }) => {
  const mockOrderOption = {
    conceptId: 'OO1200000099-MMT_2',
    deprecated: true,
    description: 'Mock order option description',
    form: 'Mock form',
    name: 'Mock order option',
    nativeId: '1234-abcd-5678-efgh',
    revisionDate: '2024-04-16T18:20:12.124Z',
    revisionId: '1',
    scope: 'PROVIDER',
    sortKey: 'Mock',
    __typename: 'OrderOption'
  }
  const mocks = [{
    request: {
      query: GET_ORDER_OPTION,
      variables: {
        params: {
          conceptId: 'OO12000000-MMT_2'
        }
      }
    },
    result: {
      data: {
        orderOption: mockOrderOption
      }
    }
  }]
  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={['/order-options/OO12000000-MMT_2']}>
          <Routes>
            <Route
              path="/order-options"
            >
              <Route
                path=":conceptId"
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <OrderOptionPage />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('OrderOptionPage', () => {
  describe('when showing the header', () => {
    test('renders the header', async () => {
      setup({})
      await waitForResponse()

      expect(screen.queryByText('Order Options')).toBeInTheDocument()
      expect(screen.queryByText('Mock form')).toBeInTheDocument()
    })
  })

  describe('when the api throws an error ', () => {
    test.skip('renders an error', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_ORDER_OPTION,
              variables: {
                params: {
                  conceptId: 'OO12000000-MMT_2'
                }
              }
            },
            result: {
              data: {
                orderOption: null
              },
              errors: [new GraphQLError('An error occurred')]
            }
          }
        ]
      })

      await waitForResponse()

      await waitFor(() => {
        expect(screen.queryByText('Sorry!')).toBeInTheDocument()
        expect(screen.queryByText('An error occurred')).toBeInTheDocument()
      })
    })
  })
})
