import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { Outlet, useParams } from 'react-router'
import { MockedProvider } from '@apollo/client/testing'

import App from '../App'
import { GET_ACLS } from '../operations/queries/getAcls'
import errorLogger from '../utils/errorLogger'
import AppContext from '../context/AppContext'
import NotificationsContext from '../context/NotificationsContext'

vi.mock('../components/ErrorBanner/ErrorBanner')
vi.mock('../utils/errorLogger')

vi.mock('../pages/SearchPage/SearchPage', () => ({
  default: vi.fn(() => {
    const { type } = useParams()

    return (
      <div data-testid={`mock-${type}-page`}>Search Page</div>
    )
  })
}))

vi.mock('../pages/HomePage/HomePage', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-home-page">Home Page</div>
  ))
}))

vi.mock('../pages/DraftsPage/DraftsPage', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-drafts-page">Drafts Page</div>
  ))
}))

vi.mock('../components/Notifications/Notifications', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-notifications" />
  ))
}))

vi.mock('../providers/Providers/Providers', () => ({
  default: vi.fn(({ children }) => (
    <div data-testid="mock-providers">{children}</div>
  ))
}))

vi.mock('../components/AuthRequiredContainer/AuthRequiredContainer', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-auth-required-container"><Outlet /></div>
  ))
}))

vi.mock('../components/Layout/Layout', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-layout"><Outlet /></div>
  ))
}))

const setup = (overrideMocks, overrideAppContext) => {
  const appContext = {
    user: { uid: 'typical' },
    setProviderId: vi.fn(),
    setProviderIds: vi.fn(),
    ...overrideAppContext
  }

  const notificationContext = {
    addNotification: vi.fn()
  }

  const mocks = [
    {
      request: {
        query: GET_ACLS,
        variables: {
          params: {
            limit: 500,
            permittedUser: 'typical',
            target: 'PROVIDER_CONTEXT'
          }
        }
      },
      result: {
        data: {
          acls: {
            items: [{ acl: { provider_identity: { provider_id: 'MMT_2' } } }]
          }
        }
      }
    }
  ]

  const container = render(
    <AppContext.Provider value={appContext}>
      <NotificationsContext.Provider value={notificationContext}>
        <MockedProvider mocks={overrideMocks || mocks}>
          <App />
        </MockedProvider>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    container,
    appContext,
    notificationContext
  }
}

describe('App component', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('when rendering the "/" route', () => {
    test('renders the notifications', async () => {
      window.history.pushState({}, '', '/')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-notifications')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })

    test('renders the home page', async () => {
      window.history.pushState({}, '', '/')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-home-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/collections" route', () => {
    test('renders the manage collections page', async () => {
      window.history.pushState({}, '', '/collections')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-collections-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/variables" route', () => {
    test('renders the manage variables page', async () => {
      window.history.pushState({}, '', '/variables')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-variables-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/services" route', () => {
    test('renders the manage services page', async () => {
      window.history.pushState({}, '', '/services')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-services-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/tools" route', () => {
    test('renders the manage tools page', async () => {
      window.history.pushState({}, '', '/tools')

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-tools-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_collections', () => {
    test('redirects to /manage-collections', () => {
      window.history.pushState({}, '', '/manage_collections')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-collections')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_variables', () => {
    test('redirects to /manage-variables', () => {
      window.history.pushState({}, '', '/manage_variables')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-variables')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_services', () => {
    test('redirects to /manage-services', () => {
      window.history.pushState({}, '', '/manage_services')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-services')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-tools', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage_tools')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/manage-tools')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-cmr', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage-cmr')

      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost:3000/cmr')
      })

      window.history.pushState({}, '', '/')
    })
  })

  // Fetches providers
  describe('when providers are fetched', () => {
    describe('when there are provider ids', () => {
      test('sets the provider ids', async () => {
        const mocks = [
          {
            request: {
              query: GET_ACLS,
              variables: {
                params: {
                  limit: 500,
                  permittedUser: 'typical',
                  target: 'PROVIDER_CONTEXT'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: [{ acl: { provider_identity: { provider_id: 'MMT_2' } } }]
                }
              }
            }
          }
        ]

        const { appContext } = setup(mocks)

        await waitFor(() => {
          expect(appContext.setProviderIds).toHaveBeenCalledTimes(1)
          expect(appContext.setProviderIds).toHaveBeenCalledWith(['MMT_2'])
        })
      })

      describe('when the user has no provider selected', () => {
        test('sets the provider id', async () => {
          const mocks = [
            {
              request: {
                query: GET_ACLS,
                variables: {
                  params: {
                    limit: 500,
                    permittedUser: 'typical',
                    target: 'PROVIDER_CONTEXT'
                  }
                }
              },
              result: {
                data: {
                  acls: {
                    items: [{ acl: { provider_identity: { provider_id: 'MMT_2' } } }]
                  }
                }
              }
            }
          ]

          const { appContext } = setup(mocks)

          await waitFor(() => {
            expect(appContext.setProviderId).toHaveBeenCalledTimes(1)
            expect(appContext.setProviderId).toHaveBeenCalledWith('MMT_2')
          })
        })
      })
    })

    describe('when the user has a provider selected', () => {
      test('does not set the provider id', async () => {
        const mocks = [
          {
            request: {
              query: GET_ACLS,
              variables: {
                params: {
                  limit: 500,
                  permittedUser: 'typical',
                  target: 'PROVIDER_CONTEXT'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: [{ acl: { provider_identity: { provider_id: 'MMT_2' } } }]
                }
              }
            }
          }
        ]

        const user = {
          uid: 'typical',
          providerId: 'MMT_2'
        }

        const { appContext } = setup(mocks, { user })

        await waitFor(() => {
          expect(appContext.setProviderId).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when there are no provider ids', () => {
      test('does not set the provider ids', async () => {
        const mocks = [
          {
            request: {
              query: GET_ACLS,
              variables: {
                params: {
                  limit: 500,
                  permittedUser: 'typical',
                  target: 'PROVIDER_CONTEXT'
                }
              }
            },
            result: {
              data: {
                acls: {
                  items: []
                }
              }
            }
          }
        ]

        const { appContext } = setup(mocks)

        await waitFor(() => {
          expect(appContext.setProviderIds).toHaveBeenCalledTimes(0)
        })
      })
    })
  })

  describe('when the request results in an error', () => {
    test('call errorLogger and triggers a notification', async () => {
      const mocks = [
        {
          request: {
            query: GET_ACLS,
            variables: {
              params: {
                limit: 500,
                permittedUser: 'typical',
                target: 'PROVIDER_CONTEXT'
              }
            }
          },
          error: new Error('An error occurred')
        }
      ]

      const { notificationContext } = setup(mocks)

      await waitFor(() => {
        expect(notificationContext.addNotification).toHaveBeenCalledTimes(1)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(new Error('An error occurred'), 'Error fetching providers')
      })
    })
  })
})
