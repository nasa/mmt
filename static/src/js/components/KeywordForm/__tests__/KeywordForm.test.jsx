import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  describe,
  expect,
  test,
  vi
} from 'vitest'

import { createUpdateKmsConcept } from '@/js/utils/createUpdateKmsConcept'
import { convertFormDataToRdf } from '@/js/utils/convertFormDataToRdf'
import KeywordForm from '../KeywordForm'

const mockInitialData = {
  Definition: 'This is a test keyword',
  KeywordUUID: 'fc0c7954-fdd2-4a16-905e-d3688dfc9be1',
  PreferredLabel: 'Test Keyword'
}

const setup = (overrideProps = {}) => {
  const defaultProps = {
    initialData: mockInitialData,
    scheme: { name: 'sciencekeywords' },
    version: { version: 'draft' }
  }

  const props = {
    ...defaultProps,
    ...overrideProps
  }

  return {
    user: userEvent.setup(),
    ...render(<KeywordForm {...props} />)
  }
}

vi.mock('@/js/hooks/useAuthContext', () => ({
  default: vi.fn(() => ({ token: 'mock-token' }))
}))

vi.mock('@/js/utils/convertFormDataToRdf', () => ({
  convertFormDataToRdf: vi.fn((data, userNote, scheme) => ({
    ...data,
    userNote,
    scheme,
    rdf: true
  }))
}))

vi.mock('@/js/utils/getUmmSchema', () => ({
  default: vi.fn(() => ({
    type: 'object',
    properties: {
      PreferredLabel: { type: 'string' },
      Definition: { type: 'string' }
    }
  }))
}))

vi.mock('@/js/utils/getUiSchema', () => ({
  default: vi.fn(() => ({
    'keyword-editor': {
      PreferredLabel: { 'ui:widget': 'text' },
      Definition: { 'ui:widget': 'textarea' }
    }
  }))
}))

vi.mock('@/js/utils/createUpdateKmsConcept', () => ({
  createUpdateKmsConcept: vi.fn(() => Promise.resolve())
}))

vi.mock('@/js/components/CustomModal/CustomModal', () => ({
  default: ({
    show, message, actions, toggleModal
  }) => (show ? (
    <div data-testid="custom-modal">
      <button type="button" data-testid="modal-close-button" onClick={toggleModal}>Close</button>
      {message}
      {
        actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))
      }
    </div>
  ) : null)
}))

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})

describe('when KeywordForm is rendered', () => {
  test('should display the form title', () => {
    setup()
    expect(screen.getByText('Edit Keyword')).toBeInTheDocument()
  })

  test('should render the form with initial data', () => {
    setup()
    expect(screen.getByDisplayValue('Test Keyword')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test keyword')).toBeInTheDocument()
  })
})

describe('when user types in the form', () => {
  test('should update formData when a change occurs', async () => {
    const mockOnFormDataChange = vi.fn()
    const { user } = setup({
      initialData: { PreferredLabel: '' },
      onFormDataChange: mockOnFormDataChange
    })

    const preferredLabelInput = screen.getByLabelText('Preferred Label')

    await user.type(preferredLabelInput, 'New Keyword')

    await waitFor(() => {
      expect(preferredLabelInput).toHaveValue('New Keyword')
    })

    expect(mockOnFormDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        PreferredLabel: 'New Keyword'
      })
    )
  })
})

describe('when initialData prop changes', () => {
  test('should update the form', () => {
    const { rerender } = setup({ initialData: { PreferredLabel: 'Initial Keyword' } })
    expect(screen.getByDisplayValue('Initial Keyword')).toBeInTheDocument()

    rerender(<KeywordForm
      initialData={{ PreferredLabel: 'Updated Keyword' }}
      scheme={{ name: 'sciencekeywords' }}
      version={{ version: 'draft' }}
    />)

    expect(screen.getByDisplayValue('Updated Keyword')).toBeInTheDocument()
  })
})

describe('when the form is submitted', () => {
  test('should open the modal when Save button is clicked', async () => {
    const { user } = setup()

    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)

    expect(screen.getByRole('textbox', { name: /Add a user note for your change/i })).toBeVisible()
  })

  test('should call createUpdateKmsConcept when final save is clicked', async () => {
    const mockOnSave = vi.fn()
    const { user } = setup({
      onSave: mockOnSave,
      token: 'mock-token',
      uid: 'test-user-id'
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    const modalSaveButton = screen.getAllByRole('button', { name: 'Save' })[1]
    await user.click(modalSaveButton)

    await waitFor(() => {
      expect(convertFormDataToRdf).toHaveBeenCalledWith(mockInitialData, '', { name: 'sciencekeywords' }, 'test-user-id')
    })

    const expectedRdfXml = {
      ...mockInitialData,
      userNote: '',
      scheme: { name: 'sciencekeywords' },
      rdf: true
    }

    expect(createUpdateKmsConcept).toHaveBeenCalledWith({
      rdfXml: expectedRdfXml,
      version: { version: 'draft' },
      token: 'mock-token'
    })
  })

  test('should close the modal after successful save', async () => {
    const { user } = setup()

    // Find the Save button within the form
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.queryByText('User Note')).not.toBeInTheDocument()
    })
  })

  test('should display error message when save fails', async () => {
    const { user } = setup()
    createUpdateKmsConcept.mockRejectedValueOnce(new Error('Save failed'))

    // Find the Save button within the form
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)

    // Click the modal's Save button
    const modalSaveButton = screen.getAllByRole('button', { name: 'Save' })[1]
    await user.click(modalSaveButton)

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument()
    })

    // Now perform additional assertions using Testing Library methods
    expect(screen.getByText(/failed/i, { selector: '.text-danger' })).toBeInTheDocument()
  })

  test('should update user note when typing', async () => {
    const { user } = setup()

    // Find the Save button within the form
    const saveButton = screen.getByRole('button', { name: 'Save' })
    await user.click(saveButton)

    const noteInput = screen.getByLabelText('Add a user note for your change (optional):')
    await user.type(noteInput, 'Test note')

    expect(noteInput).toHaveValue('Test note')
  })
})

describe('when the modal is open', () => {
  test('should close the modal when Cancel button is clicked', async () => {
    const { user } = setup()

    // Open the modal
    await user.click(screen.getByRole('button', { name: 'Save' }))

    // Verify that the modal is open
    expect(screen.getByTestId('custom-modal')).toBeInTheDocument()

    // Click the Cancel button
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    // Verify that the modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
    })
  })

  test('should close the modal when close button is clicked', async () => {
    const { user } = setup()

    // Open the modal
    await user.click(screen.getByRole('button', { name: 'Save' }))

    // Verify that the modal is open
    expect(screen.getByTestId('custom-modal')).toBeInTheDocument()

    // Click the close button
    await user.click(screen.getByTestId('modal-close-button'))

    // Verify that the modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('custom-modal')).not.toBeInTheDocument()
    })
  })
})
