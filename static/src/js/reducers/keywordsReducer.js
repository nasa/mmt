import keywordsActions from '../constants/keywordsActions'

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
    case keywordsActions.ADD_KEYWORDS_DATA: {
      const { type, data } = action.payload

      return {
        ...state,
        [type]: {
          ...state[type],
          data
        }
      }
    }

    default:
      return state
  }
}
