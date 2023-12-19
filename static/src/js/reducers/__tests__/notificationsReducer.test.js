import notificationsActions from '../../constants/notificationsActions'
import { initialState, notificationsReducer } from '../notificationsReducer'

jest.mock('lodash-es', () => ({
  ...jest.requireActual('lodash-es'),
  uniqueId: jest.fn().mockImplementation((value) => (`${value}42`))
}))

describe('notificationsReducer', () => {
  describe('default', () => {
    test('throws an error for an incorrect action', () => {
      const action = {
        type: 'wrong value'
      }

      expect(notificationsReducer(initialState, action)).toEqual(initialState)
    })
  })

  describe('NOTIFICATIONS_ADD', () => {
    test('returns the correct state', () => {
      const notifications = {
        message: 'Mock message',
        variant: 'success'
      }

      const action = {
        type: notificationsActions.NOTIFICATIONS_ADD,
        payload: notifications
      }

      const initial = []

      const expectedState = [
        ...initial,
        {
          id: 'notifications-42',
          message: 'Mock message',
          show: true,
          variant: 'success'
        }
      ]

      expect(notificationsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the correct state with existing notifications', () => {
      const notifications = {
        message: 'Mock message 2',
        variant: 'success'
      }

      const action = {
        type: notificationsActions.NOTIFICATIONS_ADD,
        payload: notifications
      }

      const initial = [
        ...initialState,
        {
          id: 'notifications-1',
          message: 'Mock message',
          show: true,
          variant: 'success'
        }
      ]

      const expectedState = [
        ...initial,
        {
          id: 'notifications-42',
          message: 'Mock message 2',
          show: true,
          variant: 'success'
        }
      ]

      expect(notificationsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('NOTIFICATIONS_HIDE', () => {
    test('returns the correct state', () => {
      const notifications = {
        id: 'notifications-1'
      }

      const action = {
        type: notificationsActions.NOTIFICATIONS_HIDE,
        payload: notifications
      }

      const initial = [
        ...initialState,
        {
          id: 'notifications-1',
          message: 'Mock message',
          show: true,
          variant: 'success'
        }, {
          id: 'notifications-2',
          message: 'Mock message 2',
          show: true,
          variant: 'success'
        }
      ]

      const expectedState = [
        {
          id: 'notifications-1',
          message: 'Mock message',
          show: false,
          variant: 'success'
        }, {
          id: 'notifications-2',
          message: 'Mock message 2',
          show: true,
          variant: 'success'
        }
      ]

      expect(notificationsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('NOTIFICATION_REMOVE', () => {
    test('returns the correct state', () => {
      const notifications = {
        id: 'notifications-1'
      }

      const action = {
        type: notificationsActions.NOTIFICATION_REMOVE,
        payload: notifications
      }

      const initial = [
        ...initialState,
        {
          id: 'notifications-1',
          message: 'Mock message',
          show: true,
          variant: 'success'
        }
      ]

      const expectedState = []

      expect(notificationsReducer(initial, action)).toEqual(expectedState)
    })
  })
})
