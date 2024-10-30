import React, { useEffect } from 'react'
import {
  act,
  render,
  screen
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Notifications from '../Notifications'
import Providers from '../../../providers/Providers/Providers'
import useNotificationsContext from '../../../hooks/useNotificationsContext'

// eslint-disable-next-line react/prop-types
const MockComponent = ({ variantType }) => {
  const { addNotification } = useNotificationsContext()

  useEffect(() => {
    addNotification({
      message: `Mock ${variantType} notification`,
      variant: `${variantType}`
    })
  }, [])

  return null
}

const setup = ({
  overrideVariantType,
  variantType = 'success'
} = {}) => {
  const user = userEvent.setup()

  render(
    <Providers>
      <Notifications />
      <MockComponent variantType={overrideVariantType || variantType} />
    </Providers>
  )

  return {
    user
  }
}

describe('Notifications', () => {
  describe('when a notification is present', () => {
    test('renders a toast', () => {
      setup()

      expect(screen.getByText('Mock success notification')).toBeInTheDocument()
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
  })
})
