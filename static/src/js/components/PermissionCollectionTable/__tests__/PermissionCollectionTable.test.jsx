import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import { InMemoryCache, defaultDataIdFromObject } from '@apollo/client'
import PermissionCollectionTable from '../PermissionCollectionTable'

import {
  mockPermission,
  mockCollectionPermissionSearch,
  mockCollectionPermissionSearchWithPages
} from './__mocks__/permissionCollectionTableResults'

const setup = ({
  additionalMock = [],
  overrideMocks = false
}) => {
  const mocks = [mockCollectionPermissionSearch, ...additionalMock]

  const user = userEvent.setup()

  render(
    <MockedProvider
      mocks={overrideMocks || mocks}
      cache={
        new InMemoryCache({
          dataIdFromObject: (object) => {
            const { __typename: typeName, conceptId } = object
            if ([
              'Acl',
              'Collection',
              'Draft',
              'Grid',
              'OrderOption',
              'Permission',
              'Service',
              'Subscription',
              'Tool',
              'Variable'
            ].includes(typeName)) {
              return conceptId
            }

            return defaultDataIdFromObject(object)
          }
        })
      }
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
                    <PermissionCollectionTable />
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

describe('PermissionCollectionTable', () => {
  describe('when click an ascending sort button for Short Name', () => {
    test('sorts and show the button as active', async () => {
      const { user } = setup({
        additionalMock: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: {
              conceptId: 'ACL00000-CMR',
              collectionParams: {
                limit: 20,
                offset: 0,
                sortKey: '-shortName'
              }
            }
          },
          result: {
            data: {
              acl: mockPermission
            }
          }
        }]
      })

      const rows = await screen.findAllByRole('row')
      const row1 = rows[0]
      const ascendingButton = within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })

      await user.click(ascendingButton)

      expect(await within(row1).findByRole('button', { name: /Sort Short Name in ascending order/ })).not.toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when click an ascending sort button for collection', () => {
    test('sorts and show the button as active', async () => {
      const { user } = setup({
        additionalMock: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: {
              conceptId: 'ACL00000-CMR',
              collectionParams: {
                limit: 20,
                offset: 0,
                sortKey: 'entryTitle'
              }
            }
          },
          result: {
            data: {
              acl: mockPermission
            }
          }
        }]
      })

      const rows = await screen.findAllByRole('row')
      const row1 = rows[0]
      const descendingButton = within(row1).queryByRole('button', { name: /Sort Collection in descending order/ })

      await user.click(descendingButton)

      expect(await within(row1).findByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })

  describe('when paging through the table', () => {
    test('navigate to the next page', async () => {
      const { user } = setup({
        overrideMocks: [mockCollectionPermissionSearchWithPages, {
          request: {
            ...mockCollectionPermissionSearchWithPages.request,
            variables: {
              conceptId: 'ACL00000-CMR',
              collectionParams: {
                limit: 20,
                offset: 40
              }
            }
          },
          result: mockCollectionPermissionSearchWithPages.result
        }]
      })

      expect(await screen.findByText('Showing Collection Associations 1-20 of 45'))
      const paginationButton = screen.getByRole('button', { name: 'Goto Page 3' })
      await user.click(paginationButton)

      expect(await screen.findByText('Showing Collection Associations 41-45 of 45'))
    })
  })
})
