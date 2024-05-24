import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import AuthContext from '@/js/context/AuthContext'

import AppContextProvider from '@/js/providers/AppContextProvider/AppContextProvider'

import useAvailableProviders from '../useAvailableProviders'
import useAppContext from '../useAppContext'

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

    await waitForResponse()

    expect(await screen.findByText('Provider IDs:')).toBeInTheDocument()
    expect(screen.queryByText('["MMT_1","MMT_2"]')).toBeInTheDocument()
    expect(screen.queryByText('Selected Provider ID:MMT_1')).toBeInTheDocument()
  })
})
