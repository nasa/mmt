import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'react-bootstrap'
import {
  beforeEach,
  describe,
  vi
} from 'vitest'

import KmsConceptSelectionWidget from '@/js/components/KmsConceptSelectionWidget/KmsConceptSelectionWidget'
import { getKmsConceptFullPaths } from '@/js/utils/getKmsConceptFullPaths'

// Mock the `getKmsConceptFullPaths` and Button components
vi.mock('@/js/utils/getKmsConceptFullPaths')

vi.mock('react-icons/fa', () => ({
  FaPencilAlt: () => <svg data-testid="pencil-icon" />,
  FaInfoCircle: () => <svg data-testid="info-circle" />,
  FaTimes: () => <svg data-testid="times" />
}))

vi.mock('@/js/components/KmsConceptSelectionEditModal/KmsConceptSelectionEditModal', () => {
  const KmsConceptSelectionEditModal = ({ show, handleAcceptChanges, toggleModal }) => (
    show ? (
      <div>
        <p>Handle Change Modal</p>
        <Button onClick={() => handleAcceptChanges('new-uuid')}>Accept Change</Button>
        {/* Add a button to simulate modal close using toggleModal */}
        <Button onClick={() => toggleModal(false)}>Cancel</Button>
      </div>
    ) : null
  )

  KmsConceptSelectionEditModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleAcceptChanges: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired
  }

  return { KmsConceptSelectionEditModal }
})

describe('KmsConceptSelectionWidget', () => {
  beforeEach(() => {
    getKmsConceptFullPaths.mockClear()
    getKmsConceptFullPaths.mockResolvedValue(['ScienceKeywords | ATMOSPHERE | TORNADOES'])
  })

  const renderComponent = (props = {}) => render(
    <KmsConceptSelectionWidget
      id="test-id"
      label="Test Label"
      onChange={vi.fn()}
      registry={
        {
          formContext: {
            focusField: null,
            version: {
              version: '1',
              version_type: 'draft'
            },
            scheme: { name: 'sciencekeywords' }
          }
        }
      }
      schema={
        {
          description: 'Description',
          maxLength: 255
        }
      }
      uiSchema={{ 'ui:title': 'UI Title' }}
      value="test-uuid"
      {...props}
    />
  )

  describe('when a user first loads the page', () => {
    test('should render the page', async () => {
      renderComponent()
      await waitFor(() => {
        expect(screen.getByText(/tornadoes/i)).toBeInTheDocument()
      })
    })

    test('should fetch and display the correct keyword', async () => {
      renderComponent()
      expect(getKmsConceptFullPaths).toHaveBeenCalledWith('test-uuid')
      await waitFor(async () => {
        expect(await screen.findByText('TORNADOES')).toBeInTheDocument()
      })
    })

    test('should show the full path as a title attribute', async () => {
      renderComponent()
      expect(getKmsConceptFullPaths).toHaveBeenCalledWith('test-uuid')
      await waitFor(() => {
        const keywordElement = screen.getByText(/tornadoes/i)
        const expectedTitle = /ScienceKeywords\s*>\s*ATMOSPHERE\s*>\s*TORNADOES/
        expect(keywordElement).toHaveAttribute('title', expect.stringMatching(expectedTitle))
      })
    })
  })

  describe('when a user clicks the edit icon', () => {
    test('should open the edit modal', async () => {
      renderComponent()
      const button = screen.getByRole('button', { name: /select/i })
      fireEvent.click(button)
      await waitFor(() => {
        expect(screen.getByText('Handle Change Modal')).toBeInTheDocument()
      })
    })

    test('should toggle the edit modal state correctly', async () => {
      renderComponent()

      // Open the modal
      const editButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(editButton)
      expect(screen.getByText('Handle Change Modal')).toBeInTheDocument()

      // Simulate clicking the custom cancel button in the modal
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      // Wait for the modal to no longer be in the document
      await waitFor(() => {
        expect(screen.queryByText('Handle Change Modal')).toBeNull()
      })
    })
  })

  describe('when a user accepts changes', () => {
    test('should call onChange when accepting the updated keyword from the modal', async () => {
      const onChangeMock = vi.fn()
      renderComponent({ onChange: onChangeMock })

      fireEvent.click(screen.getByRole('button', { name: /select/i }))
      fireEvent.click(screen.getByText('Accept Change'))

      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith('new-uuid')
      })
    })
  })

  describe('when the user encounters a network error', () => {
    test('should handle errors by adding a notification', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(console, 'log').mockImplementation(() => {})

      getKmsConceptFullPaths.mockRejectedValue(new Error('Failed to fetch full paths'))

      renderComponent()

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Error fetching keyword for test-uuid')
      })
    })
  })
})
