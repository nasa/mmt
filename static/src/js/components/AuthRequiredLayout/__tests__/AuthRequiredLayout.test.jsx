import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Navigate,
  Routes,
  Route
} from 'react-router'

import AuthContext from '@/js/context/AuthContext'
import usePermissions from '@/js/hooks/usePermissions'
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

const mockUsePermissions = (returns = {
  hasProviderIdentities: true,
  loading: false
}) => {
  usePermissions.mockReturnValue(returns)
}

const setup = ({
  isLoggedIn = false,
  authLoading = false,
  user = {}
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
        hasProviderIdentities: false,
        loading: false
      })

      setup({
        isLoggedIn: true,
        user: {
          assuranceLevel: 4
        }
      })

      expect(Navigate).toHaveBeenCalledWith({
        replace: true,
        to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT'
      }, {})
    })

    test('shows loading state while ACLs load', () => {
      mockUsePermissions({
        hasProviderIdentities: true,
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
  })
})
