import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import * as router from 'react-router'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import OrderOptionPage from '../OrderOptionPage'
import ErrorBoundary from '../../../components/ErrorBoundary/ErrorBoundary'

import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'

import { DELETE_ORDER_OPTION } from '../../../operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'
import { GET_ORDER_OPTIONS } from '../../../operations/queries/getOrderOptions'

vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mockOrderOption = {
    associationDetails: {},
    conceptId: 'OO1200000099-MMT_2',
    collections: {
      count: 0,
      items: []
    },
    deprecated: true,
    description: 'Mock order option description',
    form: 'Mock form',
    name: 'Mock order option',
    pageTitle: 'Mock order option',
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
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <AppContext.Provider value={
      {
        providerId: 'MMT_2'
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
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
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user
  }
}

describe('OrderOptionPage', () => {
  describe('when showing the header', () => {
    test('renders the header', async () => {
      setup({})

      expect(await screen.findByText('Order Options')).toBeInTheDocument()
      expect(screen.getByText('MMT_2')).toBeInTheDocument()
      expect(screen.getByText('Mock form')).toBeInTheDocument()
    })
  })

  describe('when the api throws an error ', () => {
    test('renders an error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})

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

      expect(await screen.findByText('Sorry!')).toBeInTheDocument()
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })

  describe('when clicking the delete button', () => {
    describe('when clicking Yes on the delete modal results in a success', () => {
      test('deletes the order option and hides the modal', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_ORDER_OPTION,
                variables: {
                  nativeId: '1234-abcd-5678-efgh',
                  providerId: 'MMT_2'
                }
              },
              result: {
                data: {
                  deleteOrderOption: {
                    conceptId: 'TD1000000-MMT',
                    revisionId: '3'
                  }
                }
              }
            },
            {
              request: {
                query: GET_ORDER_OPTIONS,
                variables: {
                  params: {
                    providerId: 'MMT_2'
                  }
                }
              },
              result: {
                data: {
                  orderOptions: {
                    count: 1,
                    items: [
                      {
                        description: 'This is a test record',
                        deprecated: false,
                        conceptId: 'OO1200000099-MMT_2',
                        name: 'Test order option 1',
                        form: 'some form',
                        nativeId: 'Test-Native-Id-1',
                        scope: 'PROVIDER',
                        sortKey: '',
                        associationDetails: null,
                        revisionDate: '2024-04-16T18:20:12.124Z',
                        __typename: 'OrderOption'
                      }
                    ]
                  }
                }
              }
            }
          ]
        })

        const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })

        await user.click(yesButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/order-options')
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('does not delete the order option', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_ORDER_OPTION,
                variables: {
                  nativeId: '1234-abcd-5678-efgh',
                  providerId: 'MMT_2'
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        await waitFor(() => {
          expect(screen.queryByText('Are you sure you want to delete this order option?')).not.toBeInTheDocument()
        })
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('hides delete modal', async () => {
        const { user } = setup({})

        const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        await waitFor(() => {
          expect(screen.queryByText('Are you sure you want to delete this order option?')).not.toBeInTheDocument()
        })
      })
    })
  })
})
