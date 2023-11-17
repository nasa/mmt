import reducerActions from '../constants/reducerActions'

export const initialState = {}

export const statusMessagesReducer = (state, action) => {
  switch (action.type) {
    case reducerActions.ADD_STATUS_MESSAGE: {
      return {
        ...state,
        ...action.payload
      }
    }

    case reducerActions.DISMISS_STATUS_MESSAGE: {
      const id = action.payload

      return {
        ...state,
        [id]: undefined
      }
    }

    default:
      throw new Error(`Unhandled action type (${action.type}) in statusMessages reducer`)
  }
}
