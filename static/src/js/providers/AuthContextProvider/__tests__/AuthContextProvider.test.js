import React from 'react'
import {
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Cookies, CookiesProvider } from 'react-cookie'
import AuthContextProvider from '../AuthContextProvider'
import useAuthContext from '../../../hooks/useAuthContext'
import refreshToken from '../../../utils/refreshToken'
import NotificationsContextProvider from '../../NotificationsContextProvider/NotificationsContextProvider'
import errorLogger from '../../../utils/errorLogger'

jest.mock('../../../utils/errorLogger')
jest.mock('../../../utils/getConfig', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/getConfig'),
  getApplicationConfig: jest.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

jest.mock('../../../utils/refreshToken', () => ({
  __esModule: true,
  default: jest.fn()
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
      jest.resetAllMocks()
    })

    describe('when log in is triggered', () => {
      test('logs the user in', async () => {
        delete window.location
        window.location = {}

        global.fetch = jest.fn(() => Promise.resolve({
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

        global.fetch = jest.fn(() => Promise.resolve({
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

        global.fetch = jest.fn(() => Promise.reject(new Error('URS is down')))

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
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2024-01-01'))
      })

      afterEach(() => {
        jest.useRealTimers()
      })

      test('calls refresh token lambda to exchange for a new token', async () => {
        delete window.location
        window.location = {}

        global.fetch = jest.fn(() => Promise.resolve({
          json: () => Promise.resolve({
            email: 'test.user@localhost',
            first_name: 'User',
            last_name: 'Name',
            name: 'User Name',
            uid: 'mock_user'
          })
        }))

        jest.setSystemTime(new Date('2024-02-01'))

        let expires = new Date()
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

        act(() => {
          jest.advanceTimersByTime(1500)
        })

        await waitFor(() => {
          expect(refreshToken).toHaveBeenCalledTimes(1)
          expect(refreshToken).toHaveBeenCalledWith('mock-token')
        })
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
