import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCookies } from 'react-cookie'
import jwt from 'jsonwebtoken'

import useAuthContext from '@/js/hooks/useAuthContext'
import checkAndRefreshToken from '@/js/utils/checkAndRefreshToken'
import errorLogger from '@/js/utils/errorLogger'

import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'

import MMT_COOKIE from '@/js/constants/mmtCookie'

import AuthContextProvider from '../AuthContextProvider'

vi.mock('@/js/utils/errorLogger')
vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev',
    cookieDomain: 'example.com'
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

vi.mock('react-cookie', async () => ({
  ...await vi.importActual('react-cookie'),
  useCookies: vi.fn()
}))

const MockComponent = () => {
  const {
    login,
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
        const setCookie = vi.fn()
        useCookies.mockImplementation(() => ([
          {},
          setCookie,
          vi.fn()
        ]))

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Log in' })

        await user.click(button)

        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/')}`
        expect(window.location.href).toEqual(expectedPath)

        expect(setCookie).toHaveBeenCalledTimes(1)
        expect(setCookie).toHaveBeenCalledWith(MMT_COOKIE, null, {
          domain: 'example.com',
          maxAge: 0,
          expires: new Date(0)
        })
      })
    })

    describe('when logged in', () => {
      test('shows the name', async () => {
        useCookies.mockImplementation(() => ([
          {
            [MMT_COOKIE]: 'mock-jwt'
          },
          vi.fn(),
          vi.fn()
        ]))

        setup()

        const userName = await screen.findByText('User Name: Test User', { exact: true })
        expect(userName).toBeInTheDocument()
      })
    })

    // Skipping because we don't have refresh logic right now MMT-3749
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

    describe('when there is an error decoding the token', () => {
      test('calls errorLogger', async () => {
        jwt.decode.mockImplementation(() => { throw new Error('Error decoding jwt') })
        useCookies.mockImplementation(() => ([
          {
            [MMT_COOKIE]: 'mock-jwt'
          },
          vi.fn(),
          vi.fn()
        ]))

        setup()

        expect(errorLogger).toHaveBeenCalledTimes(1)
        expect(errorLogger).toHaveBeenCalledWith(
          new Error('Error decoding jwt'),
          'AuthContextProvider: decoding JWT'
        )
      })
    })
  })
})
