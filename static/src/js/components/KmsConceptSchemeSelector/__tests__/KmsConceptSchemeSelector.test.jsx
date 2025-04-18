import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import getKmsConceptSchemes from '@/js/utils/getKmsConceptSchemes'
import KmsConceptSchemeSelector from '../KmsConceptSchemeSelector'

vi.mock('@/js/utils/getKmsConceptSchemes')

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  vi.restoreAllMocks()
})

describe('KmsConceptSchemeSelector', () => {
  const mockOnSchemeSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when component is initially rendered', () => {
    test('should display loading state', () => {
      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)
      expect(screen.getByText('Loading schemes...')).toBeInTheDocument()
    })
  })

  describe('when version is provided', () => {
    test('should fetch and display schemes', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        },
        {
          name: 'Scheme 2',
          updateDate: '2023-01-02',
          csvHeaders: ['header3', 'header4']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading schemes...')).not.toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(2)
      })

      // Then, perform the additional assertions outside of waitFor
      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveTextContent('Scheme 1')
      expect(options[1]).toHaveTextContent('Scheme 2')

      expect(getKmsConceptSchemes).toHaveBeenCalledWith('1.0')
    })

    test('should select first scheme by default and call onSchemeSelect', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        },
        {
          name: 'Scheme 2',
          updateDate: '2023-01-02',
          csvHeaders: ['header3', 'header4']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(mockOnSchemeSelect).toHaveBeenCalledWith({
          name: 'Scheme 1',
          longName: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        })
      })
    })
  })

  describe('when user selects a new scheme', () => {
    test('should call onSchemeSelect with the selected scheme', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        },
        {
          name: 'Scheme 2',
          updateDate: '2023-01-02',
          csvHeaders: ['header3', 'header4']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.getByText('Scheme 1')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByText('Scheme 1'))
      await userEvent.click(screen.getByText('Scheme 2'))

      expect(mockOnSchemeSelect).toHaveBeenCalledWith({
        name: 'Scheme 2',
        longName: 'Scheme 2',
        updateDate: '2023-01-02',
        csvHeaders: ['header3', 'header4']
      })
    })
  })

  describe('when fetching schemes fails', () => {
    test('should log error and keep loading state', async () => {
      console.error = vi.fn()
      getKmsConceptSchemes.mockRejectedValue(new Error('Failed to fetch schemes'))

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching schemes:', expect.any(Error))
      })

      expect(screen.getByText('Loading schemes...')).toBeInTheDocument()
    })
  })

  describe('when version is not provided', () => {
    test('should clear schemes and reset to loading state', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      const { rerender } = render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.getByText('Scheme 1')).toBeInTheDocument()
      })

      rerender(<KmsConceptSchemeSelector version="" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {})

      expect(screen.queryByText('Scheme 1')).toBeNull()
      expect(screen.getByText('Loading schemes...')).toBeInTheDocument()
      expect(getKmsConceptSchemes).toHaveBeenCalledTimes(1)
    })
  })

  describe('when multiple schemes are provided', () => {
    test('should sort schemes alphabetically', async () => {
      const mockSchemes = [
        {
          name: 'C Scheme',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        },
        {
          name: 'A Scheme',
          updateDate: '2023-01-02',
          csvHeaders: ['header3', 'header4']
        },
        {
          name: 'B Scheme',
          updateDate: '2023-01-03',
          csvHeaders: ['header5', 'header6']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading schemes...')).not.toBeInTheDocument()
      })

      expect(screen.getByText('A Scheme')).toBeInTheDocument()

      const selectInput = screen.getByRole('combobox')
      await userEvent.click(selectInput)

      const options = screen.getAllByText(/[ABC] Scheme/)
      expect(options.length).toBeGreaterThanOrEqual(3)

      const dropdownOptions = options.slice(-3)
      expect(dropdownOptions[0]).toHaveTextContent('A Scheme')
      expect(dropdownOptions[1]).toHaveTextContent('B Scheme')
      expect(dropdownOptions[2]).toHaveTextContent('C Scheme')

      expect(mockOnSchemeSelect).toHaveBeenCalledWith({
        name: 'A Scheme',
        longName: 'A Scheme',
        updateDate: '2023-01-02',
        csvHeaders: ['header3', 'header4']
      })
    })
  })

  describe('when fetching schemes succeeds', () => {
    test('should sort schemes alphabetically', async () => {
      const mockSchemes = [
        {
          name: 'C Scheme',
          updateDate: '2023-01-01',
          csvHeaders: ['header1']
        },
        {
          name: 'A Scheme',
          updateDate: '2023-01-02',
          csvHeaders: ['header2']
        },
        {
          name: 'B Scheme',
          updateDate: '2023-01-03',
          csvHeaders: ['header3']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      // Wait for the select to be loaded (no longer showing "Loading schemes...")
      await waitFor(() => {
        expect(screen.queryByText('Loading schemes...')).not.toBeInTheDocument()
      })

      // Check if the first option (which is selected by default) is 'A Scheme'
      expect(screen.getByText('A Scheme')).toBeInTheDocument()

      // Open the dropdown
      const selectInput = screen.getByRole('combobox')
      await userEvent.click(selectInput)

      // Get all options, including the selected one
      const allOptions = screen.getAllByText(/[ABC] Scheme/)

      // The first option might appear twice (in the input and in the list),
      // so we'll slice the array to get only the dropdown options
      const dropdownOptions = allOptions.slice(-3)

      expect(dropdownOptions.length).toBe(3)
      expect(dropdownOptions[0]).toHaveTextContent('A Scheme')
      expect(dropdownOptions[1]).toHaveTextContent('B Scheme')
      expect(dropdownOptions[2]).toHaveTextContent('C Scheme')
    })

    test('should handle case when no schemes are returned', async () => {
      getKmsConceptSchemes.mockResolvedValue({ schemes: [] })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.queryByRole('option')).not.toBeInTheDocument()
      })

      expect(mockOnSchemeSelect).not.toHaveBeenCalled()
    })

    test('should select first option when schemes are loaded', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1']
        },
        {
          name: 'Scheme 2',
          updateDate: '2023-01-02',
          csvHeaders: ['header2']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      render(<KmsConceptSchemeSelector version="1.0" onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.getByText('Scheme 1')).toBeInTheDocument()
      })

      expect(mockOnSchemeSelect).toHaveBeenCalledWith({
        name: 'Scheme 1',
        longName: 'Scheme 1',
        updateDate: '2023-01-01',
        csvHeaders: ['header1']
      })
    })
  })
})
