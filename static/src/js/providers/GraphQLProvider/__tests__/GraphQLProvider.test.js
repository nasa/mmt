import React from 'react'
import { render } from '@testing-library/react'
import {
  ApolloClient,
  ApolloLink,
  createHttpLink
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'
import GraphQLProvider from '../GraphQLProvider'
import AppContextProvider from '../../AppContextProvider/AppContextProvider'
import AuthContext from '../../../context/AuthContext'

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  __esModule: true,
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(() => ({ mockCache: {} })),
  ApolloProvider: jest.fn(({ children }) => children),
  createHttpLink: jest.fn(
    (args) => jest.requireActual('@apollo/client').createHttpLink(args)
  )
}))

jest.mock('@apollo/client/link/context', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client/link/context'),
  setContext: jest.fn(
    (args) => jest.requireActual('@apollo/client/link/context').setContext(args)
  )
}))

jest.mock('../../../context/AuthContext', () => ({
  __esModule: true,
  default: jest.requireActual('react').createContext()
}))

global.fetch = jest.fn()

jest.mock('../../../utils/getConfig', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/getConfig'),
  getApplicationConfig: jest.fn(() => ({
    graphQlHost: 'http://graphqlhost.com/dev/api'
  }))
}))

const defaultAuthContext = {
  login: jest.fn(),
  logout: jest.fn(),
  setUser: jest.fn(),
  user: {
    name: 'User Name',
    auid: 'username',
    token: {
      tokenValue: 'launchpad_token',
      tokenExp: 1234
    }
  }
}

const setup = (authContextOverride) => {
  const { rerender } = render(
    <AuthContext.Provider value={
      {
        ...defaultAuthContext,
        ...authContextOverride
      }
    }
    >
      <AppContextProvider>
        <GraphQLProvider>
          <div />
        </GraphQLProvider>
      </AppContextProvider>
    </AuthContext.Provider>
  )

  return {
    rerender
  }
}

describe('GraphQLProvider component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when the token exists', () => {
    test('creates the ApolloClient', async () => {
      setup()

      expect(ApolloClient).toHaveBeenCalledTimes(1)
      expect(ApolloClient).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            cache: { mockCache: {} },
            defaultOptions: {
              query: {
                fetchPolicy: 'no-cache'
              },
              watchQuery: {
                fetchPolicy: 'no-cache'
              }
            },
            link: expect.any(ApolloLink)
          }
        )
      )

      // Check that createHttpLink is called properly
      expect(createHttpLink).toHaveBeenCalledTimes(1)
      expect(createHttpLink).toHaveBeenCalledWith({
        uri: 'http://graphqlhost.com/dev/api'
      })

      // Check that the authLink is called properly
      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext.mock.calls[0][0](null, {})).toEqual({ headers: { Authorization: 'launchpad_token' } })
    })
  })

  describe('when the token does not exist', () => {
    test('creates the ApolloClient', async () => {
      const undefinedUserAuthContext = { ...defaultAuthContext }
      delete undefinedUserAuthContext.user.token
      setup({
        user: {
          ...undefinedUserAuthContext.user
        }
      })

      expect(ApolloClient).toHaveBeenCalledTimes(1)
      expect(ApolloClient).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            cache: { mockCache: {} },
            defaultOptions: {
              query: {
                fetchPolicy: 'no-cache'
              },
              watchQuery: {
                fetchPolicy: 'no-cache'
              }
            },
            link: expect.any(ApolloLink)
          }
        )
      )

      // Check that createHttpLink is called properly
      expect(createHttpLink).toHaveBeenCalledTimes(1)
      expect(createHttpLink).toHaveBeenCalledWith({
        uri: 'http://graphqlhost.com/dev/api'
      })

      // Check that the authLink is called properly
      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext.mock.calls[0][0](null, {})).toEqual(
        {
          headers: { Authorization: undefined }
        }
      )
    })
  })

  describe('when the component rerenders', () => {
    describe('when the token does not change', () => {
      test('does not reinitialize the ApolloClient', () => {
        const { rerender } = setup()

        expect(ApolloClient).toHaveBeenCalledTimes(1)

        ApolloClient.mockReset()

        rerender(
          <AuthContext.Provider value={
            {
              ...defaultAuthContext,
              user: {
                ...defaultAuthContext.user,
                name: 'New Name'
              }
            }
          }
          >
            <AppContextProvider>
              <GraphQLProvider>
                <div />
              </GraphQLProvider>
            </AppContextProvider>
          </AuthContext.Provider>
        )

        expect(ApolloClient).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the token does change', () => {
      test('reinitializes the ApolloClient', () => {
        const { rerender } = setup()

        expect(ApolloClient).toHaveBeenCalledTimes(1)

        ApolloClient.mockReset()

        expect(ApolloClient).toHaveBeenCalledTimes(0)

        rerender(
          <AuthContext.Provider value={
            {
              ...defaultAuthContext,
              user: {
                ...defaultAuthContext.user,
                token: {
                  tokenValue: 'new_launchpad_token',
                  tokenExp: 5678
                }
              }
            }
          }
          >
            <AppContextProvider>
              <GraphQLProvider>
                <div />
              </GraphQLProvider>
            </AppContextProvider>
          </AuthContext.Provider>
        )

        expect(ApolloClient).toHaveBeenCalledTimes(1)
      })
    })
  })
})
