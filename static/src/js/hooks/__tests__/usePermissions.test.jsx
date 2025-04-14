import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_PERMISSIONS } from '@/js/operations/queries/getPermissions'

import AuthContext from '@/js/context/AuthContext'

import usePermissions from '../usePermissions'

const TestComponent = () => {
  const { hasSystemGroup, hasSystemKeywords, loading } = usePermissions({
    systemGroup: ['read'],
    systemKeywords: ['read']
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
    </div>
  )
}

const setup = ({
  overrideMocks,
  overrideMockAuthContext
}) => {
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
            systemObject: 'KEYWORDS',
            userId: 'mock-user'
          }
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
                systemObject: 'KEYWORDS',
                permissions: [
                  'read',
                  'create'
                ],
                __typename: 'Permission'
              }
            ],
            __typename: 'PermissionList'
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
        <TestComponent />
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
                    systemObject: 'KEYWORDS',
                    userId: 'mock-user'
                  }
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
                        systemObject: 'KEYWORDS',
                        permissions: [],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
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
                    systemObject: 'KEYWORDS',
                    userId: 'mock-user'
                  }
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
                        systemObject: 'KEYWORDS',
                        permissions: [],
                        __typename: 'Permission'
                      }
                    ],
                    __typename: 'PermissionList'
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
                  systemObject: 'KEYWORDS',
                  userId: 'mock-user'
                }
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
                      systemObject: 'KEYWORDS',
                      permissions: ['read'],
                      __typename: 'Permission'
                    }
                  ],
                  __typename: 'PermissionList'
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
                  systemObject: 'KEYWORDS',
                  userId: 'mock-user'
                }
              }
            },
            result: {
              data: {
                groupPermissions: null,
                keywordsPermissions: null
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
