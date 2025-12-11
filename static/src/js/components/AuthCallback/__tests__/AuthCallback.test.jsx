import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Navigate } from 'react-router'
import { createSearchParams } from 'react-router-dom'

import AuthContext from '@/js/context/AuthContext'

import checkNonNasaMMTAccess from 'sharedUtils/checkNonNasaMMTAccess'
import errorLogger from '@/js/utils/errorLogger'
import AuthCallback from '../AuthCallback'

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  Navigate: vi.fn()
}))

vi.mock('sharedUtils/checkNonNasaMMTAccess')
vi.mock('@/js/utils/errorLogger')

const setup = ({
  authLoading = false,
  tokenExpires = new Date().getTime() + 1,
  tokenValue = 'test-token',
  user = {
    assuranceLevel: 5,
    uid: 'test-user'
  },
  target = '/mock/target'
} = {}) => {
  vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

  const context = {
    authLoading,
    tokenExpires,
    tokenValue,
    user
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('token is not expired', () => {
    test('calls Navigate when assurance level is above the minimum', () => {
      setup({})

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        to: '/mock/target'
      }, {})
    })

    describe('when the target does not exist', () => {
      test('navigates to the home page when the target does not exist', () => {
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

  describe('when validating assurance level', () => {
    test('navigates to deniedAccessMMT when the assurance level is missing', () => {
      setup({
        user: {
          assuranceLevel: undefined,
          uid: 'test-user'
        }
      })

      expect(Navigate).toHaveBeenCalledWith({
        to: '/unauthorizedAccess?errorType=deniedAccessMMT',
        replace: true
      }, {})
    })

    test('navigates to deniedAccessMMT when the assurance level is less than minimum', () => {
      setup({
        user: {
          assuranceLevel: 3,
          uid: 'test-user'
        }
      })

      expect(Navigate).toHaveBeenCalledWith({
        to: '/unauthorizedAccess?errorType=deniedAccessMMT',
        replace: true
      }, {})
    })
  })

  describe('Non-NASA access checks', () => {
    test('navigates to the target when the user has Non-NASA access', async () => {
      checkNonNasaMMTAccess.mockResolvedValue(true)

      setup({
        user: {
          assuranceLevel: 4,
          uid: 'test-user'
        }
      })

      await waitFor(() => {
        expect(checkNonNasaMMTAccess).toHaveBeenCalledWith('test-user', 'test-token')
      })

      await waitFor(() => {
        expect(Navigate).toHaveBeenCalledWith({
          to: '/mock/target'
        }, {})
      })
    })

    test('navigates to the Non-NASA denied page when the user lacks access', async () => {
      checkNonNasaMMTAccess.mockResolvedValue(false)

      setup({
        user: {
          assuranceLevel: 4,
          uid: 'test-user'
        }
      })

      await waitFor(() => {
        expect(Navigate).toHaveBeenCalledWith({
          to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT',
          replace: true
        }, {})
      })
    })

    test('logs an error and navigates to the Non-NASA denied page when the check fails', async () => {
      const mockError = new Error('boom')
      checkNonNasaMMTAccess.mockRejectedValue(mockError)

      setup({
        user: {
          assuranceLevel: 4,
          uid: 'test-user'
        }
      })

      await waitFor(() => {
        expect(errorLogger).toHaveBeenCalledWith(mockError, 'AuthCallback: checking Non-NASA MMT access')
      })

      await waitFor(() => {
        expect(Navigate).toHaveBeenCalledWith({
          to: '/unauthorizedAccess?errorType=deniedNonNasaAccessMMT',
          replace: true
        }, {})
      })
    })
  })

  describe('when the token is expired', () => {
    test('navigates to the home page', () => {
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
