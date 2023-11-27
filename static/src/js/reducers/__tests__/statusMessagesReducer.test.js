import reducerActions from '../../constants/reducerActions'
import { initialState, statusMessagesReducer } from '../statusMessagesReducer'

describe('statusMessagesReducer', () => {
  describe('default', () => {
    test('throws an error for an incorrect action', () => {
      const action = {
        type: 'wrong value'
      }

      expect(() => statusMessagesReducer(initialState, action)).toThrowError(`Unhandled action type (${action.type}) in statusMessages reducer`)
    })
  })

  describe('ADD_STATUS_MESSAGE', () => {
    test('returns the correct state when the statusMessage does not exist', () => {
      const statusMessage = {
        'mock-statusMessage-id': 'Mock message'
      }

      const action = {
        type: reducerActions.ADD_STATUS_MESSAGE,
        payload: statusMessage
      }

      const expectedState = {
        ...initialState,
        ...statusMessage
      }

      expect(statusMessagesReducer(initialState, action)).toEqual(expectedState)
    })

    test('returns the correct state when the statusMessage is already exists', () => {
      const statusMessage = {
        'mock-statusMessage-id': 'Mock message'
      }

      const action = {
        type: reducerActions.ADD_STATUS_MESSAGE,
        payload: statusMessage
      }

      const expectedState = {
        ...initialState,
        ...statusMessage
      }

      const initial = {
        ...initialState,
        ...statusMessage
      }

      expect(statusMessagesReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('DISMISS_STATUS_MESSAGE', () => {
    test('returns the correct state', () => {
      const action = {
        type: reducerActions.DISMISS_STATUS_MESSAGE,
        payload: 'mock-statusMessage-id'
      }

      const expectedState = {
        ...initialState,
        'mock-statusMessage-id': undefined
      }

      const initial = {
        ...initialState,
        'mock-statusMessage-id': 'Mock message'
      }

      expect(statusMessagesReducer(initial, action)).toEqual(expectedState)
    })
  })
})
