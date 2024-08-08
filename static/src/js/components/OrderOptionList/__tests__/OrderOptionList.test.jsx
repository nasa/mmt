import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import OrderOptionList from '../OrderOptionList'
import NotificationsContext from '../../../context/NotificationsContext'

import { DELETE_ORDER_OPTION } from '../../../operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTIONS } from '../../../operations/queries/getOrderOptions'

vi.mock('../../../utils/errorLogger')
vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_2']
})

const setup = ({
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mockOrderOptions = {
    count: 2,
    items: [
      {
        description: 'This is a test record',
        deprecated: false,
        conceptId: 'OO1200000099-MMT_2',
        name: 'Test order option 1',
        form: 'some form',
        nativeId: 'Test-Native-Id-1',
        providerId: 'MMT_2',
        scope: 'PROVIDER',
        sortKey: '',
        associationDetails: null,
        revisionDate: '2024-04-16T18:20:12.124Z',
        __typename: 'OrderOption'
      },
      {
        description: 'This is a test record',
        deprecated: false,
        conceptId: 'OO1200000095-MMT_2',
        name: 'Test order option 2',
        form: 'some form',
        nativeId: 'Test-Native-Id',
        providerId: 'MMT_2',
        scope: 'PROVIDER',
        sortKey: '',
        associationDetails: null,
        revisionDate: '2024-04-15T20:25:47.089Z',
        __typename: 'OrderOption'
      }
    ]
  }
  const mocks = [{
    request: {
      query: GET_ORDER_OPTIONS,
      variables: {
        params: {
          limit: 20,
          offset: 0,
          providerId: ['MMT_2']
        }
      }
    },
    result: {
      data: {
        orderOptions: mockOrderOptions
      }
    }
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MockedProvider mocks={overrideMocks || mocks}>
        <BrowserRouter initialEntries="">
          <Suspense>
            <OrderOptionList />
          </Suspense>
        </BrowserRouter>
      </MockedProvider>
    </NotificationsContext.Provider>
  )

  return {
    user
  }
}

describe('OrderOptionList', () => {
  describe('when getting list of order options results in a success', () => {
    test('render a table with 2 order options', async () => {
      setup({})

      expect(await screen.findByText(/You are viewing order options for the following providers: MMT_2/)).toBeInTheDocument()
      expect(await screen.findByText('Showing 2 order options')).toBeInTheDocument()
      expect(screen.getByText('Test order option 1')).toBeInTheDocument()
      expect(screen.getByText('Test order option 2')).toBeInTheDocument()
    })
  })

  describe('when getting list of order options results in a success', () => {
    test('render a table with 2 order options', async () => {
      setup({})

      expect(await screen.findAllByText('MMT_2')).toHaveLength(2)
    })
  })

  describe('when clicking the delete button', () => {
    describe('when clicking Yes on the delete modal results in a success', () => {
      test('deletes the order option and hides the modal', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_ORDER_OPTION,
                variables: {
                  nativeId: 'Test-Native-Id-1',
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
                variables: {}
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
                        providerId: 'MMT_2',
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
            },
            {
              request: {
                query: GET_ORDER_OPTIONS,
                variables: {
                  params: {
                    limit: 20,
                    offset: 0,
                    providerId: ['MMT_2']
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
                        providerId: 'MMT_2',
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

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[0])

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(await screen.findByText('Showing 1 order options')).toBeInTheDocument()
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
                  nativeId: 'Test-Native-Id-1',
                  providerId: 'MMT_2'
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[0])

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(screen.getByText('Showing 2 order options')).toBeInTheDocument()
      })
    })

    describe('when clicking No on the delete modal', () => {
      test('hides delete modal', async () => {
        const { user } = setup({})

        const deleteLink = await screen.findAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[0])

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.getByText('Showing 2 order options')).toBeInTheDocument()
        expect(screen.queryByText('Are you sure you want to delete this order option?')).not.toBeInTheDocument()
      })
    })
  })

  describe('when there are no order option found', () => {
    test('render a table with No order option found message', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_ORDER_OPTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  providerId: ['MMT_2']
                }
              }
            },
            result: {
              data: {
                orderOptions: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText('No order options found')).toBeInTheDocument()
    })
  })

  describe('when there are no providers available', () => {
    test('render a table with No available providers message', async () => {
      useAvailableProviders.mockReturnValue({
        providerIds: []
      })

      setup({
        overrideMocks: [
          {
            request: {
              query: GET_ORDER_OPTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  providerId: []
                }
              }
            },
            result: {
              data: {
                orderOptions: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(await screen.findByText(/You need providers in order to view Order Options/)).toBeInTheDocument()
      expect(await screen.findByText('No order options found')).toBeInTheDocument()
    })
  })

  describe('when order options list has more than 20 options', () => {
    test('renders the pagination component', async () => {
      useAvailableProviders.mockReturnValue({
        providerIds: ['MMT_2', 'MMT_1']
      })

      const { user } = setup({
        overrideMocks: [
          {
            request: {
              query: GET_ORDER_OPTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 0,
                  providerId: ['MMT_2', 'MMT_1']
                }
              }
            },
            result: {
              data: {
                orderOptions: {
                  count: 25,
                  items: [
                    {
                      description: 'This is a test record',
                      deprecated: true,
                      conceptId: 'OO1200000099-MMT_2',
                      name: 'Test order option 1',
                      form: 'some form',
                      nativeId: 'Test-Native-Id-1',
                      providerId: 'MMT_2',
                      scope: 'PROVIDER',
                      sortKey: '',
                      associationDetails: null,
                      revisionDate: '2024-04-16T18:20:12.124Z',
                      __typename: 'OrderOption'
                    },
                    {
                      description: 'This is a test record',
                      deprecated: false,
                      conceptId: 'OO1200000095-MMT_2',
                      name: 'Test order option 2',
                      form: 'some form',
                      nativeId: 'Test-Native-Id',
                      providerId: 'MMT_2',
                      scope: 'PROVIDER',
                      sortKey: '',
                      associationDetails: null,
                      revisionDate: '2024-04-15T20:25:47.089Z',
                      __typename: 'OrderOption'
                    }
                  ]
                }
              }
            }
          },
          {
            request: {
              query: GET_ORDER_OPTIONS,
              variables: {
                params: {
                  limit: 20,
                  offset: 20,
                  providerId: ['MMT_2', 'MMT_1']
                }
              }
            },
            result: {
              data: {
                orderOptions: {
                  count: 25,
                  items: [
                    {
                      description: 'This is a test record',
                      deprecated: false,
                      conceptId: 'OO1200000099-MMT_2',
                      name: 'Test order option 1',
                      form: 'some form',
                      nativeId: 'Test-Native-Id-1',
                      providerId: 'MMT_2',
                      scope: 'PROVIDER',
                      sortKey: '',
                      associationDetails: null,
                      revisionDate: '2024-04-16T18:20:12.124Z',
                      __typename: 'OrderOption'
                    },
                    {
                      description: 'This is a test record',
                      deprecated: false,
                      conceptId: 'OO1200000095-MMT_2',
                      name: 'Test order option 2',
                      form: 'some form',
                      nativeId: 'Test-Native-Id',
                      providerId: 'MMT_2',
                      scope: 'PROVIDER',
                      sortKey: '',
                      associationDetails: null,
                      revisionDate: '2024-04-15T20:25:47.089Z',
                      __typename: 'OrderOption'
                    }
                  ]
                }
              }
            }
          }
        ]
      })

      const pagination = await screen.findAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')

      const paginationButton = within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      expect((await screen.findAllByRole('cell'))[0].textContent).toContain('Test order option 1')
    })
  })
})
