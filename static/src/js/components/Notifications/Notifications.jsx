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
 * @component
 * @example <caption>Render the Notifications component</caption>
 * return (
 *   <Notifications />
 * )
 */
const Notifications = () => {
  const {
    hideNotification,
    notifications,
    removeNotification
  } = useNotificationsContext()

  return (
    <ToastContainer
      className="notifications-list p-3 position-fixed"
      position="bottom-end"
    >
      <For each={notifications}>
        {
          ({
            id,
            message,
            show,
            variant
          }) => {
            const iconClassNames = 'notifications-list__icon d-block text-white'
            const iconMap = {
              success: <FaCheck className={iconClassNames} />,
              danger: <FaExclamation className={iconClassNames} />
            }
            const shouldAutoHide = !(variant === 'danger')

            // Set the default delay duration to be passed to the Toast component and the bootstrap css variable
            const delay = 4000

            return (
              <Toast
                autohide={shouldAutoHide}
                bg="dark"
                className="position-relative overflow-hidden text-light"
                delay={delay}
                key={id}
                onClose={
                  () => {
                    // Hide the notification on close
                    hideNotification(id)
                  }
                }
                onExited={
                  () => {
                    // Remove the notification from the list once it has finished exiting
                    removeNotification(id)
                  }
                }
                show={show}
              >
                <Toast.Body className="d-flex">
                  <div className="d-flex flex-grow-1 overflow-hidden">
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
                    <div className="notifications-list__message">
                      {message}
                    </div>
                  </div>
                  <Button
                    className="notifications-list__close-button ms-2"
                    onClick={() => hideNotification(id)}
                    size="sm"
                    variant="outline-light-dark"
                  >
                    Close
                  </Button>
                </Toast.Body>

                <span
                  className="notifications-list__timer position-absolute bottom-0"
                  style={{ '--timer-duration': `${delay}ms` }}
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
