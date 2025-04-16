import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import KmsConceptSchemeSelector from '../KmsConceptSchemeSelector'
import getKmsConceptSchemes from '../../../utils/getKmsConceptSchemes'

vi.mock('../../../utils/getKmsConceptSchemes')

describe('KmsConceptSchemeSelector', () => {
  const mockOnSchemeSelect = vi.fn()

  let consoleErrorSpy

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  beforeEach(() => {
    mockOnSchemeSelect.mockClear()
    getKmsConceptSchemes.mockClear()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('renders without crashing', async () => {
    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Select Concept Scheme/i })).toBeInTheDocument()
    })
  })

  test('displays loading state when fetching schemes', () => {
    getKmsConceptSchemes.mockResolvedValue({ schemes: [] })
    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays schemes after fetching', async () => {
    const mockSchemes = [
      {
        name: 'scheme1',
        longName: 'Scheme 1',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      },
      {
        name: 'scheme2',
        longName: 'Scheme 2',
        updateDate: '2023-01-02',
        csvHeaders: ['header2']
      }
    ]
    getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })
  })

  test('calls onSchemeSelect when a scheme is selected', async () => {
    const mockSchemes = [
      {
        name: 'scheme1',
        longName: 'Scheme 1',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      }
    ]
    getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })

    // Find the select element
    const selectElement = screen.getByRole('combobox')

    // Click the select to open the dropdown
    await userEvent.click(selectElement)

    // Find and click the option
    const option = await screen.findByText('Scheme 1')
    await userEvent.click(option)

    // Check if onSchemeSelect was called with the correct argument
    expect(mockOnSchemeSelect).toHaveBeenCalledWith({
      name: 'scheme1',
      longName: 'Scheme 1',
      updateDate: '2023-01-01',
      csvHeaders: ['header1']
    })

    // Check if the selected scheme is displayed
    expect(screen.getByText((content, element) => element.textContent === 'Selected scheme: Scheme 1')).toBeInTheDocument()
  })

  test('displays "No scheme selected" when no scheme is selected', async () => {
    const mockSchemes = [
      {
        name: 'scheme1',
        longName: 'Scheme 1',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      }
    ]
    getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })

    // Find the div that contains the scheme selection status
    const statusDiv = screen.getByText((content, element) => element.tagName.toLowerCase() === 'div'
             && element.className.includes('text-muted')
             && element.textContent.includes('No scheme selected'))

    expect(statusDiv).toBeInTheDocument()
  })

  test('disables selector when no version is provided', async () => {
    render(<KmsConceptSchemeSelector onSchemeSelect={mockOnSchemeSelect} />)

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText('Select Concept Scheme')).toBeInTheDocument()
    })

    // Find the select container
    const selectContainer = screen.getByRole('combobox', { name: /select a concept scheme/i })

    // Check if the select container has the expected classes
    expect(selectContainer).toHaveClass('scheme-selector__select')
    expect(selectContainer).toHaveClass('css-3iigni-container')

    // Find the input element within the select container
    const selectInput = within(selectContainer).getByRole('textbox')

    // Check if the input is disabled
    expect(selectInput).toBeDisabled()

    // Try to interact with the select and expect it to not change
    await userEvent.click(selectContainer)
    expect(screen.queryByText('Scheme 1')).not.toBeInTheDocument()

    // Check if the onSchemeSelect function was not called
    expect(mockOnSchemeSelect).not.toHaveBeenCalled()
  })

  test('handles error when fetching schemes fails', async () => {
    console.error = vi.fn()
    getKmsConceptSchemes.mockRejectedValue(new Error('Fetch error'))

    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching schemes:', expect.any(Error))
    })
  })

  test('sorts schemes alphabetically', async () => {
    const mockSchemes = [
      {
        name: 'schemeB',
        longName: 'Scheme B',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      },
      {
        name: 'schemeA',
        longName: 'Scheme A',
        updateDate: '2023-01-02',
        csvHeaders: ['header2']
      },
      {
        name: 'schemeC',
        longName: 'Scheme C',
        updateDate: '2023-01-03',
        csvHeaders: ['header3']
      }
    ]
    getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

    render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })

    // Open the dropdown
    const selectElement = screen.getByText('Select a concept scheme...')
    fireEvent.mouseDown(selectElement)

    // Check if options are rendered in alphabetical order
    const options = screen.getAllByText(/Scheme [ABC]/)
    expect(options[0]).toHaveTextContent('Scheme A')
    expect(options[1]).toHaveTextContent('Scheme B')
    expect(options[2]).toHaveTextContent('Scheme C')
  })

  test('updates schemes when version changes', async () => {
    const mockSchemes1 = [
      {
        name: 'scheme1',
        longName: 'Scheme 1',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      }
    ]
    const mockSchemes2 = [
      {
        name: 'scheme2',
        longName: 'Scheme 2',
        updateDate: '2023-01-02',
        csvHeaders: ['header2']
      }
    ]

    getKmsConceptSchemes.mockResolvedValueOnce({ schemes: mockSchemes1 })
    getKmsConceptSchemes.mockResolvedValueOnce({ schemes: mockSchemes2 })

    const { rerender } = render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })

    rerender(<KmsConceptSchemeSelector version="2.0" onSchemeSelect={mockOnSchemeSelect} />)

    await waitFor(() => {
      expect(getKmsConceptSchemes).toHaveBeenCalledWith('2.0')
    })

    await waitFor(() => {
      expect(screen.getByText('Select a concept scheme...')).toBeInTheDocument()
    })
  })
})
