import React, { Suspense } from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { Cookies } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import AppContext from '@/js/context/AppContext'

import ProviderPermissions from '@/js/components/ProviderPermissions/ProviderPermissions'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'

import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

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
      query: GET_AVAILABLE_PROVIDERS,
      variables: {
        params: {
          limit: 500,
          permittedUser: 'typical',
          target: 'PROVIDER_CONTEXT'
        }
      }
    },
    result: {
      data: {
        acls: {
          items: [{
            providerIdentity: {
              target: 'PROVIDER_CONTEXT',
              provider_id: 'MMT_2'
            }
          }]
        }
      }
    }
  }, {
    request: {
      query: GET_PROVIDER_IDENTITY_PERMISSIONS,
      variables: {
        params: {
          identityType: 'provider',
          permittedGroup: '1234-abcd-5678-efgh',
          limit: 50,
          provider: 'MMT_2'
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
              groups: {
                items: [
                  {
                    permissions: [
                      'read'
                    ],
                    id: '1234-abcd-5678-efgh'
                  },
                  {
                    permissions: [
                      'read'
                    ],
                    id: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
                  }
                ]
              },
              conceptId: 'ACL1200216198-CMR'
            },
            {
              providerIdentity: {
                target: 'AUTHENTICATOR_DEFINITION',
                provider_id: 'MMT_1'
              },
              identityType: 'Provider',
              groups: {
                items: [
                  {
                    permissions: [],
                    id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                  },
                  {
                    permissions: [
                      'delete',
                      'create'
                    ],
                    id: '1234-abcd-5678-efgh'
                  }
                ]
              },
              conceptId: 'ACL1200216108-CMR'
            }
          ]
        }
      }
    }
  },
  ...additionalMocks]

  const context = {
    user: {
      uid: 'typical'
    }
  }

  render(
    <AppContext.Provider value={context}>
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
                        <ProviderPermissions />
                      </Suspense>
                    </ErrorBoundary>
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

describe('ProviderPermissions', () => {
  describe('when showing the list of permissions for the groups provider permissions', () => {
    test('renders the full table of checkboxes with correct options checked', async () => {
      const { user } = setup({})

      await waitForResponse()

      const selectInput = screen.getByRole('combobox')
      await user.click(selectInput)
      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      await waitForResponse()

      expect(screen.queryByText('Audit Reports')).toBeInTheDocument()
      expect(screen.queryByText('Authenticator Definitions')).toBeInTheDocument()

      waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox', { checked: true })
        expect(checkboxes.length).toBe(3)

        expect(checkboxes[0]).toHaveAttribute('name', 'audit_report_read')
        expect(checkboxes[1]).toHaveAttribute('name', 'authenticator_definition_create')
        expect(checkboxes[2]).toHaveAttribute('name', 'authenticator_definition_delete')
      })
    })
  })
})
