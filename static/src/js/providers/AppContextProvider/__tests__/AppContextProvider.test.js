import React from 'react'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import useAppContext from '../../../hooks/useAppContext'
import AppContextProvider from '../AppContextProvider'

const MockComponent = () => {
  const { user, login, logout } = useAppContext()

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
    <AppContextProvider>
      <MockComponent />
    </AppContextProvider>
  )
}

describe('ManagePage component', () => {
  describe('when all metadata is provided', () => {
    beforeEach(() => {
      setup()
      jest.resetAllMocks()
    })

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
  })
})
