import { uniqueId } from 'lodash'

import notificationsActions from '../constants/notificationsActions'

/*
 * Create the reducer to manage application wide notifications
 */
const notificationsReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case notificationsActions.NOTIFICATIONS_ADD: {
      const { message, variant } = payload

      return [
        ...state,
        {
          id: uniqueId('notifications-'),
          message,
          variant,
          show: true
        }
      ]
    }

    case notificationsActions.NOTIFICATIONS_HIDE: {
      const { id } = payload

      return [
        ...state.map(({ id: notificationId }, i) => (
          id === notificationId
            ? {
              ...state[i],
              show: false
            }
            : state[i]
        ))
      ]
    }

    case notificationsActions.NOTIFICATION_REMOVE: {
      const { id } = payload

      return [
        ...state.filter(({ id: notificationId }) => id !== notificationId)
      ]
    }

    default:
      return state
  }
}

export default notificationsReducer
