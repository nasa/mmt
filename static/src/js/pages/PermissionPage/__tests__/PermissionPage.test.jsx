import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import * as router from 'react-router'

import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import NotificationsContext from '@/js/context/NotificationsContext'

import Permission from '@/js/components/Permission/Permission'

import errorLogger from '@/js/utils/errorLogger'

import PermissionPage from '../PermissionPage'

vi.mock('../../../components/Permission/Permission')
vi.mock('../../../utils/errorLogger')

const setup = ({
  additionalMocks = [],
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
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

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
    user
  }
}

describe('PermissionPage', () => {
  describe('show permission page', () => {
    test('render the page and calls Permission', async () => {
      setup({})

      const pageContent = await screen.findAllByText('Permission page test')

      expect(pageContent[0]).toBeInTheDocument()

      expect(Permission).toHaveBeenCalled(1)
    })
  })

  describe('when clicking the delete button', () => {
    describe('when clicking Yes on the delete modal results in a success', () => {
      test('should delete the permission and hides the modal', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_ACL,
                variables: { conceptId: 'ACL00000-CMR' }
              },
              result: {
                data: {
                  deleteAcl: {
                    conceptId: 'ACL1200216197-CMR',
                    revisionId: '1'
                  }
                }
              }
            }
          ]
        })

        const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/permissions')
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('does not delete the collection permission and calls errorLogger', async () => {
        const { user } = setup({
          additionalMocks: [
            {
              request: {
                query: DELETE_ACL,
                variables: { conceptId: 'ACL00000-CMR' }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)

        expect(errorLogger).toHaveBeenCalledWith(
          'Unable delete collection permission',
          'Permission Page: deleteAcl Mutation'
        )
      })
    })
  })

  describe('when clicking no on the delete modal', () => {
    test('should hide the modal and should not delete the permission', async () => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

      const { user } = setup({})

      const deleteLink = await screen.findByRole('button', { name: 'A trash can icon Delete' })
      await user.click(deleteLink)

      expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

      const noButton = screen.getByRole('button', { name: 'No' })
      await user.click(noButton)

      expect(navigateSpy).toHaveBeenCalledTimes(0)
      expect(screen.queryByText('Are you sure you want to delete this collection permission?')).not.toBeInTheDocument()
    })
  })
})
