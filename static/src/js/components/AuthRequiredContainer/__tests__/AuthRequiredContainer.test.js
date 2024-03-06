import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { AuthRequiredContainer } from '../AuthRequiredContainer'
import { getApplicationConfig } from '../../../utils/getConfig'
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
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('AuthRequiredContainer component', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
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
})
