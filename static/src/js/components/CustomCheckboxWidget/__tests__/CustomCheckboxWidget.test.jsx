import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import CustomCheckboxWidget from '../CustomCheckboxWidget'

vi.importActual('../../CustomWidgetWrapper/CustomWidgetWrapper')

const setup = (overrideProps = {}) => {
  const user = userEvent.setup()
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
    user
  }
}

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

  describe('when the unchecking a value', () => {
    describe('and clear unselected is false', () => {
      test('calls on change with false', async () => {
        const { props, user } = setup({ value: true })

        const checkboxField = screen.getByRole('checkbox')

        await user.click(checkboxField)

        expect(props.onChange).toHaveBeenCalledTimes(1)
        expect(props.onChange).toHaveBeenCalledWith(false)
      })
    })

    describe('and clear unselected is true', () => {
      test('calls on change with null', async () => {
        const { props, user } = setup({
          value: true,
          uiSchema: {
            'ui:clearUnselected': true
          }
        })

        const checkboxField = screen.getByRole('checkbox')

        await user.click(checkboxField)

        expect(props.onChange).toHaveBeenCalledTimes(1)
        expect(props.onChange).toHaveBeenCalledWith(null)
      })
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
