import React from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { Cookies, CookiesProvider } from 'react-cookie'
import AuthContextProvider from '../AuthContextProvider'
import useAuthContext from '../../../hooks/useAuthContext'
import checkAndRefreshToken from '../../../utils/checkAndRefreshToken'

jest.mock('../../../utils/getConfig', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/getConfig'),
  getApplicationConfig: jest.fn(() => ({
    apiHost: 'http://test.com/dev'
  }))
}))

jest.mock('../../../utils/checkAndRefreshToken', () => ({
  __esModule: true,
  default: jest.fn()
}))

const MockComponent = () => {
  const { user, login, logout } = useAuthContext()

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
        auid: 'username',
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
        <MockComponent />
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

        setup({})

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })
        await user.click(button)
        const expectedPath = `http://test.com/dev/saml-login?target=${encodeURIComponent('/manage/collections')}`
        expect(window.location.href).toEqual(expectedPath)
      })
    })

    describe('when logged in', () => {
      describe('when log out is triggered', () => {
        beforeEach(() => {
          jest.useFakeTimers()
          jest.setSystemTime(new Date('2024-01-01'))
        })

        afterEach(() => {
          jest.useRealTimers()
        })

        test('logs the user out', async () => {
          delete window.location
          window.location = {}

          setup()

          const user = userEvent.setup({ delay: null })
          const loginButton = screen.getByRole('button', { name: 'Log in' })

          await user.click(loginButton)

          const userName = screen.getByText('User Name: User Name', { exact: true })
          expect(userName).toBeInTheDocument()

          let expires = new Date()
          expires.setMinutes(expires.getMinutes() + 15)
          expires = new Date(expires)

          act(() => {
            jest.advanceTimersByTime(1500)
          })

          expect(checkAndRefreshToken).toHaveBeenCalledTimes(1)

          expect(checkAndRefreshToken).toHaveBeenCalledWith(
            expect.objectContaining({
              name: 'User Name',
              auid: 'username',
              providerId: 'MMT_2',
              token: {
                tokenExp: expires.valueOf(),
                tokenValue: 'ABC-1'
              }
            }),
            expect.any(Function)
          )
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
    })
  })
})
