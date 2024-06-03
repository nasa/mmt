import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { ApolloError } from '@apollo/client'

import userEvent from '@testing-library/user-event'

import ProviderPermissions from '@/js/components/ProviderPermissions/ProviderPermissions'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import NotificationsContext from '@/js/context/NotificationsContext'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import {
  GET_PROVIDER_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getProviderIdentityPermissions'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

import errorLogger from '@/js/utils/errorLogger'

vi.mock('@/js/utils/errorLogger')

vi.mock('@/js/hooks/useAvailableProviders')
useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

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
          limit: 50,
          provider: 'MMT_2'
        }
      }
    },
    result: {
      data: {
        acls: {
          items: [
            {
              providerIdentity: {
                target: 'AUDIT_REPORT',
                provider_id: 'MMT_2'
              },
              groups: {
                items: [
                  {
                    userType: null,
                    permissions: [
                      'read'
                    ],
                    id: '1234-abcd-5678-efgh'
                  }
                ]
              },
              conceptId: 'ACL1200000001-CMR'
            },
            {
              providerIdentity: {
                target: 'AUTHENTICATOR_DEFINITION',
                provider_id: 'MMT_2'
              },
              groups: {
                items: [
                  {
                    userType: null,
                    permissions: [],
                    id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                  },
                  {
                    userType: null,
                    permissions: [
                      'create'
                    ],
                    id: '1234-abcd-5678-efgh'
                  }
                ]
              },
              conceptId: 'ACL1200000002-CMR'
            },
            {
              providerIdentity: {
                target: 'EXTENDED_SERVICE',
                provider_id: 'MMT_2'
              },
              groups: {
                items: [
                  {
                    userType: null,
                    permissions: [],
                    id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                  }
                ]
              },
              conceptId: 'ACL1200000003-CMR'
            }
          ]
        }
      }
    }
  },
  ...additionalMocks]

  const addNotificationMock = vi.fn()
  const notificationContext = {
    addNotification: addNotificationMock
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MemoryRouter initialEntries={['/groups/1234-abcd-5678-efgh']}>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
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
        </MockedProvider>
      </MemoryRouter>
    </NotificationsContext.Provider>
  )

  return {
    addNotificationMock,
    user
  }
}

describe('ProviderPermissions', () => {
  describe('when showing the list of permissions for the groups provider permissions', () => {
    describe('when toggling the un/check all checkbox', () => {
      test('unchecks all checkboxes', async () => {
        const { user } = setup({})

        const selectInput = await screen.findByRole('combobox')
        await user.click(selectInput)

        const option1 = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option1)

        const checkAll = await screen.findByRole('checkbox', { name: 'Check/Uncheck all permissions' })
        await user.click(checkAll)

        const table = screen.getByRole('table')

        const checkedCheckboxes = within(table).queryAllByRole('checkbox', { checked: true })
        expect(checkedCheckboxes.length).toBe(60)

        await user.click(checkAll)

        const uncheckedCheckboxes = within(table).queryAllByRole('checkbox', { checked: true })
        expect(uncheckedCheckboxes.length).toBe(0)
      })
    })
  })

  describe('when adding permissions for a target that does not already have an Acl in CMR', () => {
    describe('when the mutation fails', () => {
      test('fails to create a new Acl in CMR', async () => {
        const { addNotificationMock, user } = setup({
          additionalMocks: [{
            request: {
              query: CREATE_ACL,
              variables: {
                groupPermissions: [{
                  permissions: [
                    'create'
                  ],
                  group_id: '1234-abcd-5678-efgh'
                }],
                providerIdentity: {
                  target: 'GROUP',
                  provider_id: 'MMT_2'
                }
              }
            },
            result: {
              data: null,
              errors: [{
                message: 'An error occurred updating an Acl.',
                locations: [{
                  line: 2,
                  column: 3
                }],
                paths: ['acls']
              }]
            }
          }, {
            request: {
              query: GET_PROVIDER_IDENTITY_PERMISSIONS,
              variables: {
                params: {
                  identityType: 'provider',
                  limit: 50,
                  provider: 'MMT_2'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: [
                    {
                      providerIdentity: {
                        target: 'AUDIT_REPORT',
                        provider_id: 'MMT_2'
                      },
                      groups: {
                        items: [
                          {
                            userType: null,
                            permissions: [
                              'read'
                            ],
                            id: '1234-abcd-5678-efgh'
                          }
                        ]
                      },
                      conceptId: 'ACL1200000001-CMR'
                    },
                    {
                      providerIdentity: {
                        target: 'AUTHENTICATOR_DEFINITION',
                        provider_id: 'MMT_2'
                      },
                      groups: {
                        items: [
                          {
                            userType: null,
                            permissions: [],
                            id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                          },
                          {
                            userType: null,
                            permissions: [
                              'create'
                            ],
                            id: '1234-abcd-5678-efgh'
                          }
                        ]
                      },
                      conceptId: 'ACL1200000002-CMR'
                    },
                    {
                      providerIdentity: {
                        target: 'EXTENDED_SERVICE',
                        provider_id: 'MMT_2'
                      },
                      groups: {
                        items: [
                          {
                            userType: null,
                            permissions: [],
                            id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                          }
                        ]
                      },
                      conceptId: 'ACL1200000003-CMR'
                    },
                    {
                      providerIdentity: {
                        target: 'GROUP',
                        provider_id: 'MMT_2'
                      },
                      groups: {
                        items: [
                          {
                            userType: null,
                            permissions: [],
                            id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                          },
                          {
                            userType: null,
                            permissions: [
                              'create'
                            ],
                            id: '1234-abcd-5678-efgh'
                          }
                        ]
                      },
                      conceptId: 'ACL1200000004-CMR'
                    }
                  ]
                }
              }
            }
          }]
        })

        const selectInput = await screen.findByRole('combobox')
        await user.click(selectInput)

        const option1 = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(option1)

        const createGroupheckbox = await screen.findByRole('checkbox', {
          name: 'create group',
          checked: false
        })

        await user.click(createGroupheckbox)

        const submitButton = screen.getByRole('button', { name: 'Submit' })

        await user.click(submitButton)

        expect(addNotificationMock).toHaveBeenCalledTimes(1)
        expect(addNotificationMock).toHaveBeenCalledWith({
          message: 'Failed to update provider permissions.',
          variant: 'danger'
        })

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Failed to create provider permissions.', new ApolloError({ errorMessage: 'An error occurred updating an Acl.' }))
      })
    })
  })

  describe('when adding permissions for a target that does not already have an Acl in CMR', () => {
    test('creates a new Acl in CMR', async () => {
      const { addNotificationMock, user } = setup({
        additionalMocks: [{
          request: {
            query: CREATE_ACL,
            variables: {
              groupPermissions: [{
                permissions: [
                  'create'
                ],
                group_id: '1234-abcd-5678-efgh'
              }],
              providerIdentity: {
                target: 'GROUP',
                provider_id: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              createAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000004-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_PROVIDER_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'provider',
                limit: 50,
                provider: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [
                  {
                    providerIdentity: {
                      target: 'AUDIT_REPORT',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'AUTHENTICATOR_DEFINITION',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'EXTENDED_SERVICE',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'GROUP',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const selectInput = await screen.findByRole('combobox')
      await user.click(selectInput)

      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      const createGroupheckbox = await screen.findByRole('checkbox', {
        name: 'create group',
        checked: false
      })

      await user.click(createGroupheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create group',
        checked: true
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read group',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update group',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete group',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    })
  })

  describe('when adding permissions for a target that already has an Acl in CMR but doesnt include the selected group', () => {
    test('adds the selected group to the Acl in CMR', async () => {
      const { addNotificationMock, user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000003-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              }, {
                permissions: [
                  'create'
                ],
                group_id: '1234-abcd-5678-efgh'
              }],
              providerIdentity: {
                target: 'EXTENDED_SERVICE',
                provider_id: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000003-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_PROVIDER_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'provider',
                limit: 50,
                provider: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [
                  {
                    providerIdentity: {
                      target: 'AUDIT_REPORT',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'AUTHENTICATOR_DEFINITION',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'EXTENDED_SERVICE',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'GROUP',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const selectInput = await screen.findByRole('combobox')
      await user.click(selectInput)

      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      const createExtendedServiceCheckbox = await screen.findByRole('checkbox', {
        name: 'create extended_service',
        checked: false
      })

      await user.click(createExtendedServiceCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create extended_service',
        checked: true
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read extended_service',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update extended_service',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete extended_service',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    })
  })

  describe('when updating permissions for a target that already has an Acl in CMR that includes the selected group', () => {
    test('updates the permissions for the selected group in the Acl in CMR', async () => {
      const { addNotificationMock, user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000002-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              }, {
                permissions: [
                  'create',
                  'delete'
                ],
                group_id: '1234-abcd-5678-efgh'
              }],
              providerIdentity: {
                target: 'AUTHENTICATOR_DEFINITION',
                provider_id: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000003-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_PROVIDER_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'provider',
                limit: 50,
                provider: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [
                  {
                    providerIdentity: {
                      target: 'AUDIT_REPORT',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'AUTHENTICATOR_DEFINITION',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'delete',
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'EXTENDED_SERVICE',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'GROUP',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const selectInput = await screen.findByRole('combobox')
      await user.click(selectInput)

      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      const deleteAuthenticationDefinitionCheckbox = await screen.findByRole('checkbox', {
        name: 'delete authenticator_definition',
        checked: false
      })

      await user.click(deleteAuthenticationDefinitionCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create authenticator_definition',
        checked: true
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete authenticator_definition',
        checked: true
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    })
  })

  describe('when removing all permissions for a group that belongs to an Acl in CMR', () => {
    test('removes the selected group from the Acl in CMR', async () => {
      const { addNotificationMock, user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000002-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              }],
              providerIdentity: {
                target: 'AUTHENTICATOR_DEFINITION',
                provider_id: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000003-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_PROVIDER_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'provider',
                limit: 50,
                provider: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [
                  {
                    providerIdentity: {
                      target: 'AUDIT_REPORT',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'AUTHENTICATOR_DEFINITION',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'EXTENDED_SERVICE',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'GROUP',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const selectInput = await screen.findByRole('combobox')
      await user.click(selectInput)

      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      const createAuthenticationDefinitionCheckbox = await screen.findByRole('checkbox', {
        name: 'create authenticator_definition',
        checked: true
      })

      await user.click(createAuthenticationDefinitionCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete authenticator_definition',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    })
  })

  describe('when removing all permissions for a group that belongs to an Acl in CMR and its the last group in the Acl', () => {
    test('removes the Acl from CMR', async () => {
      const { addNotificationMock, user } = setup({
        additionalMocks: [{
          request: {
            query: DELETE_ACL,
            variables: {
              conceptId: 'ACL1200000001-CMR'
            }
          },
          result: {
            data: {
              deleteAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000001-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_PROVIDER_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'provider',
                limit: 50,
                provider: 'MMT_2'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [
                  {
                    providerIdentity: {
                      target: 'AUTHENTICATOR_DEFINITION',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'EXTENDED_SERVICE',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    providerIdentity: {
                      target: 'GROUP',
                      provider_id: 'MMT_2'
                    },
                    groups: {
                      items: [
                        {
                          userType: null,
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                        },
                        {
                          userType: null,
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh'
                        }
                      ]
                    },
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const selectInput = await screen.findByRole('combobox')
      await user.click(selectInput)

      const option1 = screen.getByRole('option', { name: 'MMT_2' })
      await user.click(option1)

      const readAuditReportCheckbox = await screen.findByRole('checkbox', {
        name: 'read audit_report',
        checked: true
      })

      await user.click(readAuditReportCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create audit_report',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read audit_report',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update audit_report',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete audit_report',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'Provider permissions updated successfully.',
        variant: 'success'
      })
    })
  })
})
