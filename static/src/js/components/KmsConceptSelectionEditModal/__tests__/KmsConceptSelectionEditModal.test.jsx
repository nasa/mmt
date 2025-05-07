import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import React from 'react'
import {
  beforeEach,
  describe,
  expect,
  vi
} from 'vitest'

import {
  KmsConceptSelectionEditModal
} from '@/js/components/KmsConceptSelectionEditModal/KmsConceptSelectionEditModal'
import getKmsKeywordTree from '@/js/utils/getKmsKeywordTree'

vi.mock('@/js/components/KeywordTree/KeywordTree', () => {
  const MockKeywordTree = ({ onNodeClick }) => (
    <button
      type="button"
      data-testid="keyword-tree"
      onClick={() => onNodeClick('mock-uuid')}
    >
      Mock Keyword Tree
    </button>
  )

  MockKeywordTree.propTypes = {
    onNodeClick: PropTypes.func.isRequired
  }

  return { KeywordTree: MockKeywordTree }
})

vi.mock('@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector', () => {
  const MockKmsConceptSchemeSelector = ({ onSchemeSelect }) => (
    <select
      data-testid="scheme-selector"
      onChange={() => onSchemeSelect({ name: 'New Scheme' })}
    >
      <option>Select a scheme</option>
      <option value="new-scheme">New Scheme</option>
    </select>
  )

  MockKmsConceptSchemeSelector.propTypes = {
    onSchemeSelect: PropTypes.func.isRequired
  }

  return { default: MockKmsConceptSchemeSelector }
})

vi.mock('@/js/utils/getKmsKeywordTree', () => ({
  default: vi.fn(() => Promise.resolve([{ id: 'mock-tree-data' }]))
}))

describe('KmsConceptSelectionEditModal', () => {
  const defaultProps = {
    show: true,
    toggleModal: vi.fn(),
    uuid: 'test-uuid',
    version: {
      version: '1.0',
      version_type: 'published'
    },
    scheme: { name: 'Test Scheme' },
    handleAcceptChanges: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('when the modal appears', () => {
    test('should render the header', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      const modalHeader = await screen.findByText('Select Concept')
      expect(modalHeader).toBeInTheDocument()
    })

    test('should render the scheme selector', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByTestId('scheme-selector')).toBeTruthy()
      })
    })

    test('should render the keyword tree', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeTruthy()
      })
    })
  })

  describe('when the modal is hidden', () => {
    test('should not show the modal', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} show={false} />)
      await waitFor(() => {
        expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('when user selects a scheme', () => {
    test('shows tree is loading', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      const schemeSelector = await screen.findByTestId('scheme-selector')
      fireEvent.change(schemeSelector)
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeTruthy()
      })
    })

    test('should render tree when a scheme is selected', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      const schemeSelector = await screen.findByTestId('scheme-selector')
      fireEvent.change(schemeSelector)
      await waitFor(() => {
        expect(screen.getByTestId('keyword-tree')).toBeTruthy()
      })
    })
  })

  describe('when user accept changes', () => {
    test('should responds with the uuid of the selected keyword', async () => {
      const handleAcceptChangesMock = vi.fn()
      const props = {
        ...defaultProps,
        handleAcceptChanges: handleAcceptChangesMock
      }

      render(<KmsConceptSelectionEditModal {...props} />)

      await waitFor(async () => {
        const keywordTree = screen.getByTestId('keyword-tree')
        await userEvent.click(keywordTree)
      })

      // Find and click the Accept button
      const acceptButton = screen.getByText('Accept')
      await userEvent.click(acceptButton)

      // Check if handleAcceptChanges was called with the new keyword value
      expect(handleAcceptChangesMock).toHaveBeenCalledWith('mock-uuid')
    })
  })

  describe('when user cancels changes', () => {
    test('should close the modal', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      await waitFor(async () => {
        const cancelButton = screen.getByText('Cancel')
        await userEvent.click(cancelButton)
        expect(defaultProps.toggleModal).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('when the user searches', () => {
    describe('when apply button is pressed', () => {
      test('should fetch the tree and includes search term', async () => {
        render(<KmsConceptSelectionEditModal {...defaultProps} />)
        const searchInput = await screen.findByPlaceholderText('Search by Pattern or UUID')
        fireEvent.change(searchInput, { target: { value: 'test search' } })
        const applyButton = screen.getByText('Apply')
        fireEvent.click(applyButton)
        await waitFor(() => {
          expect(getKmsKeywordTree).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'test search')
        })
      })
    })

    describe('when enter is pressed', () => {
      test('should fetch the tree and includes search term', async () => {
        render(<KmsConceptSelectionEditModal {...defaultProps} />)
        const searchInput = await screen.findByPlaceholderText('Search by Pattern or UUID')
        fireEvent.change(searchInput, { target: { value: 'test search' } })
        fireEvent.keyDown(searchInput, { key: 'Enter' })
        await waitFor(() => {
          expect(getKmsKeywordTree).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'test search')
        })
      })
    })

    describe('when fetch returns no results', () => {
      test('should show no results', async () => {
        vi.mocked(getKmsKeywordTree).mockResolvedValue(null)
        render(<KmsConceptSelectionEditModal {...defaultProps} />)
        const searchInput = await screen.findByPlaceholderText('Search by Pattern or UUID')
        await userEvent.type(searchInput, 'test pattern')
        const applyButton = screen.getByText('Apply')
        await userEvent.click(applyButton)
        await waitFor(() => {
          expect(screen.getByText('No results.')).toBeInTheDocument()
        })
      })
    })

    test('should handle fetch errors', async () => {
      vi.mocked(getKmsKeywordTree).mockRejectedValue(new Error('Fetch error'))
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      await waitFor(() => {
        expect(screen.getByText('Failed to load the tree. Please try again.')).toBeInTheDocument()
      })
    })

    test('should handling clearing the search box', async () => {
      render(<KmsConceptSelectionEditModal {...defaultProps} />)
      const textInput = await screen.findByPlaceholderText('Search by Pattern or UUID')
      fireEvent.change(textInput, { target: { value: 'test pattern' } })
      fireEvent.change(textInput, { target: { value: '' } })
      await waitFor(() => {
        expect(getKmsKeywordTree).toHaveBeenCalledWith(expect.anything(), expect.anything(), '')
      })
    })
  })

  describe('when no version is provided', () => {
    test('displays correct message', async () => {
      const propsWithoutVersion = {
        ...defaultProps,
        version: null
      }
      render(<KmsConceptSelectionEditModal {...propsWithoutVersion} />)
      await waitFor(() => {
        expect(screen.getByText('Select a version and scheme to load the tree')).toBeInTheDocument()
      })
    })
  })

  describe('when no scheme is provided', () => {
    test('displays correct message', async () => {
      const propsWithoutScheme = {
        ...defaultProps,
        scheme: null
      }
      render(<KmsConceptSelectionEditModal {...propsWithoutScheme} />)
      await waitFor(() => {
        expect(screen.getByText('Select a version and scheme to load the tree')).toBeInTheDocument()
      })
    })
  })
})
