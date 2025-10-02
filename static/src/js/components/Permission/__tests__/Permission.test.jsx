import { MockedProvider } from '@apollo/client/testing'
import {
  render,
  screen,
  waitFor,
  within
} from '@testing-library/react'
import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import * as router from 'react-router'

import userEvent from '@testing-library/user-event'

import Permission from '@/js/components/Permission/Permission'
import PermissionCollectionTable from '@/js/components/PermissionCollectionTable/PermissionCollectionTable'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'
import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import Providers from '@/js/providers/Providers/Providers'
import NotificationsContext from '@/js/context/NotificationsContext'

vi.mock('../../PermissionCollectionTable/PermissionCollectionTable')
vi.mock('@/js/hooks/useAvailableProviders')

useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

const setup = ({
  overrideMocks = false
}) => {
  const mockPermission = {
    __typename: 'Acl',
    conceptId: 'ACL00000-CMR',
    collections: null,
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
        collections: null,
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
          id: null,
          name: null
        },
        {
          __typename: 'GroupPermission',
          permissions: [
            'read'
          ],
          userType: 'registered',
          id: null,
          name: null
        }
      ]
    }
  }

  const mocks = [{
    request: {
      query: GET_COLLECTION_PERMISSION,
      variables: { conceptId: 'ACL00000-CMR' }
    },
    result: {
      data: {
        acl: mockPermission
      }
    }
  }]

  const user = userEvent.setup()

  const defaultMocks = [{
    request: {
      query: GET_AVAILABLE_PROVIDERS,
      variables: {
        params: {
          limit: 500,
          permittedUser: undefined,
          target: 'PROVIDER_CONTEXT'
        }
      }
    },
    result: {
      data: {
        acls: {
          items: [{
            conceptId: 'mock-id',
            providerIdentity: {
              target: 'PROVIDER_CONTEXT',
              provider_id: 'MMT_2'
            }
          }]
        }
      }
    }
  },
  {
    request: {
      query: GET_GROUPS,
      variables: {
        params: {
          tags: ['MMT_1', 'MMT_2'],
          limit: 500
        }
      }
    },
    result: {
      data: {
        groups: {
          __typename: 'GroupList',
          count: 1,
          items: [
            {
              __typename: 'Group',
              description: 'Test group',
              id: '1234-abcd-5678',
              members: {
                __typename: 'GroupMemberList',
                count: 2
              },
              name: 'Mock group',
              tag: 'MMT_2'
            }
          ]
        }

      }
    }
  }]
  const notificationContext = {
    addNotification: vi.fn()
  }

  render(
    <Providers>
      <MockedProvider
        mocks={
          [
            ...defaultMocks,
            ...(overrideMocks || mocks)
          ]
        }
      >
        <NotificationsContext.Provider value={notificationContext}>
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
                        <Permission />
                      </Suspense>
                    )
                  }
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </NotificationsContext.Provider>

      </MockedProvider>
    </Providers>
  )

  return {
    user,
    notificationContext
  }
}

describe('Permission', () => {
  describe('when the permission has all collection or granule access', () => {
    test('render appropriate text', async () => {
      setup({})

      expect(await screen.findByText('This permission grants its assigned groups access to all of its collections')).toBeInTheDocument()
      expect(screen.getByText('This permission does not grant access to granules')).toBeInTheDocument()
    })
  })

  describe('when the permission does not have collection or granule access', () => {
    test('renders appropriate text', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: false,
                  granuleApplicable: false,
                  granuleIdentifier: null,
                  name: 'Mock Permission',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: null,
                    collections: null,
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission does not grant access to collections')).toBeInTheDocument()
      expect(screen.getByText('This permission does not grant access to granules')).toBeInTheDocument()
    })
  })

  describe('when the permission has collections associated', () => {
    test('renders collection with collection count', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                collections: {
                  __typename: 'CollectionList',
                  count: 2,
                  items: [
                    {
                      __typename: 'Collection',
                      conceptId: 'C1200450598-MMT_2',
                      shortName: 'Collection 1',
                      title: 'Mock collection 1',
                      version: '1'
                    },
                    {
                      __typename: 'Collection',
                      conceptId: 'C1200427406-MMT_2',
                      shortName: 'Collection 2',
                      title: 'Mock collection 2',
                      version: '1'
                    }
                  ]
                },
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission grants its assigned groups access to 2 collections')).toBeInTheDocument()

      expect(PermissionCollectionTable).toHaveBeenCalled(1)
    })
  })

  describe('when a collection and granule has access and temporal constraint ', () => {
    test('renders collection and granule text with access and temporal constraints', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: {
                      minValue: 1,
                      maxValue: 10000,
                      includeUndefinedValue: true
                    },
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'intersect'
                    }
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: {
                      minValue: 1,
                      maxValue: 100000,
                      includeUndefinedValue: true
                    },
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'intersect'
                    }
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission grants its assigned groups access to all of its collections that have access constraint values between 1 and 100000 (or are undefined) and that have a start and end date having some overlap with the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
      expect(screen.getByText('This permission grants its assigned groups access to granules that have access constraint values between 1 and 10000 (or are undefined) and that have a start and end date having some overlap with the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z that belong to any of its collections that have access constraint values between 1 and 100000 (or are undefined) and that have a start and end date having some overlap with the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
    })
  })

  describe('when a collection and granule has access and min and max values are equal', () => {
    test('renders collection and granule text with access and min and max values are equal', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: {
                      minValue: 1,
                      maxValue: 1,
                      includeUndefinedValue: true
                    },
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'contains'
                    }
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: {
                      minValue: 1,
                      maxValue: 1,
                      includeUndefinedValue: true
                    },
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'contains'
                    }
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission grants its assigned groups access to all of its collections that have access constraint values equal to 1 (or are undefined) and that have a start and end date contained within the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
      expect(screen.getByText('This permission grants its assigned groups access to granules that have access constraint values equal to 1 (or are undefined) and that have a start and end date contained within the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z that belong to any of its collections that have access constraint values equal to 1 (or are undefined) and that have a start and end date contained within the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
    })
  })

  describe('when a collection and granule only has access control', () => {
    test('renders collection and granule text with access constraints', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: {
                      minValue: 1,
                      maxValue: 1,
                      includeUndefinedValue: true
                    },
                    temporal: null
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: {
                      minValue: 1,
                      maxValue: 1,
                      includeUndefinedValue: true
                    },
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission grants its assigned groups access to all of its collections that have access constraint values equal to 1 (or are undefined)')).toBeInTheDocument()
      expect(screen.getByText('This permission grants its assigned groups access to granules that have access constraint values equal to 1 (or are undefined) that belong to any of its collections that have access constraint values equal to 1 (or are undefined)')).toBeInTheDocument()
    })
  })

  describe('when a collection and granule only has temporal', () => {
    test('renders collection and granule text with temporal constraints', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'disjoint'
                    }
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'contain'
                    }
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
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

      expect(await screen.findByText('This permission grants its assigned groups access to all of its collections that have a start and end date the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
      expect(screen.getByText('This permission grants its assigned groups access to granules that have a start and end date outside of the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z that belong to any of its collections that have a start and end date the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
    })
  })

  describe('when the permission has guest, registered, and a user group', () => {
    test('renders a link for the user group, but not guest and registered groups', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'disjoint'
                    }
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'contain'
                    }
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'null',
                      id: 'mock-id',
                      name: 'Administrator Group'
                    }
                  ]
                }
              }
            }
          }
        }]
      })

      const table = await screen.findByRole('table')
      const tableRows = within(table).getAllByRole('row')
      const row1 = tableRows[1]
      const row1Cells = within(row1).queryAllByRole('cell')

      expect(row1Cells[0].textContent).toBe('All Guest Users')
      expect(within(row1).queryByRole('link', { name: 'All Guest Users' })).not.toBeInTheDocument()

      const row2 = tableRows[2]
      const row2Cells = within(row2).queryAllByRole('cell')

      expect(row2Cells[0].textContent).toBe('All Registered Users')
      expect(within(row2).queryByRole('link', { name: 'All Registered Users' })).not.toBeInTheDocument()

      const row3 = tableRows[3]
      const row3Cells = within(row3).queryAllByRole('cell')

      expect(row3Cells[0].textContent).toBe('Administrator Group')
      const link = within(row3).getByRole('link', { name: 'Administrator Group' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/groups/mock-id')
    })
  })

  describe('when the permission has invalid group permission', () => {
    test('should remove the invalid group permission', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'ACL00000-CMR' }
          },
          result: {
            data: {
              acl: {
                __typename: 'Acl',
                conceptId: 'ACL00000-CMR',
                collections: null,
                identityType: 'Catalog Item',
                location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
                name: 'Mock Permission',
                providerIdentity: null,
                revisionId: 5,
                systemIdentity: null,
                catalogItemIdentity: {
                  __typename: 'CatalogItemIdentity',
                  collectionApplicable: true,
                  granuleApplicable: true,
                  granuleIdentifier: {
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'disjoint'
                    }
                  },
                  name: 'Mock collection',
                  providerId: 'MMT_2',
                  collectionIdentifier: {
                    __typename: 'CollectionIdentifier',
                    accessValue: null,
                    temporal: {
                      startDate: '2018-04-01T04:07:58Z',
                      stopDate: '2023-03-29T04:11:01Z',
                      mask: 'contain'
                    }
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
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: null,
                      id: null,
                      name: 'Mock invalid group permission',
                      tag: 'ABC'
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: null,
                      id: 'valid_id',
                      name: 'Mock valid group permission',
                      tag: 'ABC'
                    }
                  ]
                }
              }
            }
          }
        }]
      })

      const table = await screen.findByRole('table')
      const tableRows = within(table).getAllByRole('row')

      // One row for header and 3 rows for content
      expect(tableRows.length).toBe(4)

      const row1 = tableRows[1]
      const row1Cells = within(row1).queryAllByRole('cell')

      expect(row1Cells[0].textContent).toBe('All Guest Users')
      expect(within(row1).queryByRole('link', { name: 'All Guest Users' })).not.toBeInTheDocument()

      const row2 = tableRows[2]
      const row2Cells = within(row2).queryAllByRole('cell')

      expect(row2Cells[0].textContent).toBe('All Registered Users')
      expect(within(row2).queryByRole('link', { name: 'All Registered Users' })).not.toBeInTheDocument()

      const row3 = tableRows[3]
      const row3Cells = within(row3).queryAllByRole('cell')

      expect(row3Cells[0].textContent).toBe('Mock valid group permission')
      const link = within(row3).getByRole('link', { name: 'Mock valid group permission' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/groups/valid_id')

      const invalidGroup = screen.queryByText('Mock invalid group permission')
      expect(invalidGroup).not.toBeInTheDocument()
    })
  })

  describe('when the ACL is not found', () => {
    test('should show a notification and navigate to permissions page', async () => {
      const navigateSpy = vi.fn()

      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      vi.spyOn(router, 'useParams').mockReturnValue({ conceptId: 'NOT_FOUND_ACL' })

      const { notificationContext } = setup({
        overrideMocks: [{
          request: {
            query: GET_COLLECTION_PERMISSION,
            variables: { conceptId: 'NOT_FOUND_ACL' }
          },
          result: {
            data: {
              acl: null
            }
          }
        }]
      })

      await waitFor(() => {
        expect(notificationContext.addNotification).toHaveBeenCalledWith({
          message: 'NOT_FOUND_ACL was not found.',
          variant: 'danger'
        })
      })

      expect(navigateSpy).toHaveBeenCalledWith('/permissions')
    })
  })
})
