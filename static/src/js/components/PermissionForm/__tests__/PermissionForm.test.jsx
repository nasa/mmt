import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'

import * as router from 'react-router'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import Providers from '@/js/providers/Providers/Providers'

import useAvailableProviders from '@/js/hooks/useAvailableProviders'

import { CREATE_ACL } from '@/js/operations/mutations/createAcl'
import { UPDATE_ACL } from '@/js/operations/mutations/updateAcl'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import { GET_GROUPS } from '@/js/operations/queries/getGroups'
import { GET_PERMISSION_COLLECTIONS } from '@/js/operations/queries/getPermissionCollections'

import errorLogger from '@/js/utils/errorLogger'

import {
  GET_COLLECTION_FOR_PERMISSION_FORM
} from '@/js/operations/queries/getCollectionForPermissionForm'
import PermissionForm from '@/js/components/PermissionForm/PermissionForm'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import { ApolloClient, InMemoryCache } from '@apollo/client'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/hooks/useAvailableProviders')

useAvailableProviders.mockReturnValue({
  providerIds: ['MMT_1', 'MMT_2']
})

vi.spyOn(console, 'error').mockImplementation(() => {})

const setup = ({
  mocks = [],
  pageUrl
}) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <MockedProvider
        mocks={
          [{
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
          },
          ...mocks]
        }
      >
        <MemoryRouter initialEntries={[pageUrl]}>
          <Routes>
            <Route path="/permissions">
              <Route
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <PermissionForm selectedCollectionsPageSize={1} />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
                path="new"
              />
              <Route
                path=":conceptId/edit"
                element={
                  (
                    <ErrorBoundary>
                      <Suspense>
                        <PermissionForm selectedCollectionsPageSize={1} />
                      </Suspense>
                    </ErrorBoundary>
                  )
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </Providers>
  )

  return {
    user
  }
}

describe('PermissionForm', () => {
  describe('when creating a new permission', () => {
    describe('when filling out the form and submitting', () => {
      test('should navigate to /permissions/conceptId', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })
            },
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: {
                  params: {
                    provider: 'MMT_2',
                    limit: 100
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                      // Add more mock collections as needed
                    ],
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: CREATE_ACL,
                variables: {
                  catalogItemIdentity: {
                    name: 'Test Name',
                    providerId: 'MMT_2',
                    collectionApplicable: true,
                    granuleApplicable: true,
                    collectionIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    },
                    granuleIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    }
                  },
                  groupPermissions: [{
                    permissions: ['read'],
                    groupId: '1234-abcd-5678'
                  }, {
                    permissions: ['read'],
                    userType: 'registered'
                  }, {
                    permissions: ['read', 'order'],
                    userType: 'guest'
                  }]
                }
              },
              result: {
                data: {
                  createAcl: {
                    conceptId: 'ACL1000000-MMT',
                    revisionId: '1'
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 1,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C13000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 1',
                          entryTitle: 'Collection 2',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            }]
        })

        const checkbox = screen.getByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = screen.getByRole('textbox', { name: 'Name' })

        await user.type(nameField, 'Test Name')

        const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
        const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

        await user.type(minValue[0], '1')
        await user.type(maxValue[0], '10')

        await user.type(minValue[1], '1')
        await user.type(maxValue[1], '10')

        // Click MMT_2 in provider dropdown
        const combos = screen.getAllByRole('combobox', { hidden: true })
        await user.click(combos[0])
        const providerOption = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(providerOption)

        // Click group search
        await user.click(combos[4])
        const option = screen.getByRole('option', { name: 'Mock group MMT_2' })
        await user.click(option)
        await user.click(combos[4])

        const option2 = screen.getByRole('option', { name: 'All Registered Users' })
        await user.click(option2)

        await user.click(combos[5])
        const option3 = screen.getByRole('option', { name: 'All Guest User' })
        await user.click(option3)

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/permissions/ACL1000000-MMT')
      })

      test('should render error when fetchMore fails', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        setup({
          pageUrl: '/permissions/ACL1000000-MMT/edit',
          mocks: [{
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  identityType: 'Catalog Item',
                  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                  name: 'Mock ACL',
                  providerIdentity: null,
                  revisionId: 1,
                  systemIdentity: null,
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {},
                    collectionApplicable: true,
                    granuleApplicable: false,
                    granuleIdentifier: null,
                    providerId: 'MMT_2'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 2,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C12000000-MMT_2',
                        directDistributionInformation: null,
                        provider: 'MMT_2',
                        shortName: 'This is collection 2',
                        entryTitle: 'Collection 1',
                        version: '1'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: [
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'guest',
                        id: null,
                        name: null,
                        tag: null
                      },
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'registered',
                        id: null,
                        name: null,
                        tag: null
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 1,
                  limit: 1
                }
              }
            },
            error: new Error('An error occurred')
          }]
        })

        await waitFor(() => {
          expect(errorLogger).toHaveBeenCalledTimes(1)
        })

        expect(errorLogger).toHaveBeenCalledWith(
          'Error fetching more collection permissions',
          'PermissionForm: fetchData'
        )
      })
    })

    describe('when filling out the form and only filling out search and order permission and submitting', () => {
      test('should navigate to /permissions/conceptId', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })

            },
            {
              request: {
                query: CREATE_ACL,
                variables: {
                  catalogItemIdentity: {
                    collectionApplicable: true,
                    collectionIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    },
                    granuleApplicable: true,
                    granuleIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    },
                    name: 'Test Name',
                    providerId: 'MMT_2'
                  },
                  groupPermissions: [{
                    permissions: ['read', 'order'],
                    userType: 'guest'
                  }]
                }
              },
              result: {
                data: {
                  createAcl: {
                    conceptId: 'ACL1000000-MMT',
                    revisionId: '1'
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 1,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C13000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 1',
                          entryTitle: 'Collection 2',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            }]
        })

        const checkbox = screen.getByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        // Check the checkbox
        const nameField = screen.getByRole('textbox', { name: 'Name' })

        await user.type(nameField, 'Test Name')

        const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
        const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

        await user.type(minValue[0], '1')
        await user.type(maxValue[0], '10')

        await user.type(minValue[1], '1')
        await user.type(maxValue[1], '10')

        const combos = screen.getAllByRole('combobox', { hidden: true })

        // Clicks the searchAndOrderGroup field
        await user.click(combos[5])

        const option3 = screen.getByRole('option', { name: 'All Guest User' })
        await user.click(option3)

        // Clicks provider field
        await user.click(combos[0])
        const providerOption = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(providerOption)

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)
        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/permissions/ACL1000000-MMT')
      })
    })

    describe('when creating a new permission results in an error', () => {
      test('should call error logger', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })

            },
            {
              request: {
                query: CREATE_ACL,
                variables: {
                  catalogItemIdentity: {
                    collectionApplicable: true,
                    granuleApplicable: true,
                    name: 'Test Name',
                    providerId: 'MMT_2'
                  },
                  groupPermissions: [
                    {
                      permissions: ['read'],
                      groupId: '1234-abcd-5678'
                    },
                    {
                      permissions: ['read'],
                      userType: 'registered'
                    },
                    {
                      permissions: ['read', 'order'],
                      userType: 'guest'
                    }
                  ]
                }
              },
              error: new Error('An error occurred')
            }]
        })

        const checkbox = screen.getByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = screen.getByRole('textbox', { name: 'Name' })

        await user.type(nameField, 'Test Name')

        // Click group search field
        const combos = screen.getAllByRole('combobox', { hidden: true })
        await user.click(combos[4])

        const option = screen.getByRole('option', { name: 'Mock group MMT_2' })
        await user.click(option)
        await user.click(combos[4])

        // Click search, order field
        const option2 = screen.getByRole('option', { name: 'All Registered Users' })
        await user.click(option2)
        await user.click(combos[3])

        await user.click(combos[5])

        const option3 = screen.getByRole('option', { name: 'All Guest User' })
        await user.click(option3)

        // Clicks provider field
        await user.click(combos[0])
        const providerOption = screen.getByRole('option', { name: 'MMT_2' })
        await user.click(providerOption)

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          'Error creating collection permission',
          'PermissionForm: createAclMutation'
        )
      })
    })

    describe('when filling out the form and clicking on Clear', () => {
      test('should clear the form', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new'
        })

        const nameField = screen.getByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Test Name')

        const clearButton = screen.getByRole('button', { name: 'Clear' })
        await user.click(clearButton)

        expect(screen.getByRole('textbox', { name: 'Name' }))
      })
    })
  })

  describe('when getting and updating a collection permission', () => {
    describe('when getting a permission and updating results in a success', () => {
      test('should navigate to /permissions/conceptId', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { user } = setup({
          pageUrl: '/permissions/ACL1000000-MMT/edit',
          mocks: [
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 1,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        },
                        {
                          __typename: 'Collection',
                          conceptId: 'C13000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 1',
                          entryTitle: 'Collection 2',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: {
                  params: {
                    limit: 100,
                    provider: 'MMT_2'
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    count: 2,
                    items: [
                      {
                        conceptId: 'C1200444618-AMD_USAPDC',
                        directDistributionInformation: null,
                        shortName: 'USAP-1753101',
                        provider: 'AMD_USAPDC',
                        entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'C1200482349-ARCTEST',
                        directDistributionInformation: null,
                        shortName: 'USAP-1753101',
                        provider: 'ARCTEST',
                        entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: UPDATE_ACL,
                variables: {
                  catalogItemIdentity: {
                    name: 'Mock ACLUpdated Name',
                    providerId: 'MMT_2',
                    collectionApplicable: true,
                    granuleApplicable: false,
                    collectionIdentifier: { conceptIds: ['C12000000-MMT_2', 'C13000000-MMT_2'] }
                  },
                  conceptId: 'ACL1000000-MMT',
                  groupPermissions: [{
                    permissions: ['read'],
                    userType: 'guest'
                  }, {
                    permissions: ['read'],
                    userType: 'registered'
                  }]
                }
              },
              result: {
                data: {
                  updateAcl: {
                    conceptId: 'ACL1000000-MMT',
                    revisionId: '2'
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 1,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C13000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 1',
                          entryTitle: 'Collection 2',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            }

          ]
        })

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        await waitFor(async () => {
          expect(await screen.findByText(/Showing selected 2 items/)).toBeInTheDocument()
        })

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(navigateSpy).toHaveBeenCalledTimes(1)
        expect(navigateSpy).toHaveBeenCalledWith('/permissions/ACL1000000-MMT')
      })
    })

    describe('when getting a permission and updating results in a failure', () => {
      test('should call errorLogger', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

        const { user } = setup({
          pageUrl: '/permissions/ACL1000000-MMT/edit',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: {
                  params: {
                    provider: 'MMT_2',
                    limit: 100
                  }
                }
              },
              result: {
                data: {
                  collections: {
                    items: [],
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: null,
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: 'MMT'
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read', 'order'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read', 'order'
                          ],
                          userType: null,
                          id: '1234-abcd-5678-efgh',
                          name: 'Mock group',
                          tag: 'MMT'
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: null,
                          id: '1234-abcd-5678',
                          name: 'Mock group2',
                          tag: 'MMT'
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: {}
              },
              result: {
                data: {
                  collections: {
                    count: 2,
                    items: [
                      {
                        conceptId: 'C1200444618-AMD_USAPDC',
                        directDistributionInformation: null,
                        shortName: 'USAP-1753101',
                        provider: 'AMD_USAPDC',
                        entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'C1200482349-ARCTEST',
                        directDistributionInformation: null,
                        shortName: 'USAP-1753101',
                        provider: 'ARCTEST',
                        entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              }
            },
            {
              request: {
                query: UPDATE_ACL,
                variables: {
                  catalogItemIdentity: {
                    name: 'Mock ACLUpdated Name',
                    providerId: 'MMT_2',
                    collectionApplicable: true,
                    granuleApplicable: false,
                    collectionIdentifier: {
                      conceptIds: []
                    }
                  },
                  conceptId: 'ACL1000000-MMT',
                  groupPermissions: [{
                    permissions: ['read'],
                    userType: 'guest'
                  }, {
                    permissions: ['read'],
                    groupId: '1234-abcd-5678'
                  }, {
                    permissions: ['read', 'order'],
                    userType: 'registered'
                  }, {
                    permissions: ['read', 'order'],
                    groupId: '1234-abcd-5678-efgh'
                  }]
                }
              },
              error: new Error('An error occurred')
            }
          ]
        })

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(errorLogger).toHaveBeenCalledWith('Error creating collection permission', 'PermissionForm: updateAclMutation')
      })
    })
  })

  describe('form validation', () => {
    describe('when min value is larger than max value', () => {
      test('render error', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [{
            request: {
              query: GET_PERMISSION_COLLECTIONS,
              variables: {
                params: {
                  provider: undefined,
                  limit: 100
                }
              }
            },
            result: {
              data: {
                collections: {
                  items: [
                    // Your mock collection items here
                  ],
                  __typename: 'CollectionList'
                }
              }
            }
          }]
        })

        const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        const granuleCheckbox = screen.getByRole('checkbox', { name: 'Granules' })

        await user.type(nameField, 'Test Name')
        await user.click(granuleCheckbox)

        const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
        const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

        // Fills out collection field
        await user.type(minValue[0], '10')
        await user.type(maxValue[0], '5')

        // Fills out granule field
        await user.type(minValue[1], '1')
        await user.type(maxValue[1], '10')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(await screen.findByText('Minimum value should be less than Maximum value')).toBeInTheDocument()
      })
    })

    describe('when granule min value is larger than max value', () => {
      test('render min max error', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })
            }]
        })

        const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = await screen.findByRole('textbox', { name: 'Name' })

        await user.type(nameField, 'Test Name')

        const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
        const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

        // Fills out collection field
        await user.type(minValue[0], '1')
        await user.type(maxValue[0], '5')

        // Fills out granule field
        await user.type(minValue[1], '10')
        await user.type(maxValue[1], '5')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(await screen.findByText('Minimum value should be less than Maximum value')).toBeInTheDocument()
      })
    })

    describe('when collection start date is larger than stop date', () => {
      test('renders start date is larger error', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [{
            request: {
              query: GET_PERMISSION_COLLECTIONS,
              variables: {
                params: {
                  provider: undefined,
                  limit: 100
                }
              }
            },
            result: {
              data: {
                collections: {
                  items: [
                    // Your mock collection items here
                  ],
                  __typename: 'CollectionList'
                }
              }
            }
          }]
        })

        const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        const granuleCheckbox = screen.getByRole('checkbox', { name: 'Granules' })

        await user.type(nameField, 'Test Name')
        await user.click(granuleCheckbox)

        const startDate = screen.getAllByRole('textbox', { name: 'Start Date' })
        const stopDate = screen.getAllByRole('textbox', { name: 'Stop Date' })

        // Fills out collection field
        await user.type(startDate[0], '2024-06-06T00:00:00.000Z')
        await user.type(stopDate[0], '2024-06-04T00:00:00.000Z')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(await screen.findByText('Start date should be earlier than Stop date')).toBeInTheDocument()
      })
    })

    describe('when granule start date is larger than stop date', () => {
      test('renders granules start date is larger error', async () => {
        const { user } = setup({
          pageUrl: '/permissions/new',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })
            }]
        })

        const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
        await user.click(checkbox)

        const nameField = await screen.findByRole('textbox', { name: 'Name' })

        await user.type(nameField, 'Test Name')

        const startDate = screen.getAllByRole('textbox', { name: 'Start Date' })
        const stopDate = screen.getAllByRole('textbox', { name: 'Stop Date' })

        // Fills out granule field
        await user.type(startDate[1], '2024-06-06T00:00:00.000Z')
        await user.type(stopDate[1], '2024-06-04T00:00:00.000Z')

        const submitButton = screen.getByRole('button', { name: 'Submit' })
        await user.click(submitButton)

        expect(await screen.findByText('Start date should be earlier than Stop date')).toBeInTheDocument()
      })
    })
  })

  describe('PermissionForm Modal', () => {
    let user
    beforeEach(() => {
      const navigateSpy = vi.fn()
      vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      const setupResult = setup({
        pageUrl: '/permissions/ACL1000000-MMT/edit',
        mocks: [
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  identityType: 'Catalog Item',
                  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                  name: 'Mock ACL',
                  providerIdentity: null,
                  revisionId: 1,
                  systemIdentity: null,
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    },
                    granuleIdentifier: {
                      accessValue: {
                        maxValue: 10,
                        minValue: 1
                      }
                    },
                    collectionApplicable: true,
                    granuleApplicable: true,
                    providerId: 'MMT_2'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 1,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C12000000-MMT_2',
                        directDistributionInformation: null,
                        provider: 'MMT_2',
                        shortName: 'This is collection 2',
                        entryTitle: 'Collection 1',
                        version: '1'
                      },
                      {
                        __typename: 'Collection',
                        conceptId: 'C13000000-MMT_2',
                        directDistributionInformation: null,
                        provider: 'MMT_2',
                        shortName: 'This is collection 1',
                        entryTitle: 'Collection 2',
                        version: '1'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: [
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'guest',
                        id: null,
                        name: null,
                        tag: null
                      },
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'registered',
                        id: null,
                        name: null,
                        tag: null
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            request: {
              query: GET_PERMISSION_COLLECTIONS,
              variables: {
                params: {
                  limit: 100,
                  provider: 'MMT_2'
                }
              }
            },
            result: {
              data: {
                collections: {
                  count: 2,
                  items: [
                    {
                      conceptId: 'C1200444618-AMD_USAPDC',
                      directDistributionInformation: null,
                      shortName: 'USAP-1753101',
                      provider: 'AMD_USAPDC',
                      entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                      __typename: 'Collection'
                    },
                    {
                      conceptId: 'C1200482349-ARCTEST',
                      directDistributionInformation: null,
                      shortName: 'USAP-1753101',
                      provider: 'ARCTEST',
                      entryTitle: '"The Omnivores Dilemma": The Effect of Autumn Diet on Winter Physiology and Condition of Juvenile Antarctic Krill',
                      __typename: 'Collection'
                    }
                  ],
                  __typename: 'CollectionList'
                }
              }
            }
          },
          {
            request: {
              query: UPDATE_ACL,
              variables: {
                catalogItemIdentity: {
                  name: 'Mock ACLUpdated Name',
                  providerId: 'MMT_2',
                  collectionApplicable: true,
                  granuleApplicable: false,
                  collectionIdentifier: { conceptIds: ['C12000000-MMT_2', 'C13000000-MMT_2'] }
                },
                conceptId: 'ACL1000000-MMT',
                groupPermissions: [{
                  permissions: ['read'],
                  userType: 'guest'
                }, {
                  permissions: ['read'],
                  userType: 'registered'
                }]
              }
            },
            result: {
              data: {
                updateAcl: {
                  conceptId: 'ACL1000000-MMT',
                  revisionId: '2'
                }
              }
            }
          },
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  identityType: 'Catalog Item',
                  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                  name: 'Mock ACL',
                  providerIdentity: null,
                  revisionId: 1,
                  systemIdentity: null,
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {},
                    collectionApplicable: true,
                    granuleApplicable: false,
                    granuleIdentifier: null,
                    providerId: 'MMT_2'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 2,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C12000000-MMT_2',
                        directDistributionInformation: null,
                        provider: 'MMT_2',
                        shortName: 'This is collection 2',
                        entryTitle: 'Collection 1',
                        version: '1'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: [
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'guest',
                        id: null,
                        name: null,
                        tag: null
                      },
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'registered',
                        id: null,
                        name: null,
                        tag: null
                      }
                    ]
                  }
                }
              }
            }
          },
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 1,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  identityType: 'Catalog Item',
                  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                  name: 'Mock ACL',
                  providerIdentity: null,
                  revisionId: 1,
                  systemIdentity: null,
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {},
                    collectionApplicable: true,
                    granuleApplicable: false,
                    granuleIdentifier: null,
                    providerId: 'MMT_2'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 2,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C13000000-MMT_2',
                        directDistributionInformation: null,
                        provider: 'MMT_2',
                        shortName: 'This is collection 1',
                        entryTitle: 'Collection 2',
                        version: '1'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: [
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'guest',
                        id: null,
                        name: null,
                        tag: null
                      },
                      {
                        __typename: 'AclGroup',
                        permissions: [
                          'read'
                        ],
                        userType: 'registered',
                        id: null,
                        name: null,
                        tag: null
                      }
                    ]
                  }
                }
              }
            }
          }

        ]
      })
      user = setupResult.user
    })

    test('shows confirmation modal when switching to All Collections with existing data', async () => {
      const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
      await user.click(checkbox)

      // Check if the confirmation modal is shown
      expect(screen.getByText(/Checking "All Collections" will remove/)).toBeInTheDocument()
    })

    test('handleConfirmAllCollection deletes fields and updates form data', async () => {
      const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
      await user.click(checkbox)

      const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
      const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

      expect(minValue[0]).toHaveValue('1')
      expect(maxValue[0]).toHaveValue('10')

      // Confirm the modal
      const confirmButton = screen.getByRole('button', { name: 'Yes' })
      await user.click(confirmButton)

      expect(minValue[0]).toHaveValue('')
      expect(maxValue[0]).toHaveValue('')
    })

    test('handleCancelAllCollection sets allCollection to false and closes modal', async () => {
      const checkbox = await screen.findByRole('checkbox', { name: 'All Collections' })
      await user.click(checkbox)

      // Cancel the modal
      const cancelButton = screen.getByRole('button', { name: 'No' })
      await user.click(cancelButton)

      // Check if the checkbox is unchecked and the fields are still there
      expect(checkbox).not.toBeChecked()

      const maxValue = screen.getAllByRole('textbox', { name: 'Maximum Value' })
      const minValue = screen.getAllByRole('textbox', { name: 'Minimum Value' })

      expect(minValue[0]).toHaveValue('1')
      expect(maxValue[0]).toHaveValue('10')
    })
  })

  describe('collection selection handling', () => {
    test('sets allCollection to false when hasCollectionIdentifier is true', async () => {
      setup({
        pageUrl: '/permissions/ACL1000000-MMT/edit',
        mocks: [
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {
                      conceptIds: ['C1234-TEST']
                    },
                    providerId: 'TEST_PROVIDER'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 1,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C1234-TEST',
                        shortName: 'Test Collection'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: []
                  }
                }
              }
            }
          }
        ]
      })

      await waitFor(() => {
        const allCollectionsCheckbox = screen.getByRole('checkbox', { name: 'All Collections' })
        expect(allCollectionsCheckbox).not.toBeChecked()
      })
    })

    test('sets allCollection to true when hasCollectionIdentifier is false', async () => {
      setup({
        pageUrl: '/permissions/ACL1000000-MMT/edit',
        mocks: [
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: null,
                    providerId: 'TEST_PROVIDER'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 0,
                    items: []
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: []
                  }
                }
              }
            }
          }
        ]
      })

      await waitFor(() => {
        const allCollectionsCheckbox = screen.getByRole('checkbox', { name: 'All Collections' })
        expect(allCollectionsCheckbox).toBeChecked()
      })

      // Optionally, you can also check that the selectedCollections are empty
      const selectedCollectionsSection = screen.queryByText('Selected Collections')
      expect(selectedCollectionsSection).not.toBeInTheDocument()
    })

    test('shows confirmation modal when switching to All Collections with existing filters', async () => {
      const { user } = setup({
        pageUrl: '/permissions/ACL1000000-MMT/edit',
        mocks: [
          {
            request: {
              query: GET_COLLECTION_FOR_PERMISSION_FORM,
              variables: {
                conceptId: 'ACL1000000-MMT',
                params: {
                  offset: 0,
                  limit: 1
                }
              }
            },
            result: {
              data: {
                acl: {
                  __typename: 'Acl',
                  conceptId: 'ACL1000000-CMR',
                  catalogItemIdentity: {
                    __typename: 'CatalogItemIdentity',
                    collectionIdentifier: {
                      conceptIds: ['C1234-TEST']
                    },
                    providerId: 'TEST_PROVIDER'
                  },
                  collections: {
                    __typename: 'CollectionList',
                    count: 1,
                    items: [
                      {
                        __typename: 'Collection',
                        conceptId: 'C1234-TEST',
                        shortName: 'Test Collection'
                      }
                    ]
                  },
                  groups: {
                    __typename: 'AclGroupList',
                    items: []
                  }
                }
              }
            }
          }
        ]
      })

      // Wait for the form to load
      await waitFor(() => {
        expect(screen.getByRole('checkbox', { name: 'All Collections' })).toBeInTheDocument()
      })

      // Add a filter
      const minValueInput = screen.getAllByRole('textbox', { name: 'Minimum Value' })[0]
      await user.type(minValueInput, '10')

      // Click "All Collections" checkbox
      const allCollectionsCheckbox = screen.getByRole('checkbox', { name: 'All Collections' })
      await user.click(allCollectionsCheckbox)

      // Check if the confirmation modal is shown
      await waitFor(() => {
        expect(screen.getByText(/Checking "All Collections" will remove/)).toBeInTheDocument()
      })
    })
  })

  describe('form validation', () => {
    describe('when invalid group permission occur', () => {
      test('should remove the invalid group permission', async () => {
        const navigateSpy = vi.fn()
        vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)
        vi.spyOn(console, 'warn').mockImplementation(() => {})

        const { user } = setup({
          pageUrl: '/permissions/ACL1000000-MMT/edit',
          mocks: [
            {
              request: {
                query: GET_PERMISSION_COLLECTIONS,
                variables: ({ params }) => params.limit === 100
              },
              result: ({ variables }) => ({
                data: {
                  collections: {
                    items: [
                      {
                        conceptId: 'MOCK_CONCEPT_ID_1',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_1',
                        provider: variables.params.provider || 'MOCK_PROVIDER_1',
                        entryTitle: 'MOCK_ENTRY_TITLE_1',
                        __typename: 'Collection'
                      },
                      {
                        conceptId: 'MOCK_CONCEPT_ID_2',
                        directDistributionInformation: null,
                        shortName: 'MOCK_SHORT_NAME_2',
                        provider: variables.params.provider || 'MOCK_PROVIDER_2',
                        entryTitle: 'MOCK_ENTRY_TITLE_2',
                        __typename: 'Collection'
                      }
                    ],
                    __typename: 'CollectionList'
                  }
                }
              })

            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: null,
                          id: null,
                          name: 'Mock invalid group permission',
                          tag: 'ABC'
                        },
                        {
                          __typename: 'AclGroup',
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
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 0,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C12000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 2',
                          entryTitle: 'Collection 1',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            },
            {
              request: {
                query: GET_COLLECTION_FOR_PERMISSION_FORM,
                variables: {
                  conceptId: 'ACL1000000-MMT',
                  params: {
                    offset: 1,
                    limit: 1
                  }
                }
              },
              result: {
                data: {
                  acl: {
                    __typename: 'Acl',
                    conceptId: 'ACL1000000-CMR',
                    identityType: 'Catalog Item',
                    location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL1200427411-CMR',
                    name: 'Mock ACL',
                    providerIdentity: null,
                    revisionId: 1,
                    systemIdentity: null,
                    catalogItemIdentity: {
                      __typename: 'CatalogItemIdentity',
                      collectionIdentifier: {},
                      collectionApplicable: true,
                      granuleApplicable: false,
                      granuleIdentifier: null,
                      providerId: 'MMT_2'
                    },
                    collections: {
                      __typename: 'CollectionList',
                      count: 2,
                      items: [
                        {
                          __typename: 'Collection',
                          conceptId: 'C13000000-MMT_2',
                          directDistributionInformation: null,
                          provider: 'MMT_2',
                          shortName: 'This is collection 1',
                          entryTitle: 'Collection 2',
                          version: '1'
                        }
                      ]
                    },
                    groups: {
                      __typename: 'AclGroupList',
                      items: [
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'guest',
                          id: null,
                          name: null,
                          tag: null
                        },
                        {
                          __typename: 'AclGroup',
                          permissions: [
                            'read'
                          ],
                          userType: 'registered',
                          id: null,
                          name: null,
                          tag: null
                        }
                      ]
                    }
                  }
                }
              }
            }
          ]
        })

        const nameField = await screen.findByRole('textbox', { name: 'Name' })
        await user.type(nameField, 'Updated Name')

        const invalidGroup = screen.queryByText('Mock invalid group permission')
        expect(invalidGroup).toBeNull()

        // Const validGroup = screen.queryByText('Mock valid group permission')
        // expect(validGroup).toBeInTheDocument()
      })
    })
  })
})
