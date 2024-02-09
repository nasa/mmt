import decodeCookie from '../decodeCookie'
import encodeCookie from '../encodeCookie'

describe('decodeCookie', () => {
  test('returns the decoded object', () => {
    const obj = { token: 'abc-1' }
    const encodedCookie = encodeCookie(obj)
    expect(decodeCookie(encodedCookie)).toEqual(obj)
  })

  test('returns empty object if null is passed to it', () => {
    expect(decodeCookie(null)).toEqual({})
    expect(decodeCookie(undefined)).toEqual({})
  })
})
