import React from 'react'

import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import CustomModal from '../CustomModal'

vi.mock('react-bootstrap/Modal', () => ({
  default: {
    Body: vi.fn(() => <div data-testid="modal-body" />),
    Header: vi.fn(() => <div data-testid="modal-header" />),
    Title: vi.fn(() => <div data-testid="modal-title" />),
    Footer: vi.fn(() => <div data-testid="modal-footer" />),
    Dialog: vi.fn(() => <div data-testid="modal-dialog" />)
  }
}))

const setup = (overrideProps) => {
  const onClick = vi.fn()

  const props = {
    show: true,
    message: 'Mock message',
    toggleModal: vi.fn(),
    actions: [
      {
        label: 'Yes',
        variant: 'primary',
        onClick
      }
    ],
    ...overrideProps
  }

  const user = userEvent.setup()

  const { container } = render(<CustomModal {...props} />)

  return {
    container,
    props,
    user
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

  describe('when no actions are provided', () => {
    test('does not render the footer', () => {
      setup({
        actions: null
      })

      expect(screen.getByTestId('modal-header')).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId('modal-body')).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId('modal-footer')).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the close button is clicked', () => {
    test('calls the toggleModal callback', async () => {
      const toggleModalMock = vi.fn()

      const { user } = setup({
        actions: null,
        toggleModal: toggleModalMock
      })

      const button = screen.getByRole('button', { name: /Close/i })

      await user.click(button)

      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })

  describe('when the backdrop is clicked', () => {
    test('calls the toggleModal callback', async () => {
      const toggleModalMock = vi.fn()

      const { user } = setup({
        actions: null,
        toggleModal: toggleModalMock
      })

      const dialog = screen.getByRole('dialog')

      await user.click(dialog)

      expect(toggleModalMock).toHaveBeenCalledTimes(1)
      expect(toggleModalMock).toHaveBeenCalledWith(false)
    })
  })
})
