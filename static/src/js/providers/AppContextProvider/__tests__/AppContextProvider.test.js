import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import useAppContext from '../../../hooks/useAppContext'
import AppContextProvider from '../AppContextProvider'

const MockComponent = () => {
  const {
    user, login, logout
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
    </div>
  )
}

const setup = () => {
  render(
    <MockedProvider>
      <AppContextProvider>
        <MockComponent />
      </AppContextProvider>
    </MockedProvider>
  )
}

describe('AppContextProvider component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
      jest.resetAllMocks()
    })

    // Mock useLazyQuery
    const mockLazyQuery = jest.fn()

    jest.mock('@apollo/client', () => ({
      ...jest.requireActual('@apollo/client'),
      useLazyQuery: jest.fn(() => [mockLazyQuery])
    }))

    describe('when log in is triggered', () => {
      test('logs the user in', async () => {
        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })

        await user.click(button)

        const userName = screen.getByText('User Name: User Name', { exact: true })
        expect(userName).toBeInTheDocument()
      })
    })

    describe('when log out is triggered', () => {
      test('logs the user out', async () => {
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

    describe('when initial user state is set', () => {
      test('renders user name correctly', () => {
        const userName = screen.getByText('User Name: User Name', { exact: true })
        expect(userName).toBeInTheDocument()
      })
    })

    describe('when login function is called', () => {
      test('sets user state correctly', async () => {
        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in' })

        await user.click(button)

        expect(screen.getByText('User Name: User Name', { exact: true })).toBeInTheDocument()
      })
    })

    describe('when logout function is called', () => {
      test('clears user state correctly', async () => {
        const user = userEvent.setup()
        const loginButton = screen.getByRole('button', { name: 'Log in' })

        await user.click(loginButton)

        const logoutButton = screen.getByRole('button', { name: 'Log out' })
        await user.click(logoutButton)

        const newUserName = screen.queryByText('User Name: User Name', { exact: true })

        expect(newUserName).not.toBeInTheDocument()
      })
    })
  })
})
