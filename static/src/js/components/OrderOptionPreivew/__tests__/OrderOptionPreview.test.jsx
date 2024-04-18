import { render, screen } from '@testing-library/react'
import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import AppContext from '../../../context/AppContext'
import OrderOptionPreview from '../OrderOptionPreview'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'

import errorLogger from '../../../utils/errorLogger'

vi.mock('../../../utils/errorLogger')

const setup = ({
  overrideMocks = false
}) => {
  const mockOrderOption = {
    conceptId: 'OO1200000099-MMT_2',
    deprecated: true,
    description: 'Mock order option description',
    form: 'Mock form',
    name: 'Mock order option',
    nativeId: '1234-abcd-5678-efgh',
    revisionDate: '2024-04-16T18:20:12.124Z',
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
                element={<OrderOptionPreview />}
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

describe('OrderOptionPreview', () => {
  describe('when getting order option results in a success', () => {
    test('renders the order options', async () => {
      setup({})
      await waitForResponse()

      expect(screen.getByText('Mock order option description')).toBeInTheDocument()
      expect(screen.getByText('PROVIDER')).toBeInTheDocument()
      expect(screen.getByText('Mock form')).toBeInTheDocument()
    })
  })

  describe('when getting order option results in a failure', () => {
    test('calls error logger', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_ORDER_OPTION,
            variables: {
              params: {
                conceptId: 'OO12000000-MMT_2'
              }
            }
          },
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to get Order Option', 'Order Option: getOrderOption')
    })
  })

  describe('when the order does not have SortKey and Deprecated ', () => {
    test('render false for Deprecated and Blank name for SortKey', async () => {
      setup({
        overrideMocks: [{
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
              orderOption: {
                conceptId: 'OO1200000099-MMT_2',
                deprecated: null,
                description: 'Mock order option description',
                form: 'Mock form',
                name: 'Mock order option',
                nativeId: '1234-abcd-5678-efgh',
                revisionDate: '2024-04-16T18:20:12.124Z',
                scope: 'PROVIDER',
                sortKey: null,
                __typename: 'OrderOption'
              }
            }
          }
        }]
      })

      await waitForResponse()

      expect(screen.getByText('<Blank Sort Key>')).toBeInTheDocument()
      expect(screen.getByText('false')).toBeInTheDocument()
    })
  })
})
