import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { validateJson } from '@/js/utils/validateJson'
import { JsonFileUploadModal } from '../JsonFileUploadModal'

vi.mock('@/js/utils/validateJson')

const mockSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' }
  }
}

const setup = (props = {}) => {
  const defaultProps = {
    show: true,
    toggleModal: vi.fn(),
    schema: mockSchema,
    upload: vi.fn(),
    ...props
  }

  const user = userEvent.setup()

  return {
    user,
    ...render(<JsonFileUploadModal {...defaultProps} />)
  }
}

describe('JsonFileUploadModal', () => {
  describe('When the modal is shown', () => {
    test('should display the file upload area', () => {
      setup()
      expect(screen.getByText(/Drop a JSON file here or click to upload/)).toBeInTheDocument()
    })
  })

  describe('When a file is selected', () => {
    test('should display the file name', async () => {
      const { user } = setup()
      const file = new File(['{}'], 'test.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')
      await user.upload(input, file)

      expect(screen.getByText(/Selected file: test.json/)).toBeInTheDocument()
    })
  })

  describe('When the upload button is clicked without a file', () => {
    test('should display an error message', async () => {
      const { user } = setup()
      const uploadButton = screen.getByRole('button', { name: 'Upload' })

      await user.click(uploadButton)

      expect(screen.getByText('Please select a file to upload.')).toBeInTheDocument()
    })
  })

  describe('When an invalid JSON file is uploaded', () => {
    test('should display an error message', async () => {
      const { user } = setup()
      const file = new File(['invalid json'], 'test.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')

      await user.upload(input, file)

      const uploadButton = screen.getByRole('button', { name: 'Upload' })
      await user.click(uploadButton)

      expect(screen.getByText('Invalid JSON file. Please upload a valid JSON file.')).toBeInTheDocument()
    })
  })

  describe('When a valid JSON file is uploaded', () => {
    test('should call the upload function and close the modal', async () => {
      validateJson.mockReturnValue({ errors: null })
      const uploadMock = vi.fn()
      const toggleModalMock = vi.fn()
      const { user } = setup({
        upload: uploadMock,
        toggleModal: toggleModalMock
      })

      const file = new File(['{"name": "test"}'], 'test.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')

      await user.upload(input, file)

      const uploadButton = screen.getByRole('button', { name: 'Upload' })
      await user.click(uploadButton)

      await waitFor(() => {
        expect(uploadMock).toHaveBeenCalledWith({ name: 'test' })
      })

      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })

  describe('When the cancel button is clicked', () => {
    test('should close the modal', async () => {
      const toggleModalMock = vi.fn()
      const { user } = setup({ toggleModal: toggleModalMock })

      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)

      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })

  describe('When the modal is closed', () => {
    test('should reset the file and errors state', async () => {
      const { rerender } = setup()

      const file = new File(['{}'], 'test.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')
      await userEvent.upload(input, file)

      expect(screen.getByText(/Selected file: test.json/)).toBeInTheDocument()

      rerender(
        <JsonFileUploadModal
          show={false}
          toggleModal={vi.fn()}
          schema={mockSchema}
          upload={vi.fn()}
        />
      )

      expect(screen.queryByText(/Selected file: test.json/)).not.toBeInTheDocument()
    })
  })

  describe('When JSON validation fails', () => {
    test('should display error messages', async () => {
      validateJson.mockReturnValue({ errors: ['Invalid field: name'] })
      const { user } = setup()

      const file = new File(['{"invalidField": "test"}'], 'test.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')

      await user.upload(input, file)

      const uploadButton = screen.getByRole('button', { name: 'Upload' })
      await user.click(uploadButton)

      expect(screen.getByText('Invalid field: name')).toBeInTheDocument()
    })
  })

  describe('When multiple files are dropped', () => {
    test('should only accept the first file', async () => {
      const { user } = setup()

      const file1 = new File(['{}'], 'test1.json', { type: 'application/json' })
      const file2 = new File(['{}'], 'test2.json', { type: 'application/json' })
      const input = screen.getByLabelText('Upload JSON file')

      await user.upload(input, [file1, file2])

      expect(screen.getByText(/Selected file: test1.json/)).toBeInTheDocument()
      expect(screen.queryByText(/Selected file: test2.json/)).not.toBeInTheDocument()
    })
  })
})
