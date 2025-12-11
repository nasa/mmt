import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import {
  MemoryRouter,
  Navigate,
  Routes,
  Route
} from 'react-router'

import AuthContext from '@/js/context/AuthContext'
import AppContext from '@/js/context/AppContext'
import usePermissions from '@/js/hooks/usePermissions'
import useAvailableProviders from '@/js/hooks/useAvailableProviders'
import AuthRequiredLayout from '../AuthRequiredLayout'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  apiHost: 'https://example.com'
}))

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

vi.mock('@/js/hooks/usePermissions')
vi.mock('@/js/hooks/useAvailableProviders', () => ({
  __esModule: true,
  default: vi.fn()
}))

const mockUsePermissions = (returns = {
  hasProviderPermissions: true,
  loading: false
}) => {
  usePermissions.mockReturnValue(returns)
}

const setup = ({
  isLoggedIn = false,
  authLoading = false,
  user = {},
  providerId = 'SCIOPS'
} = {}) => {
  vi.setSystemTime('2024-01-01')

  const now = new Date().getTime()

  const context = {
    authLoading,
    tokenValue: 'mock-token',
    tokenExpires: isLoggedIn ? now + 1 : now - 1,
    user
  }

  render(
    <AuthContext.Provider value={context}>
      <AppContext.Provider value={
        {
          providerId,
          setProviderId: vi.fn()
        }
      }
      >
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
      </AppContext.Provider>
    </AuthContext.Provider>
  )
}

beforeEach(() => {
  delete window.location
  window.location = {}
})

describe('AuthRequiredContainer component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUsePermissions()
    useAvailableProviders.mockReturnValue({
      providerIds: ['SCIOPS'],
      providersLoading: false
    })
  })

  describe('when the user has not authenticated', () => {
    test('redirects the user to login', () => {
      setup()

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()

      expect(window.location.href).toEqual('https://example.com/login?target=%2Ftools')
    })
  })

  describe('when the user is authenticated', () => {
    test('should not redirect the user', () => {
      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 5
        }
      })

      expect(screen.getByText('Mock Component')).toBeInTheDocument()
    })
  })

  describe('when the app is still loading the token', () => {
    test('should not redirect the user', () => {
      setup({
        authLoading: true
      })

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()
    })
  })

  describe('when assurance level is insufficient', () => {
    test('navigates to the denied access page', () => {
      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 3
        }
      })

      expect(Navigate).toHaveBeenCalledWith({
        replace: true,
        to: '/unauthorizedAccess?errorType=deniedAccessMMT'
      }, {})
    })
  })

  describe('when assurance level is 4', () => {
    test('navigates to deniedNonNasaAccess when ACL missing', () => {
      mockUsePermissions({
        hasProviderPermissions: false,
        loading: false
      })

      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4
        }
      })

      return waitFor(() => {
        expect(Navigate).toHaveBeenCalledWith({
          replace: true,
          to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT'
        }, {})
      })
    })

    test('shows loading state while ACLs load', () => {
      mockUsePermissions({
        hasProviderPermissions: true,
        loading: true
      })

      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4
        }
      })

      expect(screen.getByText('Please wait logging in...')).toBeInTheDocument()
    })

    test('allows access if any provider grants the ACL', async () => {
      useAvailableProviders.mockReturnValue({
        providerIds: ['SCIOPS', 'SCIOPS2'],
        providersLoading: false
      })

      usePermissions
        .mockReturnValueOnce({
          hasProviderPermissions: false,
          loading: false
        })
        .mockReturnValue({
          hasProviderPermissions: true,
          loading: false
        })

      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4
        }
      })

      await screen.findByText('Mock Component')

      expect(Navigate).not.toHaveBeenCalledWith({
        replace: true,
        to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT'
      }, {})
    })
  })
})
