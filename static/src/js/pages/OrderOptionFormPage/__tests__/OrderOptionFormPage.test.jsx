import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import Providers from '../../../providers/Providers/Providers'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'

import OrderOptionFormPage from '../OrderOptionFormPage'

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = ({
  mocks,
  pageUrl
}) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider
        mocks={mocks}
      >
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route
              path="/order-options"
            >
              <Route
                element={
                  (
                    <Suspense>
                      <OrderOptionFormPage />
                    </Suspense>
                  )
                }
                path="new"
              />
              <Route
                path=":conceptId/edit"
                element={
                  (
                    <Suspense>
                      <OrderOptionFormPage />
                    </Suspense>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user
  }
}

describe('OrderOptionFormPage', () => {
  describe('when showing the header for a new OrderOption', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/order-options/new'
      })

      expect(await screen.findByText('Order Options')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'New Order Option' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for an order orderOption with name', () => {
    test('show render the header with name', async () => {
      setup({
        pageUrl: '/order-options/OO1000000-MMT_2/edit',
        mocks: [{
          request: {
            query: GET_ORDER_OPTION,
            variables: { params: { conceptId: 'OO1000000-MMT_2' } }
          },
          result: {
            data: {
              orderOption: {
                associationDetails: {},
                conceptId: 'OO1000000-MMT_2',
                collections: {
                  count: 0,
                  items: []
                },
                deprecated: null,
                description: 'Test Description',
                form: 'Test Form',
                name: 'Test Name',
                nativeId: 'dce1859e-774c-4561-9451-fc9d77906015',
                revisionId: '1',
                revisionDate: '2024-04-23T15:03:34.399Z',
                pageTitle: 'Test Name',
                providerId: 'MMT_2',
                scope: 'PROVIDER',
                sortKey: null,
                __typename: 'OrderOption'
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Order Options')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'Edit Test Name' })).toBeInTheDocument()
    })
  })
})
