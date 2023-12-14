import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FaStar } from 'react-icons/fa'

import Button from '../Button'

jest.mock('react-icons/fa')

const setup = (overrideProps = {}) => {
  const props = {
    onClick: jest.fn(),
    ...overrideProps
  }

  render(
    <Button {...props}>
      Click me!
    </Button>
  )

  return {
    props,
    user: userEvent.setup()
  }
}

describe('Button', () => {
  describe('when the button with children', () => {
    test('renders the button', () => {
      setup()

      expect(screen.getByText('Click me!')).toBeInTheDocument()
    })
  })

  describe('when the button with an icon', () => {
    beforeEach(() => {
      FaStar.mockImplementation(
        jest.requireActual('react-icons/fa').FaStar
      )
    })

    test('renders the button', () => {
      setup({
        Icon: FaStar
      })

      expect(FaStar).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the button is clicked', () => {
    test('executes onClick callback', async () => {
      const { props, user } = setup()

      await user.click(screen.getByRole('button'))

      expect(props.onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('when set the specified size and variant to the button', () => {
    test('applies to the button', () => {
      setup({
        size: 'lg',
        variant: 'danger'
      })

      const button = screen.getByRole('button')

      expect(button).toHaveClass('btn-lg')
      expect(button).toHaveClass('btn-danger')
    })
  })

  describe('when set naked prop is true to the button', () => {
    test('applies naked style to the button', () => {
      setup({
        naked: true
      })

      const button = screen.getByRole('button')

      expect(button).toHaveClass('button--naked')
    })
  })
})
