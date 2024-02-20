import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react'
import CustomModal from '../CustomModal'

const setup = (overrideProps) => {
  const onClick = jest.fn()
  const props = {
    show: true,
    message: 'Mock message',
    toggleModal: jest.fn(),
    actions: [
      {
        label: 'Yes',
        variant: 'primary',
        onClick
      }
    ],
    ...overrideProps
  }

  render(<CustomModal {...props} />)

  return {
    props
  }
}

describe('CustomModal', () => {
  test('render a Modal', () => {
    setup()

    expect(screen.getByText('Mock message')).toBeInTheDocument()
  })

  describe('when selecting `Yes`', () => {
    test('calls onClick', async () => {
      const { props } = setup()

      const button = screen.getByText('Yes')
      await userEvent.click(button)

      const onClickProp = props.actions.at(0).onClick
      expect(onClickProp).toHaveBeenCalledTimes(1)
    })
  })

  describe('when provided a header', () => {
    test('renders the header', () => {
      setup({
        header: 'Header content'
      })

      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    test('renders the close button', () => {
      setup({
        header: 'Header content'
      })

      expect(screen.getByRole('button', { name: 'X icon Close' })).toBeInTheDocument()
    })
  })
})
