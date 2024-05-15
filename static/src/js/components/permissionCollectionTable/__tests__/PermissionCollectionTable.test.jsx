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

import AppContext from '@/js/context/AppContext'
import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import PermissionCollectionTable from '../PermissionCollectionTable'

const mockPermission = {
  __typename: 'Acl',
  conceptId: 'ACL00000-CMR',
  identityType: 'Catalog Item',
  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
  name: 'Mock Permission',
  providerIdentity: null,
  revisionId: 5,
  systemIdentity: null,
  catalogItemIdentity: {
    __typename: 'CatalogItemIdentity',
    collectionApplicable: true,
    granuleApplicable: false,
    granuleIdentifier: null,
    name: 'Mock Permission',
    providerId: 'MMT_2',
    collectionIdentifier: {
      __typename: 'CollectionIdentifier',
      accessValue: null,
      collections: {
        __typename: 'CollectionList',
        count: 1,
        items: [
          {
            __typename: 'Collection',
            conceptId: 'C1200450691-MMT_2',
            shortName: 'Collection 1',
            title: 'Mock Collection 1',
            version: '1'
          },
          {
            __typename: 'Collection',
            conceptId: 'C1200450692-MMT_2',
            shortName: 'Collection 2',
            title: 'Mock Collection 2',
            version: '2'
          }
        ]
      },
      temporal: null
    }
  },
  groupPermissions: {
    __typename: 'GroupPermissionList',
    groupPermission: [
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'guest',
        group: null
      },
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'registered',
        group: null
      }
    ]
  }
}
const setup = ({
  additionalMock = []
}) => {
  const mocks = [{
    request: {
      query: GET_COLLECTION_PERMISSION,
      variables: {
        conceptId: 'ACL00000-CMR'
      }
    },
    result: {
      data: {
        acl: mockPermission
      }
    }
  }, ...additionalMock]

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
        mocks={mocks}
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
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
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
              collectionParams: { sortKey: '-shortName' }
            }
          },
          result: {
            data: {
              acl: mockPermission
            }
          }
        }]
      })

      await waitForResponse()

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const ascendingButton = within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })

      await user.click(ascendingButton)

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in ascending order/ })).not.toHaveClass('table__sort-button--inactive')
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
              collectionParams: { sortKey: 'entryTitle' }
            }
          },
          result: {
            data: {
              acl: mockPermission
            }
          }
        }]
      })

      await waitForResponse()

      const rows = screen.queryAllByRole('row')
      const row1 = rows[0]
      const descendingButton = within(row1).queryByRole('button', { name: /Sort Collection in descending order/ })

      await user.click(descendingButton)

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })
})
