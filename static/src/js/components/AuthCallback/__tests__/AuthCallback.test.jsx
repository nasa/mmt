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

const setup = (jwt = 'mock-jwt', target = '/mock/target') => {
  const context = {
    setToken: vi.fn()
  }

  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter
        initialEntries={
          [{
            pathname: '/auth_callback',
            search: `?${createSearchParams({
              jwt,
              target
            })}`
          }]
        }
      >
        <AuthCallback />
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return {
    context
  }
}

describe('AuthCallback component', () => {
  describe('when the jwt exists', () => {
    test('calls setToken and Navigate', () => {
      const { context } = setup()

      expect(context.setToken).toHaveBeenCalledTimes(1)
      expect(context.setToken).toHaveBeenCalledWith('mock-jwt')

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: '/mock/target'
      }, {})
    })

    describe('when the target does not exist', () => {
      test('calls setToken and Navigate', () => {
        const { context } = setup('mock-jwt', '')

        expect(context.setToken).toHaveBeenCalledTimes(1)
        expect(context.setToken).toHaveBeenCalledWith('mock-jwt')

        expect(Navigate).toHaveBeenCalledTimes(1)
        expect(Navigate).toHaveBeenCalledWith({
          to: '/'
        }, {})
      })
    })
  })

  describe('when the jwt does not exist', () => {
    test('calls Navigate', () => {
      const { context } = setup('', '/mock/target')

      expect(context.setToken).toHaveBeenCalledTimes(0)

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: '/'
      }, {})
    })
  })
})
