import React from 'react'
import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'
import UniqueItemsArray from '../UniqueItemsArray'

describe('UniqueItemsArray', () => {
  const defaultProps = {
    id: 'test-array',
    label: 'Test Array',
    onChange: vi.fn(),
    options: {
      enumOptions: [
        {
          label: 'Option 1',
          value: 'option1'
        },
        {
          label: 'Option 2',
          value: 'option2'
        },
        {
          label: 'Option 3',
          value: 'option3'
        }
      ]
    },
    schema: { description: 'Test description' },
    uiSchema: {},
    value: []
  }

  describe('when the component is rendered', () => {
    test('should display the correct title and options', () => {
      render(<UniqueItemsArray {...defaultProps} />)
      expect(screen.getByText('Test Array')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 2')).toBeInTheDocument()
      expect(screen.getByLabelText('Option 3')).toBeInTheDocument()
    })
  })

  describe('when a user checks a checkbox', () => {
    test('should call onChange with the updated value', () => {
      render(<UniqueItemsArray {...defaultProps} />)
      fireEvent.click(screen.getByLabelText('Option 1'))
      expect(defaultProps.onChange).toHaveBeenCalledWith(['option1'])
    })
  })

  describe('when a user unchecks a checkbox', () => {
    test('should call onChange with the updated value', () => {
      const props = {
        ...defaultProps,
        value: ['option1', 'option2']
      }
      render(<UniqueItemsArray {...props} />)
      fireEvent.click(screen.getByLabelText('Option 1'))
      expect(props.onChange).toHaveBeenCalledWith(['option2'])
    })
  })

  describe('when the component is disabled', () => {
    test('should render disabled checkboxes', () => {
      render(<UniqueItemsArray {...defaultProps} disabled />)
      expect(screen.getByLabelText('Option 1')).toBeDisabled()
      expect(screen.getByLabelText('Option 2')).toBeDisabled()
      expect(screen.getByLabelText('Option 3')).toBeDisabled()
    })
  })

  describe('when a custom title is provided in uiSchema', () => {
    test('should display the custom title', () => {
      const props = {
        ...defaultProps,
        uiSchema: { 'ui:title': 'Custom Title' }
      }
      render(<UniqueItemsArray {...props} />)
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
    })
  })
})
