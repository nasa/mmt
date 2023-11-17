import { initialState, toastsReducer } from '../toastsReducer'

describe('toastsReducer', () => {
  describe('default', () => {
    test('throws an error for an incorrect action', () => {
      const action = {
        type: 'wrong value'
      }

      expect(() => toastsReducer(initialState, action)).toThrowError(`Unhandled action type (${action.type}) in toast reducer`)
    })
  })

  describe('ADD_TOAST', () => {
    test('returns the correct state when the toast does not exist', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'ADD_TOAST',
        payload: toast
      }

      const expectedState = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initialState, action)).toEqual(expectedState)
    })

    test('returns the correct state when the toast is already active', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'ADD_TOAST',
        payload: toast
      }

      const expectedState = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        }
      }

      const initial = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the correct state when the toast has been dismissed', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'ADD_TOAST',
        payload: toast
      }

      const expectedState = {
        ...initialState,
        dismissedToasts: {
          [toast.id]: toast
        }
      }

      const initial = {
        ...initialState,
        dismissedToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the correct state when the toast has been dismissed but more errors have occurred', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 2
      }

      const action = {
        type: 'ADD_TOAST',
        payload: toast
      }

      const expectedState = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        },
        dismissedToasts: {
          [toast.id]: {
            ...toast,
            numberErrors: 1
          }
        }
      }

      const initial = {
        ...initialState,
        dismissedToasts: {
          [toast.id]: {
            ...toast,
            numberErrors: 1
          }
        }
      }

      expect(toastsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('DISMISS_TOAST', () => {
    test('returns the correct state', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'DISMISS_TOAST',
        payload: toast.id
      }

      const expectedState = {
        ...initialState,
        activeToasts: {},
        dismissedToasts: {
          [toast.id]: toast
        }
      }

      const initial = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('DELETE_ALL_TOASTS_BY_ID', () => {
    test('returns the correct state', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'DELETE_ALL_TOASTS_BY_ID',
        payload: toast.id
      }

      const expectedState = {
        ...initialState,
        activeToasts: {},
        dismissedToasts: {
          [toast.id]: undefined
        }
      }

      const initial = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        },
        dismissedToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the initial state when an ID is not provided', () => {
      const toast = {
        id: 'mock-toast-id',
        numberErrors: 1
      }

      const action = {
        type: 'DELETE_ALL_TOASTS_BY_ID',
        payload: undefined
      }

      const initial = {
        ...initialState,
        activeToasts: {
          [toast.id]: toast
        },
        dismissedToasts: {
          [toast.id]: toast
        }
      }

      expect(toastsReducer(initial, action)).toEqual(initialState)
    })
  })
})
