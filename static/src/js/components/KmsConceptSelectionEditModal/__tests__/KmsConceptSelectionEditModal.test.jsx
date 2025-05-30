import React from 'react'

import {
  describe,
  test,
  expect,
  vi,
  beforeEach
} from 'vitest'
import {
  render,
  screen,
  within,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropTypes from 'prop-types'
import { KmsConceptSelectionEditModal } from '../KmsConceptSelectionEditModal'

vi.mock('@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector', () => ({
  default: vi.fn().mockImplementation(({ defaultScheme }) => (
    <select data-testid="mock-scheme-selector">
      <option value={defaultScheme.name}>{defaultScheme.name}</option>
      <option value="New Scheme">New Scheme</option>
    </select>
  ))
}))

vi.mock('@/js/components/KeywordTree/KeywordTree', () => {
  const MockKeywordTree = React.forwardRef(({ onNodeClick }, ref) => {
    const handleInteraction = () => onNodeClick('new-keyword-id')

    return (
      <div
        ref={ref}
        data-testid="mock-keyword-tree"
        onClick={handleInteraction}
        onKeyDown={
          (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              handleInteraction()
            }
          }
        }
        role="button"
        tabIndex={0}
      >
        Mocked KeywordTree
      </div>
    )
  })

  MockKeywordTree.propTypes = {
    onNodeClick: PropTypes.func.isRequired
  }

  MockKeywordTree.displayName = 'MockKeywordTree'

  return { KeywordTree: MockKeywordTree }
})

vi.mock('@/js/utils/getKmsKeywordTree', () => ({
  default: vi.fn().mockResolvedValue({
    ok: true,
    data: {
      id: 'root',
      children: [
        {
          id: 'child1',
          label: 'Child 1'
        },
        {
          id: 'child2',
          label: 'Child 2'
        }
      ]
    }
  })
}))

vi.mock('@/js/components/KmsConceptSchemeSelector/KmsConceptSchemeSelector', () => ({
  default: vi.fn().mockImplementation(({ defaultScheme, onSchemeSelect }) => (
    <select
      data-testid="mock-scheme-selector"
      onChange={
        (e) => onSchemeSelect({
          id: e.target.value,
          name: e.target.value
        })
      }
    >
      <option value={defaultScheme.name}>{defaultScheme.name}</option>
      <option value="New Scheme">New Scheme</option>
    </select>
  ))
}))

describe('KmsConceptSelectionEditModal', () => {
  const mockProps = {
    handleAcceptChanges: vi.fn(),
    scheme: {
      id: 'scheme1',
      name: 'Test Scheme'
    },
    show: true,
    toggleModal: vi.fn(),
    uuid: 'test-uuid',
    version: {
      version: '1.0',
      version_type: 'published'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when showing the modal', () => {
    test('should renders the modal when show is true', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)
      await waitFor(() => {
        expect(screen.getByText('Select Concept')).toBeInTheDocument()
      })
    })

    test('should not render the modal when show is false', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} show={false} />)
      await waitFor(() => {
        expect(screen.queryByText('Select Concept')).not.toBeInTheDocument()
      })
    })
  })

  describe('when selecting a scheme', () => {
    test('renders the scheme selector', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)

      // Wait for the modal to appear
      const modal = await screen.findByRole('dialog')

      // Find the scheme selector label
      const schemeLabel = within(modal).getByText('Scheme:')

      // Find the scheme selector (combobox)
      const schemeSelector = within(modal).getByRole('combobox')

      // Check if the label has the correct class
      expect(schemeLabel).toHaveClass('kms-concept-selection-edit-modal__label')

      // Check if the scheme selector exists
      expect(schemeSelector).toBeInTheDocument()

      // Check if the options are present in the scheme selector
      expect(within(schemeSelector).getByRole('option', { name: 'Test Scheme' })).toBeInTheDocument()
      expect(within(schemeSelector).getByRole('option', { name: 'New Scheme' })).toBeInTheDocument()

      // Check if the container class exists (without directly accessing nodes)
      const containerElement = screen.getByText((content, element) => element.classList.contains('kms-concept-selection-edit-modal__scheme-selector')
           && element.textContent.includes('Scheme:'))
      expect(containerElement).toBeInTheDocument()
    })

    test('should update selected scheme when a new scheme is selected', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)
      await waitFor(() => {
        const schemeSelector = screen.getByRole('combobox')
        expect(schemeSelector).toBeInTheDocument()
      })

      // Note: This part might need to be adjusted based on how your KmsConceptSchemeSelector is implemented
      const schemeSelector = screen.getByRole('combobox')
      await userEvent.selectOptions(schemeSelector, 'New Scheme')
      expect(schemeSelector).toHaveValue('New Scheme')
    })
  })

  describe('when handling callback functions', () => {
    test('should update selected scheme when onSchemeSelect is called', async () => {
      const { rerender } = render(<KmsConceptSelectionEditModal {...mockProps} />)

      // Wait for the component to render
      await screen.findByRole('dialog')

      // Get the scheme selector
      const schemeSelector = screen.getByTestId('mock-scheme-selector')

      // Simulate selecting a new scheme
      await userEvent.selectOptions(schemeSelector, 'New Scheme')

      // Re-render the component to reflect the state change
      rerender(<KmsConceptSelectionEditModal {...mockProps} />)

      // Check if the new scheme is selected
      expect(schemeSelector).toHaveValue('New Scheme')

      // Check if Accept button now uses the new scheme
      await userEvent.click(screen.getByText('Accept'))
      expect(mockProps.handleAcceptChanges).toHaveBeenCalledWith('test-uuid') // This should still be 'test-uuid' as we haven't changed the keyword
    })

    test('should update selected keyword when onHandleSelectKeyword is called', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)

      // Wait for the component to render
      await screen.findByRole('dialog')

      // Get the mock keyword tree
      const mockKeywordTree = screen.getByTestId('mock-keyword-tree')

      // Simulate selecting a new keyword
      await userEvent.click(mockKeywordTree)

      // Check if handleAcceptChanges is called with the new keyword when Accept is clicked
      await userEvent.click(screen.getByText('Accept'))

      // This now checks if handleAcceptChanges is called with the new keyword ID
      expect(mockProps.handleAcceptChanges).toHaveBeenCalledWith('new-keyword-id')
    })
  })

  describe('when interacting with buttons in the modal', () => {
    test('should toggleModal when Cancel button is clicked', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)
      await waitFor(() => {
        const cancelButton = screen.getByText('Cancel')
        expect(cancelButton).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Cancel'))
      expect(mockProps.toggleModal).toHaveBeenCalledWith(false)
    })

    test('should call handleAcceptChanges and toggleModal when Accept button is clicked', async () => {
      render(<KmsConceptSelectionEditModal {...mockProps} />)
      await waitFor(() => {
        const acceptButton = screen.getByText('Accept')
        expect(acceptButton).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Accept'))
      expect(mockProps.handleAcceptChanges).toHaveBeenCalledWith('test-uuid')
      expect(mockProps.toggleModal).toHaveBeenCalledWith(false)
    })
  })
})
