import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import KmsConceptVersionSelector from '../KmsConceptVersionSelector'
import getKmsConceptVersions from '../../../utils/getKmsConceptVersions'

vi.mock('../../../utils/getKmsConceptVersions')

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

  test('renders without crashing', async () => {
    render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)
    await waitFor(() => {
      expect(screen.getByText('Loading versions...')).toBeInTheDocument()
    })
  })

  test('displays loading state when fetching versions', () => {
    getKmsConceptVersions.mockResolvedValue({ versions: [] })
    render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)
    expect(screen.getByText('Loading versions...')).toBeInTheDocument()
  })

  test('displays versions after fetching', async () => {
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

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading versions...')).not.toBeInTheDocument()
    })

    // Check if the select element is rendered
    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeInTheDocument()

    // Open the dropdown
    await userEvent.click(selectElement)

    // Check if both versions are displayed in the dropdown
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveTextContent('draft (DRAFT-NEXT RELEASE)')
    expect(options[1]).toHaveTextContent('1.0 (PRODUCTION)')
  })

  test('calls onVersionSelect when a version is selected', async () => {
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

  test('handles error when fetching versions fails', async () => {
    console.error = vi.fn()
    getKmsConceptVersions.mockRejectedValue(new Error('Fetch error'))

    render(<KmsConceptVersionSelector onVersionSelect={mockOnVersionSelect} />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching versions:', expect.any(Error))
    })
  })

  test('sorts versions correctly', async () => {
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

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading versions...')).not.toBeInTheDocument()
    })

    // Check if the select element is rendered
    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeInTheDocument()

    // Open the dropdown
    await userEvent.click(selectElement)

    // Get all options
    const options = screen.getAllByRole('option')

    // Check the number of options
    expect(options).toHaveLength(3)

    // Check the order and content of options
    expect(options[0]).toHaveTextContent('draft (DRAFT-NEXT RELEASE)')
    expect(options[1]).toHaveTextContent('2.0 (PRODUCTION)')
    expect(options[2]).toHaveTextContent('1.0 (PAST PUBLISHED)')

    // Verify that the draft version is automatically selected
    await waitFor(() => {
      expect(mockOnVersionSelect).toHaveBeenCalledWith({
        version: 'draft',
        version_type: 'draft'
      })
    })
  })

  test('automatically selects the draft version', async () => {
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

  test('does not auto-select if no draft version is available', async () => {
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

  test('handles unknown version types correctly', async () => {
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
