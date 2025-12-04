import React from 'react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import AuthContext from '@/js/context/AuthContext'

import ErrorUnauthorizedAccess from '../ErrorUnauthorizedAccess'

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
  describe('when errorType is "deniedAccessMMT"', () => {
    test('renders the deniedAccessMMT error message', () => {
      setup('deniedAccessMMT')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access MMT.')).toBeInTheDocument()
    })
  })

  describe('when errorType is "deniedNonNasaAccessMMT"', () => {
    test('renders the non-NASA MMT error message', () => {
      setup('deniedNonNasaAccessMMT')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users.')).toBeInTheDocument()
    })
  })

  describe('when errorType is not provided', () => {
    test('renders the default error message', () => {
      setup('')
      expect(screen.getByText('An unknown error occurred.')).toBeInTheDocument()
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
  })
})
