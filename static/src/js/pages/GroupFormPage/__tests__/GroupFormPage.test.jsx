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
import { GET_GROUP } from '../../../operations/queries/getGroup'

import GroupFormPage from '../GroupFormPage'

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
                path="/groups"
              >
                <Route
                  path="new"
                  element={
                    (
                      <Suspense>
                        <GroupFormPage />
                      </Suspense>
                    )
                  }
                />
                <Route
                  path=":id/edit"
                  element={
                    (
                      <Suspense>
                        <GroupFormPage />
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

describe('GroupFormPage', () => {
  describe('when showing the header for a new Group', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/groups/new'
      })

      await waitForResponse()

      expect(screen.queryByText('Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'New Group' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for an order group with name', () => {
    test('show render the header with name', async () => {
      setup({
        pageUrl: '/groups/dce1859e-774c-4561-9451-fc9d77906015/edit',
        mocks: [{
          request: {
            query: GET_GROUP,
            variables: { params: { id: 'dce1859e-774c-4561-9451-fc9d77906015' } }
          },
          result: {
            data: {
              group: {
                id: 'dce1859e-774c-4561-9451-fc9d77906015',
                description: 'Test Description',
                name: 'Test Name',
                members: {
                  count: 0,
                  items: []
                },
                tag: 'MMT_2'
              }
            }
          }
        }]
      })

      await waitForResponse()

      expect(screen.queryByText('Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'Edit Test Name' })).toBeInTheDocument()
    })
  })
})
