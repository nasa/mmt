import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import AuthContext from '@/js/context/AuthContext'
import userEvent from '@testing-library/user-event'
import LayoutUnauthenticated from '../LayoutUnauthenticated'

import * as getConfig from '../../../../../../sharedUtils/getConfig'

const setup = () => {
  vi.spyOn(getConfig, 'getUmmVersionsConfig').mockImplementation(() => ({
    ummC: 'mock-umm-c',
    ummS: 'mock-umm-s',
    ummT: 'mock-umm-t',
    ummV: 'mock-umm-v'
  }))

  const context = {
    login: vi.fn()
  }

  const user = userEvent.setup()

  render(
    <AuthContext.Provider value={context}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutUnauthenticated />}>
            <Route
              index
              element={
                (
                  <>
                    This is some content
                  </>
                )
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )

  return {
    context,
    user
  }
}

describe('LayoutUnauthenticated component', () => {
  test('renders the content to the React Router Outlet', async () => {
    setup()

    expect(screen.getByText('This is some content')).toBeInTheDocument()
  })

  describe('when the login button is clicked', () => {
    test('calls login', async () => {
      const { context, user } = setup()

      const button = screen.getByRole('button', { name: /Log in/ })

      await user.click(button)
      expect(context.login).toHaveBeenCalledTimes(1)
    })
  })
})
