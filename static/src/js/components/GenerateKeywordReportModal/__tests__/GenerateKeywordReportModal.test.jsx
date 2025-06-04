import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { kmsGetConceptUpdatesReport } from '@/js/utils/kmsGetConceptUpdatesReport'
import getKmsConceptVersions from '@/js/utils/getKmsConceptVersions'
import GenerateKeywordReportModal from '../GenerateKeywordReportModal'

vi.mock('@/js/utils/kmsGetConceptUpdatesReport')
vi.mock('@/js/utils/getKmsConceptVersions')

const setup = ({
  overrideProps = {}
} = {}) => {
  const user = userEvent.setup()

  const defaultProps = {
    show: true,
    toggleModal: vi.fn()
  }

  const props = {
    ...defaultProps,
    ...overrideProps
  }

  const { container } = render(
    <GenerateKeywordReportModal {...props} />
  )

  return {
    container,
    props,
    user
  }
}

describe('GenerateKeywordReportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders all form elements correctly', async () => {
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
    setup()

    expect(screen.getByLabelText(/Start Date:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/End Date:/i)).toBeInTheDocument()
    expect(screen.getByText('Loading versions...')).toBeInTheDocument()
    expect(screen.getByLabelText(/Filter by Earthdata Login User-Id:/i)).toBeInTheDocument()
    expect(screen.getByText('Generate CSV Report')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(await screen.findByText('draft (DRAFT-NEXT RELEASE)'))
  })

  test('handles user ID input correctly', async () => {
    const { user } = setup()

    const userIdInput = screen.getByPlaceholderText('Earthdata Login Username (Optional)')
    await user.type(userIdInput, 'testuser123')
    expect(userIdInput.value).toBe('testuser123')
  })

  test('handles version selection correctly', async () => {
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

    const { user } = setup()
    expect(screen.getByText('Loading versions...')).toBeInTheDocument()

    const selectElement = screen.getByRole('combobox')
    await user.click(selectElement)

    const option = await screen.findByText('1.0 (PRODUCTION)')
    await userEvent.click(option)

    expect(screen.getByText('1.0 (PRODUCTION)')).toBeInTheDocument()
  })

  test('handles date selection correctly', async () => {
    const { user } = setup()

    // Get the date picker inputs
    const startDatePicker = screen.getByLabelText('Start Date:')
    const endDatePicker = screen.getByLabelText('End Date:')

    await user.click(startDatePicker)
    await user.clear(startDatePicker)
    await user.type(startDatePicker, '2024-01-01')

    await user.click(endDatePicker)
    await user.clear(endDatePicker)
    await user.type(endDatePicker, '2024-01-31')

    // Verify the values were set correctly
    expect(startDatePicker).toHaveValue('2024-01-01')
    expect(endDatePicker).toHaveValue('2024-01-31')
  })

  test('handles report generation correctly', async () => {
    kmsGetConceptUpdatesReport.mockResolvedValueOnce()
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

    const { user } = setup()
    await waitFor(() => {
      expect(screen.getByText('Loading versions...')).toBeInTheDocument()
    })

    const selectElement = screen.getByRole('combobox')
    await user.click(selectElement)

    const option = await screen.findByText('1.0 (PRODUCTION)')
    await user.click(option)

    const startDatePicker = screen.getByPlaceholderText('Select a start date')
    const endDatePicker = screen.getByPlaceholderText('Select an end date')
    const userIdInput = screen.getByPlaceholderText('Earthdata Login Username (Optional)')

    await user.type(startDatePicker, '2024-01-01')
    await user.type(endDatePicker, '2024-01-31')
    await user.type(userIdInput, 'testuser123')

    // Click generate report button
    const generateButton = screen.getByText('Generate CSV Report')
    await user.click(generateButton)

    // Verify kmsGetConceptUpdatesReport was called with correct params
    expect(kmsGetConceptUpdatesReport).toHaveBeenCalledWith({
      version: {
        version: '1.0',
        version_type: 'published'
      },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      userId: 'testuser123'
    })
  })

  test('handles error during report generation', async () => {
    const mockError = new Error('Failed to generate report')
    kmsGetConceptUpdatesReport.mockRejectedValueOnce(mockError)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { user } = setup()

    const generateButton = screen.getByText('Generate CSV Report')
    await user.click(generateButton)

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error generating report:', mockError)
    })

    consoleSpy.mockRestore()
  })

  test('handles modal close correctly', async () => {
    const { user, props } = setup()

    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(props.toggleModal).toHaveBeenCalledWith(false)
  })

  test('does not render when show is false', () => {
    const { container } = setup({
      overrideProps: {
        show: false
      }
    })

    expect(container).toBeEmptyDOMElement()
  })

  test('handles error during report generation', async () => {
    const mockError = new Error('Failed to generate report')
    kmsGetConceptUpdatesReport.mockRejectedValueOnce(mockError)

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

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { user } = setup()

    // Wait for versions to load
    await waitFor(() => {
      expect(screen.queryByText('Loading versions...')).not.toBeInTheDocument()
    })

    // Select a version
    const selectElement = screen.getByRole('combobox')
    await user.click(selectElement)
    const option = await screen.findByText('1.0 (PRODUCTION)')
    await user.click(option)

    // Fill in the form
    const startDatePicker = screen.getByPlaceholderText('Select a start date')
    const endDatePicker = screen.getByPlaceholderText('Select an end date')
    await user.type(startDatePicker, '2024-01-01')
    await user.type(endDatePicker, '2024-01-31')

    // Click generate report button
    const generateButton = screen.getByText('Generate CSV Report')
    await user.click(generateButton)

    // Verify that kmsGetConceptUpdatesReport was called
    expect(kmsGetConceptUpdatesReport).toHaveBeenCalled()

    // Verify error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error generating report:', mockError)
    })

    expect(await screen.findByText('Error generating report.')).toBeVisible()

    consoleSpy.mockRestore() // Removing the spy on console.error
  })
})
