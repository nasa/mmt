import reducerActions from '../constants/reducerActions'

export const initialState = {}

// {
//   relatedUrls: {
//     isLoading: false,
//     isLoaded: false,
//     data: {}
//   }
// }

export const keywordsReducer = (state, action) => {
  switch (action.type) {
    case reducerActions.ADD_KEYWORDS_DATA: {
      const { type, data } = action.payload

      return {
        ...state,
        [type]: {
          ...state[type],
          data
        }
      }
    }

    case reducerActions.LOADING_KEYWORDS: {
      const type = action.payload

      return {
        ...state,
        [type]: {
          ...state[type],
          isLoading: true,
          isLoaded: false
        }
      }
    }

    case reducerActions.LOADED_KEYWORDS: {
      const type = action.payload

      return {
        ...state,
        [type]: {
          ...state[type],
          isLoading: false,
          isLoaded: true
        }
      }
    }

    default:
      throw new Error(`Unhandled action type (${action.type}) in keywords reducer`)
  }
}
