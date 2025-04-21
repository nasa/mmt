import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import getKmsConceptVersions from '@/js/utils/getKmsConceptVersions'
import KmsConceptVersionSelector from '../KmsConceptVersionSelector'

vi.mock('@/js/utils/getKmsConceptVersions')

describe('KmsConceptVersionSelector', () => {
  const mockOnVersionSelect = vi.fn()

  beforeEach(() => {
    mockOnVersionSelect.mockClear()
    getKmsConceptVersions.mockClear()
  })

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('when component is rendered', () => {
    test('should render without crashing', async () => {
      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)
      await waitFor(() => {
        expect(screen.getByText('Loading versions...')).toBeInTheDocument()
      })
    })

    test('should only auto-select draft version once', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PUBLISHED'
        },
        {
          version: 'draft',
          type: 'DRAFT'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      const { rerender } = render(
        <KmsConceptVersionSelector
          onVersionSelect={mockOnVersionSelect}
        />
      )
      // Wait for the initial render and auto-selection
      await waitFor(() => {
        expect(mockOnVersionSelect).toHaveBeenCalledWith({
          version: 'draft',
          version_type: 'draft'
        })
      })

      // Clear the mock to reset call count
      mockOnVersionSelect.mockClear()

      // Trigger a re-render
      rerender(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      // Wait a bit to ensure any asynchronous operations complete
      await new Promise((resolve) => { setTimeout(resolve, 0) })

      // Check that onVersionSelect is not called again
      expect(mockOnVersionSelect).not.toHaveBeenCalled()

      // Verify that the draft version is still selected
      expect(screen.getByText('draft (DRAFT-NEXT RELEASE)')).toBeInTheDocument()
    })
  })

  describe('when fetching versions', () => {
    test('should display loading state', () => {
      getKmsConceptVersions.mockResolvedValue({ versions: [] })
      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)
      expect(screen.getByText('Loading versions...')).toBeInTheDocument()
    })

    test('should display versions after fetching', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PUBLISHED'
        },
        {
          version: 'draft',
          type: 'DRAFT'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading versions...')).not.toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      expect(selectElement).toBeInTheDocument()

      await userEvent.click(selectElement)

      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveTextContent('draft (DRAFT-NEXT RELEASE)')
      expect(options[1]).toHaveTextContent('1.0 (PRODUCTION)')
    })
  })

  describe('when user selects a version', () => {
    test('should call onVersionSelect with correct parameters', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PUBLISHED'
        },
        {
          version: 'draft',
          type: 'DRAFT'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(screen.getByText('Loading versions...')).toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      const option = await screen.findByText('1.0 (PRODUCTION)')
      await userEvent.click(option)

      expect(mockOnVersionSelect).toHaveBeenCalledWith({
        version: '1.0',
        version_type: 'published'
      })
    })
  })

  describe('when fetching versions fails', () => {
    test('should handle the error and log it', async () => {
      console.error = vi.fn()
      getKmsConceptVersions.mockRejectedValue(new Error('Fetch error'))

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching versions:', expect.any(Error))
      })
    })
  })

  describe('when versions are loaded', () => {
    test('should sort versions correctly', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PAST_PUBLISHED'
        },
        {
          version: '2.0',
          type: 'PUBLISHED'
        },
        {
          version: 'draft',
          type: 'DRAFT'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading versions...')).not.toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      expect(selectElement).toBeInTheDocument()

      await userEvent.click(selectElement)

      const options = screen.getAllByRole('option')

      expect(options).toHaveLength(3)
      expect(options[0]).toHaveTextContent('draft (DRAFT-NEXT RELEASE)')
      expect(options[1]).toHaveTextContent('2.0 (PRODUCTION)')
      expect(options[2]).toHaveTextContent('1.0 (PAST PUBLISHED)')

      await waitFor(() => {
        expect(mockOnVersionSelect).toHaveBeenCalledWith({
          version: 'draft',
          version_type: 'draft'
        })
      })
    })

    test('should automatically select the draft version if available', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PUBLISHED'
        },
        {
          version: 'draft',
          type: 'DRAFT'
        },
        {
          version: '3.0',
          type: 'PAST-PUBLISHED'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(mockOnVersionSelect).toHaveBeenCalledWith({
          version: 'draft',
          version_type: 'draft'
        })
      })

      expect(screen.getByText('draft (DRAFT-NEXT RELEASE)')).toBeInTheDocument()
    })

    test('should not auto-select if no draft version is available', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'PUBLISHED'
        },
        {
          version: '0.9',
          type: 'PAST_PUBLISHED'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      expect(mockOnVersionSelect).not.toHaveBeenCalled()
    })
  })

  describe('when encountering unknown version types', () => {
    test('should handle them correctly', async () => {
      const mockVersions = [
        {
          version: '1.0',
          type: 'UNKNOWN_TYPE'
        }
      ]
      getKmsConceptVersions.mockResolvedValue({ versions: mockVersions })

      render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

      await waitFor(() => {
        expect(screen.getByText('Loading versions...')).toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      fireEvent.mouseDown(selectElement)

      const option = await screen.findByText('1.0 (UNKNOWN_TYPE)')
      expect(option).toBeInTheDocument()

      await userEvent.click(option)

      expect(mockOnVersionSelect).toHaveBeenCalledWith({
        version: '1.0',
        version_type: 'unknown_type'
      })
    })
  })
})
