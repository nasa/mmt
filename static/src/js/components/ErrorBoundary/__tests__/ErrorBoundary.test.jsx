import React from 'react'
import { render, screen } from '@testing-library/react'

import ErrorBoundary from '../ErrorBoundary'

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
      vi.spyOn(console, 'error').mockImplementation(() => {})

      const ThrowError = () => {
        throw new Error('Test for ErrorBoundary')
      }

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Test for ErrorBoundary')).toBeInTheDocument()
    })
  })

  describe('when there is an EDL timeout error', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    test('renders error banner asking user to refresh browser', async () => {
      const ThrowError = () => {
        const error = new Error('An unknown error occurred')
        error.graphQLErrors = [
          {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            },
            path: ['acl', 'groups']
          }
        ]

        throw error
      }

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Error retrieving groups. Please refresh')).toBeInTheDocument()
    })
  })
})
