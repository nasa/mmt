import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { MemoryRouter } from 'react-router'
import { createSearchParams } from 'react-router-dom'
import * as router from 'react-router'
import AuthCallbackContainer from '../AuthCallbackContainer'

const setup = (overrideSearchParams, overrideProps) => {
  const props = {
    children: 'children',
    ...overrideProps
  }

  act(() => {
    render(
      <MemoryRouter initialEntries={
        [{
          pathname: '/auth_callbac',
          search: `?${createSearchParams(overrideSearchParams || ({
            target: '/manage/services'
          }))}`
        }]
      }
      >
        <AuthCallbackContainer {...props} />
      </MemoryRouter>
    )
  })
}

describe('AuthCallbackContainer component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sets the user and redirects', () => {
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup()
    expect(navigateSpy).toHaveBeenCalledTimes(1)
    expect(navigateSpy).toHaveBeenCalledWith('/manage/services')
  })

  test('does not redirect if no target is provided', () => {
    const navigateSpy = jest.fn()
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigateSpy)

    setup({}) // No target search param
    expect(navigateSpy).toHaveBeenCalledTimes(0)
  })
})
