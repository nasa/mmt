import React, {
  useEffect,
  useRef,
  useState
} from 'react'
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
  const [copyStatus, setCopyStatus] = useState({})
  const copyTimers = useRef({})
  const mounted = useRef(false)
  const {
    hideNotification,
    notifications,
    removeNotification
  } = useNotificationsContext()

  // Prevent updates from pending copies and clear reset timers on unmount.
  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
      Object.values(copyTimers.current).forEach(clearTimeout)
      copyTimers.current = {}
    }
  }, [])

  // Each notification has its own reset timer. A new result cancels its old timer.
  // Successful copies reset after two seconds, and pending timers clear on unmount.
  const handleCopy = async (id, message) => {
    let status
    try {
      await navigator.clipboard.writeText(message)
      status = 'copied'
    } catch {
      status = 'failed'
    }

    if (!mounted.current) return

    clearTimeout(copyTimers.current[id])
    delete copyTimers.current[id]
    setCopyStatus((previous) => ({
      ...previous,
      [id]: status
    }))

    if (status === 'copied') {
      copyTimers.current[id] = setTimeout(() => {
        delete copyTimers.current[id]
        setCopyStatus((previous) => ({
          ...previous,
          [id]: undefined
        }))
      }, 2000)
    }
  }

  return (
    <ToastContainer
      className="notifications-list p-3 position-fixed"
      position="bottom-end"
    >
      {
        notifications.filter(({ show }) => show).length > 1 && (
          <div className="d-flex justify-content-end mb-2">
            <Button
              className="pe-auto"
              onClick={
                () => notifications.forEach(({ id, show }) => {
                  if (show) hideNotification(id)
                })
              }
              size="sm"
              title="Dismiss all notifications"
              variant="dark"
            >
              Dismiss All
            </Button>
          </div>
        )
      }
      <For each={notifications}>
        {
          ({
            action,
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
            let copyTitle = 'Copy this notification'
            if (copyStatus[id] === 'copied') copyTitle = 'Copied notification message'
            if (copyStatus[id] === 'failed') copyTitle = 'Unable to copy notification message. Try again.'

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
                  {/* LEFT SIDE: Icon and Message (Unchanged) */}
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
                      {
                        copyStatus[id] === 'failed' && (
                          <div className="text-danger mt-1">Unable to copy notification message. Try again.</div>
                        )
                      }
                    </div>
                  </div>
                  <div className="d-flex ms-3 gap-2 align-items-start">
                    {
                      action && (
                        <Button
                          onClick={
                            () => {
                              action.onClick()
                              hideNotification(id)
                            }
                          }
                          size="sm"
                          variant="outline-light-dark"
                        >
                          {action.label}
                        </Button>
                      )
                    }
                    {/* Stacked Default Controls (Close and Copy) */}
                    <div className="d-flex flex-column gap-2">
                      <Button
                        className="notifications-list__close-button w-100"
                        onClick={() => hideNotification(id)}
                        size="sm"
                        title="Dismiss this notification"
                        variant="outline-light-dark"
                      >
                        Close
                      </Button>

                      <Button
                        className="notifications-list__close-button w-100"
                        onClick={() => handleCopy(id, message)}
                        size="sm"
                        title={copyTitle}
                        variant="outline-light-dark"
                      >
                        {copyStatus[id] === 'copied' ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
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
