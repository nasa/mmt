import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { Cookies, CookiesProvider } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'

import Providers from '../../../providers/Providers/Providers'
import { GET_ORDER_OPTION } from '../../../operations/queries/getOrderOption'

import OrderOptionFormPage from '../OrderOptionFormPage'

let expires = new Date()
expires.setMinutes(expires.getMinutes() + 15)
expires = new Date(expires)

const cookie = new Cookies(
  {
    loginInfo: ({
      providerId: 'MMT_2',
      name: 'User Name',
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires.valueOf()
      }
    })
  }
)
cookie.HAS_DOCUMENT_COOKIE = false

const setup = ({
  mocks,
  pageUrl
}) => {
  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
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
    </CookiesProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('OrderOptionFormPage', () => {
  describe('when showing the header for a new OrderOption', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/order-options/new'
      })

      await waitForResponse()

      expect(screen.queryByText('Order Options')).toBeInTheDocument()
      expect(screen.queryByText('New Order Option')).toBeInTheDocument()
    })
  })

  describe('when showing the header for an order orderOption with name', () => {
    test('show render the header with name', async () => {
      setup({
        pageUrl: '/order-options/OO1000000-MMT/edit',
        mocks: [{
          request: {
            query: GET_ORDER_OPTION,
            variables: { params: { conceptId: 'OO1000000-MMT' } }
          },
          result: {
            data: {
              orderOption: {
                associationDetails: {},
                conceptId: 'OO1000000-MMT',
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
                scope: 'PROVIDER',
                sortKey: null,
                __typename: 'OrderOption'
              }
            }
          }
        }]
      })

      await waitForResponse()

      expect(screen.queryByText('Order Options')).toBeInTheDocument()
      expect(screen.queryByText('Edit Test Name')).toBeInTheDocument()
    })
  })
})
