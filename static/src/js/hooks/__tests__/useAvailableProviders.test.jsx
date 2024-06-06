import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { ApolloError } from '@apollo/client'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import AuthContext from '@/js/context/AuthContext'

import AppContextProvider from '@/js/providers/AppContextProvider/AppContextProvider'

import errorLogger from '@/js/utils/errorLogger'

import useAvailableProviders from '../useAvailableProviders'
import useAppContext from '../useAppContext'

vi.mock('@/js/utils/errorLogger')

const TestComponent = () => {
  const { providerId } = useAppContext()
  const { providerIds } = useAvailableProviders()

  return (
    <div>
      <div>
        Provider IDs:
        {
          providerIds && (
            <span>{JSON.stringify(providerIds)}</span>
          )
        }
      </div>
      <div>
        {
          providerId && (
            <div>
              Selected Provider ID:
              {providerId}
            </div>
          )
        }
      </div>
    </div>
  )
}

const setup = ({
  overrideMocks
}) => {
  const mocks = [
    {
      request: {
        query: GET_AVAILABLE_PROVIDERS,
        variables: {
          params: {
            limit: 500,
            permittedUser: 'mock-user',
            target: 'PROVIDER_CONTEXT'
          }
        }
      },
      result: {
        data: {
          acls: {
            items: [{
              conceptId: 'mock-id-1',
              providerIdentity: {
                provider_id: 'MMT_1'
              }
            }, {
              conceptId: 'mock-id-2',
              providerIdentity: {
                provider_id: 'MMT_2'
              }
            }]
          }
        }
      }
    }
  ]

  render(
    <AuthContext.Provider value={
      {
        user: { uid: 'mock-user' }
      }
    }
    >
      <AppContextProvider>
        <MockedProvider
          mocks={overrideMocks || mocks}
        >
          <TestComponent />
        </MockedProvider>
      </AppContextProvider>
    </AuthContext.Provider>
  )
}

describe('useAvailableProviders', () => {
  test('returns the available providers', async () => {
    setup({})

    expect(await screen.findByText('Provider IDs:')).toBeInTheDocument()
    expect(screen.getByText('["MMT_1","MMT_2"]')).toBeInTheDocument()
    expect(screen.getByText('Selected Provider ID:MMT_1')).toBeInTheDocument()
  })

  test('returns an empty array on error', async () => {
    setup({
      overrideMocks: [
        {
          request: {
            query: GET_AVAILABLE_PROVIDERS,
            variables: {
              params: {
                limit: 500,
                permittedUser: 'mock-user',
                target: 'PROVIDER_CONTEXT'
              }
            }
          },
          result: {
            data: null,
            errors: [{
              message: 'An error occurred in useAvailableProviders.',
              locations: [{
                line: 2,
                column: 3
              }],
              paths: ['acls']
            }]
          }
        }
      ]
    })

    await waitFor(() => {
      expect(errorLogger).toHaveBeenCalledTimes(1)
    })

    expect(errorLogger).toHaveBeenCalledWith(
      'Failed fetching available providers',
      new ApolloError({ errorMessage: 'An error occurred in useAvailableProviders.' })
    )
  })
})
