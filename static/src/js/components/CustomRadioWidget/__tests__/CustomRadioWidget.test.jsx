import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CustomRadioWidget from '../CustomRadioWidget'
import CustomWidgetWrapper from '../../CustomWidgetWrapper/CustomWidgetWrapper'

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

  const user = userEvent.setup()

  render(
    <CustomRadioWidget {...props} />
  )

  return {
    props,
    user
  }
}

beforeEach(() => {
  CustomWidgetWrapper.mockImplementation(
    vi.importActual('../../CustomWidgetWrapper/CustomWidgetWrapper').default
  )
})

describe('CustomRadioWidget', () => {
  describe('when radio buttons are required', () => {
    test('renders a radio button element with required icon', async () => {
      setup({
        required: true
      })

      expect(screen.getByRole('radio', { name: 'True' })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'False' })).toBeInTheDocument()

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        required: true,
        title: 'Test Field'
      }), {})

      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  describe('when the field has a value', () => {
    test('renders the correct radio selected', () => {
      setup({
        value: true
      })

      expect(screen.getByRole('radio', { name: 'True' })).toHaveAttribute('checked')
      expect(screen.getByRole('radio', { name: 'False' })).not.toHaveAttribute('checked')
    })
  })

  describe('when the field is changed', () => {
    test('calls onChange', async () => {
      const { props, user } = setup()

      const trueRadio = screen.getByRole('radio', { name: 'True' })
      await user.click(trueRadio)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(true)
    })
  })

  describe('when the field is cleared', () => {
    test('calls onChange', async () => {
      const { props, user } = setup({
        value: true
      })

      const clear = screen.getByRole('button', { name: 'Clear selection' })
      await user.click(clear)

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(undefined)
    })
  })

  describe('when the field is cleared with a keypress', () => {
    test('calls onChange', async () => {
      const { props, user } = setup({
        value: true
      })

      const clear = screen.getByRole('button', { name: 'Clear selection' })
      clear.focus()
      await user.keyboard('{Enter}')

      expect(props.onChange).toHaveBeenCalledTimes(1)
      expect(props.onChange).toHaveBeenCalledWith(undefined)
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

      const trueRadio = screen.getByRole('radio', { name: 'True' })

      expect(trueRadio).toHaveFocus()
    })
  })

  describe('when the field has a schema title', () => {
    test('uses the schema title', () => {
      setup({
        uiSchema: {
          'ui:title': 'Schema Title'
        }
      })

      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Schema Title'
      }), {})
    })
  })

  describe('when the field has custom options', () => {
    test('uses the custom options', () => {
      setup({
        uiSchema: {
          'ui:options': {
            trueOptionLabel: 'Custom True',
            falseOptionLabel: 'Custom False',
            showClear: false
          }
        }
      })

      expect(screen.getByRole('radio', { name: 'Custom True' })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'Custom False' })).toBeInTheDocument()
      expect(CustomWidgetWrapper).toHaveBeenCalledTimes(1)
      expect(CustomWidgetWrapper).toHaveBeenCalledWith(expect.objectContaining({
        description: 'Test Description',
        label: 'Test Field',
        required: true,
        title: 'Test Field'
      }), {})
    })
  })
})
