import { useCallback, useReducer } from 'react'

import { initialState, statusMessagesReducer } from '../reducers/statusMessagesReducer'
import reducerActions from '../constants/reducerActions'

const useStatusMessages = () => {
  const [statusMessages, statusMessagesDispatch] = useReducer(statusMessagesReducer, initialState)

  /**
   * Add a new statusMessage
   */
  const addStatusMessage = useCallback(({
    id,
    message,
    type
  }) => {
    statusMessagesDispatch({
      type: reducerActions.ADD_STATUS_MESSAGE,
      payload: {
        [id]: {
          message,
          type
        }
      }
    })
  }, [])

  /**
   * Dismiss a statusMessage
   */
  const dismissStatusMessage = useCallback((id) => {
    statusMessagesDispatch({
      type: reducerActions.DISMISS_STATUS_MESSAGE,
      payload: id
    })
  }, [])

  return {
    statusMessages,
    addStatusMessage,
    dismissStatusMessage
  }
}

export default useStatusMessages
