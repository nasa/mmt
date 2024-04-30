import React from 'react'
import { render, screen } from '@testing-library/react'

import ErrorBoundary from '../ErrorBoundary'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'

vi.mock('../../ErrorBanner/ErrorBanner')

const setup = () => {
  render(
    <ErrorBoundary>
      <span>Mock Component</span>
    </ErrorBoundary>
  )
}

describe('ErrorBoundary', () => {
  describe('when there is no errors', () => {
    test('renders the children with no error', async () => {
      setup()

      expect(screen.getByText('Mock Component')).toBeInTheDocument()
    })
  })

  describe('when there is an error', () => {
    test('renders error banner', async () => {
      const ThrowError = () => {
        throw new Error('Test for ErrorBoundary')
      }

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(ErrorBanner).toHaveBeenCalled(1)
    })
  })
})
