import React from 'react'
import classNames from 'classnames'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { FaCheck, FaExclamation } from 'react-icons/fa'
import Button from '../Button/Button'

import useNotificationsContext from '../../hooks/useNotificationsContext'

import For from '../For/For'

import './Notifications.scss'

/*
 * Renders a `Notification` component.
 *
 * The component is renders application wide notifications. Notifications should be created
 * with the `useNotifications` hook.
 *
 * @param {ButtonProps} props
 *
 * @component
 * @example <caption>Render the Notifications component</caption>
 * return (
 *   <Notifications />
 * )
 */
const Notifications = () => {
  const {
    notifications,
    hideNotification,
    removeNotification
  } = useNotificationsContext()

  return (
    <ToastContainer
      className="notifications-list p-3 position-fixed"
      position="top-center"
    >
      <For each={notifications}>
        {
          ({
            id,
            variant,
            message,
            show
          }) => {
            const iconClassNames = 'notifications-list__icon d-block text-white'
            const iconMap = {
              success: <FaCheck className={iconClassNames} />,
              danger: <FaExclamation className={iconClassNames} />
            }

            // Set the default delay duration to be passed to the Toast component and the bootstrap css variable
            const delay = 4000

            return (
              <Toast
                key={id}
                className="bg-dark position-relative overflow-hidden"
                bg="secondary"
                autohide
                delay={delay}
                onClose={
                  () => {
                  // Hide the notification on close
                    hideNotification(id)
                  }
                }
                show={show}
                onExited={
                  () => {
                  // Remove the notification from the list once it has finished exiting
                    removeNotification(id)
                  }
                }
              >
                <Toast.Body className="text-white d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <span
                      className={
                        classNames(
                          'notifications-list__icon-background d-flex align-items-center justify-content-center me-2',
                          {
                            [`bg-${variant}`]: variant
                          }
                        )
                      }
                      aria-hidden
                    >
                      {iconMap[variant] && iconMap[variant]}
                    </span>
                    {message}
                  </div>
                  <Button
                    className="px-1 py-2 m-0"
                    naked
                    size="sm"
                    onClick={() => hideNotification(id)}
                  >
                    Close
                  </Button>
                </Toast.Body>
                <span
                  style={{ '--timer-duration': `${delay}ms` }}
                  className="notifications-list__timer position-absolute bottom-0"
                />
              </Toast>
            )
          }
        }
      </For>
    </ToastContainer>
  )
}

export default Notifications
