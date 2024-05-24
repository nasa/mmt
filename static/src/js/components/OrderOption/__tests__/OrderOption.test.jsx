import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'

import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'

import OrderOption from '../OrderOption'

const setup = ({
  overrideMocks = false
}) => {
  const mockOrderOption = {
    associationDetails: {},
    collections: {
      count: 0,
      items: []
    },
    conceptId: 'OO1200000099-MMT_2',
    deprecated: true,
    description: 'Mock order option description',
    form: 'Mock form',
    name: 'Mock order option',
    nativeId: '1234-abcd-5678-efgh',
    pageTitle: 'Mock order option',
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

  const user = userEvent.setup()

  render(
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
                  <Suspense>
                    <OrderOption />
                  </Suspense>
                )
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )

  return {
    user
  }
}

describe('OrderOption', () => {
  describe('when getting order option results in a success', () => {
    test('renders the order options', async () => {
      setup({})
      await waitForResponse()

      expect(screen.getByText('Mock order option description')).toBeInTheDocument()
      expect(screen.getByText('Mock form')).toBeInTheDocument()
    })
  })
})
