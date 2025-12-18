import React, { createContext } from 'react'
import { render } from '@testing-library/react'
import { ApolloClient, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import GraphQLProvider from '../GraphQLProvider'
import AppContextProvider from '../../AppContextProvider/AppContextProvider'
import AuthContext from '../../../context/AuthContext'
import { getApplicationConfig } from '../../../../../../sharedUtils/getConfig'

function createDefaultApplicationConfig() {
  return {
    env: 'test',
    graphQlHost: 'http://graphqlhost.com/dev/api'
  }
}

const defaultApplicationConfig = createDefaultApplicationConfig()

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
  getApplicationConfig: vi.fn(() => createDefaultApplicationConfig())
}))

const defaultAuthContext = {
  login: vi.fn(),
  logout: vi.fn(),
  setUser: vi.fn(),
  tokenValue: 'edl_token',
  user: {
    name: 'User Name',
    auid: 'username'
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
    getApplicationConfig.mockReturnValue(defaultApplicationConfig)
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

      // Check that the authLink is called properly
      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext.mock.calls[0][0](null, {})).toEqual({
        headers: {
          Authorization: 'Bearer edl_token',
          'Client-Id': 'eed-mmt-test'
        }
      })
    })
  })

  describe('when the token does not exist', () => {
    test('creates the ApolloClient', async () => {
      setup({
        ...defaultAuthContext,
        tokenValue: undefined
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

      // Check that the authLink is called properly
      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext.mock.calls[0][0](null, {})).toEqual(
        {
          headers: {
            Authorization: 'Bearer undefined',
            'Client-Id': 'eed-mmt-test'
          }
        }
      )
    })
  })

  describe('when running in local development', () => {
    test('does not prefix the authorization header', () => {
      getApplicationConfig.mockReturnValue({
        ...defaultApplicationConfig,
        env: 'development'
      })

      setup()

      expect(setContext).toHaveBeenCalledTimes(1)
      expect(setContext.mock.calls[0][0](null, {})).toEqual({
        headers: {
          Authorization: 'edl_token',
          'Client-Id': 'eed-mmt-development'
        }
      })
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
              tokenValue: 'new_edl_token'
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
