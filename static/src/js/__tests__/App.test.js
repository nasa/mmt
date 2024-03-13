import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import { MockedProvider } from '@apollo/client/testing'
import App from '../App'
import { MockedProvider } from '@apollo/client/testing'
import App from '../App'
import ManageCmrPage from '../pages/ManageCmrPage/ManageCmrPage'
import { GET_ACLS } from '../operations/queries/getAcls'
import errorLogger from '../utils/errorLogger'
import AppContext from '../context/AppContext'
import NotificationsContext from '../context/NotificationsContext'

jest.mock('../components/ErrorBanner/ErrorBanner')
jest.mock('../utils/errorLogger')
import { GET_ACLS } from '../operations/queries/getAcls'
import errorLogger from '../utils/errorLogger'
import AppContext from '../context/AppContext'
import NotificationsContext from '../context/NotificationsContext'

jest.mock('../components/ErrorBanner/ErrorBanner')
jest.mock('../utils/errorLogger')

jest.mock('../pages/ManagePage/ManagePage', () => ({
  __esModule: true,
  default: jest.fn(() => {
    const { type } = jest.requireActual('react-router-dom').useParams()

    return (
      <div data-testid={`mock-manage-${type}-page`}>Manage Page</div>
    )
  })
}))

jest.mock('../pages/HomePage/HomePage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-home-page">Home Page</div>
  ))
}))

jest.mock('../pages/DraftsPage/DraftsPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-drafts-page">Drafts Page</div>
  ))
}))

jest.mock('../pages/ManageCmrPage/ManageCmrPage', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-manage-cmr-page">Manage CMR Page</div>
  ))
}))

jest.mock('../providers/Providers/Providers', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-providers" />
  ))
}))

jest.mock('../components/Notifications/Notifications', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-notifications" />
  ))
}))

jest.mock('../providers/Providers/Providers', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <div data-testid="mock-providers">{children}</div>
  ))
}))

jest.mock('../components/AuthRequiredContainer/AuthRequiredContainer', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => (
    <div data-testid="mock-auth-required-container">{children}</div>
  ))
}))

jest.mock('../components/Layout/Layout', () => {
  const { Outlet } = jest.requireActual('react-router-dom')

  return ({
    __esModule: true,
    default: jest.fn(() => (
      <div data-testid="mock-layout"><Outlet /></div>
    ))
  })
})

const setup = (overrideMocks, overrideAppContext) => {
  const appContext = {
    user: { uid: 'typical' }, // Mock the user object
    setProviderId: jest.fn(),
    setProviderIds: jest.fn(),
    ...overrideAppContext
  }

  const notificationContext = {
    addNotification: jest.fn()
  }

  const mocks = [
    {
      request: {
        query: GET_ACLS,
        variables: {
          params: {
            includeFullAcl: true,
            pageNum: 1,
            pageSize: 2000,
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
        <MockedProvider mocks={overrideMocks || mocks} addTypename={false}>
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

const setup = (overrideMocks, overrideAppContext) => {
  const appContext = {
    user: { uid: 'typical' }, // Mock the user object
    setProviderId: jest.fn(),
    setProviderIds: jest.fn(),
    ...overrideAppContext
  }

  const notificationContext = {
    addNotification: jest.fn()
  }

  const mocks = [
    {
      request: {
        query: GET_ACLS,
        variables: {
          params: {
            includeFullAcl: true,
            pageNum: 1,
            pageSize: 2000,
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
        <MockedProvider mocks={overrideMocks || mocks} addTypename={false}>
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
    jest.clearAllMocks()
  })

  describe('when rendering the "/" route', () => {
    test('renders the notifications', async () => {
      window.history.pushState({}, '', '/')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-notifications')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })

    test('renders the home page', async () => {
      window.history.pushState({}, '', '/')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-home-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/manage/collections" route', () => {
    test('renders the manage collections page', async () => {
      window.history.pushState({}, '', '/manage/collections')

      setup()
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-manage-collections-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/manage/variables" route', () => {
    test('renders the manage variables page', async () => {
      window.history.pushState({}, '', '/manage/variables')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-manage-variables-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/manage/services" route', () => {
    test('renders the manage services page', async () => {
      window.history.pushState({}, '', '/manage/services')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-manage-services-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/manage/tools" route', () => {
    test('renders the manage tools page', async () => {
      window.history.pushState({}, '', '/manage/tools')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-manage-tools-page')).toBeInTheDocument()
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when rendering the "/manage/cmr" route', () => {
    test('renders the manage cmr page', async () => {
      window.history.pushState({}, '', '/manage/cmr')

      setup()

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('mock-manage-cmr-page')).toBeInTheDocument()
        expect(ManageCmrPage).toHaveBeenCalledTimes(3)
        expect(ManageCmrPage).toHaveBeenCalledTimes(3)
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_collections', () => {
    test('redirects to /manage-collections', () => {
      window.history.pushState({}, '', '/manage_collections')

      setup()
      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-collections')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_variables', () => {
    test('redirects to /manage-variables', () => {
      window.history.pushState({}, '', '/manage_variables')

      setup()
      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-variables')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage_services', () => {
    test('redirects to /manage-services', () => {
      window.history.pushState({}, '', '/manage_services')

      setup()
      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-services')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-tools', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage_tools')

      setup()
      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage-tools')
      })

      window.history.pushState({}, '', '/')
    })
  })

  describe('when visiting /manage-cmr', () => {
    test('redirects to /manage-tools', () => {
      window.history.pushState({}, '', '/manage-cmr')

      setup()
      setup()

      waitFor(() => {
        expect(window.location.href).toEqual('http://localhost/manage/cmr')
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
                  includeFullAcl: true,
                  pageNum: 1,
                  pageSize: 2000,
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
                    includeFullAcl: true,
                    pageNum: 1,
                    pageSize: 2000,
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
                  includeFullAcl: true,
                  pageNum: 1,
                  pageSize: 2000,
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
                  includeFullAcl: true,
                  pageNum: 1,
                  pageSize: 2000,
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
                includeFullAcl: true,
                pageNum: 1,
                pageSize: 2000,
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
