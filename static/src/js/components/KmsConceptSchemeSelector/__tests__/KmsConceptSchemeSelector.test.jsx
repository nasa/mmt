import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
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
  const mockVersion = {
    version: '1.0',
    version_type: 'published'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when component is initially rendered', () => {
    test('should display loading state', () => {
      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)
      expect(screen.getByText('Select scheme...')).toBeInTheDocument()
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

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.queryByText('Loading schemes...')).not.toBeInTheDocument()
      })

      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(2)
      })

      const options = screen.getAllByRole('option')
      expect(options[0]).toHaveTextContent('Scheme 1')
      expect(options[1]).toHaveTextContent('Scheme 2')

      expect(getKmsConceptSchemes).toHaveBeenCalledWith(mockVersion)
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

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      // Open the dropdown
      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      // Assert options are in the document
      await waitFor(() => {
        expect(screen.getByText('Select scheme...')).toBeInTheDocument()
      })

      // Wait for options to appear
      await waitFor(() => {
        const option1 = screen.getByRole('option', { name: 'Scheme 1' })
        expect(option1).toBeInTheDocument()
      })

      // Select the first option
      const option1 = screen.getByText('Scheme 1')
      await userEvent.click(option1)

      // Reopen dropdown and select 'Scheme 2'
      await userEvent.click(selectElement)
      const option2 = screen.getByRole('option', { name: 'Scheme 2' })
      await userEvent.click(option2)

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

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error fetching schemes:', expect.any(Error))
      })

      expect(screen.getByText('Select scheme...')).toBeInTheDocument()
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

      const { rerender } = render(
        <KmsConceptSchemeSelector
          version={mockVersion}
          onSchemeSelect={mockOnSchemeSelect}
        />
      )
      await waitFor(() => {
        expect(screen.getByText('Select scheme...')).toBeInTheDocument()
      })

      rerender(<KmsConceptSchemeSelector version={null} onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {})

      expect(screen.queryByText('Scheme 1')).toBeNull()
      expect(screen.getByText('Select scheme...')).toBeInTheDocument()
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

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(3)
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

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      const selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(3)
      })

      expect(screen.getByText('A Scheme')).toBeInTheDocument()

      const selectInput = screen.getByRole('combobox')
      await userEvent.click(selectInput)

      const allOptions = screen.getAllByText(/[ABC] Scheme/)

      const dropdownOptions = allOptions.slice(-3)

      expect(dropdownOptions.length).toBe(3)
      expect(dropdownOptions[0]).toHaveTextContent('A Scheme')
      expect(dropdownOptions[1]).toHaveTextContent('B Scheme')
      expect(dropdownOptions[2]).toHaveTextContent('C Scheme')
    })

    test('should handle case when no schemes are returned', async () => {
      getKmsConceptSchemes.mockResolvedValue({ schemes: [] })

      render(<KmsConceptSchemeSelector version={mockVersion} onSchemeSelect={mockOnSchemeSelect} />)

      await waitFor(() => {
        expect(screen.queryByRole('option')).not.toBeInTheDocument()
      })

      expect(mockOnSchemeSelect).not.toHaveBeenCalled()
    })
  })

  describe('when onSchemeSelect prop is not provided', () => {
    test('should use default onSchemeSelect without errors', async () => {
      const mockSchemes = [
        {
          name: 'Scheme 1',
          updateDate: '2023-01-01',
          csvHeaders: ['header1', 'header2']
        }
      ]
      getKmsConceptSchemes.mockResolvedValue({ schemes: mockSchemes })

      // Render the component without onSchemeSelect prop
      render(<KmsConceptSchemeSelector version={mockVersion} />)

      // Wait for the loading state to finish
      await waitFor(() => {
        expect(screen.queryByText('Loading schemes...')).not.toBeInTheDocument()
      })

      // Check if the component renders without errors by looking for the select element
      const selectElement = screen.getByRole('combobox')
      expect(selectElement).toBeInTheDocument()

      // Check if the correct option is selected
      await waitFor(() => {
        expect(screen.getByText('Select scheme...')).toBeInTheDocument()
      })

      // Attempt to change the selected scheme
      await userEvent.click(selectElement)

      // Verify that the option is in the dropdown
      const option = screen.getByRole('option', { name: 'Scheme 1' })
      expect(option).toBeInTheDocument()

      // Click the option (even though it's already selected)
      await userEvent.click(option)

      // If we reach this point without any errors, the test passes
    })
  })

  describe('when version changes', () => {
    test('should fetch new schemes and update the selector', async () => {
      const initialMockSchemes = [
        {
          name: 'Initial Scheme',
          updateDate: '2023-01-01',
          csvHeaders: ['header1']
        }
      ]
      const updatedMockSchemes = [
        {
          name: 'Updated Scheme',
          updateDate: '2023-01-02',
          csvHeaders: ['header2']
        }
      ]

      getKmsConceptSchemes.mockResolvedValueOnce({ schemes: initialMockSchemes })

      const { rerender } = render(
        <KmsConceptSchemeSelector
          version={mockVersion}
          onSchemeSelect={mockOnSchemeSelect}
        />
      )

      let selectElement = screen.getByRole('combobox')
      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(1)
      })

      getKmsConceptSchemes.mockResolvedValueOnce({ schemes: updatedMockSchemes })

      const updatedVersion = {
        version: '2.0',
        version_type: 'published'
      }
      rerender(
        <KmsConceptSchemeSelector
          version={updatedVersion}
          onSchemeSelect={mockOnSchemeSelect}
        />
      )

      selectElement = screen.getByRole('combobox')

      await userEvent.click(selectElement)

      await waitFor(() => {
        const options = screen.getAllByRole('option')
        expect(options.length).toBe(1)
      })

      await waitFor(() => {
        expect(screen.getByText('Updated Scheme')).toBeInTheDocument()
      })

      expect(getKmsConceptSchemes).toHaveBeenCalledTimes(2)
      expect(getKmsConceptSchemes).toHaveBeenNthCalledWith(1, mockVersion)
      expect(getKmsConceptSchemes).toHaveBeenNthCalledWith(2, updatedVersion)
    })
  })

  describe('when defaultScheme matches an option', () => {
    test('should select the default scheme initially', async () => {
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

      render(
        <KmsConceptSchemeSelector
          version={mockVersion}
          defaultScheme={{ name: 'Scheme 1' }}
          onSchemeSelect={mockOnSchemeSelect}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByText('Scheme 1')
        expect(selectElement).toBeInTheDocument()
      })
    })
  })
})
