import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { MemoryRouter } from 'react-router'
import { createSearchParams } from 'react-router-dom'
import { Cookies, CookiesProvider } from 'react-cookie'
import * as router from 'react-router'
import AuthCallbackContainer from '../AuthCallbackContainer'
import AppContext from '../../../context/AppContext'

const setup = (overrideUser, overrideSearchParams, overrideProps) => {
  const props = {
    children: 'children',
    ...overrideProps
  }
  global.fetch = vi.fn(() => Promise.resolve({
    json: () => Promise.resolve({
      ok: true,
      statusCode: 200,
      status: 'success',
      name: 'mock_name'
    })
  }))

  const cookie = new Cookies({
    launchpadToken: 'mock-token'
  })
  cookie.HAS_DOCUMENT_COOKIE = false

  let expires = new Date()
  expires.setMinutes(expires.getMinutes() + 15)
  expires = new Date(expires)

  const context = {
    updateLoginInfo: vi.fn(),
    user: overrideUser || {
      name: 'Mock User',
      token: {
        tokenValue: 'mock_token',
        tokenExp: expires
      }
    }
  }

  act(() => {
    render(
      <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
        <AppContext.Provider value={context}>
          <MemoryRouter initialEntries={
            [{
              pathname: '/auth_callback',
              search: `?${createSearchParams(overrideSearchParams || ({
                target: '/manage/services',
                auid: 'mock_user'
              }))}`
            }]
          }
          >
            <AuthCallbackContainer {...props} />
          </MemoryRouter>
        </AppContext.Provider>
      </CookiesProvider>
    )
  })

  return context
}

describe('AuthCallbackContainer component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('sets the user and calls updateLoginInfo', async () => {
    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    const context = setup({})

    expect(context.updateLoginInfo).toHaveBeenCalledTimes(1)
    expect(context.updateLoginInfo).toHaveBeenCalledWith('mock_user')
  })

  test('if we have user, navigate', async () => {
    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    setup()
    expect(navigateSpy).toHaveBeenCalledWith('/manage/services', { replace: true })
  })

  test('does not redirect if no target is provided', async () => {
    const navigateSpy = vi.fn()
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({}, {}) // No target search param
    expect(navigateSpy).toHaveBeenCalledTimes(0)
  })
})
