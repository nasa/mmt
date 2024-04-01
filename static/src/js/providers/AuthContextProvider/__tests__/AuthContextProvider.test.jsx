import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Cookies, CookiesProvider } from 'react-cookie'
import AuthContextProvider from '../AuthContextProvider'
import useAuthContext from '../../../hooks/useAuthContext'
import checkAndRefreshToken from '../../../utils/checkAndRefreshToken'
import NotificationsContextProvider from '../../NotificationsContextProvider/NotificationsContextProvider'
import errorLogger from '../../../utils/errorLogger'

vi.mock('../../../utils/errorLogger')
vi.mock('../../../utils/getConfig', async () => ({
  ...await vi.importActual('../../../utils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

vi.mock('../../../utils/checkAndRefreshToken', () => ({
  default: vi.fn()
}))

const MockComponent = () => {
  const {
    user, login, logout, updateLoginInfo
  } = useAuthContext()

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
            updateLoginInfo('mock_user')
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
    </div>
  )
}

const setup = (overrideCookie) => {
  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const cookie = new Cookies(
    overrideCookie || {
      launchpadToken: 'mock-launchpad-token'
    }
  )
  cookie.HAS_DOCUMENT_COOKIE = false

  render(
    <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
      <AuthContextProvider>
        <NotificationsContextProvider>
          <MockComponent />
        </NotificationsContextProvider>
      </AuthContextProvider>
    </CookiesProvider>
  )
}

describe('AuthContextProvider component', () => {
  describe('when app starts up', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    describe('when log in is triggered', () => {
      test('logs the user in', async () => {
        delete window.location
        window.location = {}

        global.fetch = vi.fn(() => Promise.resolve({
          json: () => Promise.resolve({
            email: 'test.user@localhost',
            first_name: 'User',
            last_name: 'Name',
            name: 'User Name',
            uid: 'mock_user'
          })
        }))

        setup({
          launchpadToken: 'mock-launchpad-token'
        })

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })
        await user.click(button)
        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/manage/collections')}`
        expect(window.location.href).toEqual(expectedPath)
      })
    })

    describe('when logged in', () => {
      test('shows the name', async () => {
        delete window.location
        window.location = {}

        global.fetch = vi.fn(() => Promise.resolve({
          json: () => Promise.resolve({
            email: 'test.user@localhost',
            first_name: 'User',
            last_name: 'Name',
            name: 'User Name',
            uid: 'mock_user'
          })
        }))

        setup({
          launchpadToken: 'mock-launchpad-token'
        })

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })
        await user.click(button)
        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/manage/collections')}`
        expect(window.location.href).toEqual(expectedPath)

        await waitFor(() => {
          const userName = screen.getByText('User Name: User Name', { exact: true })
          expect(userName).toBeInTheDocument()
        })
      })

      test('shows errors if can not retrieve name from urs', async () => {
        delete window.location
        window.location = {}

        global.fetch = vi.fn(() => Promise.reject(new Error('URS is down')))

        setup({
          launchpadToken: 'mock-launchpad-token'
        })

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })
        await user.click(button)

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toBeCalledWith('Error retrieving profile for mock_user, message=Error: URS is down', 'AuthContextProvider')
      })
    })

    describe('when refresh token', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      test('calls refresh token lambda to exchange for a new token', async () => {
        let expires = new Date('2024-02-01')
        expires.setMinutes(expires.getMinutes() - 2)
        expires = new Date(expires)

        setup({
          launchpadToken: 'mock-launchpad-token',
          loginInfo: {
            auid: 'username',
            name: 'User Name',
            token: {
              tokenValue: 'mock-token',
              tokenExp: expires.valueOf()
            }
          }

        })

        vi.advanceTimersByTime(1500)

        expect(checkAndRefreshToken).toHaveBeenCalledTimes(1)
        expect(checkAndRefreshToken).toHaveBeenCalledWith({
          auid: 'username',
          name: 'User Name',
          token: {
            tokenExp: 1706745480000,
            tokenValue: 'mock-token'
          }
        }, expect.any(Function))
      })
    })

    describe('when log out is triggered', () => {
      test('logs the user out', async () => {
        delete window.location
        window.location = {}

        let expires = new Date()
        expires.setMinutes(expires.getMinutes() + 15)
        expires = new Date(expires)

        setup({
          launchpadToken: 'mock-launchpad-token',
          loginInfo: {
            auid: 'username',
            name: 'User Name',
            token: {
              tokenValue: 'mock-token',
              tokenExp: expires.valueOf()
            }
          }
        })

        const user = userEvent.setup()

        await waitFor(() => {
          const userName = screen.getByText('User Name: User Name', { exact: true })
          expect(userName).toBeInTheDocument()
        })

        const logoutButton = screen.getByRole('button', { name: 'Log out' })

        await user.click(logoutButton)

        const newUserName = screen.queryByText('User Name: User Name', { exact: true })

        expect(newUserName).not.toBeInTheDocument()
      })
    })
  })
})
