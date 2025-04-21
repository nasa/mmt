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

import SystemPermissions from '@/js/components/SystemPermissions/SystemPermissions'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'

import NotificationsContext from '@/js/context/NotificationsContext'

import {
  GET_SYSTEM_IDENTITY_PERMISSIONS
} from '@/js/operations/queries/getSystemIdentityPermissions'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_GROUP } from '@/js/operations/queries/getGroup'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

import errorLogger from '@/js/utils/errorLogger'

vi.mock('@/js/utils/errorLogger')

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
                target: 'DASHBOARD_ADMIN'
              },
              identityType: 'System',
              groups: {
                items: [{
                  id: '1234-abcd-5678-efgh',
                  permissions: [
                    'read'
                  ],
                  userType: null
                }]
              },
              conceptId: 'ACL1200000001-CMR'
            },
            {
              systemIdentity: {
                target: 'INGEST_MANAGEMENT_ACL'
              },
              identityType: 'System',
              groups: {
                items: [
                  {
                    permissions: [],
                    id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                    userType: null
                  },
                  {
                    permissions: [
                      'read',
                      'update'
                    ],
                    id: '1234-abcd-5678-efgh',
                    userType: null
                  }
                ]
              },
              conceptId: 'ACL1200000002-CMR'
            },
            {
              systemIdentity: {
                target: 'TAG_GROUP'
              },
              identityType: 'System',
              groups: {
                items: [
                  {
                    permissions: [],
                    id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                    userType: null
                  }
                ]
              },
              conceptId: 'ACL1200000004-CMR'
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
    addNotificationMock,
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
        expect(checkedCheckboxes.length).toBe(54)

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
                systemIdentity: {
                  target: 'ANY_ACL'
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
                        target: 'DASHBOARD_ADMIN'
                      },
                      identityType: 'System',
                      groups: {
                        items: [
                          {
                            permissions: [
                              'read'
                            ],
                            id: '1234-abcd-5678-efgh',
                            userType: null
                          }
                        ]
                      },
                      conceptId: 'ACL1200000001-CMR'
                    },
                    {
                      systemIdentity: {
                        target: 'INGEST_MANAGEMENT_ACL'
                      },
                      identityType: 'System',
                      groups: {
                        items: [
                          {
                            permissions: [],
                            id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                            userType: null
                          },
                          {
                            permissions: [
                              'read',
                              'update'
                            ],
                            id: '1234-abcd-5678-efgh',
                            userType: null
                          }
                        ]
                      },
                      conceptId: 'ACL1200000002-CMR'
                    },
                    {
                      systemIdentity: {
                        target: 'TAG_GROUP'
                      },
                      identityType: 'System',
                      groups: {
                        items: [
                          {
                            permissions: [],
                            id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                            userType: null
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

        const createAnyAclCheckbox = await screen.findByRole('checkbox', {
          name: 'create any_acl',
          checked: false
        })

        await user.click(createAnyAclCheckbox)

        const submitButton = screen.getByRole('button', { name: 'Submit' })

        await user.click(submitButton)

        expect(addNotificationMock).toHaveBeenCalledTimes(1)
        expect(addNotificationMock).toHaveBeenCalledWith({
          message: 'Failed to update system permissions.',
          variant: 'danger'
        })

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith('Failed to create system permissions.', new ApolloError({ errorMessage: 'An error occurred updating an Acl.' }))
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
                      target: 'ANY_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  }, {
                    systemIdentity: {
                      target: 'DASHBOARD_ADMIN'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'INGEST_MANAGEMENT_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        },
                        {
                          permissions: [
                            'read',
                            'update'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
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

      expect(await screen.findByRole('checkbox', {
        name: 'read any_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update any_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete any_acl',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'System permissions updated successfully.',
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
                      target: 'ANY_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  }, {
                    systemIdentity: {
                      target: 'DASHBOARD_ADMIN'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'INGEST_MANAGEMENT_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        },
                        {
                          permissions: [
                            'read',
                            'update'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        },
                        {
                          permissions: [
                            'update'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
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

      const updateTagGroupCheckbox = await screen.findByRole('checkbox', {
        name: 'update tag_group',
        checked: false
      })

      await user.click(updateTagGroupCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create tag_group',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read tag_group',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update tag_group',
        checked: true
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete tag_group',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'System permissions updated successfully.',
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
                      target: 'ANY_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  }, {
                    systemIdentity: {
                      target: 'DASHBOARD_ADMIN'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'INGEST_MANAGEMENT_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        },
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
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

      const updateIngestManagementAclCheckbox = await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: true
      })

      await user.click(updateIngestManagementAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked

      expect(await screen.findByRole('checkbox', {
        name: 'create ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read ingest_management_acl',
        checked: true
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'System permissions updated successfully.',
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
                      target: 'ANY_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  }, {
                    systemIdentity: {
                      target: 'DASHBOARD_ADMIN'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000001-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'INGEST_MANAGEMENT_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
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
        name: 'create ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete ingest_management_acl',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'System permissions updated successfully.',
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
                      target: 'ANY_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [
                            'create'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000003-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'INGEST_MANAGEMENT_ACL'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
                        },
                        {
                          permissions: [
                            'read'
                          ],
                          id: '1234-abcd-5678-efgh',
                          userType: null
                        }
                      ]
                    },
                    conceptId: 'ACL1200000002-CMR'
                  },
                  {
                    systemIdentity: {
                      target: 'TAG_GROUP'
                    },
                    identityType: 'System',
                    groups: {
                      items: [
                        {
                          permissions: [],
                          id: '3a07720d-2ac4-4ea5-a0fb-a32dd7c7435f',
                          userType: null
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

      const readDashboardAdminAclCheckbox = await screen.findByRole('checkbox', {
        name: 'read dashboard_admin',
        checked: true
      })

      await user.click(readDashboardAdminAclCheckbox)

      const submitButton = screen.getByRole('button', { name: 'Submit' })

      await user.click(submitButton)

      // After submission, the data is reloaded -- make sure the checkbox is checked
      expect(await screen.findByRole('checkbox', {
        name: 'create dashboard_admin',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'read dashboard_admin',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'update dashboard_admin',
        checked: false
      })).toBeVisible()

      expect(await screen.findByRole('checkbox', {
        name: 'delete dashboard_admin',
        checked: false
      })).toBeVisible()

      expect(addNotificationMock).toHaveBeenCalledTimes(1)
      expect(addNotificationMock).toHaveBeenCalledWith({
        message: 'System permissions updated successfully.',
        variant: 'success'
      })
    })
  })
})
