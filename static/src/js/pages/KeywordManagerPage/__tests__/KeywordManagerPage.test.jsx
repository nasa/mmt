import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import * as getConfigModule from 'sharedUtils/getConfig'
import * as getKmsConceptVersionsModule from '@/js/utils/getKmsConceptVersions'
import * as createFormDataFromRdfModule from '@/js/utils/createFormDataFromRdf'
import userEvent from '@testing-library/user-event'
import * as getKmsKeywordTreeModule from '@/js/utils/getKmsKeywordTree'
import * as publishKmsConceptVersionModule from '@/js/utils/publishKmsConceptVersion'
import KeywordManagerPage from '../KeywordManagerPage'

vi.mock('@/js/utils/getKmsKeywordTree')

vi.mock('@/js/utils/publishKmsConceptVersion')

vi.mock('@/js/components/KeywordTree/KeywordTree', () => ({
  KeywordTree: vi.fn((props) => {
    if (!props.data) {
      return null
    }

    return (
      <div data-testid="keyword-tree">
        <pre>{JSON.stringify(props.data, null, 2)}</pre>
        <button type="button" onClick={() => props.onNodeClick('test-node-id')}>Click Node</button>
        <button
          type="button"
          onClick={
            () => props.onAddNarrower('parent-id', {
              id: 'new-id',
              title: 'New Keyword'
            })
          }
        >
          Add Narrower
        </button>
      </div>
    )
  })
}))

vi.mock('sharedUtils/getConfig')
vi.mock('@/js/utils/createFormDataFromRdf')

vi.mock('@/js/components/KeywordForm/KeywordForm', () => ({
  __esModule: true,
  default: vi.fn(({ initialData, onFormDataChange }) => (
    <div data-testid="keyword-form">
      <pre>{JSON.stringify(initialData, null, 2)}</pre>
      <button
        type="button"
        onClick={
          () => onFormDataChange({
            ...initialData,
            PreferredLabel: 'Updated Keyword'
          })
        }
      >
        Update Form Data
      </button>
    </div>
  ))
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

const mockToggleModal = vi.fn()

vi.mock('@/js/components/CustomModal/CustomModal', () => ({
  __esModule: true,
  default: ({
    show, toggleModal, header, message, actions
  }) => {
    if (show) {
      mockToggleModal.mockImplementation(toggleModal)
    }

    return show ? (
      <div
        data-testid="custom-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-header"
      >
        <h2 id="modal-header">{header}</h2>
        <p>{message}</p>
        <button
          type="button"
          onClick={toggleModal}
          data-testid="modal-close"
        >
          Close
        </button>
        {
          actions && actions.map((action) => (
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
    test('should render the KeywordManagerPage component', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Keyword Manager' })).toBeVisible()
      })

      expect(screen.getByText('Version:')).toBeVisible()
      expect(screen.getByText('Scheme:')).toBeVisible()
      expect(screen.getAllByRole('combobox')).toHaveLength(2)
    })
  })

  describe('when a version is selected', () => {
    test('should update selectedVersion', async () => {
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

    test('should show warning modal when a published version is selected', async () => {
      setup()

      await waitFor(() => {
        expect(screen.getByTestId('version-selector')).toBeInTheDocument()
      })

      const versionSelector = screen.getByTestId('version-selector')

      // Simulate selecting a published version
      fireEvent.change(versionSelector, { target: { value: '3.0' } })

      // Check if the warning modal is shown
      await waitFor(() => {
        expect(screen.getByText('Warning')).toBeVisible()
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

    test('should close warning modal when toggleModal is called', async () => {
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

  describe('when publishing a new version', () => {
    let publishKmsConceptVersionMock

    beforeEach(() => {
      publishKmsConceptVersionMock = vi.fn()
      vi.spyOn(publishKmsConceptVersionModule, 'publishKmsConceptVersion').mockImplementation(publishKmsConceptVersionMock)
    })

    test('should open publish modal when "Publish New Keyword Version" button is clicked', async () => {
      const { user } = setup()

      // Look for the button within the PageHeader
      const pageHeader = screen.getByRole('banner')
      const publishButton = within(pageHeader).getByRole('button', {
        name: /publish new keyword version/i
      })

      await user.click(publishButton)

      // Check if the modal is opened
      expect(screen.getByText('Publish New Keyword Version', { selector: 'h2' })).toBeInTheDocument()
      expect(screen.getByLabelText('Version Name:')).toBeVisible()
    })

    test('should close publish modal when Cancel button is clicked', async () => {
      const { user } = setup()

      const publishButton = screen.getByRole('button', {
        name: /publish new keyword version/i
      })
      await user.click(publishButton)

      // Check if the modal is opened
      expect(screen.getByLabelText('Version Name:')).toBeVisible()

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      // Check if the modal is closed by verifying the absence of the Version Name input
      await waitFor(() => {
        expect(screen.queryByLabelText('Version Name:')).not.toBeInTheDocument()
      })
    })

    test('should initiate publish process when Publish button is clicked', async () => {
      const { user } = setup()

      // Open the publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Verify that the modal for entering version name is shown
      const versionNameInput = await screen.findByLabelText('Version Name:')
      expect(versionNameInput).toBeVisible()

      // Enter a new version name
      await user.type(versionNameInput, 'NewVersion')

      // Find and click the Publish button in the modal
      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Verify that the publish function was called with the correct version
      expect(publishKmsConceptVersionMock).toHaveBeenCalledWith('NewVersion')

      // Verify that the modal is closed after publishing
      await waitFor(() => {
        expect(screen.queryByLabelText('Version Name:')).not.toBeInTheDocument()
      })
    })

    test('should reset page state after successful publish', async () => {
      publishKmsConceptVersionMock.mockResolvedValue()
      const { user } = setup()

      // Select a version and scheme first
      const versionSelector = screen.getByTestId('version-selector')
      await user.selectOptions(versionSelector, '2.0')

      const schemeSelector = screen.getByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Publish new version
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      const versionNameInput = screen.getByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')

      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Wait for the publish process to complete
      await waitFor(() => {
        expect(screen.queryByText('Publishing...')).not.toBeInTheDocument()
      })

      expect(screen.queryByTestId('keyword-tree')).not.toBeInTheDocument()
      expect(screen.queryByTestId('keyword-form')).not.toBeInTheDocument()
      expect(screen.getByText('Select a version and scheme to load the tree')).toBeVisible()
    })
  })

  describe('when display publish modal', () => {
    test('should open publish modal and reset related states', async () => {
      const { user } = setup()

      // Find and click the "Publish New Keyword Version" button
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Check if the modal is opened by looking for a specific element inside the modal
      await waitFor(() => {
        expect(screen.getByLabelText('Version Name:')).toBeVisible()
      })

      // Check if the version name input is empty
      const versionNameInput = screen.getByLabelText('Version Name:')
      expect(versionNameInput).toHaveValue('')

      // Check if there's no publish error message
      expect(screen.queryByText(/error publishing new keyword version/i)).not.toBeInTheDocument()

      // Close the modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      // Check if the modal is closed by ensuring the version name input is no longer present
      await waitFor(() => {
        expect(screen.queryByLabelText('Version Name:')).not.toBeInTheDocument()
      })
    })
  })

  describe('KmsConceptSchemeSelector component', () => {
    test('should render the scheme selector next to the version selector', async () => {
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

    test('should update selectedScheme when a scheme is selected', async () => {
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

    test('scheme selector should be enabled when a version is selected', async () => {
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

  describe('KeywordTree component', () => {
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

    test('should render the tree when version and scheme are selected', async () => {
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

    test('should show loading message while fetching tree data', async () => {
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
      expect(screen.getByText('Loading...')).toBeVisible()

      // Wait for the loading to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      }, { timeout: 2000 })

      // Check that the tree is now loaded
      expect(screen.getByTestId('keyword-tree')).toBeInTheDocument()
    })

    test('should show error message when tree data fetch fails', async () => {
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
        expect(screen.getByText('Failed to load the tree. Please try again.')).toBeVisible()
      }, { timeout: 2000 })

      // Ensure the tree is not rendered
      expect(screen.queryByTestId('keyword-tree')).not.toBeInTheDocument()
    })

    test('should call handleShowKeyword and createFormDataFromRdf when a node is clicked', async () => {
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
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/concept/test-node-id?version=2.0'))
      })

      // Verify that createFormDataFromRdf was called with the fetched RDF data
      await waitFor(() => {
        expect(mockCreateFormDataFromRdf).toHaveBeenCalledWith('<rdf:RDF></rdf:RDF>')
      })

      // Check if the KeywordForm is rendered
      expect(screen.getByTestId('keyword-form')).toBeInTheDocument()
    })

    test('should show error message when fetching keyword data fails', async () => {
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

    test('should use "published" as version parameter when selected version is published', async () => {
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

    test('should update selected keyword data when handleAddNarrower is called', async () => {
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

      // Find and click the "Add Narrower" button
      const addNarrowerButton = screen.getByText('Add Narrower')
      await user.click(addNarrowerButton)

      // Wait for the KeywordForm to be rendered
      await waitFor(() => {
        expect(screen.getByTestId('keyword-form')).toBeInTheDocument()
      })

      const keywordFormContent = screen.getByTestId('keyword-form').textContent

      expect(keywordFormContent).toContain('"KeywordUUID": "new-id"')
      expect(keywordFormContent).toContain('"PreferredLabel": "New Keyword"')
      expect(keywordFormContent).toContain('"BroaderKeywords": [\n    {\n      "BroaderUUID": "parent-id"\n    }\n  ]')
    })
  })

  describe('Publishing process', () => {
    let publishKmsConceptVersionMock

    beforeEach(() => {
      publishKmsConceptVersionMock = vi.fn()
      vi.spyOn(publishKmsConceptVersionModule, 'publishKmsConceptVersion').mockImplementation(publishKmsConceptVersionMock)
    })

    test('should show publishing modal while publishing is in progress', async () => {
      // Mock the publishKmsConceptVersion function to delay resolution
      publishKmsConceptVersionMock = vi.fn(() => new Promise((resolve) => {
        setTimeout(resolve, 100)
      }))

      vi.spyOn(publishKmsConceptVersionModule, 'publishKmsConceptVersion')
        .mockImplementation(publishKmsConceptVersionMock)

      const { user } = setup()

      // Open publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Enter version name and click publish
      const versionNameInput = screen.getByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')
      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Check if the publishing state is entered
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Publish' })).not.toBeInTheDocument()
      })

      expect(screen.queryByLabelText('Version Name:')).not.toBeInTheDocument()

      // Wait for publishing to complete
      await waitFor(() => {
        expect(publishKmsConceptVersionMock).toHaveBeenCalledWith('NewVersion')
      })
    })

    test('should re-enable publish button after error in publishing', async () => {
      publishKmsConceptVersionMock.mockRejectedValue(new Error('Publish failed'))
      const { user } = setup()

      // Open the publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Wait for the modal to open and find elements within it
      const modal = await screen.findByTestId('custom-modal')

      // Find the input field and type the new version name
      const versionNameInput = within(modal).getByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')

      // Find and click the publish button in the modal
      const modalPublishButton = within(modal).getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Wait for the publish action to be called
      await waitFor(() => {
        expect(publishKmsConceptVersionMock).toHaveBeenCalledWith('NewVersion')
      })

      // Wait for a short period to allow for state updates
      await waitFor(() => {}, { timeout: 100 })

      // Check if the main publish button is not disabled
      expect(publishButton).not.toBeDisabled()

      // Open the publish modal again to check if it's re-enabled
      await user.click(publishButton)

      // Wait for the modal to open again
      const reopenedModal = await screen.findByTestId('custom-modal')

      // Check if the version name input is present and empty
      const newVersionNameInput = within(reopenedModal).getByLabelText('Version Name:')
      expect(newVersionNameInput).toHaveValue('')

      // Check if the publish button in the modal is enabled
      const modalPublishButtonAfterError = within(reopenedModal).getByRole('button', { name: 'Publish' })
      expect(modalPublishButtonAfterError).not.toBeDisabled()
    })

    test('should close publish modal when toggleModal is called', async () => {
      const { user } = setup()

      // Open the publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Wait for the modal to open
      await waitFor(() => {
        expect(screen.getByTestId('custom-modal')).toBeInTheDocument()
      })

      // Find the close button within the modal
      const modal = screen.getByTestId('custom-modal')
      const closeButton = within(modal).getByTestId('modal-close')

      // Click the close button
      await user.click(closeButton)

      // Check if the modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
      })

      // Verify that the Version Name input is no longer present
      expect(screen.queryByLabelText('Version Name:')).not.toBeInTheDocument()
    })

    test('should not allow closing of publishing modal while publishing is in progress', async () => {
      const { user } = setup()

      // Mock the publishKmsConceptVersion function to delay resolution
      publishKmsConceptVersionMock = vi.fn(() => new Promise((resolve) => {
        setTimeout(resolve, 1000)
      }))

      vi.spyOn(publishKmsConceptVersionModule, 'publishKmsConceptVersion')
        .mockImplementation(publishKmsConceptVersionMock)

      // Open publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Enter version name and click publish
      const versionNameInput = screen.getByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')
      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Check if the publishing modal is shown
      await waitFor(() => {
        expect(screen.getByText('Publishing... Please wait.')).toBeVisible()
      })

      // Try to close the modal by calling toggleModal
      mockToggleModal()

      // Verify that the modal is still open
      expect(screen.getByText('Publishing... Please wait.')).toBeVisible()

      // Wait for publishing to complete
      await waitFor(() => {
        expect(publishKmsConceptVersionMock).toHaveBeenCalledWith('NewVersion')
      }, { timeout: 2000 })

      // Verify that the modal is closed after publishing is complete
      await waitFor(() => {
        expect(screen.queryByText('Publishing... Please wait.')).not.toBeInTheDocument()
      })
    })
  })
})
