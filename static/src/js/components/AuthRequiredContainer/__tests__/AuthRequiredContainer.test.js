import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { AuthRequiredContainer } from '../AuthRequiredContainer'
import { getApplicationConfig } from '../../../utils/getConfig'
import AppContext from '../../../context/AppContext'
import * as getConfig from '../../../utils/getConfig'

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

  test('should redirect if there is no app context user', () => {
    delete window.location
    window.location = {}

    jest.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      cookie: null
    }))

    setup(null)

    const { apiHost } = getApplicationConfig()
    const expectedPath = `${apiHost}/saml-login?target=${encodeURIComponent('/manage/tools')}`
    expect(window.location.href).toEqual(expectedPath)
  })

  test('should render children if there is an app context user', () => {
    jest.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
      cookie: {
        token: 'some-token'
      }
    }))

    setup(null)

    expect(screen.getByText('children')).toBeInTheDocument()
  })
})
