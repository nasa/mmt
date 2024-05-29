import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import NotificationsContext from '@/js/context/NotificationsContext'

import Permission from '@/js/components/Permission/Permission'

import PermissionPage from '../PermissionPage'

vi.mock('../../../components/Permission/Permission')

const setup = ({
  overrideMocks = false
}) => {
  const mockPermission = {
    __typename: 'Acl',
    catalogItemIdentity: null,
    collections: null,
    conceptId: 'ACL00000-CMR',
    groups: null,
    identityType: null,
    location: null,
    name: 'Permission page test',
    providerIdentity: null,
    revisionId: '1',
    systemIdentity: null
  }

  const mocks = [{
    request: {
      query: GET_COLLECTION_PERMISSION,
      variables: { conceptId: 'ACL00000-CMR' }
    },
    result: {
      data: {
        acl: mockPermission
      }
    }
  }]

  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={['/permissions/ACL00000-CMR']}>
          <Routes>
            <Route
              path="/permissions"
            >
              <Route
                path=":conceptId"
                element={
                  (
                    <Suspense>
                      <PermissionPage />
                    </Suspense>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </NotificationsContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('PermissionPage', () => {
  describe('show permission page', () => {
    test('render the page and calls Permission', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getAllByText('Permission page test')[0]).toBeInTheDocument()
      expect(Permission).toHaveBeenCalled(1)
    })
  })
})
