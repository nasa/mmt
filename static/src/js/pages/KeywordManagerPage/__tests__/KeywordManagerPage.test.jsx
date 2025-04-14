import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import KeywordManagerPage from '../KeywordManagerPage'

vi.mock('@/js/components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }) => <div data-testid="error-boundary">{children}</div>
}))

vi.mock('@/js/components/Page/Page', () => ({
  default: ({ children, header }) => (
    <div data-testid="page">
      {header}
      {children}
    </div>
  )
}))

vi.mock('@/js/components/PageHeader/PageHeader', () => ({
  default: ({ title }) => <h1 data-testid="page-header">{title}</h1>
}))

const setup = () => {
  render(
    <BrowserRouter>
      <KeywordManagerPage />
    </BrowserRouter>
  )
}

describe('KeywordManagerPage component', () => {
  describe('when the page loads', () => {
    test('renders the KeywordManagerPage component', () => {
      setup()

      expect(screen.getByTestId('page')).toBeInTheDocument()

      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Keyword Manager')).toBeInTheDocument()

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()

      expect(screen.getByText('Keyword Management Tree to be inserted here')).toBeInTheDocument()
    })
  })
})
