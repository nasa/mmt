import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { useQuery } from '@apollo/client'
import AppContext from '../../../context/AppContext'
import Header from '../Header'

// Mock the useQuery hook
jest.mock('@apollo/client')

// Mock the response for GET_ACLS
const mockedAclData = {
  data: {
    acls: {
      items: [
        { acl: { provider_identity: { provider_id: 'Provider 1' } } },
        { acl: { provider_identity: { provider_id: 'Provider 2' } } }
      ]
    }
  }
}

beforeEach(() => {
  // Reset the mock implementation before each test
  useQuery.mockClear()
})

// Set up the mock for useQuery
useQuery.mockReturnValue({ data: mockedAclData })

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

      const button = screen.getByRole('button', { name: 'Log in with Launchpad' })
      expect(button).toBeInTheDocument()
    })

    describe('when the login button is clicked', () => {
      test('calls the login function on the context', async () => {
        const { context } = setup()

        const user = userEvent.setup()
        const button = screen.getByRole('button', { name: 'Log in with Launchpad' })

        await user.click(button)

        expect(context.login).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when the user is logged in', () => {
    beforeEach(async () => {
      setup({
        overrideContext: {
          user: {
            name: 'User Name',
            providerId: 'MMT_2'
          },
          login: jest.fn(),
          logout: jest.fn()
        }
      })
    })

    test('displays the user name badge', () => {
      expect(screen.getByText('User Name')).toBeInTheDocument()
      expect(screen.getByText('User Name').className).toContain('badge')
      expect(screen.getByText('User Name').className).toContain('pointer dropdown-toggle badge bg-primary')
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
  })
})
