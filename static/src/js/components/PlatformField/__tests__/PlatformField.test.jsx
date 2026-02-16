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

  render(
    <PlatformField {...props} />
  )

  return {
    props,
    user
  }
}

describe('Platform Field', () => {
  describe('when formData prop changes', () => {
    test('updates the state with new formData values', async () => {
      fetchCmrKeywords.mockReturnValue({
        basis: [
          {
            value: 'Air-based Platforms',
            subfields: ['category'],
            category: [
              {
                value: 'Jet',
                subfields: ['short_name'],
                short_name: [
                  {
                    value: 'A340-600',
                    subfields: ['long_name'],
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
        ['Air-based Platforms', 'Jet', 'A340-600', 'Airbus A340-600'],
        ['Air-based Platforms', 'AIRPLANE', 'airplane']
      ])

      const initialFormData = {
        Type: 'Jet',
        ShortName: 'A340-600',
        LongName: 'Airbus A340-600'
      }

      const onChange = vi.fn()
      const formContext = {
        focusField: '',
        setFocusField: vi.fn()
      }
      const uiSchema = {
        'ui:controlled': {
          name: 'platforms',
          controlName: ['basis', 'category', 'short_name', 'long_name']
        }
      }

      const { rerender } = render(
        <PlatformField
          formData={initialFormData}
          onChange={onChange}
          registry={{ formContext }}
          uiSchema={uiSchema}
        />
      )

      // Wait for component to finish loading
      await waitFor(() => {
        expect(screen.getByText('A340-600')).toBeInTheDocument()
      })

      // Initial values should be displayed
      expect(screen.getByDisplayValue('Jet')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Airbus A340-600')).toBeInTheDocument()

      // Re-render with updated formData
      rerender(
        <PlatformField
          formData={
            {
              Type: 'AIRPLANE',
              ShortName: 'airplane',
              LongName: ''
            }
          }
          onChange={onChange}
          registry={{ formContext }}
          uiSchema={uiSchema}
        />
      )

      // Wait for component to update with new values
      await waitFor(() => {
        expect(screen.getByText('airplane')).toBeInTheDocument()
      })

      // Updated values should be displayed
      expect(screen.getByDisplayValue('AIRPLANE')).toBeInTheDocument()
    })
  })

  describe('when a user clicks clicks the down arrow on Short Name', () => {
    test('renders a list of clickable cmr keywords', async () => {
      const { user } = setup()

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      expect(screen.getByText('Jet').className).toContain('platform-field-select-title')
      expect(screen.getByText('A340-600').className).toContain('platform-field-select-option')

      await user.click(screen.getByText('A340-600'))

      expect(screen.getByDisplayValue('Jet')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Airbus A340-600')).toBeInTheDocument()
    })
  })

  describe('when a user selects the clear option', () => {
    test('the state is cleared', async () => {
      const { user } = setup({
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

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()
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
