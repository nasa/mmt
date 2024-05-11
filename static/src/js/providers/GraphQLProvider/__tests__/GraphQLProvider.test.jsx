import React, { createContext } from 'react'
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

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client')

  return {
    ...actual,
    ApolloClient: vi.fn(),
    InMemoryCache: vi.fn(() => ({ mockCache: {} })),
    ApolloProvider: vi.fn(({ children }) => children),
    createHttpLink: vi.fn(
      (args) => actual.createHttpLink(args)
    )
  }
})

vi.mock('@apollo/client/link/context', async () => {
  const actual = await vi.importActual('@apollo/client/link/context')

  return {
    ...actual,
    setContext: vi.fn(
      (args) => actual.setContext(args)
    )
  }
})

vi.mock('../../../context/AuthContext', () => ({
  default: createContext()
}))

vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    env: 'test',
    graphQlHost: 'http://graphqlhost.com/dev/api'
  }))
}))

const defaultAuthContext = {
  login: vi.fn(),
  logout: vi.fn(),
  setUser: vi.fn(),
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
    vi.clearAllMocks()
  })

  describe('when the token exists', () => {
    test('creates the ApolloClient', async () => {
      setup()

      expect(ApolloClient).toHaveBeenCalledTimes(1)
      expect(ApolloClient).toHaveBeenCalledWith(
        expect.objectContaining(
          {
            cache: { mockCache: {} },
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
      expect(setContext.mock.calls[0][0](null, {})).toEqual({
        headers: {
          Authorization: 'launchpad_token',
          'Client-Id': 'eed-mmt-test'
        }
      })
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
          headers: {
            Authorization: undefined,
            'Client-Id': 'eed-mmt-test'
          }
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
