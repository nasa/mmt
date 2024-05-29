import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import Header from '../Header'
import AuthContext from '../../../context/AuthContext'
import { providerResults } from './__mocks__/providerResults'

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: vi.fn()
}))

const setup = ({
  overrideMocks,
  overrideContext = {},
  overrideInitalEntries = ['/'],
  loggedIn = false
} = {}) => {
  vi.setSystemTime('2024-01-01')
  const mocks = [
    providerResults
  ]

  const now = new Date().getTime()

  const tokenExpires = loggedIn ? now + 1 : now - 1

  const context = {
    user: {
      name: 'User Name'
    },
    login: vi.fn(),
    tokenExpires,
    ...overrideContext
  }

  const user = userEvent.setup()

  render(
    <AuthContext.Provider value={context}>
      <MockedProvider
        mocks={overrideMocks || mocks}
      >
        <MemoryRouter initialEntries={[...overrideInitalEntries]}>
          <Routes>
            <Route path="/" element={<Header />} />
            <Route path="/:type" element={<Header />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </AuthContext.Provider>
  )

  return {
    context,
    user
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
    test('displays the user name badge', () => {
      setup({
        loggedIn: true
      })

      expect(screen.getByText('User Name')).toBeInTheDocument()
      expect(screen.getByText('User Name').className).toContain('badge')
    })
  })
})
