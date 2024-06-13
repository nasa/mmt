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

vi.mock('react-router-dom', async () => ({
  ...await vi.importActual('react-router-dom'),
  useNavigate: vi.fn()
}))

const setup = ({
  overrideMocks,
  overrideContext = {},
  overrideInitalEntries = ['/']
} = {}) => {
  const context = {
    login: vi.fn(),
    ...overrideContext
  }

  const user = userEvent.setup()

  render(
    <AuthContext.Provider value={context}>
      <MockedProvider
        mocks={overrideMocks}
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
})
