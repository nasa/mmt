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

const mockPermission = {
  __typename: 'Acl',
  conceptId: 'ACL00000-CMR',
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
      temporal: null
    }
  },
  groups: {
    __typename: 'AclGroupList',
    items: [
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'guest',
        group: null,
        id: null,
        name: null
      },
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'registered',
        group: null,
        id: null,
        name: null
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

  const user = userEvent.setup()

  render(
    <MockedProvider
      mocks={mocks}
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

      const rows = await screen.findAllByRole('row')
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

      const rows = await screen.findAllByRole('row')
      const row1 = rows[0]
      const descendingButton = within(row1).queryByRole('button', { name: /Sort Collection in descending order/ })

      await user.click(descendingButton)

      expect(within(row1).queryByRole('button', { name: /Sort Short Name in descending order/ })).toHaveClass('table__sort-button--inactive')
    })
  })
})
