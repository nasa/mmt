import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
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

import SystemPermissionsPage from '@/js/pages/SystemPermissionsPage/SystemPermissionsPage'

vi.mock('@/js/components/SystemPermissions/SystemPermissions', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-system-permissions">System Permissions</div>
  ))
}))

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
    tag: 'CMR'
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
              systemIdentity: {
                target: 'DASHBOARD_ADMIN',
                provider_id: 'MMT_1'
              },
              identityType: 'System',
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
              systemIdentity: {
                target: 'INGEST_MANAGEMENT_ACL',
                provider_id: 'MMT_1'
              },
              identityType: 'System',
              groupPermissions: [
                {
                  permissions: [],
                  group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                },
                {
                  permissions: [
                    'read',
                    'update'
                  ],
                  group_id: '1234-abcd-5678-efgh'
                }
              ],
              conceptId: 'ACL1200216108-CMR'
            },
            {
              systemIdentity: {
                target: 'PROVIDER',
                provider_id: 'MMT_1'
              },
              identityType: 'System',
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

  const user = userEvent.setup()

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
                      <SystemPermissionsPage />
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
    user
  }
}

describe('SystemPermissionPage', () => {
  describe('when showing the list of permissions for the groups provider permissions', () => {
    test('renders the full table of checkboxes with correct options checked', async () => {
      setup({})

      expect(await screen.findByRole('link', { name: 'System Groups' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'System Groups' })).toHaveAttribute('href', '/admin/groups')
      expect(screen.getByRole('link', { name: 'Mock group' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Mock group' })).toHaveAttribute('href', '/admin/groups/1234-abcd-5678-efgh')

      expect(screen.queryByText('Mock group System Permissions')).toBeInTheDocument()

      expect(screen.getByTestId('mock-system-permissions')).toBeInTheDocument()
    })
  })
})
