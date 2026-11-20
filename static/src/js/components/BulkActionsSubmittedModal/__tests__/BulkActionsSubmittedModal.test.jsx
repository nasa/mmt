import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BulkActionsSubmittedModal from '../BulkActionsSubmittedModal'

const setup = ({
  show = true,
  taskId = 'BU-4439',
  onClose = vi.fn(),
  onViewJobStatus = vi.fn()
} = {}) => {
  const user = userEvent.setup()

  render(
    <BulkActionsSubmittedModal
      show={show}
      taskId={taskId}
      onClose={onClose}
      onViewJobStatus={onViewJobStatus}
    />
  )

  return {
    onClose,
    onViewJobStatus,
    user
  }
}

describe('BulkActionsSubmittedModal component', () => {
  test('shows the task id', () => {
    setup()

    expect(screen.getByText('Bulk Update Submitted')).toBeInTheDocument()
    expect(screen.getByText('BU-4439')).toBeInTheDocument()
  })

  test('calls onClose when Close is clicked', async () => {
    const { onClose, user } = setup()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalled()
  })

  test('calls onViewJobStatus when View Job Status is clicked', async () => {
    const { onViewJobStatus, user } = setup()

    await user.click(screen.getByRole('button', { name: 'View Job Status' }))

    expect(onViewJobStatus).toHaveBeenCalled()
  })
})
