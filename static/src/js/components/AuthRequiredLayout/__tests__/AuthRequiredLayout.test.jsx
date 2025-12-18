import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Routes,
  Route,
  Navigate
} from 'react-router'

import AuthContext from '@/js/context/AuthContext'
import errorLogger from '@/js/utils/errorLogger'
import { GET_NON_NASA_DRAFT_USER_ACLS } from '@/js/operations/queries/getNonNasaDraftUserAcls'
import MMT_COOKIE from 'sharedConstants/mmtCookie'
import AuthRequiredLayout from '../AuthRequiredLayout'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

const mockSetCookie = vi.fn()
vi.mock('@/js/hooks/useMMTCookie', () => ({
  __esModule: true,
  default: () => ({
    setCookie: mockSetCookie
  })
}))

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  apiHost: 'https://example.com',
  cookieDomain: '.example.com'
}))

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

vi.mock('@/js/utils/errorLogger', () => ({
  __esModule: true,
  default: vi.fn()
}))

const setup = ({
  isLoggedIn = false,
  authLoading = false,
  user = {},
  mocks = []
} = {}) => {
  vi.setSystemTime('2024-01-01')

  const now = new Date().getTime()

  const context = {
    authLoading,
    tokenValue: 'mock-token',
    tokenExpires: isLoggedIn ? now + 60000 : now - 1,
    user
  }

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthContext.Provider value={context}>
        <MemoryRouter initialEntries={['/tools']}>
          <Routes>
            <Route
              path="/"
              element={<AuthRequiredLayout />}
            >
              <Route
                path="/tools"
                element={<div>Mock Component</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </MockedProvider>
  )
}

beforeEach(() => {
  delete window.location
  window.location = {}

  vi.clearAllMocks()
  mockSetCookie.mockClear()
})

describe('AuthRequiredContainer component', () => {
  describe('when the user has not authenticated', () => {
    test('redirects the user to login', () => {
      setup()

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()

      expect(window.location.href).toEqual('https://example.com/login?target=%2Ftools')
    })
  })

  describe('when the user is authenticated', () => {
    test('should not redirect the user', () => {
      setup({ isLoggedIn: true })

      expect(screen.getByText('Mock Component')).toBeInTheDocument()
    })
  })

  describe('when the app is still loading the token', () => {
    test('should not redirect the user', () => {
      setup({
        isLoggedIn: false,
        authLoading: true
      })

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()
    })
  })

  describe('when checking assurance levels', () => {
    test('renders content for NASA users (level 5) without extra permission checks', async () => {
      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 5,
          uid: 'nasa-user'
        }
      })

      expect(await screen.findByText('Mock Component')).toBeInTheDocument()
      expect(Navigate).not.toHaveBeenCalled()
    })

    test('allows non-NASA users (level 4) that have the required ACLs', async () => {
      const uid = 'non-nasa-user'
      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4,
          uid
        },
        mocks: [{
          request: {
            query: GET_NON_NASA_DRAFT_USER_ACLS,
            variables: {
              params: {
                permittedUser: uid,
                target: 'NON_NASA_DRAFT_USER'
              }
            }
          },
          result: {
            data: {
              acls: {
                items: [{
                  name: 'mock-acl'
                }]
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Mock Component')).toBeInTheDocument()
      expect(Navigate).not.toHaveBeenCalled()
    })

    test('blocks non-NASA users (level 4) without the ACLs', async () => {
      const uid = 'denied-user'
      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4,
          uid
        },
        mocks: [{
          request: {
            query: GET_NON_NASA_DRAFT_USER_ACLS,
            variables: {
              params: {
                permittedUser: uid,
                target: 'NON_NASA_DRAFT_USER'
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
        }]
      })

      await waitFor(() => {
        expect(Navigate).toHaveBeenCalledWith(expect.objectContaining({
          replace: true,
          to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT'
        }), {})
      })

      expect(mockSetCookie).toHaveBeenCalledWith(MMT_COOKIE, null, expect.objectContaining({
        domain: '.example.com',
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      }))
    })

    test('logs errors and denies non-NASA users when the ACL check fails', async () => {
      const uid = 'errored-user'
      const mockError = new Error('boom')

      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4,
          uid
        },
        mocks: [{
          request: {
            query: GET_NON_NASA_DRAFT_USER_ACLS,
            variables: {
              params: {
                permittedUser: uid,
                target: 'NON_NASA_DRAFT_USER'
              }
            }
          },
          error: mockError
        }]
      })

      await waitFor(() => {
        expect(errorLogger).toHaveBeenCalledWith('Failed non nasa draft user acls', mockError)
      })

      expect(Navigate).toHaveBeenCalledWith(expect.objectContaining({
        replace: true,
        to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT'
      }), {})

      expect(mockSetCookie).toHaveBeenCalledWith(MMT_COOKIE, null, expect.objectContaining({
        domain: '.example.com',
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      }))
    })
  })

  describe('when the auth context does not include a user', () => {
    test('falls back when user is undefined without crashing', async () => {
      setup({
        isLoggedIn: true,
        user: undefined
      })

      expect(await screen.findByText('Mock Component')).toBeInTheDocument()
    })
  })
})
