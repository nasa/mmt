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
import { describe } from 'vitest'

import {
  GET_SYSTEM_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getSystemIdentityPermissions'

import { GET_GROUP } from '../../../operations/queries/getGroup'

import SystemPermissions from '../SystemPermissions'
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary'

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
      query: GET_SYSTEM_IDENTITY_PERMISSIONS,
      variables: {
        params: {
          identityType: 'system',
          limit: 50,
          permittedGroup: '1234-abcd-5678-efgh'
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
                      <SystemPermissions />
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

describe('SystemPermissions', () => {
  describe('when showing the list of permissions for the groups provider permissions', () => {
    test('renders the full table of checkboxes with correct options checked', async () => {
      setup({})

      await waitForResponse()

      expect(screen.queryByText('CMR Dashboard Admin')).toBeInTheDocument()
      expect(screen.queryByText('Ingest Operations')).toBeInTheDocument()

      const checkboxes = screen.getAllByRole('checkbox', { checked: true })
      expect(checkboxes.length).toBe(3)

      expect(checkboxes[0]).toHaveAttribute('name', 'dashboard_admin_read')
      expect(checkboxes[1]).toHaveAttribute('name', 'ingest_management_acl_read')
      expect(checkboxes[2]).toHaveAttribute('name', 'ingest_management_acl_update')
    })
  })
})
