import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { Cookies } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'
import { GET_GROUP } from '@/js/operations/queries/getGroup'

import ProviderPermissionsPage from '@/js/pages/ProviderPermissionsPage/ProviderPermissionsPage'

vi.mock('@/js/components/ProviderPermissions/ProviderPermissions', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-provider-permissions">Provider Permissions</div>
  ))
}))

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
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mockGroup = {
    id: '1234-abcd-5678-efgh',
    description: 'Mock group description',
    members: {
      count: 1,
      items: [{
        id: 'test.user',
        firstName: 'Test',
        lastName: 'User',
        emailAddress: 'test@example.com',
        __typename: 'GroupMember'
      }]
    },
    name: 'Mock group',
    tag: 'MMT_2'
  }

  const mocks = [{
    request: {
      query: GET_GROUP,
      variables: {
        params: {
          id: '1234-abcd-5678-efgh'
        }
      }
    },
    result: {
      data: {
        group: mockGroup
      }
    }
  }, {
    request: {
      query: GET_PROVIDER_IDENTITY_PERMISSIONS,
      variables: {
        params: {
          identityType: 'provider',
          limit: 50
        }
      }
    },
    result: {
      data: {
        acls: {
          count: 30,
          cursor: 'eyJqc29uIjoiW1wicHJvdmlkZXIgLSBtbXRfMSAtIHByb3ZpZGVyX2luZm9ybWF0aW9uXCIsXCJBQ0wxMjAwMjE1Nzg5LUNNUlwiXSJ9',
          items: [
            {
              providerIdentity: {
                target: 'AUDIT_REPORT',
                provider_id: 'MMT_1'
              },
              identityType: 'Provider',
              groupPermissions: [
                {
                  permissions: [
                    'read'
                  ],
                  group_id: '1234-abcd-5678-efgh'
                },
                {
                  permissions: [
                    'read'
                  ],
                  group_id: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
                }
              ],
              conceptId: 'ACL1200216198-CMR'
            },
            {
              providerIdentity: {
                target: 'AUTHENTICATOR_DEFINITION',
                provider_id: 'MMT_1'
              },
              identityType: 'Provider',
              groupPermissions: [
                {
                  permissions: [],
                  group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                },
                {
                  permissions: [
                    'delete',
                    'create'
                  ],
                  group_id: '1234-abcd-5678-efgh'
                }
              ],
              conceptId: 'ACL1200216108-CMR'
            },
            {
              providerIdentity: {
                target: 'CATALOG_ITEM_ACL',
                provider_id: 'MMT_1'
              },
              identityType: 'Provider',
              groupPermissions: [
                {
                  permissions: [],
                  user_type: 'registered'
                },
                {
                  permissions: [],
                  user_type: 'guest'
                }
              ],
              conceptId: 'ACL1200216192-CMR'
            }
          ]
        }
      }
    }
  },
  ...additionalMocks]

  render(

    <MockedProvider
      mocks={overrideMocks || mocks}
    >
      <MemoryRouter initialEntries={['/groups/1234-abcd-5678-efgh']}>
        <Routes>
          <Route
            path="/groups"
          >
            <Route
              path=":id"
              element={
                (
                  <ErrorBoundary>
                    <Suspense>
                      <ProviderPermissionsPage />
                    </Suspense>
                  </ErrorBoundary>
                )
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('ProviderPermissionPage', () => {
  describe('when showing the list of permissions for the groups provider permissions', () => {
    test('renders the full table of checkboxes with correct options checked', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByRole('link', { name: 'Groups' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Groups' })).toHaveAttribute('href', '/groups')
      expect(screen.getByRole('link', { name: 'Mock group' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Mock group' })).toHaveAttribute('href', '/groups/1234-abcd-5678-efgh')

      expect(screen.queryByText('Mock group Provider Permissions')).toBeInTheDocument()

      expect(screen.getByTestId('mock-provider-permissions')).toBeInTheDocument()
    })
  })
})
