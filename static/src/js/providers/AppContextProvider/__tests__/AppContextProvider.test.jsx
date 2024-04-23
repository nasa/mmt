import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cookies, CookiesProvider } from 'react-cookie'
import useAppContext from '../../../hooks/useAppContext'
import AppContextProvider from '../AppContextProvider'
import AuthContextProvider from '../../AuthContextProvider/AuthContextProvider'

vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

const MockComponent = () => {
  const {
    user,
    login,
    logout,
    setProviderId
  } = useAppContext()

  return (
    <div>
      <div>
        User Name:
        {' '}
        {user?.name}
      </div>
      <button
        type="button"
        onClick={
          () => {
            login()
          }
        }
      >
        Log in
      </button>
      <button
        type="button"
        onClick={
          () => {
            logout()
          }
        }
      >
        Log out
      </button>
      <button
        type="button"
        onClick={() => setProviderId('MMT_TEST')}
      >
        Set provider id
      </button>
      <div>
        Provider Id:
        {' '}
        {user?.providerId}
      </div>
    </div>
  )
}

const setup = (overrideCookie) => {
  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const cookie = new Cookies(
    overrideCookie || {
      loginInfo: {
        name: 'User Name',
        token: {
          tokenValue: 'ABC-1',
          tokenExp: expires.valueOf()
        }
      }
    }
  )
  cookie.HAS_DOCUMENT_COOKIE = false

  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <AuthContextProvider>
        <AppContextProvider>
          <MockComponent />
        </AppContextProvider>
      </AuthContextProvider>
    </CookiesProvider>
  )

  return cookie
}

describe('AppContextProvider component', () => {
  describe('when app starts up', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    describe('when log in is triggered', () => {
      test('logs the user in', async () => {
        delete window.location
        window.location = {}

        setup()

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })

        await user.click(button)

        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/collections')}`
        expect(window.location.href).toEqual(expectedPath)
      })
    })

    describe('when log out is triggered', () => {
      test('logs the user out', async () => {
        delete window.location
        window.location = {}

        setup()

        const user = userEvent.setup()
        const loginButton = screen.getByRole('button', { name: 'Log in' })

        await user.click(loginButton)

        const userName = screen.getByText('User Name: User Name', { exact: true })

        expect(userName).toBeInTheDocument()

        const logoutButton = screen.getByRole('button', { name: 'Log out' })

        await user.click(logoutButton)

        const newUserName = screen.queryByText('User Name: User Name', { exact: true })

        expect(newUserName).not.toBeInTheDocument()
      })
    })

    describe('setProviderId is triggered', () => {
      test('sets the provider id', async () => {
        delete window.location
        window.location = {}

        setup()

        const user = userEvent.setup()
        const setProviderButton = screen.getByRole('button', { name: 'Set provider id' })

        await user.click(setProviderButton)

        const providerId = screen.getByText('Provider Id: MMT_TEST', { exact: true })

        expect(providerId).toBeInTheDocument()
      })
    })
  })

  describe('cleans up old cookie causing header length issues', () => {
    test('clears old data cookie when present', async () => {
      delete window.location
      window.location = {}
      const cookie = setup({
        launchpadToken: 'mock launchpad token',
        data: 'encoded cookie'
      })

      // Only launchpadtoken left
      expect(cookie.cookies).toEqual({ launchpadToken: 'mock launchpad token' })
    })
  })
})
