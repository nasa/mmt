import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import userEvent from '@testing-library/user-event'
import KeywordForm from '../KeywordForm'

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

describe('when KeywordForm is rendered', () => {
  const mockInitialData = {
    KeywordUUID: '123',
    PreferredLabel: 'Test Keyword',
    Definition: 'This is a test keyword'
  }

  test('should display the form title', () => {
    render(<KeywordForm initialData={mockInitialData} />)
    expect(screen.getByText('Edit Keyword')).toBeInTheDocument()
  })

  test('should render the form with initial data', () => {
    render(<KeywordForm initialData={mockInitialData} />)
    expect(screen.getByDisplayValue('Test Keyword')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test keyword')).toBeInTheDocument()
  })
})

describe('when user types in the form', () => {
  test('updates formData when a change occurs', async () => {
    const user = userEvent.setup()
    const mockOnFormDataChange = vi.fn()

    render(<KeywordForm
      initialData={{ PreferredLabel: '' }}
      onFormDataChange={mockOnFormDataChange}
    />)

    const preferredLabelInput = screen.getByLabelText('Preferred Label')

    await user.type(preferredLabelInput, 'New Keyword')

    // Wait for the state to update
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
  test('should update the form data', () => {
    const { rerender } = render(<KeywordForm initialData={{ PreferredLabel: 'Initial Keyword' }} />)
    expect(screen.getByDisplayValue('Initial Keyword')).toBeInTheDocument()

    rerender(<KeywordForm initialData={{ PreferredLabel: 'Updated Keyword' }} />)
    expect(screen.getByDisplayValue('Updated Keyword')).toBeInTheDocument()
  })
})
