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
  global.fetch = jest.fn(() => Promise.resolve({
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

  const context = {
    updateLoginInfo: jest.fn(),
    user: overrideUser || {
      name: 'Mock User',
      token: {
        tokenValue: 'mock_token',
        tokenExp: 1234
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
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('sets the user and redirects', async () => {
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    const context = setup()

    expect(context.updateLoginInfo).toHaveBeenCalledTimes(1)
    expect(context.updateLoginInfo).toHaveBeenCalledWith('mock_user')
    expect(navigateSpy).toHaveBeenCalledWith('/manage/services', { replace: true })
  })

  test('does not redirect if no target is provided', async () => {
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({}, {}) // No target search param
    expect(navigateSpy).toHaveBeenCalledTimes(0)
  })
})
