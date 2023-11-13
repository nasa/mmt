import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DeleteDraftModal from '../DeleteDraftModal'

const setup = () => {
  const props = {
    show: true,
    closeModal: jest.fn(),
    onDelete: jest.fn()
  }

  render(<DeleteDraftModal {...props} />)

  return {
    props
  }
}

describe('DeleteDraftModal', () => {
  test('renders a modal', () => {
    setup()

    expect(screen.getByText('Are you sure you want to delete this draft?')).toBeInTheDocument()
  })

  describe('when selecting `No`', () => {
    test('calls closeModal', async () => {
      const { props } = setup()

      const button = screen.getByText('No')
      await userEvent.click(button)

      expect(props.closeModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('when selecting `Yes`', () => {
    test('calls onDelete', async () => {
      const { props } = setup()

      const button = screen.getByText('Yes')
      await userEvent.click(button)

      expect(props.onDelete).toHaveBeenCalledTimes(1)
    })
  })
})
