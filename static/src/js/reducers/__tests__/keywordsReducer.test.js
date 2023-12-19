import keywordsActions from '../../constants/keywordsActions'
import { initialState, keywordsReducer } from '../keywordsReducer'

describe('keywordsReducer', () => {
  describe('default', () => {
    test('throws an error for an incorrect action', () => {
      const action = {
        type: 'wrong value'
      }

      expect(keywordsReducer(initialState, action)).toEqual(initialState)
    })
  })

  describe('ADD_KEYWORDS_DATA', () => {
    test('returns the correct state', () => {
      const keywords = {
        type: 'relatedUrls',
        data: {
          mock: 'data'
        }
      }

      const action = {
        type: keywordsActions.ADD_KEYWORDS_DATA,
        payload: keywords
      }

      const initial = {
        ...initialState,
        relatedUrls: {
          isLoading: true
        }
      }

      const expectedState = {
        ...initial,
        relatedUrls: {
          isLoading: true,
          data: keywords.data
        }
      }

      expect(keywordsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the correct state with existing keywords', () => {
      const keywords = {
        type: 'relatedUrls',
        data: {
          mock: 'data'
        }
      }

      const action = {
        type: keywordsActions.ADD_KEYWORDS_DATA,
        payload: keywords
      }

      const initial = {
        ...initialState,
        scienceKeywords: {
          isLoading: false,
          data: {
            mock: 'data'
          }
        },
        relatedUrls: {
          isLoading: true
        }
      }

      const expectedState = {
        ...initial,
        relatedUrls: {
          isLoading: true,
          data: keywords.data
        }
      }

      expect(keywordsReducer(initial, action)).toEqual(expectedState)
    })
  })
})
