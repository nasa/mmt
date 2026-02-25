import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import parseCmrResponse from '../../../utils/parseCmrResponse'
import fetchCmrKeywords from '../../../utils/fetchCmrKeywords'
import PlatformField from '../PlatformField'

vi.mock('../../../utils/parseCmrResponse')
vi.mock('../../../utils/fetchCmrKeywords')

const setup = (overrideProps = {}) => {
  const onChange = vi.fn()

  const formContext = {
    focusField: '',
    setFocusField: vi.fn()
  }

  fetchCmrKeywords.mockReturnValue({
    basis: [
      {
        value: 'Air-based Platforms',
        subfields: [
          'category'
        ],
        category: [
          {
            value: 'Jet',
            subfields: [
              'short_name'
            ],
            short_name: [
              {
                value: 'A340-600',
                subfields: [
                  'long_name'
                ],
                long_name: [
                  {
                    value: 'Airbus A340-600',
                    uuid: 'bab77f95-aa34-42aa-9a12-922d1c9fae63'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  })

  parseCmrResponse.mockReturnValue([
    [
      'Air-based Platforms',
      'Jet',
      'A340-600',
      'Airbus A340-600'
    ],
    [
      'Air-based Platforms',
      'AIRPLANE',
      'airplane'
    ]
  ])

  const uiSchema = {
    'ui:controlled': {
      name: 'platforms',
      controlName: ['basis', 'category', 'short_name', 'long_name']
    }
  }

  const props = {
    formData: {},
    onChange,
    registry: {
      formContext
    },
    uiSchema,
    ...overrideProps
  }

  const user = userEvent.setup()

  const { rerender } = render(
    <PlatformField {...props} />
  )

  return {
    props,
    user,
    rerender: (newFormData) => {
      rerender(
        <PlatformField {...props} formData={newFormData} />
      )
    }
  }
}

describe('Platform Field', () => {
  describe('when formData already exists', () => {
    test('form should prepopulate with formData and update when formData changes', async () => {
      const initialFormData = {
        Type: 'Jet',
        ShortName: 'A340-600',
        LongName: 'Airbus A340-600'
      }

      const { rerender } = setup({ formData: initialFormData })

      // Wait for component to load
      await waitFor(() => {
        expect(screen.queryByText('Select Short Name')).not.toBeInTheDocument()
      })

      // Verify initial formData is displayed
      expect(screen.getByText('A340-600')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Jet')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Airbus A340-600')).toBeInTheDocument()

      // Rerender with new formData (simulating parent component update)
      const updatedFormData = {
        Type: 'AIRPLANE',
        ShortName: 'airplane',
        LongName: ''
      }

      rerender(updatedFormData)

      // Verify updated formData is displayed
      await waitFor(() => {
        expect(screen.getByText('airplane')).toBeInTheDocument()
      })

      expect(screen.getByDisplayValue('AIRPLANE')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('No available Long Name')).toBeInTheDocument()

      // Verify old values are no longer displayed
      expect(screen.queryByText('A340-600')).not.toBeInTheDocument()
      expect(screen.queryByDisplayValue('Airbus A340-600')).not.toBeInTheDocument()
    })
  })

  describe('when a user clicks clicks the down arrow on Short Name', () => {
    test('renders a list of clickable cmr keywords', async () => {
      const { user, props } = setup()

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('Jet').className).toContain('platform-field-select-title')
      expect(screen.getByText('A340-600').className).toContain('platform-field-select-option')

      await user.click(screen.getByText('A340-600'))

      expect(props.onChange).toHaveBeenCalledWith({
        Type: 'Jet',
        ShortName: 'A340-600',
        LongName: 'Airbus A340-600'
      })
    })
  })

  describe('when a user selects the clear option', () => {
    test('calls onChange with empty values', async () => {
      const { user, props } = setup({
        formData: {
          Type: 'airplane',
          ShortName: 'AIRPLANE'
        }
      })

      expect(screen.getByText('AIRPLANE')).toBeInTheDocument()
      expect(screen.getByDisplayValue('airplane')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('No available Long Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)
      await user.click(screen.getByText('Clear Short Name'))

      expect(props.onChange).toHaveBeenCalledWith({
        Type: '',
        ShortName: '',
        LongName: ''
      })
    })
  })

  describe('when a user clicks away from the menu', () => {
    test('the screen blurs', async () => {
      const { user } = setup()

      const select = screen.getByRole('combobox')
      await user.click(select)

      const blurClick = (screen.getAllByRole('textbox'))
      await user.click(blurClick[0])

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()
    })
  })

  describe('when a user selects an option with no longName', () => {
    test('the screen blurs', async () => {
      const { user } = setup()

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.click(screen.getByText('airplane'))
    })
  })
})
