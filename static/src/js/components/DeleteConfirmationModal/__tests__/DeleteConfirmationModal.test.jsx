import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal'

describe('DeleteConfirmationModal', () => {
  const defaultProps = {
    show: true,
    nodeToDelete: { data: { title: 'Test Node' } },
    isDeleting: false,
    deleteError: null,
    onConfirm: vi.fn(),
    onCancel: vi.fn()
  }

  test('When rendered with default props, should display correct content', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument()
    expect(screen.getByText('Delete "Test Node"?')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  test('When isDeleting is true, should display spinner and disable buttons', () => {
    render(
      <DeleteConfirmationModal
        show
        nodeToDelete={{ data: { title: 'Test Node' } }}
        isDeleting
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    expect(screen.getByLabelText('Deleting')).toBeInTheDocument() // Look for the spinner by its aria-label
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  test('When deleteError is provided, should display error message', () => {
    const errorMessage = 'An error occurred during deletion'
    render(<DeleteConfirmationModal {...defaultProps} deleteError={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('When Cancel button is clicked, should call onCancel', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)

    screen.getByText('Cancel').click()
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })

  test('When Delete button is clicked, should call onConfirm', () => {
    render(<DeleteConfirmationModal {...defaultProps} />)

    screen.getByText('Delete').click()
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })
})
