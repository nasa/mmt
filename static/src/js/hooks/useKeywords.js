import { useCallback, useReducer } from 'react'

import { initialState, keywordsReducer } from '../reducers/keywordsReducer'
import reducerActions from '../constants/reducerActions'

const useKeywords = () => {
  const [keywords, keywordsDispatch] = useReducer(keywordsReducer, initialState)

  /**
   * TODO
   */
  const addKeywordsData = useCallback(({
    data,
    type
  }) => {
    keywordsDispatch({
      type: reducerActions.ADD_KEYWORDS_DATA,
      payload: {
        type,
        data
      }
    })
  }, [])

  /**
   * TODO remove
   */
  const loadingKeywords = useCallback((type) => {
    keywordsDispatch({
      type: reducerActions.LOADING_KEYWORDS,
      payload: type
    })
  }, [])

  /**
   * TODO remove
   */
  const loadedKeywords = useCallback((type) => {
    keywordsDispatch({
      type: reducerActions.LOADED_KEYWORDS,
      payload: type
    })
  }, [])

  return {
    keywords,
    addKeywordsData,
    loadingKeywords,
    loadedKeywords
  }
}

export default useKeywords
