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
    setRedirecting: vi.fn(),
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

  return context
}

beforeEach(() => {
  delete window.location
  window.location = {}
})

describe('AuthRequiredContainer component', () => {
  describe('when the user has not authenticated', () => {
    test('redirects the user to login', () => {
      const { setRedirecting } = setup()

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()
      expect(setRedirecting).toBeCalledWith(true)
      expect(window.location.href).toEqual('https://example.com/saml-login?target=%2Ftools')
    })
  })

  describe('when the user is authenticated', () => {
    test('should not redirect the user', () => {
      const { setRedirecting } = setup(true)
      expect(setRedirecting).toBeCalledTimes(0)
      expect(screen.getByText('Mock Component')).toBeInTheDocument()
    })
  })

  describe('when the app is still loading the token', () => {
    test('should not redirect the user', () => {
      const { setRedirecting } = setup(undefined, true)
      expect(setRedirecting).toBeCalledTimes(0)

      expect(screen.queryByText('Mock Component')).not.toBeInTheDocument()
    })
  })
})
