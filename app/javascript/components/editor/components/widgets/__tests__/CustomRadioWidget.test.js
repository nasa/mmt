import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import CustomRadioWidget from '../CustomRadioWidget'

describe('CustomRadiowidget', () => {
  it('renders the component with initial values', async () => {
    const props = {
      value: true,
      onChange: jest.fn(),
      options: {
        title: 'Title'
      }
    }
    const { container } = render(<CustomRadioWidget {...props} />)
    const labelElement = screen.getByTestId('custom-radio-widget--label')
    const trueRadioButton = screen.getByTestId('custom-radio-widget--value__true')
    const falseRadioButton = screen.getByTestId('custom-radio-widget--value__false')

    expect(labelElement.textContent).toBe('Title')
    expect(trueRadioButton.checked).toBe(true)
    expect(falseRadioButton.checked).toBe(false)

    expect(container).toMatchSnapshot()
  })

  it('should call the onChange function with true when "True" radio button is clicked', () => {
    const props = {
      value: false,
      onChange: jest.fn(),
      uiSchema: null
    }
    const { container } = render(<CustomRadioWidget {...props} />)
    const trueRadioButton = screen.getByTestId('custom-radio-widget--value__true')

    fireEvent.click(trueRadioButton)
    expect(props.onChange).toHaveBeenCalledWith(true)

    expect(container).toMatchSnapshot()
  })

  it('should call the onChange function with false when "False" radio button is clicked', () => {
    const props = {
      value: true,
      onChange: jest.fn(),
      uiSchema: null
    }
    const { container } = render(<CustomRadioWidget {...props} />)
    const falseRadioButton = screen.getByTestId('custom-radio-widget--value__false')

    fireEvent.click(falseRadioButton)
    expect(props.onChange).toHaveBeenCalledWith(false)

    expect(container).toMatchSnapshot()
  })
})
