import AppContext from '@/js/context/AppContext'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import userEvent from '@testing-library/user-event'

import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

import Permission from '../Permission'
import PermissionCollectionTable from '../../permissionCollectionTable/PermissionCollectionTable'

vi.mock('../../permissionCollectionTable/PermissionCollectionTable')

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
          group: null,
          id: null,
          name: null
        },
        {
          __typename: 'GroupPermission',
          permissions: [
            'read'
          ],
          userType: 'registered',
          group: null,
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

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        }
      }
    }
    >

      <MockedProvider
        mocks={overrideMocks || mocks}
      >
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
      </MockedProvider>

    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('Permission', () => {
  describe('when the permission has all collection or granule access', () => {
    test('render appropriate text', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('This permission grants its assigned groups access to all of its collections')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(screen.getByText('This permission does not grant access to collections')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(PermissionCollectionTable).toHaveBeenCalled(1)

      expect(screen.getByText('This permission grants its assigned groups access to 2 collections')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(screen.getByText('This permission grants its assigned groups access to all of its collections that have access constraint values between 1 and 100000 (or are undefined) and that have a start and end date having some overlap with the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(screen.getByText('This permission grants its assigned groups access to all of its collections that have access constraint values equal to 1 (or are undefined) and that have a start and end date contained within the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(screen.getByText('This permission grants its assigned groups access to all of its collections that have access constraint values equal to 1 (or are undefined)')).toBeInTheDocument()
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
                      group: null,
                      id: null,
                      name: null
                    },
                    {
                      __typename: 'GroupPermission',
                      permissions: [
                        'read'
                      ],
                      userType: 'registered',
                      group: null,
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

      await waitForResponse()

      expect(screen.getByText('This permission grants its assigned groups access to all of its collections that have a start and end date the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
      expect(screen.getByText('This permission grants its assigned groups access to granules that have a start and end date outside of the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z that belong to any of its collections that have a start and end date the date range 2018-04-01T04:07:58Z to 2023-03-29T04:11:01Z')).toBeInTheDocument()
    })
  })
})
