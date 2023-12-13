import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { FaStar } from 'react-icons/fa'
import Button from '../Button'

describe('Button', () => {
  describe('when the button with children', () => {
    test('renders the button', () => {
      const { getByText } = render(<Button onClick={() => {}}>Click me!</Button>)
      expect(getByText('Click me!')).toBeInTheDocument()
    })
  })

  describe('when the button with an icon', () => {
    test('renders the button', () => {
      const { container } = render(
        <Button onClick={() => {}} Icon={<FaStar />}>
          Click me!
        </Button>
      )
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('when the button is clicked', () => {
    test('executes onClick callback', () => {
      const onClickMock = jest.fn()
      const { getByText } = render(<Button onClick={onClickMock}>Click me!</Button>)
      fireEvent.click(getByText('Click me!'))
      expect(onClickMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when set the specified size and variant to the button', () => {
    test('applies to the button', () => {
      const { container } = render(
        <Button onClick={() => {}} size="lg" variant="danger">
          Click me!
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('btn-lg')
      expect(button).toHaveClass('btn-danger')
    })
  })

  describe('when set naked prop is true to the button', () => {
    test('applies naked style to the button', () => {
      const { container } = render(
        <Button onClick={() => {}} naked>
          Click me!
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('button--naked')
    })
  })
})
