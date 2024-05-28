import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import useAuthContext from '@/js/hooks/useAuthContext'
import checkAndRefreshToken from '@/js/utils/checkAndRefreshToken'
import errorLogger from '@/js/utils/errorLogger'
import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'
import AuthContextProvider from '../AuthContextProvider'

vi.mock('@/js/utils/errorLogger')
vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

vi.mock('@/js/utils/checkAndRefreshToken', () => ({
  default: vi.fn()
}))

vi.mock('jsonwebtoken', async () => ({
  default: {
    decode: vi.fn().mockReturnValue({
      edlProfile: {
        name: 'Test User'
      }
    })
  }
}))

const MockComponent = () => {
  const {
    login,
    logout,
    user
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
        onClick={login}
      >
        Log in
      </button>
      <button
        type="button"
        onClick={logout}
      >
        Log out
      </button>
    </div>
  )
}

const setup = () => {
  const user = userEvent.setup()

  render(
    <AuthContextProvider>
      <NotificationsContextProvider>
        <MockComponent />
      </NotificationsContextProvider>
    </AuthContextProvider>
  )

  return { user }
}

beforeEach(() => {
  delete window.location
  window.location = {}
})

describe('AuthContextProvider component', () => {
  describe('when app starts up', () => {
    describe('when log in is triggered', () => {
      test('logs the user in', async () => {
        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Log in' })

        await user.click(button)

        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/')}`
        expect(window.location.href).toEqual(expectedPath)
      })
    })

    describe('when logged in', () => {
      test('shows the name', async () => {
        global.localStorage.setItem('token', 'mock-jwt')

        setup()

        const userName = await screen.findByText('User Name: Test User', { exact: true })
        expect(userName).toBeInTheDocument()
      })
    })

    // Skipping because we don't have refresh logic right now
    describe.skip('when refresh token', () => {
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

        vi.advanceTimersByTime(6000)

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
        const { user } = setup()

        const userName = await screen.findByText('User Name: Test User', { exact: true })
        expect(userName).toBeInTheDocument()

        const logoutButton = screen.getByRole('button', { name: 'Log out' })
        await user.click(logoutButton)

        const newUserName = screen.queryByText('User Name: Test User', { exact: true })
        expect(newUserName).not.toBeInTheDocument()
      })
    })

    describe('when there is an error reading the localstorage', () => {
      test('calls errorLogger', async () => {
        global.localStorage.getItem = vi.fn(() => { throw new Error('error reading storage') })
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

        setup()

        expect(consoleMock).toHaveBeenCalledTimes(1)
        expect(consoleMock).toHaveBeenCalledWith('Error fetching token: Error: error reading storage')

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          new Error('error reading storage'),
          'AuthContextProvider: local storage get'
        )
      })
    })

    describe('when there is an error setting the localstorage', () => {
      test('calls errorLogger', async () => {
        global.localStorage.setItem('token', 'mock-jwt')
        global.localStorage.getItem = vi.fn().mockReturnValue('mock-jwt')
        global.localStorage.setItem = vi.fn(() => { throw new Error('error setting storage') })
        const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

        setup()

        expect(consoleMock).toHaveBeenCalledTimes(1)
        expect(consoleMock).toHaveBeenCalledWith('Error saving token: Error: error setting storage')

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          new Error('error setting storage'),
          'AuthContextProvider: local storage set/remove'
        )
      })
    })
  })
})
