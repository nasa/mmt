import { render, screen } from '@testing-library/react'
import React, { Suspense } from 'react'
import { MockedProvider } from '@apollo/client/testing'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import AppContext from '@/js/context/AppContext'

import Providers from '../Providers'

const setup = ({
  overrideMocks = false
}) => {
  const mocks = [{
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
          __typename: 'AclList',
          items: [
            {
              providerIdentity: {
                target: 'PROVIDER_CONTEXT',
                provider_id: 'MMT_1'
              }
            },
            {
              providerIdentity: {
                target: 'PROVIDER_CONTEXT',
                provider_id: 'MMT_2'
              }
            }
          ]
        }
      }
    }
  }]

  render(
    <AppContext.Provider value={
      {
        user: {
          uid: 'mock-user'
        }
      }
    }
    >
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <Suspense>
          <Providers />
        </Suspense>
      </MockedProvider>
    </AppContext.Provider>
  )
}

describe('Providers', () => {
  describe('when the user has providers', () => {
    test('displays the provider list', async () => {
      setup({})

      expect(await screen.findByText('You have permissions to manage metadata records for the following providers.')).toBeVisible()

      expect(screen.getByText('MMT_1')).toBeInTheDocument()
      expect(screen.getByText('MMT_2')).toBeInTheDocument()
    })
  })

  describe('when the user has no available providers', () => {
    test('renders a message', async () => {
      setup({
        overrideMocks: [{
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
                __typename: 'AclList',
                items: []
              }
            }
          }
        }]
      })

      expect(await screen.findByText('You do not have access to any providers.')).toBeVisible()
    })
  })
})
