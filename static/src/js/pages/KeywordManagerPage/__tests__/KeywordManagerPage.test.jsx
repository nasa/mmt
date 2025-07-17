import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
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
import userEvent from '@testing-library/user-event'
import * as publishKmsConceptVersionModule from '@/js/utils/publishKmsConceptVersion'
import * as useAuthContextModule from '@/js/hooks/useAuthContext'
import PropTypes from 'prop-types'
import GenerateKeywordReportModal from '@/js/components/GenerateKeywordReportModal/GenerateKeywordReportModal'
import { deleteKmsConcept } from '@/js/utils/deleteKmsConcept'
import KeywordManagerPage from '../KeywordManagerPage'

vi.mock('@/js/utils/deleteKmsConcept', () => ({
  deleteKmsConcept: vi.fn()
}))

// Get a reference to the mocked function
const mockDeleteKmsConcept = vi.mocked(deleteKmsConcept)

vi.mock('@/js/components/DeleteConfirmationModal/DeleteConfirmationModal', () => {
  const MockDeleteConfirmationModal = ({
    show, onConfirm, onCancel, deleteError
  }) => (
    show ? (
      <div data-testid="delete-confirmation-modal">
        {deleteError && <div data-testid="delete-error">{deleteError}</div>}
        <button type="button" onClick={onConfirm} data-testid="confirm-delete">Confirm Delete</button>
        <button type="button" onClick={onCancel} data-testid="cancel-delete">Cancel</button>
      </div>
    ) : null
  )

  MockDeleteConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    deleteError: PropTypes.string
  }

  MockDeleteConfirmationModal.defaultProps = {
    deleteError: null
  }

  return { DeleteConfirmationModal: MockDeleteConfirmationModal }
})

vi.mock('@/js/utils/getVersionName', () => ({
  getVersionName: vi.fn((version) => {
    if (!version) return null

    return version.version_type === 'published' ? 'published' : version.version
  })
}))

vi.mock('@/js/utils/errorLogger', () => ({
  __esModule: true,
  default: vi.fn()
}))

vi.mock('@/js/utils/getKmsKeywordTree')
vi.mock('@/js/utils/publishKmsConceptVersion')

vi.mock('@/js/hooks/useAuthContext', () => ({
  __esModule: true,
  default: vi.fn()
}))

vi.mock('@/js/components/ErrorBanner/ErrorBanner', () => ({
  default: ({ message }) => (
    <div data-testid="error-banner">
      <p data-testid="error-banner__message">{message}</p>
    </div>
  )
}))

vi.mock('@/js/components/GenerateKeywordReportModal/GenerateKeywordReportModal', () => ({
  __esModule: true,
  default: vi.fn(({ show, toggleModal }) => {
    if (show) {
      return (
        <div data-testid="generate-keyword-report-modal">
          Mocked Generate Keyword Report Modal
          <button type="button" onClick={() => toggleModal(false)}>Close Modal</button>
        </div>
      )
    }

    return null
  })
}))

export const mockRefreshTree = vi.fn()

vi.mock('@/js/components/KeywordTree/KeywordTree', () => {
  const KeywordTreeComponent = forwardRef(({ onNodeClick, onAddNarrower, onNodeDelete }, ref) => {
    const [refreshed, setRefreshed] = useState(false)
    const [selectedNode, setSelectedNode] = useState(null)

    useImperativeHandle(ref, () => ({
      refreshTree: () => {
        mockRefreshTree()
        setRefreshed(true)
      }
    }))

    return (
      <div data-testid="mock-keyword-tree">
        Mock Keyword Tree
        <button
          type="button"
          onClick={
            () => {
              onNodeClick('mock-node-id')
              setSelectedNode('mock-node-id')
            }
          }
        >
          Select Node
        </button>
        <button
          type="button"
          onClick={
            () => onAddNarrower('parent-id', {
              id: 'new-id',
              title: 'New Keyword'
            })
          }
        >
          Add Narrower
        </button>
        <button
          type="button"
          onClick={() => onNodeDelete({ id: 'mock-node-id' })}
          data-testid="delete-node-button"
        >
          Delete Node
        </button>
        {refreshed && <div data-testid="tree-refreshed">Tree refreshed</div>}
        {
          selectedNode && (
            <div data-testid="concept-selected">
              Concept selected:
              {selectedNode}
            </div>
          )
        }
      </div>
    )
  })
  KeywordTreeComponent.propTypes = {
    onNodeClick: PropTypes.func.isRequired,
    onAddNarrower: PropTypes.func.isRequired,
    onNodeDelete: PropTypes.func.isRequired
  }

  KeywordTreeComponent.displayName = 'KeywordTree'

  return { KeywordTree: KeywordTreeComponent }
})

// Partially mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    useLocation: () => ({
      pathname: '/keywords'
    }),
    useNavigate: () => vi.fn()
  }
})

vi.mock('@/js/components/KeywordForm/KeywordForm', () => ({
  default: ({ initialData, onSave }) => (
    initialData ? (
      <div data-testid="mock-keyword-form">
        <p data-testid="preferred-label">
          PreferredLabel:
          {' '}
          {initialData.PreferredLabel}
        </p>
        <button type="button" onClick={() => onSave('mock-keyword-id')}>Save Keyword</button>
      </div>
    ) : null
  )
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

  vi.spyOn(useAuthContextModule, 'default').mockImplementation(() => ({
    tokenValue: 'mock-token-value'
  }))

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
    mockRefreshTree.mockClear()
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
    vi.spyOn(useAuthContextModule, 'default').mockImplementation(() => ({
      tokenValue: 'mock-token-value'
    }))

    // Reset the mock before each test
    mockDeleteKmsConcept.mockReset()
    mockDeleteKmsConcept.mockResolvedValue(null)
  })

  afterEach(() => {
    console.error = originalConsoleError
    vi.restoreAllMocks()
    vi.clearAllMocks()
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

    test('should display error message when publishing fails', async () => {
      publishKmsConceptVersionMock.mockRejectedValue(new Error('Publish failed'))

      const { user } = setup()

      // Open the publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Enter a new version name
      const versionNameInput = await screen.findByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')

      // Find and click the Publish button in the modal
      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('Error publishing new keyword version. Please try again in a few minutes.')).toBeInTheDocument()
      })

      // Verify that the modal is still open
      expect(screen.getByTestId('custom-modal')).toBeInTheDocument()
    })

    test('should clear error message when attempting to publish again', async () => {
      publishKmsConceptVersionMock
        .mockRejectedValueOnce(new Error('Publish failed'))
        .mockResolvedValueOnce()

      const { user } = setup()

      // Open the publish modal
      const publishButton = screen.getByRole('button', { name: /publish new keyword version/i })
      await user.click(publishButton)

      // Enter a new version name
      const versionNameInput = await screen.findByLabelText('Version Name:')
      await user.type(versionNameInput, 'NewVersion')

      // Find and click the Publish button in the modal
      const modalPublishButton = screen.getByRole('button', { name: 'Publish' })
      await user.click(modalPublishButton)

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('Error publishing new keyword version. Please try again in a few minutes.')).toBeInTheDocument()
      })

      // Click the Publish button again
      await user.click(modalPublishButton)

      // Wait for the error message to disappear
      await waitFor(() => {
        expect(screen.queryByText('Error publishing new keyword version. Please try again in a few minutes.')).not.toBeInTheDocument()
      })

      // Verify that the modal is closed after successful publish
      await waitFor(() => {
        expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
      })
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
  })

  describe('when displaying publish modal', () => {
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

  describe('when selecting a scheme and version', () => {
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

    test('should enable scheme selector when a version is selected', async () => {
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

  describe('when adding or saving a keyword', () => {
    test('should refresh the keyword tree and set the selected keyword ID', async () => {
      const { user } = setup()

      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <skos:Concept rdf:about="http://example.com/concept/mock-uuid">
          <skos:prefLabel>Mock Keyword</skos:prefLabel>
          <skos:definition>This is a mock keyword for testing.</skos:definition>
        </skos:Concept>
      </rdf:RDF>`)
      }))

      vi.spyOn(React, 'useRef').mockReturnValue({ current: { refreshTree: mockRefreshTree } })

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

      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeInTheDocument()
      })

      const schemeSelector = screen.getByTestId('scheme-selector')
      expect(schemeSelector).toHaveValue('')

      fireEvent.change(schemeSelector, { target: { value: 'scheme1' } })
      expect(schemeSelector).toHaveValue('scheme1')

      // Click on a node in the mock tree to trigger handleShowKeyword
      await user.click(screen.getByRole('button', { name: /select node/i }))

      // Wait for the KeywordForm to appear
      await waitFor(() => {
        expect(screen.getByTestId('mock-keyword-form')).toBeInTheDocument()
      })

      // Click the save button in the mock KeywordForm
      const saveButton = screen.getByRole('button', { name: /save keyword/i })
      await user.click(saveButton)

      // Verify that mockRefreshTree was called
      expect(mockRefreshTree).toHaveBeenCalledTimes(1)
    })

    test('should not show the keyword form before a node is selected', async () => {
      setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await userEvent.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await userEvent.selectOptions(schemeSelector, 'scheme1')

      // Check that the keyword form is not present
      expect(screen.queryByTestId('mock-keyword-form')).not.toBeInTheDocument()
    })

    test('should show the keyword form after a node is selected', async () => {
      const { user } = setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Click the "Select Node" button
      await user.click(screen.getByRole('button', { name: /select node/i }))

      // Check that the keyword form is now present
      await waitFor(() => {
        expect(screen.getByTestId('mock-keyword-form')).toBeInTheDocument()
      })
    })

    test('should display an error banner when an error occurs', async () => {
      const { user } = setup()

      // Mock fetch to simulate an error
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Click the "Select Node" button
      await user.click(screen.getByRole('button', { name: /select node/i }))

      // Verify that an error banner is displayed
      await waitFor(() => {
        expect(screen.getByTestId('error-banner')).toBeInTheDocument()
      })

      // Verify the error message
      expect(screen.getByTestId('error-banner__message')).toHaveTextContent('Network error')

      // Verify that the KeywordForm is not displayed when there's an error
      expect(screen.queryByTestId('mock-keyword-form')).not.toBeInTheDocument()
    })

    test('should display an error banner when HTTP error occurs', async () => {
      const { user } = setup()

      // Mock fetch to simulate a HTTP error
      global.fetch = vi.fn(() => Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found')
      }))

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Click the "Select Node" button
      await user.click(screen.getByRole('button', { name: /select node/i }))

      // Wait for the error banner to appear
      await waitFor(() => {
        expect(screen.getByTestId('error-banner')).toBeInTheDocument()
      })

      // Verify the error message
      expect(screen.getByTestId('error-banner__message')).toHaveTextContent('HTTP error! status: 404')

      // Verify that the KeywordForm is not displayed when there's an error
      expect(screen.queryByTestId('mock-keyword-form')).not.toBeInTheDocument()
    })

    test('should create a new keyword and show the keyword form', async () => {
      const { user } = setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Click the "Add Narrower" button
      await user.click(screen.getByRole('button', { name: /add narrower/i }))

      // Check that the keyword form is shown
      await waitFor(() => {
        expect(screen.getByTestId('mock-keyword-form')).toBeInTheDocument()
      })

      // Check the content of the form
      const preferredLabel = screen.getByTestId('preferred-label')
      expect(preferredLabel).toHaveTextContent('PreferredLabel: New Keyword')

      // Alternatively, you can use a more flexible regex match:
      expect(preferredLabel).toHaveTextContent(/PreferredLabel:.*New Keyword/)

      // Check that the Save Keyword button is present
      expect(screen.getByRole('button', { name: /save keyword/i })).toBeInTheDocument()
    })
  })

  describe('Generate Report functionality', () => {
    test('should open the Generate Report modal when the button is clicked', async () => {
      const { user } = setup()

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Keyword Manager' })).toBeInTheDocument()
      })

      // Find the Generate Report button
      const generateReportButton = screen.getByRole('button', { name: /generate report/i })
      expect(generateReportButton).toBeInTheDocument()

      // Click the Generate Report button
      await user.click(generateReportButton)

      // Check if the GenerateKeywordReportModal is rendered
      await waitFor(() => {
        expect(screen.getByTestId('generate-keyword-report-modal')).toBeInTheDocument()
      })
    })

    test('should close the Generate Report modal when toggleModal is called', async () => {
      const { user } = setup()

      // Wait for the page to load
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Keyword Manager' })).toBeInTheDocument()
      })

      // Find and click the Generate Report button
      const generateReportButton = screen.getByRole('button', { name: /generate report/i })
      await user.click(generateReportButton)

      // Check if the GenerateKeywordReportModal is rendered
      await waitFor(() => {
        expect(screen.getByTestId('generate-keyword-report-modal')).toBeInTheDocument()
      })

      // Find and click the Close Modal button
      const closeModalButton = screen.getByRole('button', { name: /close modal/i })
      await user.click(closeModalButton)

      // Check if the GenerateKeywordReportModal is no longer rendered
      await waitFor(() => {
        expect(screen.queryByTestId('generate-keyword-report-modal')).not.toBeInTheDocument()
      })

      // Verify that the mock function was called with false
      expect(GenerateKeywordReportModal).toHaveBeenLastCalledWith(
        expect.objectContaining({ show: false }),
        expect.any(Object)
      )
    })
  })

  describe('Delete functionality', () => {
    test('should open delete confirmation modal when delete is triggered', async () => {
      const { user } = setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Wait for the modal to appear and then check its content
      let modal
      await waitFor(() => {
        modal = screen.getByTestId('delete-confirmation-modal')
        expect(modal).toBeInTheDocument()
      })

      expect(modal.textContent).toContain('Delete')

      // Check for the presence of confirm and cancel buttons
      expect(screen.getByTestId('confirm-delete')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-delete')).toBeInTheDocument()
    })

    test('should close delete confirmation modal when cancel is clicked', async () => {
      const { user } = setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Check if the delete confirmation modal is shown
      expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument()

      // Click cancel
      const cancelButton = screen.getByTestId('cancel-delete')
      await user.click(cancelButton)

      // Check if the modal is closed
      expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument()
    })

    test('should call deleteKmsConcept when delete is confirmed', async () => {
      const { user } = setup()

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Confirm delete
      const confirmButton = screen.getByTestId('confirm-delete')
      await user.click(confirmButton)

      // Wait for deleteKmsConcept to be called
      await waitFor(() => {
        expect(mockDeleteKmsConcept).toHaveBeenCalledTimes(1)
      }, { timeout: 2000 })

      // Check if deleteKmsConcept was called with the correct arguments
      expect(mockDeleteKmsConcept).toHaveBeenCalledWith(expect.objectContaining({
        uuid: 'mock-node-id',
        version: 'published',
        token: 'mock-token-value'
      }))

      // Wait for the modal to close
      await waitFor(() => {
        expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument()
      }, { timeout: 2000 })

      // Check if the tree refresh function was called
      expect(mockRefreshTree).toHaveBeenCalledTimes(1)
    })

    test('should display error message when delete fails', async () => {
      const { user } = setup()

      // Reset the mock and make it reject with an error
      mockDeleteKmsConcept.mockReset()
      mockDeleteKmsConcept.mockRejectedValue(new Error('Delete failed'))

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Get initial modal content
      const initialModalContent = screen.getByTestId('delete-confirmation-modal').textContent

      // Confirm delete
      const confirmButton = screen.getByTestId('confirm-delete')
      await user.click(confirmButton)

      // Check if deleteKmsConcept was called
      expect(mockDeleteKmsConcept).toHaveBeenCalledTimes(1)

      // Wait for the modal content to change
      await waitFor(() => {
        const updatedModalContent = screen.getByTestId('delete-confirmation-modal').textContent
        expect(updatedModalContent).not.toBe(initialModalContent)
      }, { timeout: 3000 })

      // Check if the error message is displayed
      const modalContent = screen.getByTestId('delete-confirmation-modal').textContent
      expect(modalContent.toLowerCase()).toContain('failed')

      // The modal should still be open
      expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument()
    })

    test('should close delete confirmation modal and clear error when closed', async () => {
      const { user } = setup()

      // Reset the mock and make it reject with an error
      mockDeleteKmsConcept.mockReset()
      mockDeleteKmsConcept.mockRejectedValue(new Error('Delete failed'))

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Confirm delete to trigger error
      const confirmButton = screen.getByTestId('confirm-delete')
      await user.click(confirmButton)

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('Delete failed')).toBeInTheDocument()
      })

      // Close the modal
      const cancelButton = screen.getByTestId('cancel-delete')
      await user.click(cancelButton)

      // Check if the modal is closed
      expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument()

      // Reopen the delete modal
      await user.click(deleteButton)

      // Check that the error message is no longer present
      expect(screen.queryByText('Delete failed')).not.toBeInTheDocument()
    })

    test('should display error message when deleteKmsConcept returns an error', async () => {
      const { user } = setup()

      // Mock deleteKmsConcept to return an error message
      mockDeleteKmsConcept.mockResolvedValue('An error occurred while deleting the concept')

      // Select version and scheme
      const versionSelector = await screen.findByTestId('version-selector')
      await user.selectOptions(versionSelector, '3.0')

      const schemeSelector = await screen.findByTestId('scheme-selector')
      await user.selectOptions(schemeSelector, 'scheme1')

      // Trigger delete
      const deleteButton = screen.getByTestId('delete-node-button')
      await user.click(deleteButton)

      // Confirm delete
      const confirmButton = screen.getByTestId('confirm-delete')
      await user.click(confirmButton)

      // Wait for the error message to appear
      await waitFor(() => {
        expect(screen.getByText('An error occurred while deleting the concept')).toBeInTheDocument()
      })

      // The modal should still be open
      expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument()
    })
  })
})
