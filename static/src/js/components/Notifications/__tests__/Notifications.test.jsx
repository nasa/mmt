import React, { useEffect } from 'react'
import {
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Notifications from '../Notifications'
import Providers from '../../../providers/Providers/Providers'
import useNotificationsContext from '../../../hooks/useNotificationsContext'

const MockComponent = () => {
  const { addNotification } = useNotificationsContext()

  useEffect(() => {
    addNotification({
      message: 'Mock notification',
      variant: 'success'
    })
  }, [])

  return null
}

const setup = (overrideNotifications) => {
  const notifications = [{
    id: 'notifications-1',
    variant: 'success',
    message: 'Mock notification',
    show: true
  }]
  const hideNotification = vi.fn()
  const removeNotification = vi.fn()

  const contextValue = {
    notifications: overrideNotifications || notifications,
    hideNotification,
    removeNotification
  }

  const user = userEvent.setup()

  render(
    <Providers>
      <Notifications />
      <MockComponent />
    </Providers>
  )

  return {
    contextValue,
    user
  }
}

describe('Notifications', () => {
  describe('when a notification is present', () => {
    test('renders a toast', () => {
      setup()

      expect(screen.getByText('Mock notification')).toBeInTheDocument()
    })

    describe('when clicking the close button', () => {
      test('the notification is removed', async () => {
        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Close' })

        await user.click(button)

        expect(screen.queryByText('Mock notification')).not.toBeInTheDocument()
      })
    })

    describe('when the delay on the notification expires', () => {
      test('the notification is removed', () => {
        vi.useFakeTimers()

        setup()

        expect(screen.getByText('Mock notification')).toBeInTheDocument()

        act(() => {
          vi.advanceTimersByTime(4000)
        })

        waitFor(() => {
          expect(screen.queryByText('Mock notification')).not.toBeInTheDocument()
        })
      })
    })
  })
})
