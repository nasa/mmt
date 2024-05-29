import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Navigate } from 'react-router'
import { createSearchParams } from 'react-router-dom'

import AuthContext from '@/js/context/AuthContext'

import AuthCallback from '../AuthCallback'

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

const setup = ({
  authLoading = false,
  tokenExpires = new Date().getTime() + 1,
  target = '/mock/target'
}) => {
  vi.setSystemTime('2024-01-01')

  const context = {
    authLoading,
    tokenExpires
  }

  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter
        initialEntries={
          [{
            pathname: '/auth_callback',
            search: `?${createSearchParams({
              target
            })}`
          }]
        }
      >
        <AuthCallback />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('AuthCallback component', () => {
  describe('token is not expired', () => {
    test('calls Navigate', () => {
      setup({})

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: '/mock/target'
      }, {})
    })

    describe('when the target does not exist', () => {
      test('calls setToken and Navigate', () => {
        setup({
          target: ''
        })

        expect(Navigate).toHaveBeenCalledTimes(1)
        expect(Navigate).toHaveBeenCalledWith({
          to: '/'
        }, {})
      })
    })
  })

  describe('when the token is expired', () => {
    test('does not call Navigate', () => {
      setup({
        tokenExpires: new Date().getTime() - 1
      })

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: '/'
      }, {})
    })
  })

  describe('when the auth is loading', () => {
    test('does not call Navigate', () => {
      setup({
        authLoading: true
      })

      expect(Navigate).toHaveBeenCalledTimes(0)
    })
  })
})
