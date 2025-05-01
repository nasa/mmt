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
  it,
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
    it('should render the page', async () => {
      renderComponent()
      await waitFor(() => {
        expect(screen.getByText(/tornadoes/i)).toBeInTheDocument()
      })
    })

    it('should fetch and display the correct full path', async () => {
      renderComponent()
      expect(getKmsConceptFullPaths).toHaveBeenCalledWith('test-uuid')
      await waitFor(async () => {
        expect(await screen.findByText('TORNADOES')).toBeInTheDocument()
      })
    })
  })

  describe('when a user clicks the edit icon', () => {
    it('should open the edit modal', () => {
      renderComponent()
      const button = screen.getByRole('button', { name: /edit/i })
      fireEvent.click(button)
      expect(screen.getByText('Handle Change Modal')).toBeInTheDocument()
    })

    it('should toggle the edit modal state correctly', async () => {
      renderComponent()

      // Open the modal
      const editButton = screen.getByRole('button', { name: /edit/i })
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
    it('should call onChange when accepting changes from the modal', () => {
      const onChangeMock = vi.fn()
      renderComponent({ onChange: onChangeMock })

      fireEvent.click(screen.getByRole('button', { name: /edit/i }))
      fireEvent.click(screen.getByText('Accept Change'))

      expect(onChangeMock).toHaveBeenCalledWith('new-uuid')
    })
  })

  describe('error handling in fetchFullPaths', () => {
    it('should handle errors thrown by getKmsConceptFullPaths gracefully', async () => {
      getKmsConceptFullPaths.mockRejectedValueOnce(new Error('Failed to fetch full paths'))

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error')

      renderComponent()

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching versions:', expect.any(Error))
      })

      // Restore the console.error after the test
      consoleErrorSpy.mockRestore()
    })
  })
})
