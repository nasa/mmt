import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'

import { GET_ORDER_OPTIONS } from '../../../operations/queries/getOrderOptions'
import AppContext from '../../../context/AppContext'
import OrderOptionList from '../OrderOptionList'

vi.mock('../../../utils/errorLogger')

const setup = ({
  overrideMocks = false
}) => {
  const mockOrderOptions = {
    count: 2,
    items: [
      {
        description: 'This is a test record',
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
      <MockedProvider mocks={overrideMocks || mocks}>
        <BrowserRouter initialEntries="">
          <Suspense>
            <OrderOptionList />
          </Suspense>
        </BrowserRouter>
      </MockedProvider>
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

      await waitForResponse()

      expect(within(pagination[0]).queryByLabelText('Current Page, Page 2')).toBeInTheDocument()
    })
  })
})
