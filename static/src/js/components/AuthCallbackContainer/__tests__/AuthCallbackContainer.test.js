import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { MemoryRouter } from 'react-router'
import { createSearchParams } from 'react-router-dom'
import { Cookies, CookiesProvider } from 'react-cookie'
import * as router from 'react-router'
import AuthCallbackContainer from '../AuthCallbackContainer'
import Providers from '../../../providers/Providers/Providers'

const setup = (changeCookieFn, overrideSearchParams, overrideProps) => {
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
  cookie.addChangeListener(changeCookieFn)

  act(() => {
    render(
      <CookiesProvider defaultSetOptions={{ path: '/' }} cookies={cookie}>
        <Providers>
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
        </Providers>
      </CookiesProvider>
    )
  })
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
    const changeCookieFn = jest.fn()
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup(changeCookieFn)

    await waitFor(() => {
      expect(changeCookieFn).toHaveBeenCalledTimes(1)
    })

    expect(changeCookieFn).toHaveBeenCalledTimes(1)

    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)
    expires = new Date(expires)

    expect(changeCookieFn).toHaveBeenCalledWith({
      name: 'loginInfo',
      options: {},
      value: {
        auid: 'mock_user',
        name: 'mock_name',
        token: {
          tokenExp: expires.valueOf(),
          tokenValue: 'mock-token'
        }
      }
    })

    expect(navigateSpy).toHaveBeenCalledWith('/manage/services')
  })

  test('does not redirect if no target is provided', async () => {
    const changeCookieFn = jest.fn()
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup(changeCookieFn, {}) // No target search param
    await waitFor(() => {
      expect(changeCookieFn).toHaveBeenCalledTimes(1)
    })

    expect(navigateSpy).toHaveBeenCalledTimes(0)
  })
})
