import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import AuthContext from '@/js/context/AuthContext'
import MMT_COOKIE from 'sharedConstants/mmtCookie'

import ErrorUnauthorizedAccess from '../ErrorUnauthorizedAccess'
import * as getConfig from '../../../../../../sharedUtils/getConfig'

const mockRemoveCookie = vi.fn()
vi.mock('@/js/hooks/useMMTCookie', () => ({
  __esModule: true,
  default: () => ({
    removeCookie: mockRemoveCookie
  })
}))

vi.spyOn(getConfig, 'getApplicationConfig').mockImplementation(() => ({
  cookieDomain: '.example.com'
}))

const setup = (errorType) => {
  const context = {
    login: vi.fn()
  }
  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter initialEntries={[`/unauthorizedAccess?errorType=${errorType}`]}>
        <Routes>
          <Route path="/unauthorizedAccess" element={<ErrorUnauthorizedAccess />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return {
    context
  }
}

describe('ErrorUnauthorizedAccess component', () => {
  beforeEach(() => {
    mockRemoveCookie.mockClear()
  })

  describe('when errorType is "deniedAccessMMT"', () => {
    test('renders the deniedAccessMMT error message', () => {
      setup('deniedAccessMMT')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access MMT.')).toBeInTheDocument()
    })

    test('clears the auth cookie so the user can log in again', () => {
      setup('deniedAccessMMT')

      expect(mockRemoveCookie).toHaveBeenCalledWith(MMT_COOKIE, {
        domain: '.example.com',
        path: '/'
      })
    })
  })

  describe('when errorType is "deniedNonNasaAccessMMT"', () => {
    test('renders the non-NASA MMT error message', () => {
      setup('deniedNonNasaAccessMMT')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users.')).toBeInTheDocument()
    })

    test('clears the auth cookie so the user can log in again', () => {
      setup('deniedNonNasaAccessMMT')

      expect(mockRemoveCookie).toHaveBeenCalledWith(MMT_COOKIE, {
        domain: '.example.com',
        path: '/'
      })
    })
  })

  describe('when errorType is not provided', () => {
    test('renders the default error message', () => {
      setup('')
      expect(screen.getByText('An unknown error occurred.')).toBeInTheDocument()
    })

    test('clears the auth cookie', () => {
      setup('')

      expect(mockRemoveCookie).toHaveBeenCalledWith(MMT_COOKIE, {
        domain: '.example.com',
        path: '/'
      })
    })
  })

  describe('common elements', () => {
    beforeEach(() => {
      setup('deniedAccessMMT')
    })

    test('renders the contact information', () => {
      const contactLink = screen.getByText('Earthdata Operations')
      expect(contactLink).toBeInTheDocument()
      expect(contactLink).toHaveAttribute('href', 'mailto:support@earthdata.nasa.gov')
    })
  })

  describe('when errorType is an unrecognized value', () => {
    test('renders the default error message', () => {
      setup('foo')
      expect(screen.getByText('An unknown error occurred.')).toBeInTheDocument()
    })

    test('clears the auth cookie', () => {
      setup('foo')

      expect(mockRemoveCookie).toHaveBeenCalledWith(MMT_COOKIE, {
        domain: '.example.com',
        path: '/'
      })
    })
  })
})
