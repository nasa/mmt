import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as getConfigModule from 'sharedUtils/getConfig'
import * as getKmsConceptVersionsModule from '@/js/utils/getKmsConceptVersions'
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
  __esModule: true,
  default: ({ onVersionSelect }) => {
    const { useState, useEffect } = React

    const [versions, setVersions] = useState([])
    useEffect(() => {
      getKmsConceptVersionsModule.default().then((result) => {
        setVersions(result.versions)
      })
    }, [])

    return (
      <select
        data-testid="version-selector"
        onChange={
          (e) => {
            const selectedVersion = versions.find((v) => v.version === e.target.value)
            onVersionSelect({
              version: selectedVersion.version,
              version_type: selectedVersion.type
            })
          }
        }
      >
        <option value="">Select a version</option>
        {
          versions.map((version) => (
            <option key={version.version} value={version.version}>
              {`${version.version} (${version.type.toUpperCase()})`}
            </option>
          ))
        }
      </select>
    )
  }
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
  let getKmsConceptVersionsMock

  beforeEach(() => {
    originalConsoleError = console.error
    console.error = vi.fn()

    getApplicationConfigMock = vi.fn().mockReturnValue({ showKeywordManager: 'true' })
    vi.spyOn(getConfigModule, 'getApplicationConfig').mockImplementation(getApplicationConfigMock)

    getKmsConceptVersionsMock = vi.fn().mockResolvedValue({
      versions: [
        {
          version: '1.0',
          type: 'draft',
          creation_date: '2023-01-01'
        },
        {
          version: '2.0',
          type: 'past_published',
          creation_date: '2023-02-01'
        },
        {
          version: '3.0',
          type: 'published',
          creation_date: '2023-03-01'
        }
      ]
    })

    vi.spyOn(getKmsConceptVersionsModule, 'default').mockImplementation(getKmsConceptVersionsMock)
  })

  afterEach(() => {
    console.error = originalConsoleError
    vi.restoreAllMocks()
  })

  describe('when the page loads', () => {
    test('renders the KeywordManagerPage component', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('page')).toBeInTheDocument()
      })

      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Keyword Manager')).toBeInTheDocument()
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
      expect(screen.getByText('Version:')).toBeInTheDocument()
      expect(screen.getByTestId('version-selector')).toBeInTheDocument()
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
    test('renders the KeywordManagerPage component', async () => {
      getApplicationConfigMock.mockReturnValue({ showKeywordManager: 'true' })

      setup()

      await waitFor(() => {
        expect(screen.getByTestId('page')).toBeInTheDocument()
      })

      expect(screen.getByTestId('page-header')).toBeInTheDocument()
      expect(screen.getByText('Keyword Manager')).toBeInTheDocument()
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
      expect(screen.getByText('Version:')).toBeInTheDocument()
      expect(screen.getByTestId('version-selector')).toBeInTheDocument()
    })
  })

  describe('when a version is selected', () => {
    test('updates selectedVersion', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')

      // Check initial state
      expect(versionSelector).toHaveValue('')

      // Simulate version selection
      fireEvent.change(versionSelector, { target: { value: '2.0' } })

      // Check if the version selector value has been updated
      expect(versionSelector).toHaveValue('2.0')
    })

    test('shows warning modal when a published version is selected', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')

      // Simulate selecting a published version
      fireEvent.change(versionSelector, { target: { value: '3.0' } })

      // Check if the warning modal is shown
      await waitFor(() => {
        expect(screen.getByText('Warning')).toBeInTheDocument()
      })

      expect(screen.getByText('You are now viewing the live published keyword version. Changes made to this version will show up on the website right away.')).toBeInTheDocument()

      // Close the modal
      fireEvent.click(screen.getByText('OK'))

      // Check if the modal is closed
      await waitFor(() => {
        expect(screen.queryByText('Warning')).not.toBeInTheDocument()
      })

      // Verify that the selected version is still set
      expect(versionSelector).toHaveValue('3.0')
    })
  })
})
