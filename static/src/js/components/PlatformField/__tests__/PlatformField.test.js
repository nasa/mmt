import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import parseCmrResponse from '../../../utils/parseCmrResponse'
import fetchCmrKeywords from '../../../utils/fetchCmrKeywords'
import PlatformField from '../PlatformField'

jest.mock('../../../utils/parseCmrResponse')
jest.mock('../../../utils/fetchCmrKeywords')

const setup = (overrideProps = {}) => {
  const onChange = jest.fn()

  const formContext = {
    focusField: '',
    setFocusField: jest.fn()
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

  render(
    <PlatformField {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Platform Field', () => {
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
          Type: 'Jet',
          ShortName: 'A360-600',
          LongName: ''
        }
      })

      expect(screen.getByText('A360-600')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Jet')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('No available Long Name')).toBeInTheDocument()

      const select = screen.getByRole('combobox')
      await user.click(select)

      await user.click(screen.getByText('Clear Short Name'))

      expect(screen.getByText('Select Short Name')).toBeInTheDocument()
    })
  })
})
