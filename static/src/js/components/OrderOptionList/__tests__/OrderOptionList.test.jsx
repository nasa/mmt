import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'

import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'

import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import OrderOptionList from '../OrderOptionList'

import { DELETE_ORDER_OPTION } from '../../../operations/mutations/deleteOrderOption'
import { GET_ORDER_OPTIONS } from '../../../operations/queries/getOrderOptions'

vi.mock('../../../utils/errorLogger')

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
          providerId: 'MMT_2',
          limit: 20,
          offset: 0
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

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MockedProvider mocks={overrideMocks || mocks}>
          <BrowserRouter initialEntries="">
            <Suspense>
              <OrderOptionList />
            </Suspense>
          </BrowserRouter>
        </MockedProvider>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('OrderOptionList', () => {
  describe('when getting list of order options results in a success', () => {
    test('render a table with 2 order options', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('Showing 2 order options')).toBeInTheDocument()
      expect(screen.getByText('Test order option 1')).toBeInTheDocument()
      expect(screen.getByText('Test order option 2')).toBeInTheDocument()
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
            },
            {
              request: {
                query: GET_ORDER_OPTIONS,
                variables: {
                  params: {
                    providerId: 'MMT_2',
                    limit: 20,
                    offset: 0
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
        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[0])

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)
        await waitForResponse()

        expect(screen.getByText('Showing 1 order options')).toBeInTheDocument()
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
        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
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

        await waitForResponse()

        const deleteLink = screen.getAllByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink[0])

        expect(screen.getByText('Are you sure you want to delete this order option?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.getByText('Showing 2 order options')).toBeInTheDocument()
        expect(screen.queryByText('Are you sure you want to delete this order option?')).not.toBeInTheDocument()
      })
    })
  })

  describe('when clicking on edit button', () => {
    test('should navigate to /order-options/id', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      const { user } = setup({})

      await waitForResponse()

      const editButton = screen.getAllByRole('button', { name: 'Edit Button Edit' })
      await user.click(editButton[0])

      expect(navigateSpy).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith('/order-options/OO1200000099-MMT_2/edit')
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
                  providerId: 'MMT_2',
                  limit: 20,
                  offset: 0
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

      await waitForResponse()

      expect(screen.getByText('No order options found')).toBeInTheDocument()
    })
  })

  describe('when order options list has more than 20 options', () => {
    test('renders the pagination component', async () => {
      const { user } = setup({
        overrideMocks: [
          {
            request: {
              query: GET_ORDER_OPTIONS,
              variables: {
                params: {
                  providerId: 'MMT_2',
                  limit: 20,
                  offset: 0
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
                  providerId: 'MMT_2',
                  limit: 20,
                  offset: 20
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

      await waitForResponse()

      const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      expect(within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })).toHaveTextContent('2')

      const paginationButton = within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Test order option 1')
      })
    })
  })
})
