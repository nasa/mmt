import React from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCookies } from 'react-cookie'
import jwt from 'jsonwebtoken'

import useAuthContext from '@/js/hooks/useAuthContext'
import errorLogger from '@/js/utils/errorLogger'
import refreshToken from '@/js/utils/refreshToken'

import NotificationsContextProvider from '@/js/providers/NotificationsContextProvider/NotificationsContextProvider'

import MMT_COOKIE from '../../../../../../sharedContstants/mmtCookie'

import AuthContextProvider from '../AuthContextProvider'

vi.mock('@/js/utils/errorLogger')
vi.mock('@/js/utils/refreshToken')

vi.mock('../../../../../../sharedUtils/getConfig', async () => ({
  ...await vi.importActual('../../../../../../sharedUtils/getConfig'),
  getApplicationConfig: vi.fn(() => ({
    apiHost: 'http://test.com/dev',
    cookieDomain: 'example.com',
    tokenValidTime: '900'
  }))
}))

vi.mock('jsonwebtoken', async () => ({
  default: {
    decode: vi.fn().mockReturnValue({
      edlProfile: {
        name: 'Test User'
      },
      exp: (new Date('2024-01-01').getTime() / 1000) + 900,
      launchpadToken: 'mock-token'
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
          path: '/',
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

    describe('when the user token is about to expire', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      describe('when the first token\'s timer ends', () => {
        test('refreshes the user token', async () => {
          // The first timer will always refresh the token, because the user loaded the page
          // within the valid timeframe of the token
          const setCookie = vi.fn()
          useCookies.mockImplementation(() => ([
            {
              [MMT_COOKIE]: 'mock-jwt'
            },
            setCookie,
            vi.fn()
          ]))

          setup()

          await act(() => {
            vi.advanceTimersByTime(14.5 * 60 * 1000) // 14.5 minutes
          })

          expect(refreshToken).toHaveBeenCalledTimes(1)
          expect(refreshToken).toHaveBeenCalledWith(expect.objectContaining({
            jwt: 'mock-jwt'
          }))
        })
      })

      describe('when the user has not been active during the token valid time', () => {
        // TODO MMT-3750 check warning
        test('warns the user they will be logged out', async () => {
          const setCookie = vi.fn()
          useCookies.mockImplementation(() => ([
            {
              [MMT_COOKIE]: 'mock-jwt'
            },
            setCookie,
            vi.fn()
          ]))

          setup()

          // The first timeout will have a refresh
          await act(() => {
            vi.advanceTimersByTime(14.5 * 60 * 1000) // 14.5 minutes
          })

          expect(refreshToken).toHaveBeenCalledTimes(1)
          expect(refreshToken).toHaveBeenCalledWith(expect.objectContaining({
            jwt: 'mock-jwt'
          }))

          vi.clearAllMocks()

          // The second timeout will not have the user active, and will not refresh
          vi.advanceTimersByTime(14.5 * 60 * 1000) // 14.5 minutes

          expect(refreshToken).toHaveBeenCalledTimes(0)
        })
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
