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
import * as createFormDataFromRdfModule from '@/js/utils/createFormDataFromRdf'
import userEvent from '@testing-library/user-event'
import * as getKmsKeywordTreeModule from '@/js/utils/getKmsKeywordTree'
import KeywordManagerPage from '../KeywordManagerPage'

vi.mock('@/js/utils/getKmsKeywordTree')

vi.mock('@/js/components/KeywordTree/KeywordTree', () => ({
  KeywordTree: vi.fn((props) => {
    if (!props.data) {
      return null
    }

    return (
      <div data-testid="keyword-tree">
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
        <button type="button" onClick={() => props.onNodeClick('test-node-id')}>Click Node</button>
      </div>
    )
  })
}))

vi.mock('sharedUtils/getConfig')
vi.mock('@/js/utils/createFormDataFromRdf')

vi.mock('@/js/components/KeywordForm/KeywordForm', () => ({
  __esModule: true,
  default: ({ initialData }) => (
    <div data-testid="keyword-form">
      <pre>{JSON.stringify(initialData, null, 2)}</pre>
    </div>
  )
}))

vi.mock('@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder', () => ({
  default: () => <div>Metadata Preview Placeholder</div>
}))

vi.mock('@/js/components/KmsConceptVersionSelector/KmsConceptVersionSelector', () => ({
  __esModule: true,
  default: ({ onVersionSelect }) => {
    const versions = [
      {
        version: '1.0',
        type: 'draft'
      },
      {
        version: '2.0',
        type: 'past_published'
      },
      {
        version: '3.0',
        type: 'published'
      }
    ]

    return (
      <select
        data-testid="version-selector"
        onChange={
          (e) => {
            const selected = versions.find((v) => v.version === e.target.value)
            onVersionSelect({
              version: selected.version,
              version_type: selected.type
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

vi.mock('@/js/components/CustomModal/CustomModal', () => ({
  __esModule: true,
  default: ({
    show, toggleModal, header, message, actions
  }) => (
    show ? (
      <div data-testid="custom-modal">
        <h2>{header}</h2>
        <p>{message}</p>
        <button type="button" onClick={toggleModal} data-testid="modal-close">Close</button>
        {
          actions.map((action) => (
            <button
              type="button"
              key={action.label}
              onClick={action.onClick}
              data-testid={`modal-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {action.label}
            </button>
          ))
        }
      </div>
    ) : null
  )
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
      expect(screen.getAllByRole('combobox')).toHaveLength(2)
    })
  })

  describe('when a version is selected', () => {
    test('updates selectedVersion', async () => {
      const { user } = setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')

      // Check initial state
      expect(versionSelector).toHaveValue('')

      // Simulate version selection
      await user.selectOptions(versionSelector, '3.0')

      // Check if the version selector value has been updated
      expect(versionSelector).toHaveValue('3.0')
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

    test('closes warning modal when toggleModal is called', async () => {
      const { user } = setup()

      // Select a published version to trigger the warning modal
      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      // Check if the warning modal is shown
      await waitFor(() => {
        expect(screen.getByTestId('custom-modal')).toBeInTheDocument()
      })

      // Find and click the close button
      const closeButton = screen.getByTestId('modal-close')
      await user.click(closeButton)

      // Check if the modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
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

  describe('KeywordTree', () => {
    let getKmsKeywordTreeMock

    beforeEach(() => {
      getKmsKeywordTreeMock = vi.fn().mockResolvedValue([
        {
          id: 'root',
          name: 'Root',
          children: [
            {
              id: 'child1',
              name: 'Child 1'
            },
            {
              id: 'child2',
              name: 'Child 2'
            }
          ]
        }
      ])

      vi.spyOn(getKmsKeywordTreeModule, 'default').mockImplementation(getKmsKeywordTreeMock)
    })

    test('renders the tree when version and scheme are selected', async () => {
      const { user } = setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
      })

      const treeContent = screen.getByTestId('keyword-tree')
      expect(treeContent).toHaveTextContent('"id": "root"')
      expect(treeContent).toHaveTextContent('"name": "Root"')
      expect(treeContent).toHaveTextContent('"name": "Child 1"')
      expect(treeContent).toHaveTextContent('"name": "Child 2"')
    })

    test('shows loading message while fetching tree data', async () => {
      getKmsKeywordTreeMock.mockImplementation(() => new Promise((resolve) => {
        setTimeout(() => resolve([]), 1000)
      }))

      const { user } = setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Check for the loading message
      await screen.findByText('Loading...')

      // Wait for the loading to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      }, { timeout: 2000 })

      // Check that the tree is now loaded
      expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
    })

    test('shows error message when tree data fetch fails', async () => {
      getKmsKeywordTreeMock.mockRejectedValue(new Error('Failed to fetch tree data'))

      const { user } = setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Wait for and check the error message
      await waitFor(() => {
        expect(screen.getByText('Failed to load the tree. Please try again.')).toBeInTheDocument()
      }, { timeout: 2000 })

      // Ensure the tree is not rendered
      expect(screen.queryByTestId('keyword-tree')).not.toBeInTheDocument()
    })

    test('calls handleShowKeyword and createFormDataFromRdf when a node is clicked', async () => {
      const mockCreateFormDataFromRdf = vi.fn().mockReturnValue({})
      vi.spyOn(createFormDataFromRdfModule, 'default').mockImplementation(mockCreateFormDataFromRdf)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rdf:RDF></rdf:RDF>')
      })

      const { user } = setup()

      // Select version and scheme
      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Wait for the tree to load
      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
      })

      // Simulate click on a node
      const clickButton = screen.getByText('Click Node')
      await user.click(clickButton)

      // Wait for the fetch to be called
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/concept/test-node-id'))
      })

      // Verify that createFormDataFromRdf was called with the fetched RDF data
      await waitFor(() => {
        expect(mockCreateFormDataFromRdf).toHaveBeenCalledWith('<rdf:RDF></rdf:RDF>')
      })
    })

    test('shows error message when fetching keyword data fails', async () => {
      // Mock fetch to return a non-OK response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      const { user } = setup()

      // Select version and scheme
      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Wait for the tree to load
      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
      })

      // Simulate click on a node
      const clickButton = screen.getByText('Click Node')
      await user.click(clickButton)

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('HTTP error! status: 404')).toBeInTheDocument()
      })

      // Ensure that the KeywordForm is not rendered
      expect(screen.queryByTestId('keyword-form')).not.toBeInTheDocument()
    })
    // Add this test within the 'KeywordTree' describe block

    test('uses "published" as version parameter when selected version is published', async () => {
      const mockCreateFormDataFromRdf = vi.fn().mockReturnValue({})
      vi.spyOn(createFormDataFromRdfModule, 'default').mockImplementation(mockCreateFormDataFromRdf)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('<rdf:RDF></rdf:RDF>')
      })

      const { user } = setup()

      // Select published version
      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0') // Assuming '3.0' is the published version

      // Close the warning modal
      await waitFor(() => {
        expect(screen.getByTestId('custom-modal')).toBeInTheDocument()
      })

      const okButton = screen.getByTestId('modal-action-ok')
      await user.click(okButton)

      // Select scheme
      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Wait for the tree to load
      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
      })

      // Simulate click on a node
      const clickButton = screen.getByText('Click Node')
      await user.click(clickButton)

      // Wait for the fetch to be called and check the URL
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/concept/test-node-id?version=published'))
      })

      // Verify that createFormDataFromRdf was called with the fetched RDF data
      await waitFor(() => {
        expect(mockCreateFormDataFromRdf).toHaveBeenCalledWith('<rdf:RDF></rdf:RDF>')
      })
    })
  })
})
