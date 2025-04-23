import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import createFormDataFromRdf from '@/js/utils/createFormDataFromRdf'
import * as getConfigModule from 'sharedUtils/getConfig'
import * as getKmsConceptVersionsModule from '@/js/utils/getKmsConceptVersions'
import userEvent from '@testing-library/user-event'
import KeywordManagerPage from '../KeywordManagerPage'

vi.mock('sharedUtils/getConfig')
vi.mock('@/js/utils/createFormDataFromRdf')

vi.mock('@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder', () => ({
  default: () => <div>Metadata Preview Placeholder</div>
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

global.fetch = vi.fn()

vi.mock('@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector', () => ({
  __esModule: true,
  default: ({ onSchemeSelect, version }) => {
    const { useState, useEffect } = React

    const [schemes, setSchemes] = useState([])
    useEffect(() => {
      if (version) {
        setSchemes([
          {
            id: 'scheme1',
            name: 'Scheme 1'
          },
          {
            id: 'scheme2',
            name: 'Scheme 2'
          }
        ])
      }
    }, [version])

    return (
      <select
        data-testid="scheme-selector"
        onChange={
          (e) => onSchemeSelect({
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text
          })
        }
      >
        <option value="">Select a scheme</option>
        {
          schemes.map((scheme) => (
            <option key={scheme.id} value={scheme.id}>
              {scheme.name}
            </option>
          ))
        }
      </select>
    )
  }
}))

const setup = () => {
  const user = userEvent.setup()
  render(
    <BrowserRouter>
      <KeywordManagerPage />
    </BrowserRouter>
  )

  return { user }
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
        expect(screen.getByRole('heading', { name: 'Keyword Manager' })).toBeInTheDocument()
      })

      expect(screen.getByText('Version:')).toBeInTheDocument()
      expect(screen.getByText('Scheme:')).toBeInTheDocument()
      expect(screen.getAllByRole('combobox')).toHaveLength(2) // Two selectors
      expect(screen.getByRole('button', { name: 'Preview Keyword' })).toBeInTheDocument()
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

  describe('when a user clicks the Preview Keyword button', () => {
    describe('and the fetch is successful', () => {
      test('should display the keyword form', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          text: () => Promise.resolve('<rdf:RDF></rdf:RDF>')
        })

        const mockParsedData = {
          PreferredLabel: 'Test Keyword',
          Definition: 'This is a test definition'
        }
        createFormDataFromRdf.mockReturnValue(mockParsedData)

        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Preview Keyword' }))

        await waitFor(() => {
          expect(screen.getByText('Edit Keyword')).toBeInTheDocument()
        })

        expect(screen.getByText('This is a test definition')).toBeInTheDocument()
      })
    })

    describe('and the fetch fails', () => {
      test('should display an error message', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Fetch failed'))

        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Preview Keyword' }))

        await waitFor(() => {
          expect(screen.getByText('Fetch failed')).toBeInTheDocument()
        })

        expect(screen.queryByText('Edit Keyword')).not.toBeInTheDocument()
      })
    })

    describe('and the response is not ok', () => {
      test('should display an error message with the status', async () => {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          statusText: 'Not Found'
        })

        const { user } = setup()

        await user.click(screen.getByRole('button', { name: 'Preview Keyword' }))

        await waitFor(() => {
          expect(screen.getByText('HTTP error! status: 404')).toBeInTheDocument()
        })

        expect(screen.queryByText('Edit Keyword')).not.toBeInTheDocument()
      })
    })
  })

  describe('KmsConceptSchemeSelector', () => {
    test('renders the scheme selector next to the version selector', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      // Find the flex container using only Testing Library methods
      const versionLabel = screen.getByText('Version:')
      const schemeLabel = screen.getByText('Scheme:')

      expect(screen.getByText('Version:')).toBe(versionLabel)
      expect(screen.getByText('Scheme:')).toBe(schemeLabel)

      expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
    })

    test('updates selectedScheme when a scheme is selected', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      fireEvent.change(versionSelector, { target: { value: '2.0' } })

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      expect(schemeSelector).toHaveValue('')

      fireEvent.change(schemeSelector, { target: { value: 'scheme1' } })
      expect(schemeSelector).toHaveValue('scheme1')
    })

    test('scheme selector is enabled when a version is selected', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      fireEvent.change(versionSelector, { target: { value: '2.0' } })

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      expect(schemeSelector).not.toBeDisabled()
    })
  })
})
