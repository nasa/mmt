import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import PermissionFormPage from '../PermissionFormPage'
import PermissionForm from '../../../components/PermissionForm/PermissionForm'

vi.mock('../../../components/PermissionForm/PermissionForm')

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = ({
  mocks,
  pageUrl
}) => {
  render(
    <MockedProvider
      mocks={mocks}
    >
      <MemoryRouter initialEntries={[pageUrl]}>
        <Routes>
          <Route
            path="/permissions"
          >
            <Route
              element={
                (
                  <Suspense>
                    <PermissionFormPage />
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
                    <PermissionFormPage />
                  </Suspense>
                )
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('OrderOptionFormPage', () => {
  describe('when showing the header for a new OrderOption', () => {
    test('should render the header', async () => {
      setup({
        pageUrl: '/permissions/new'
      })

      expect(await screen.findByText('Collection Permission')).toBeInTheDocument()

      expect(PermissionForm).toBeCalledTimes(1)

      expect(screen.getByRole('heading', { value: 'New Collection Permission' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for an permission name', () => {
    test('show render the header with name', async () => {
      setup({
        pageUrl: '/permissions/ACL1000000-MMT/edit',
        mocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL1000000-MMT' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL1000000-MMT',
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1000000-MMT',
                name: 'Test name',
                providerIdentity: null,
                revisionId: 1,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionIdentifier: null,
                  collectionApplicable: true,
                  granuleApplicable: false,
                  granuleIdentifier: null,
                  providerId: 'MMT'
                },
                collections: null,
                groups: {
                  __typename: 'AclGroupList',
                  items: [
                    {
                      __typename: 'AclGroup',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'AclGroup',
                      permissions: [
                        'read',
                        'order'
                      ],
                      userType: 'guest',
                      id: null,
                      name: null
                    }
                  ]
                }
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Collection Permission')).toBeInTheDocument()

      expect(screen.getByRole('heading', { value: 'Edit Test Name' })).toBeInTheDocument()
    })
  })
})
