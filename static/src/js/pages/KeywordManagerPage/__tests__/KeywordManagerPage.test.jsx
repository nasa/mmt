import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as getConfigModule from 'sharedUtils/getConfig'
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

vi.mock('@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector', () => ({
  default: ({ onVersionSelect }) => (
    <select
      data-testid="version-selector"
      onChange={
        (e) => {
          const [version, type] = e.target.value.split('|')
          onVersionSelect({
            version,
            version_type: type
          })
        }
      }
    >
      <option value="">Select a version</option>
      <option value="1.0|draft">Version 1.0 (Draft)</option>
      <option value="2.0|draft">Version 2.0 (Draft)</option>
      <option value="3.0|published">Version 3.0 (Published)</option>
    </select>
  )
}))

const setup = () => {
  render(
    <BrowserRouter>
      <KeywordManagerPage />
    </BrowserRouter>
  )
}

describe('KeywordManagerPage component', () => {
  let originalConsoleError
  let getApplicationConfigMock

  beforeEach(() => {
    originalConsoleError = console.error
    console.error = vi.fn()

    // Mock the getApplicationConfig function
    getApplicationConfigMock = vi.fn().mockReturnValue({ showKeywordManager: 'true' })
    vi.spyOn(getConfigModule, 'getApplicationConfig').mockImplementation(getApplicationConfigMock)
  })

  afterEach(() => {
    console.error = originalConsoleError
    vi.restoreAllMocks()
  })

  describe('when the page loads', () => {
    test('renders the KeywordManagerPage component', () => {
      setup()

      expect(screen.getByTestId('page')).toBeInTheDocument()
      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Keyword Manager')).toBeInTheDocument()
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
      expect(screen.getByText('Version:')).toBeInTheDocument()
    })
  })

  describe('when showKeywordManager is false', () => {
    test('renders nothing', () => {
      getApplicationConfigMock.mockReturnValue({ showKeywordManager: 'false' })

      setup()

      expect(screen.queryByTestId('page')).not.toBeInTheDocument()
      expect(screen.queryByTestId('page-header')).not.toBeInTheDocument()
      expect(screen.queryByText('Keyword Manager')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()
      expect(screen.queryByText('Version:')).not.toBeInTheDocument()
    })
  })

  describe('when showKeywordManager is true', () => {
    test('renders the KeywordManagerPage component', () => {
      getApplicationConfigMock.mockReturnValue({ showKeywordManager: 'true' })

      setup()

      expect(screen.getByTestId('page')).toBeInTheDocument()
      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Keyword Manager')).toBeInTheDocument()
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
      expect(screen.getByText('Version:')).toBeInTheDocument()
    })
  })

  describe('when a version is selected', () => {
    test('calls onVersionSelect and updates selectedVersion', async () => {
      getApplicationConfigMock.mockReturnValue({ showKeywordManager: 'true' })

      setup()

      const versionSelector = screen.getByTestId('version-selector')

      // Check initial state
      expect(versionSelector).toHaveValue('')

      // Simulate version selection
      fireEvent.change(versionSelector, { target: { value: '2.0|draft' } })

      // Check if the version selector value has been updated
      expect(versionSelector).toHaveValue('2.0|draft')
    })

    test('shows warning modal when a published version is selected', async () => {
      getApplicationConfigMock.mockReturnValue({ showKeywordManager: 'true' })

      const { rerender } = render(
        <BrowserRouter>
          <KeywordManagerPage />
        </BrowserRouter>
      )

      const versionSelector = screen.getByTestId('version-selector')

      // Simulate selecting a published version
      fireEvent.change(versionSelector, { target: { value: '3.0|published' } })

      // Check if the warning modal is shown
      await waitFor(() => {
        expect(screen.getByText('Warning')).toBeInTheDocument()
      })

      expect(screen.getByText('You are now viewing the live published keyword version. Changes made to this version will show up on the website right away.')).toBeInTheDocument()

      // Close the modal
      fireEvent.click(screen.getByText('OK'))

      // Force a re-render to reflect the state change
      rerender(
        <BrowserRouter>
          <KeywordManagerPage />
        </BrowserRouter>
      )

      // Check if the modal is closed
      await waitFor(() => {
        expect(screen.queryByText('Warning')).not.toBeInTheDocument()
      })

      // Verify that the selected version is still set
      expect(versionSelector).toHaveValue('3.0|published')
    })
  })
})
