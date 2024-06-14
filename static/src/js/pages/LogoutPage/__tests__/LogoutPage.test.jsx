import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Navigate } from 'react-router'

import AuthContext from '@/js/context/AuthContext'

import LogoutPage from '../LogoutPage'

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

const setup = () => {
  vi.setSystemTime('2024-01-01')

  const context = {
    setToken: vi.fn()
  }

  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter>
        <LogoutPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return { context }
}

describe('LogoutPage component', () => {
  test('calls setToken and Navigate', () => {
    const { context } = setup()

    expect(context.setToken).toHaveBeenCalledTimes(1)
    expect(context.setToken).toHaveBeenCalledWith(null)

    expect(Navigate).toHaveBeenCalledTimes(1)
    expect(Navigate).toHaveBeenCalledWith({
      to: '/',
      replace: true
    }, {})
  })
})
