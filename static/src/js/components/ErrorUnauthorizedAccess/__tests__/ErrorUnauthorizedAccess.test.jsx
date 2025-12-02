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
      <MemoryRouter initialEntries={['/unauthorized']}>
        <Routes>
          <Route path="/unauthorized" element={<ErrorUnauthorizedAccess errorType={errorType} />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return {
    context
  }
}

describe('ErrorUnauthorizedAccess component', () => {
  describe('when errorType is "mmt"', () => {
    test('renders the MMT error message', () => {
      setup('mmt')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access MMT.')).toBeInTheDocument()
    })
  })

  describe('when errorType is "nonNasaDraft"', () => {
    test('renders the non-NASA draft error message', () => {
      setup('nonNasaMMT')
      expect(screen.getByText('It appears you are not provisioned with the proper permissions to access the MMT for Non-NASA Users.')).toBeInTheDocument()
    })
  })

  describe('common elements', () => {
    beforeEach(() => {
      setup('mmt')
    })

    test('renders the contact information', () => {
      const contactLink = screen.getByText('Earthdata Operations')
      expect(contactLink).toBeInTheDocument()
      expect(contactLink).toHaveAttribute('href', 'mailto:support@earthdata.nasa.gov')
    })
  })
})
