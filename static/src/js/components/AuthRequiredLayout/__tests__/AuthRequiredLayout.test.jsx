import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router'

import AuthContext from '@/js/context/AuthContext'

import AuthRequiredLayout from '../AuthRequiredLayout'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  apiHost: 'https://example.com'
}))

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

const setup = (isLoggedIn = false, authLoading = false) => {
  vi.setSystemTime('2024-01-01')

  const now = new Date().getTime()

  const context = {
    authLoading,
    tokenValue: 'mock-token',
    tokenExpires: isLoggedIn ? now + 1 : now - 1
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
  describe('when the user has not authenticated', () => {
    test('redirects the user to login', () => {
      setup()

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()

      expect(window.location.href).toEqual('https://example.com/saml-login?target=%2Ftools')
    })
  })

  describe('when the user is authenticated', () => {
    test('should not redirect the user', () => {
      setup(true)

      expect(screen.getByText('Mock Component')).toBeInTheDocument()
    })
  })

  describe('when the app is still loading the token', () => {
    test('should not redirect the user', () => {
      setup(undefined, true)

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()
    })
  })
})
