import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_PERMISSIONS } from '@/js/operations/queries/getPermissions'

import AuthContext from '@/js/context/AuthContext'

import usePermissions from '../usePermissions'

import * as getConfig from '../../../../../sharedUtils/getConfig'

const TestComponent = ({ hookProps = {} }) => {
  const {
    systemGroup = ['read'],
    systemKeywords = ['read'],
    ...restHookProps
  } = hookProps

  const {
    hasSystemGroup,
    hasSystemKeywords,
    hasProviderPermissions,
    loading
  } = usePermissions({
    systemGroup,
    systemKeywords,
    ...restHookProps
  })

  return (
    <div>
      {
        loading && (
          <span>Loading</span>
        )
      }
      {
        hasSystemGroup && (
          <span>
            hasSystemGroup is true
          </span>
        )
      }
      {
        !hasSystemGroup && (
          <span>
            hasSystemGroup is false
          </span>
        )
      }
      {
        hasSystemKeywords && (
          <span>hasSystemKeywords is true</span>
        )
      }
      {
        !hasSystemKeywords && (
          <span>hasSystemKeywords is false</span>
        )
      }
      {
        hasProviderPermissions && (
          <span>hasProviderPermissions is true</span>
        )
      }
      {
        !hasProviderPermissions && (
          <span>hasProviderPermissions is false</span>
        )
      }
    </div>
  )
}

const setup = ({
  overrideMocks,
  overrideMockAuthContext,
  hookProps
} = {}) => {
  const mocks = [
    {
      request: {
        query: GET_PERMISSIONS,
        variables: {
          groupPermissionParams: {
            systemObject: 'GROUP',
            userId: 'mock-user'
          },
          keywordsPermissionParams: {
            systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
            userId: 'mock-user'
          },
          providerPermissionParams: null
        }
      },
      result: {
        data: {
          groupPermissions: {
            count: 1,
            items: [
              {
                systemObject: 'GROUP',
                permissions: [
                  'read',
                  'create'
                ],
                __typename: 'Permission'
              }
            ],
            __typename: 'PermissionList'
          },
          keywordsPermissions: {
            count: 1,
            items: [
              {
                systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                permissions: [
                  'read',
                  'create'
                ],
                __typename: 'Permission'
              }
            ],
            __typename: 'PermissionList'
          },
          providerPermissions: {
            count: 0,
            items: []
          }
        }
      }
    }
  ]

  const mockAuthContext = {
    user: { uid: 'mock-user' }
  }

  render(
    <AuthContext.Provider value={overrideMockAuthContext || mockAuthContext}>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <TestComponent hookProps={hookProps} />
      </MockedProvider>
    </AuthContext.Provider>
  )
}

describe('usePermissions', () => {
  describe('systemGroup', () => {
    describe('when the user has the given permission', () => {
      test('returns true', async () => {
        setup({})

        expect(screen.getByText('Loading')).toBeInTheDocument()

        expect(await screen.findByText('hasSystemGroup is true')).toBeInTheDocument()
        expect(screen.queryByText('hasSystemGroup is false')).not.toBeInTheDocument()
      })
    })

    describe('when the user does not have the given permission', () => {
      test('returns false', async () => {
        setup({
          overrideMocks: [
            {
              request: {
                query: GET_PERMISSIONS,
                variables: {
                  groupPermissionParams: {
                    systemObject: 'GROUP',
                    userId: 'mock-user'
                  },
                  keywordsPermissionParams: {
                    systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                    userId: 'mock-user'
                  },
                  providerPermissionParams: null
                }
              },
              result: {
                data: {
                  groupPermissions: {
                    count: 1,
                    items: [
                      {
                        systemObject: 'GROUP',
                        permissions: [],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
                  },
                  keywordsPermissions: {
                    count: 1,
                    items: [
                      {
                        systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                        permissions: [],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
                  },
                  providerPermissions: {
                    count: 0,
                    items: []
                  }
                }
              }
            }
          ]
        })

        expect(screen.getByText('Loading')).toBeInTheDocument()

        expect(await screen.findByText('hasSystemGroup is false')).toBeInTheDocument()
        expect(screen.queryByText('hasSystemGroup is true')).not.toBeInTheDocument()
      })
    })
  })

  describe('systemKeywords', () => {
    describe('when the user has the given keyword permission', () => {
      test('returns true', async () => {
        setup({})

        expect(screen.getByText('Loading')).toBeInTheDocument()

        expect(await screen.findByText('hasSystemKeywords is true')).toBeInTheDocument()
        expect(screen.queryByText('hasSystemKeywords is false')).not.toBeInTheDocument()
      })
    })

    describe('when the user does not have the given keyword permission', () => {
      test('returns false', async () => {
        vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
          env: 'production'
        }))

        setup({
          overrideMocks: [
            {
              request: {
                query: GET_PERMISSIONS,
                variables: {
                  groupPermissionParams: {
                    systemObject: 'GROUP',
                    userId: 'mock-user'
                  },
                  keywordsPermissionParams: {
                    systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                    userId: 'mock-user'
                  },
                  providerPermissionParams: null
                }
              },
              result: {
                data: {
                  groupPermissions: {
                    count: 1,
                    items: [
                      {
                        systemObject: 'GROUP',
                        permissions: ['read'],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
                  },
                  keywordsPermissions: {
                    count: 1,
                    items: [
                      {
                        systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                        permissions: [],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
                  },
                  providerPermissions: {
                    count: 0,
                    items: []
                  }
                }
              }
            }
          ]
        })

        expect(screen.getByText('Loading')).toBeInTheDocument()

        expect(await screen.findByText('hasSystemKeywords is false')).toBeInTheDocument()
        expect(screen.queryByText('hasSystemKeywords is true')).not.toBeInTheDocument()
      })
    })
  })

  describe('providerPermissionParams', () => {
    test('returns true when the ACL exists', async () => {
      setup({
        hookProps: {
          systemGroup: null,
          systemKeywords: null,
          providerPermissionParams: {
            target: 'NON_NASA_DRAFT_USER'
          }
        },
        overrideMocks: [
          {
            request: {
              query: GET_PERMISSIONS,
              variables: {
                groupPermissionParams: null,
                keywordsPermissionParams: null,
                providerPermissionParams: {
                  target: 'NON_NASA_DRAFT_USER',
                  userId: 'mock-user'
                }
              }
            },
            result: {
              data: {
                groupPermissions: {
                  count: 0,
                  items: []
                },
                keywordsPermissions: {
                  count: 0,
                  items: []
                },
                providerPermissions: {
                  count: 1,
                  items: [
                    {
                      conceptId: null,
                      systemObject: null,
                      target: 'NON_NASA_DRAFT_USER',
                      permissions: [
                        'read',
                        'create',
                        'update',
                        'delete'
                      ],
                      __typename: 'Permission'
                    }
                  ]
                }
              }
            }
          }
        ]
      })

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(await screen.findByText('hasProviderPermissions is true')).toBeInTheDocument()
    })

    test('returns false when the ACL is missing', async () => {
      setup({
        hookProps: {
          systemGroup: null,
          systemKeywords: null,
          providerPermissionParams: {
            target: 'NON_NASA_DRAFT_USER'
          }
        },
        overrideMocks: [
          {
            request: {
              query: GET_PERMISSIONS,
              variables: {
                groupPermissionParams: null,
                keywordsPermissionParams: null,
                providerPermissionParams: {
                  target: 'NON_NASA_DRAFT_USER',
                  userId: 'mock-user'
                }
              }
            },
            result: {
              data: {
                groupPermissions: {
                  count: 0,
                  items: []
                },
                keywordsPermissions: {
                  count: 0,
                  items: []
                },
                providerPermissions: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(screen.getByText('Loading')).toBeInTheDocument()
      expect(await screen.findByText('hasProviderPermissions is false')).toBeInTheDocument()
    })
  })

  describe('when both systemGroup and systemKeywords are provided', () => {
    test('returns correct values for both', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_PERMISSIONS,
              variables: {
                groupPermissionParams: {
                  systemObject: 'GROUP',
                  userId: 'mock-user'
                },
                keywordsPermissionParams: {
                  systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                  userId: 'mock-user'
                },
                providerPermissionParams: null
              }
            },
            result: {
              data: {
                groupPermissions: {
                  count: 1,
                  items: [
                    {
                      systemObject: 'GROUP',
                      permissions: ['read'],
                      __typename: 'Permission'
                    }
                  ],
                  __typename: 'PermissionList'
                },
                keywordsPermissions: {
                  count: 1,
                  items: [
                    {
                      systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                      permissions: ['read'],
                      __typename: 'Permission'
                    }
                  ],
                  __typename: 'PermissionList'
                },
                providerPermissions: {
                  count: 0,
                  items: []
                }
              }
            }
          }
        ]
      })

      expect(screen.getByText('Loading')).toBeInTheDocument()

      expect(await screen.findByText('hasSystemGroup is true')).toBeInTheDocument()
      expect(screen.queryByText('hasSystemGroup is false')).not.toBeInTheDocument()
      expect(await screen.findByText('hasSystemKeywords is true')).toBeInTheDocument()
      expect(screen.queryByText('hasSystemKeywords is false')).not.toBeInTheDocument()
    })
  })

  describe('when the data is loading', () => {
    test('returns loading true', async () => {
      setup({
        overrideMocks: [
          {
            request: {
              query: GET_PERMISSIONS,
              variables: {
                groupPermissionParams: {
                  systemObject: 'GROUP',
                  userId: 'mock-user'
                },
                keywordsPermissionParams: {
                  systemObject: 'KEYWORD_MANAGEMENT_SYSTEM',
                  userId: 'mock-user'
                },
                providerPermissionParams: null
              }
            },
            result: {
              data: {
                groupPermissions: null,
                keywordsPermissions: null,
                providerPermissions: null
              }
            }
          }
        ]
      })

      expect(screen.getByText('Loading')).toBeInTheDocument()
    })
  })

  describe('when the user is not logged in', () => {
    test('loading is set to false and the items are displayed', async () => {
      setup({
        overrideMocks: [],
        overrideMockAuthContext: { user: undefined }
      })

      expect(screen.queryByText('Loading')).not.toBeInTheDocument()

      expect(await screen.findByText('hasSystemGroup is false')).toBeInTheDocument()
      expect(await screen.findByText('hasSystemKeywords is false')).toBeInTheDocument()

      expect(screen.queryByText('hasSystemGroup is true')).not.toBeInTheDocument()
      expect(screen.queryByText('hasSystemKeywords is true')).not.toBeInTheDocument()
    })
  })
})
