import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as router from 'react-router'
import { AuthRequiredContainer } from '../AuthRequiredContainer'
import { getApplicationConfig } from '../../../../../../sharedUtils/getConfig'
import AppContext from '../../../context/AppContext'

const setup = (overrideUser, overrideProps) => {
  const context = {
    user: overrideUser || {}
  }
  const props = {
    children: 'children',
    ...overrideProps
  }

  act(() => {
    render(
      <AppContext.Provider value={context}>
        <MemoryRouter initialEntries={
          [{
            pathname: '/manage/tools'
          }]
        }
        >
          <AuthRequiredContainer {...props} />
        </MemoryRouter>
      </AppContext.Provider>
    )
  })

  return {
    context,
    user: userEvent.setup()
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('AuthRequiredContainer component', () => {
  const { href } = window.location

  afterEach(() => {
    vi.clearAllMocks()
    window.location.href = href
  })

  test('should redirect to authenticate if user has not authenticated', () => {
    delete window.location
    window.location = {}
    setup(null)

    const { apiHost } = getApplicationConfig()
    const expectedPath = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/tools')}`
    expect(window.location.href).toEqual(expectedPath)
  })

  test('should not redirect if user has authenticated', () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    setup({
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires.valueOf()
      }
    })

    expect(screen.getByText('children')).toBeInTheDocument()
  })

  test('should redirect the user to / if token is expired', () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() - 2)
    expires = new Date(expires)

    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({
      token: {
        tokenValue: 'ABC-1',
        tokenExp: expires.valueOf()
      }
    })

    expect(navigateSpy).toHaveBeenCalledWith('/', { replace: true })
  })

  test('should redirect the user to / if there is no user data', () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() - 2)
    expires = new Date(expires)

    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({})

    expect(navigateSpy).toHaveBeenCalledWith('/', { replace: true })
  })

  test('should redirect the user to / if there is user data but no token', () => {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() - 2)
    expires = new Date(expires)

    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({ name: 'mock name' })

    expect(navigateSpy).toHaveBeenCalledWith('/', { replace: true })
  })
})
