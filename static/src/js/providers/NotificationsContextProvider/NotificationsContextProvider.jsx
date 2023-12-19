import React, { useMemo, useReducer } from 'react'
import PropTypes from 'prop-types'

import notificationsActions from '../../constants/notificationsActions'
import { initialState, notificationsReducer } from '../../reducers/notificationsReducer'

import NotificationsContext from '../../context/NotificationsContext'

const NotificationsContextProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationsReducer, initialState)

  /**
   * Adds a new notification to the notifications reducer
   */
  const addNotification = ({
    message,
    variant
  }) => {
    dispatch({
      type: notificationsActions.NOTIFICATIONS_ADD,
      payload: {
        message,
        variant
      }
    })
  }

  /**
   * Hides a new notification to the notifications reducer
   */
  const hideNotification = (id) => {
    dispatch({
      type: notificationsActions.NOTIFICATIONS_HIDE,
      payload: {
        id
      }
    })
  }

  /**
   * Removes a new notification to the notifications reducer
   */
  const removeNotification = (id) => {
    dispatch({
      type: notificationsActions.NOTIFICATION_REMOVE,
      payload: {
        id
      }
    })
  }

  const value = useMemo(() => ({
    notifications,
    addNotification,
    hideNotification,
    removeNotification
  }), [notifications])

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

NotificationsContextProvider.defaultProps = {
  children: null
}

NotificationsContextProvider.propTypes = {
  children: PropTypes.node
}

export default NotificationsContextProvider
