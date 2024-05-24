import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Routes,
  Route,
  Navigate
} from 'react-router'

import AuthContext from '@/js/context/AuthContext'

import APP_LOADING_TOKEN from '@/js/constants/appLoadingToken'
import AuthRequiredLayout from '../AuthRequiredLayout'

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

const setup = (isLoggedIn = false, tokenValue = 'mock-token') => {
  vi.setSystemTime('2024-01-01')

  const now = new Date().getTime()

  const context = {
    tokenValue,
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

describe('AuthRequiredContainer component', () => {
  describe('when the user has not authenticated', () => {
    test('redirects the user to login', () => {
      setup()

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: 'http://localhost:4001/dev/saml-login?target=%2Ftools'
      }, {})
    })
  })

  describe('when the user is authenticated', () => {
    test('should not redirect the user', () => {
      setup(true)

      expect(screen.queryByText('Mock Component')).toBeInTheDocument()

      expect(Navigate).toHaveBeenCalledTimes(0)
    })
  })

  describe('when the app is still loading the token', () => {
    test('should not redirect the user', () => {
      setup(undefined, APP_LOADING_TOKEN)

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()

      expect(Navigate).toHaveBeenCalledTimes(0)
    })
  })
})
