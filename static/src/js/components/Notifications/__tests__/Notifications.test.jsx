import React, { useEffect } from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { expect } from 'vitest'
import Notifications from '../Notifications'
import Providers from '../../../providers/Providers/Providers'
import useNotificationsContext from '../../../hooks/useNotificationsContext'

// eslint-disable-next-line react/prop-types
const MockComponent = ({ action, variantType }) => {
  const { addNotification } = useNotificationsContext()

  useEffect(() => {
    addNotification({
      action,
      message: `Mock ${variantType} notification`,
      variant: `${variantType}`
    })
  }, [])

  return null
}

const setup = ({
  action,
  additionalVariantType,
  overrideVariantType,
  variantType = 'success'
} = {}) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <Notifications />
      <MockComponent action={action} variantType={overrideVariantType || variantType} />
      {additionalVariantType && <MockComponent variantType={additionalVariantType} />}
    </Providers>
  )

  return {
    user
  }
}

describe('Notifications', () => {
  test('does not render Dismiss All when there are notifications', () => {
    render(
      <Providers>
        <Notifications />
      </Providers>
    )

    expect(screen.queryByRole('button', { name: 'Dismiss All' })).not.toBeInTheDocument()
  })

  describe('when multiple notifications are present', () => {
    test('copies only the selected notification message', async () => {
      const { user } = setup({ additionalVariantType: 'danger' })

      expect(screen.getByText('Mock success notification')).toBeInTheDocument()
      expect(screen.getByText('Mock danger notification')).toBeInTheDocument()

      await user.click(screen.getAllByRole('button', { name: 'Copy' })[1])

      expect(await navigator.clipboard.readText()).toBe('Mock danger notification')
    })

    test('dismisses all error notifications', async () => {
      const { user } = setup({
        variantType: 'danger',
        additionalVariantType: 'danger'
      })

      expect(screen.getAllByText('Mock danger notification')).toHaveLength(2)

      await user.click(screen.getByRole('button', { name: 'Dismiss All' }))

      expect(screen.queryByText('Mock danger notification')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Dismiss All' })).not.toBeInTheDocument()
    })

    test('dismisses notifications of all variants without invoking their actions', async () => {
      const onClick = vi.fn()
      const { user } = setup({
        action: {
          label: 'Undo',
          onClick
        },
        additionalVariantType: 'danger'
      })

      await user.click(screen.getByRole('button', { name: 'Dismiss All' }))

      expect(screen.queryByText('Mock success notification')).not.toBeInTheDocument()
      expect(screen.queryByText('Mock danger notification')).not.toBeInTheDocument()
      expect(onClick).not.toHaveBeenCalled()
    })

    test('hides Dismiss All when only one visible notification remains', async () => {
      const { user } = setup({ additionalVariantType: 'danger' })

      await user.click(screen.getAllByRole('button', { name: 'Close' })[0])

      expect(screen.getByText('Mock danger notification')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Dismiss All' })).not.toBeInTheDocument()
    })
  })

  describe('when a notification is present', () => {
    test('renders a toast', () => {
      setup()

      expect(screen.getByText('Mock success notification')).toBeInTheDocument()
    })

    test('copies its message without dismissing it or invoking its action', async () => {
      const onClick = vi.fn()
      const { user } = setup({
        action: {
          label: 'Undo',
          onClick
        }
      })

      await user.click(screen.getByRole('button', { name: 'Copy' }))

      expect(await navigator.clipboard.readText()).toBe('Mock success notification')
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
      expect(screen.getByText('Mock success notification')).toBeInTheDocument()
      expect(onClick).not.toHaveBeenCalled()
    })

    test('copy button handles clipboard failure and allows retrying', async () => {
      const { user } = setup({ variantType: 'danger' })
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Permission denied'))

      await user.click(screen.getByRole('button', { name: 'Copy' }))

      expect(screen.getByText('Mock danger notification')).toBeInTheDocument()
      const copyButton = screen.getByRole('button', { name: 'Copy' })

      expect(copyButton).toHaveAttribute('title', 'Unable to copy notification message. Try again.')

      await user.click(copyButton)

      expect(await navigator.clipboard.readText()).toBe('Mock danger notification')
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
    })

    describe('when clicking the close button', () => {
      test('the notification is removed', async () => {
        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Close' })

        await user.click(button)

        expect(screen.queryByText('Mock success notification')).not.toBeInTheDocument()
      })
    })

    describe('when the delay on the notification expires', () => {
      test('the notification is removed', async () => {
        vi.useFakeTimers()

        setup()

        expect(screen.getByText('Mock success notification')).toBeInTheDocument()

        await act(() => {
          vi.advanceTimersByTimeAsync(4001)
        })

        expect(screen.queryByText('Mock success notification')).not.toBeInTheDocument()
      })
    })

    describe('when the the notification is of type danger', () => {
      test('the notification does not expire', async () => {
        vi.useFakeTimers()

        setup({ overrideVariantType: 'danger' })

        expect(screen.getByText('Mock danger notification')).toBeInTheDocument()

        await act(() => {
          vi.advanceTimersByTimeAsync(4001)
        })

        expect(screen.getByText('Mock danger notification')).toBeInTheDocument()
      })
    })

    describe('when the notification has an action', () => {
      test('renders the action button and calls its onClick when clicked', async () => {
        const onClick = vi.fn()

        const { user } = setup({
          action: {
            label: 'Undo',
            onClick
          }
        })

        await user.click(screen.getByRole('button', { name: 'Undo' }))

        expect(onClick).toHaveBeenCalledTimes(1)
      })

      test('removes the notification after the action is clicked', async () => {
        const { user } = setup({
          action: {
            label: 'Undo',
            onClick: vi.fn()
          }
        })

        await user.click(screen.getByRole('button', { name: 'Undo' }))

        expect(screen.queryByText('Mock success notification')).not.toBeInTheDocument()
      })
    })

    describe('when the notification has no action', () => {
      test('does not render an action button', () => {
        setup()

        expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
      })
    })
  })
})
