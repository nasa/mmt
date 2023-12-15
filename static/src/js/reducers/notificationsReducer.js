import { uniqueId } from 'lodash-es'

import notificationsActions from '../constants/notificationsActions'

export const initialState = []
/*
 * Create the reducer to manage application wide notifications
 */
export const notificationsReducer = (state, action) => {
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
        ...state.map(({ id: notificationId }, index) => (
          id === notificationId
            ? {
              ...state[index],
              show: false
            }
            : state[index]
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
