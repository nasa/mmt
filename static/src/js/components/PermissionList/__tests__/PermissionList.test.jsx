import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import React, { Suspense } from 'react'

import userEvent from '@testing-library/user-event'

import { DELETE_ACL } from '@/js/operations/mutations/deleteAcl'
import { GET_COLLECTION_PERMISSIONS } from '@/js/operations/queries/getCollectionPermissions'

import NotificationsContext from '@/js/context/NotificationsContext'

import errorLogger from '@/js/utils/errorLogger'

import { MemoryRouter } from 'react-router'
import PermissionList from '../PermissionList'

vi.mock('../../../utils/errorLogger')

const setup = ({
  overrideMocks = false
}) => {
  const mockPermission = {
    __typename: 'AclList',
    count: 2,
    items: [
      {
        __typename: 'Acl',
        acl: {
          group_permissions: [
            {
              permissions: [
                'read'
              ],
              user_type: 'guest'
            },
            {
              permissions: [
                'read'
              ],
              user_type: 'registered'
            },
            {
              permissions: [
                'read',
                'order'
              ],
              group_id: 'dac6baa0-5564-4d3e-b151-113d78966548'
            },
            {
              permissions: [
                'read',
                'order'
              ],
              group_id: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
            },
            {
              permissions: [
                'read',
                'order'
              ],
              group_id: 'adb932a3-0c53-4b22-abee-d362cf60ff1b'
            }
          ],
          catalog_item_identity: {
            name: 'All Collections',
            provider_id: 'MMT_2',
            granule_applicable: false,
            collection_applicable: true
          },
          legacy_guid: 'C888DB7F-AF5B-BC22-61ED-BBD6F4965F76'
        },
        conceptId: 'ACL1200216197-CMR',
        name: 'All Collections',
        providerIdentity: null,
        catalogItemIdentity: {
          name: 'All Granules',
          providerId: 'MMT_2',
          collectionApplicable: false,
          granuleApplicable: true
        }
      },
      {
        __typename: 'Acl',
        acl: {
          group_permissions: [
            {
              permissions: [
                'read'
              ],
              user_type: 'guest'
            },
            {
              permissions: [
                'read'
              ],
              user_type: 'registered'
            },
            {
              permissions: [
                'order',
                'update',
                'read',
                'create',
                'delete'
              ],
              group_id: 'adb932a3-0c53-4b22-abee-d362cf60ff1b'
            },
            {
              permissions: [
                'update',
                'delete',
                'order',
                'read',
                'create'
              ],
              group_id: 'dac6baa0-5564-4d3e-b151-113d78966548'
            },
            {
              permissions: [
                'order',
                'update',
                'delete',
                'read',
                'create'
              ],
              group_id: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
            }
          ],
          legacy_guid: '13F00E3E-CFF0-3536-83DD-01569A04BDBB'

        },
        conceptId: 'ACL1200216196-CMR',
        name: 'All Granules',
        providerIdentity: null,
        catalogItemIdentity: {
          name: 'All Granules',
          providerId: 'MMT_2',
          collectionApplicable: false,
          granuleApplicable: true
        }
      }
    ]
  }

  const mocks = [{
    request: {
      query: GET_COLLECTION_PERMISSIONS,
      variables: {
        params: {
          identityType: 'catalog_item',
          limit: 20,
          offset: 0
        }
      }
    },
    result: {
      data: {
        acls: mockPermission
      }
    }
  }]

  const notificationContext = {
    addNotification: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <NotificationsContext.Provider value={notificationContext}>
      <MockedProvider mocks={overrideMocks || mocks}>
        <MemoryRouter>
          <Suspense>
            <PermissionList />
          </Suspense>
        </MemoryRouter>
      </MockedProvider>
    </NotificationsContext.Provider>
  )

  return {
    user
  }
}

describe('PermissionList', () => {
  describe('when getting list of permissions results in a success', () => {
    test('renders a table with 2 permission', async () => {
      setup({})

      expect(await screen.findByText('All Collections')).toBeInTheDocument()
      expect(screen.getByText('All Granules')).toBeInTheDocument()
    })
  })

  describe('when no permission are available', () => {
    test('renders the pagination components', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_COLLECTION_PERMISSIONS,
              variables: {
                params: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 0
                }
              }
            },
            result: {
              data: {
                acls: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]

      })

      expect(await screen.findByText('No permissions found')).toBeInTheDocument()
    })
  })

  describe('when permission list has more than 20 permission', () => {
    test('renders the pagination components', async () => {
      const { user } = setup({
        overrideMocks: [
          {
            request: {
              query: GET_COLLECTION_PERMISSIONS,
              variables: {
                params: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 0
                }
              }
            },
            result: {
              data: {
                acls: {
                  __typename: 'AclList',
                  count: 25,
                  items: [
                    {
                      __typename: 'Acl',
                      conceptId: 'ACL1200216197-CMR',
                      name: 'All Collections',
                      providerIdentity: null,
                      catalogItemIdentity: {
                        name: 'All Collections',
                        providerId: 'MMT_2',
                        granuleApplicable: false,
                        collectionApplicable: true
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            request: {
              query: GET_COLLECTION_PERMISSIONS,
              variables: {
                params: {
                  identityType: 'catalog_item',
                  limit: 20,
                  offset: 20
                }
              }
            },
            result: {
              data: {
                acls: {
                  __typename: 'AclList',
                  count: 25,
                  items: [
                    {
                      catalogItemIdentity: {
                        name: 'Page 2 All Collection',
                        providerId: 'MMT_2',
                        granuleApplicable: false,
                        collectionApplicable: true
                      },
                      conceptId: 'ACL1200216197-CMR',
                      name: 'Page 2 All Collection',
                      providerIdentity: null
                    }
                  ]
                }
              }
            }
          }
        ]

      })

      expect(await screen.findByText('Showing 1-20 of 25 permissions')).toBeInTheDocument()

      const pagination = screen.queryAllByRole('navigation', { name: 'Pagination Navigation' })

      expect(pagination).toHaveLength(2)

      const paginationButton = within(pagination[0]).getByRole('button', { name: 'Goto Page 2' })

      await user.click(paginationButton)

      await waitFor(() => {
        expect(screen.queryAllByRole('cell')[0].textContent).toContain('Page 2 All Collection')
      })
    })
  })

  describe('when clicking delete button', () => {
    describe('when clicking yes on the delete modal', () => {
      test('deletes collection permission and hides the modal', async () => {
        const { user } = setup(
          {
            overrideMocks: [
              {
                request: {
                  query: GET_COLLECTION_PERMISSIONS,
                  variables: {
                    params: {
                      identityType: 'catalog_item',
                      limit: 20,
                      offset: 0
                    }
                  }
                },
                result: {
                  data: {
                    acls: {
                      __typename: 'AclList',
                      count: 1,
                      items: [
                        {
                          __typename: 'Acl',
                          conceptId: 'ACL1200216197-CMR',
                          name: 'All Collections',
                          providerIdentity: null,
                          catalogItemIdentity: {
                            name: 'All Collections',
                            providerId: 'MMT_2',
                            granuleApplicable: false,
                            collectionApplicable: true
                          }
                        }
                      ]
                    }
                  }
                }
              },
              {
                request: {
                  query: DELETE_ACL,
                  variables: { conceptId: 'ACL1200216197-CMR' }
                },
                result: {
                  data: {
                    deleteAcl: {
                      conceptId: 'ACL1200216197-CMR',
                      revisionId: '1'
                    }
                  }
                }
              },
              {
                request: {
                  query: GET_COLLECTION_PERMISSIONS,
                  variables: {
                    params: {
                      identityType: 'catalog_item',
                      limit: 20,
                      offset: 0
                    }
                  }
                },
                result: {
                  data: {
                    acls: {
                      __typename: 'AclList',
                      count: 0,
                      items: []
                    }
                  }
                }
              }
            ]
          }
        )

        const deleteLink = await screen.findByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(await screen.findByText('No permissions found')).toBeInTheDocument()
      })
    })

    describe('when clicking Yes on the delete modal results in a failure', () => {
      test('should not delete the permission and calls errorLogger', async () => {
        const { user } = setup(
          {
            overrideMocks: [
              {
                request: {
                  query: GET_COLLECTION_PERMISSIONS,
                  variables: {
                    params: {
                      identityType: 'catalog_item',
                      limit: 20,
                      offset: 0
                    }
                  }
                },
                result: {
                  data: {
                    acls: {
                      __typename: 'AclList',
                      count: 1,
                      items: [
                        {
                          __typename: 'Acl',
                          conceptId: 'ACL1200216197-CMR',
                          name: 'All Collections',
                          providerIdentity: null,
                          catalogItemIdentity: {
                            name: 'All Collections',
                            providerId: 'MMT_2',
                            granuleApplicable: false,
                            collectionApplicable: true
                          }
                        }
                      ]
                    }
                  }
                }
              },
              {
                request: {
                  query: DELETE_ACL,
                  variables: { conceptId: 'ACL1200216197-CMR' }
                },
                error: new Error('An error occurred')
              }
            ]
          }
        )
        const deleteLink = await screen.findByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

        const yesButton = screen.getByRole('button', { name: 'Yes' })
        await user.click(yesButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)

        expect(errorLogger).toHaveBeenCalledWith(
          'Unable delete collection permission',
          'Permission List: deleteAcl Mutation'
        )
      })
    })

    describe('when clicking no on the delete modal', () => {
      test('should hide the modal and should not delete the permission', async () => {
        const { user } = setup(
          {
            overrideMocks: [
              {
                request: {
                  query: GET_COLLECTION_PERMISSIONS,
                  variables: {
                    params: {
                      identityType: 'catalog_item',
                      limit: 20,
                      offset: 0
                    }
                  }
                },
                result: {
                  data: {
                    acls: {
                      __typename: 'AclList',
                      count: 1,
                      items: [
                        {
                          __typename: 'Acl',
                          conceptId: 'ACL1200216197-CMR',
                          name: 'All Collections',
                          providerIdentity: null,
                          catalogItemIdentity: {
                            name: 'All Collections',
                            providerId: 'MMT_2',
                            granuleApplicable: false,
                            collectionApplicable: true
                          }
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        )

        const deleteLink = await screen.findByRole('button', { name: 'Delete Button Delete' })
        await user.click(deleteLink)

        expect(screen.getByText('Are you sure you want to delete this collection permission?')).toBeInTheDocument()

        const noButton = screen.getByRole('button', { name: 'No' })
        await user.click(noButton)

        expect(screen.getByText('Showing 1 permissions')).toBeInTheDocument()
        expect(screen.queryByText('Are you sure you want to delete this collection permission?')).not.toBeInTheDocument()
      })
    })
  })
})
