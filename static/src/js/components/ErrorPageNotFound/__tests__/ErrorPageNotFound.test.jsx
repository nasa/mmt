import React from 'react'
import { render, screen } from '@testing-library/react'

import ErrorPageNotFound from '../ErrorPageNotFound'

vi.mock('@/js/utils/errorLogger')
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mocked-uuid')
}))

const setup = () => {
  render(
    <ErrorPageNotFound />
  )
}

describe('ErrorPageNotFound', () => {
  describe('when a user tries to navigate to a page that does not exist', () => {
    test('renders the 404 page', () => {
      setup()

      expect(screen.getByText('Sorry! The page you were looking for does not exist.')).toBeInTheDocument()
      expect(screen.getByText('mocked-uuid')).toBeInTheDocument()
    })
  })
})
