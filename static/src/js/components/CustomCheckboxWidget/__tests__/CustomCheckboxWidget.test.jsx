import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'
import CustomCheckboxWidget from '../CustomCheckboxWidget'

vi.mock('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const props = {
    id: 'mock-id',
    label: 'Test Field',
    onChange: vi.fn(),
    registry: {
      formContext: {
        focusField: '',
        setFocusField: vi.fn()
      }
    },
    required: true,
    schema: {
      description: 'Test Description'
    },
    uiSchema: {},
    value: false,
    ...overrideProps
  }

  render(
    <CustomCheckboxWidget {...props} />
  )

  return {
    props,
    user: userEvent.setup()
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    vi.importActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomCheckboxWidget', () => {
  describe('when the checking a value', () => {
    test('calls on change', async () => {
      const { props, user } = setup({})

      const checkboxField = screen.getByRole('checkbox')

      await user.click(checkboxField)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(true)
    })
  })

  describe('when the field should be focused', () => {
    test('focuses the field', async () => {
      setup({
        registry: {
          formContext: {
            focusField: 'mock-id'
          }
        }
      })

      const trueRadio = screen.getByRole('checkbox')

      expect(trueRadio).toHaveFocus()
    })
  })
})
