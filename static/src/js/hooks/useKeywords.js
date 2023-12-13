import { useCallback, useReducer } from 'react'

import { initialState, keywordsReducer } from '../reducers/keywordsReducer'
import keywordsActions from '../constants/keywordsActions'

const useKeywords = () => {
  const [keywords, keywordsDispatch] = useReducer(keywordsReducer, initialState)

  /**
   * Adds keyword data to the keywords reducer
   */
  const addKeywordsData = useCallback(({
    data,
    type
  }) => {
    keywordsDispatch({
      type: keywordsActions.ADD_KEYWORDS_DATA,
      payload: {
        type,
        data
      }
    })
  }, [])

  return {
    addKeywordsData,
    keywords
  }
}

export default useKeywords
