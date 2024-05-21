import React, { Suspense } from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import { Cookies } from 'react-cookie'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'

import NotificationsContext from '@/js/context/NotificationsContext'

import {
  GET_SYSTEM_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getSystemIdentityPermissions'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

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
                }
              ],
              conceptId: 'ACL1200000001-CMR'
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
              conceptId: 'ACL1200000002-CMR'
            },
            {
              systemIdentity: {
                target: 'TAG_GROUP',
                provider_id: 'MMT_1'
              },
              identityType: 'System',
              groupPermissions: [
                {
                  permissions: [],
                  group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                }
              ],
              conceptId: 'ACL1200000004-CMR'
            }
          ]
        }
      }
    }
  },
  ...additionalMocks]

  const notificationContext = {
    addNotification: vi.fn()
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
                        <SystemPermissions />
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
    user
  }
}

describe('SystemPermissions', () => {
  describe('when showing the list of permissions for the groups system permissions', () => {
    describe('when toggling the un/check all checkbox', () => {
      test('unchecks all checkboxes', async () => {
        const { user } = setup({})

        const checkAll = await screen.findByRole('checkbox', { name: 'Check/Uncheck all permissions' })
        await user.click(checkAll)

        const table = screen.getByRole('table')

        const checkedCheckboxes = within(table).queryAllByRole('checkbox', { checked: true })
        expect(checkedCheckboxes.length).toBe(50)

        await user.click(checkAll)

        const uncheckedCheckboxes = within(table).queryAllByRole('checkbox', { checked: true })
        expect(uncheckedCheckboxes.length).toBe(0)
      })
    })
  })

  describe('when adding permissions for a target that does not already have an Acl in CMR', () => {
    test('creates a new Acl in CMR', async () => {
      const { user } = setup({
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
              systemIdentity: {
                target: 'ANY_ACL'
              }
            }
          },
          result: {
            data: {
              createAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000001-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_SYSTEM_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'system',
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
                      target: 'ANY_ACL',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [
                          'create'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000003-CMR'
                  }, {
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
                      }
                    ],
                    conceptId: 'ACL1200000001-CMR'
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
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [],
                        group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                      }
                    ],
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const createAnyAclCheckbox = await screen.findByRole('checkbox', {
        name: 'create any_acl',
        checked: false
      })

      await user.click(createAnyAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create any_acl',
        checked: true
      })).toBeVisible()
    })
  })

  describe('when adding permissions for a target that already has an Acl in CMR but doesnt include the selected group', () => {
    test('adds the selected group to the Acl in CMR', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000004-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              }, {
                permissions: [
                  'update'
                ],
                group_id: '1234-abcd-5678-efgh'
              }],
              systemIdentity: {
                target: 'TAG_GROUP'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000004-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_SYSTEM_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'system',
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
                      target: 'ANY_ACL',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [
                          'create'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000003-CMR'
                  }, {
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
                      }
                    ],
                    conceptId: 'ACL1200000001-CMR'
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
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP',
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
                          'update'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const updateTagGroupCheckbox = await screen.findByRole('checkbox', {
        name: 'update tag_group',
        checked: false
      })

      await user.click(updateTagGroupCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'update tag_group',
        checked: true
      })).toBeVisible()
    })
  })

  describe('when updating permissions for a target that already has an Acl in CMR that includes the selected group', () => {
    test('updates the permissions for the selected group in the Acl in CMR', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000002-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              },
              {
                permissions: [
                  'read'
                ],
                group_id: '1234-abcd-5678-efgh'
              }],
              systemIdentity: {
                target: 'INGEST_MANAGEMENT_ACL'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000002-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_SYSTEM_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'system',
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
                      target: 'ANY_ACL',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [
                          'create'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000003-CMR'
                  }, {
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
                      }
                    ],
                    conceptId: 'ACL1200000001-CMR'
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
                          'read'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [],
                        group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                      }
                    ],
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const updateIngestManagementAclCheckbox = await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: true
      })

      await user.click(updateIngestManagementAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: false
      })).toBeVisible()
    })
  })

  describe('when removing all permissions for a group that belongs to an Acl in CMR', () => {
    test('removes the selected group from the Acl in CMR', async () => {
      const { user } = setup({
        additionalMocks: [{
          request: {
            query: UPDATE_ACL,
            variables: {
              conceptId: 'ACL1200000002-CMR',
              groupPermissions: [{
                permissions: [],
                group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
              }],
              systemIdentity: {
                target: 'INGEST_MANAGEMENT_ACL'
              }
            }
          },
          result: {
            data: {
              updateAcl: {
                revisionId: '4',
                conceptId: 'ACL1200000002-CMR'
              }
            }
          }
        }, {
          request: {
            query: GET_SYSTEM_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'system',
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
                      target: 'ANY_ACL',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [
                          'create'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000003-CMR'
                  }, {
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
                      }
                    ],
                    conceptId: 'ACL1200000001-CMR'
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
                      }
                    ],
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [],
                        group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                      }
                    ],
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const readIngestManagementAclCheckbox = await screen.findByRole('checkbox', {
        name: 'read ingest_management_acl',
        checked: true
      })

      await user.click(readIngestManagementAclCheckbox)

      const updateIngestManagementAclCheckbox = await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: true
      })

      await user.click(updateIngestManagementAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'read ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: false
      })).toBeVisible()
    })
  })

  describe('when removing all permissions for a group that belongs to an Acl in CMR and its the last group in the Acl', () => {
    test('removes the Acl from CMR', async () => {
      const { user } = setup({
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
            query: GET_SYSTEM_IDENTITY_PERMISSIONS,
            variables: {
              params: {
                identityType: 'system',
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
                      target: 'ANY_ACL',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [
                          'create'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000003-CMR'
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
                          'read'
                        ],
                        group_id: '1234-abcd-5678-efgh'
                      }
                    ],
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP',
                      provider_id: 'MMT_1'
                    },
                    identityType: 'System',
                    groupPermissions: [
                      {
                        permissions: [],
                        group_id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f'
                      }
                    ],
                    conceptId: 'ACL1200000004-CMR'
                  }
                ]
              }
            }
          }
        }]
      })

      const readDashboardAdminAclCheckbox = await screen.findByRole('checkbox', {
        name: 'read dashboard_admin',
        checked: true
      })

      await user.click(readDashboardAdminAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'read dashboard_admin',
        checked: false
      })).toBeVisible()
    })
  })
})
