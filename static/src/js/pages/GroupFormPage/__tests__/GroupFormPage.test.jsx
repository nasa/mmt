import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import Providers from '@/js/providers/Providers/Providers'
import { GET_GROUP } from '@/js/operations/queries/getGroup'

import GroupFormPage from '../GroupFormPage'

vi.mock('@/js/components/GroupForm/GroupForm')

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
            <Route
              path="/admin/groups"
            >
              <Route
                path="new"
                element={
                  (
                    <Suspense>
                      <GroupFormPage isAdminPage />
                    </Suspense>
                  )
                }
              />
              <Route
                path=":id/edit"
                element={
                  (
                    <Suspense>
                      <GroupFormPage isAdminPage />
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

describe('GroupFormPage', () => {
  describe('when showing the header for a new Group', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/groups/new'
      })

      expect(await screen.findByText('Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'New Group' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for a new System Group', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/admin/groups/new'
      })

      expect(await screen.findByText('System Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'New System Group' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for a group with name', () => {
    test('render the header with name', async () => {
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

      expect(await screen.findByText('Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'Edit Test Name' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for a system group with name', () => {
    test('render the header with name', async () => {
      setup({
        pageUrl: '/admin/groups/dce1859e-774c-4561-9451-fc9d77906015/edit',
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
                tag: 'CMR'
              }
            }
          }
        }]
      })

      expect(await screen.findByText('System Groups')).toBeInTheDocument()
      expect(screen.getByRole('heading', { value: 'Edit Test Name' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for a system group with name', () => {
    test('render the header with name', async () => {
      setup({
        pageUrl: '/admin/groups/dce1859e-774c-4561-9451-fc9d77906015/edit',
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
                tag: 'CMR'
              }
            }
          }
        }]
      })

      expect(await screen.findByText('CMR')).toBeInTheDocument()
    })
  })
})
