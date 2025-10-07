import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'

import AuthContext from '@/js/context/AuthContext'

import ErrorPageNotFound from '../ErrorPageNotFound'

vi.mock('@/js/utils/errorLogger')

const setup = () => {
  const context = {
    login: vi.fn()
  }
  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter initialEntries={['/404']}>
        <Routes>
          <Route path="/404" element={<ErrorPageNotFound />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )

  return {
    context
  }
}

describe('ErrorPageNotFound', () => {
  describe('when a user tries to navigate to a page that does not exist', () => {
    test('renders the 404 page', () => {
      setup()

      expect(screen.getByText('Sorry! The page you were looking for does not exist.')).toBeInTheDocument()
      expect(screen.getByText('mock-uuid')).toBeInTheDocument()
    })
  })
})
