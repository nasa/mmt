import React from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppContext from '../../../context/AppContext'
import Header from '../Header'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}))

const setup = ({
  overrideContext = {}
} = {}) => {
  const context = {
    user: {},
    login: jest.fn(),
    logout: jest.fn(),
    ...overrideContext
  }
  render(
    <AppContext.Provider value={context}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </AppContext.Provider>
  )

  return {
    context,
    user: userEvent.setup()
  }
}

describe('Header component', () => {
  test('displays the NASA Earthdata MMT logo', () => {
    setup()

    expect(screen.getByText('Metadata Management Tool')).toBeInTheDocument()
    expect(screen.getByText('Metadata Management Tool')).toHaveClass('nasa')
    expect(screen.getByText('Metadata Management Tool').textContent).toEqual('EarthdataMetadata Management Tool')
  })

  describe('when the user is logged out', () => {
    test('shows the log in button', () => {
      setup()

      const button = screen.getByRole('button', { name: /Log in with Launchpad/ })
      expect(button).toBeInTheDocument()
    })

    describe('when the login button is clicked', () => {
      test('calls the login function on the context', async () => {
        const { context } = setup()

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: /Log in with Launchpad/ })

        await user.click(button)

        expect(context.login).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when the user is logged in', () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    beforeEach(async () => {
      jest.clearAllMocks()

      setup({
        overrideContext: {
          user: {
            name: 'User Name',
            token: {
              tokenValue: 'ABC-1',
              tokenExp: expires
            }
          },
          login: jest.fn(),
          logout: jest.fn()
        }
      })
    })

    test('displays the user name badge', () => {
      expect(screen.getByText('User Name')).toBeInTheDocument()
      expect(screen.getByText('User Name').className).toContain('badge')
      expect(screen.getByText('User Name').className).toContain('bg-blue-light')
    })

    test('displays the search form', () => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Enter a search term')
    })

    test('displays the search submit button', () => {
      expect(screen.getByRole('button', { name: 'Search Collections' })).toBeInTheDocument()
    })

    test('does not display the search options dropdown', () => {
      expect(screen.getByText('Search Collections')).not.toHaveClass('show')
    })

    test('displays the provider dropdown', () => {
      expect(screen.getByRole('button', { name: 'MMT_2' })).toBeInTheDocument()
    })

    describe('when a provider is selected from the dropdown', () => {
      test('updates the selected provider in the state', async () => {
        const providerDropdownButton = screen.getByRole('button', { name: 'MMT_2' })
        userEvent.click(providerDropdownButton)

        const providerOption = await screen.findByText('MMT_2')
        userEvent.click(providerOption)

        await waitFor(() => {
          expect(screen.getByRole('button', { name: 'MMT_2' })).toBeInTheDocument()
        })
      })
    })

    describe('when the search submit dropdown button is clicked', () => {
      test('displays the search submit button', async () => {
        const user = userEvent.setup()

        const searchOptionsButton = screen.queryByRole('button', { name: 'Search Options' })

        await user.click(searchOptionsButton)

        expect(searchOptionsButton).toHaveAttribute('aria-expanded', 'true')
      })
    })

    describe('when the user types a search query', () => {
      test('updates the input', async () => {
        const user = userEvent.setup()
        const searchInput = await screen.getByRole('textbox', { name: 'Search' })

        await user.type(searchInput, 'search query')

        expect(searchInput).toHaveValue('search query')
      })

      describe('when the user submits search query using the input', () => {
        test('updates the input', async () => {
          const navigateMock = jest.fn()

          useNavigate.mockReturnValue(navigateMock)

          const user = userEvent.setup()
          const searchInput = await screen.getByRole('textbox', { name: 'Search' })
          const searchSubmitButton = await screen.getByRole('button', { name: 'Search Collections' })

          await user.type(searchInput, 'search query')

          expect(searchInput).toHaveValue('search query')

          await user.click(searchSubmitButton)

          expect(navigateMock).toHaveBeenCalledTimes(1)
          expect(navigateMock).toHaveBeenCalledWith('/search?type=collections&keyword=search query')
        })
      })

      describe('when the user submits search query using the enter key', () => {
        test('updates the input', async () => {
          const navigateMock = jest.fn()

          useNavigate.mockReturnValue(navigateMock)

          const user = userEvent.setup()
          const searchInput = await screen.getByRole('textbox', { name: 'Search' })

          await user.type(searchInput, 'search query')

          expect(searchInput).toHaveValue('search query')

          await user.type(searchInput, '{enter}')

          expect(navigateMock).toHaveBeenCalledTimes(1)
          expect(navigateMock).toHaveBeenCalledWith('/search?type=collections&keyword=search query')
        })
      })
    })
  })

  describe('when the clicks log out', () => {
    test('displays the search submit button', async () => {
      let expires = new Date()
      expires.setMinutes(expires.getMinutes() + 15)
      expires = new Date(expires)

      const { context } = setup({
        overrideContext: {
          user: {
            name: 'User Name',
            token: {
              tokenValue: 'ABC-1',
              tokenExp: expires.valueOf()
            }
          },
          login: jest.fn(),
          logout: jest.fn()
        }
      })

      const user = userEvent.setup()

      const userDropdownButton = screen.queryByRole('button', { name: 'User Name' })

      await user.click(userDropdownButton)

      const logoutButton = screen.queryByRole('button', { name: 'Logout' })

      await user.click(logoutButton)

      expect(context.logout).toHaveBeenCalledTimes(1)
      expect(context.logout).toHaveBeenCalledWith()
    })
  })
})
