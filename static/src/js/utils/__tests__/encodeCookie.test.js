import decodeCookie from '../decodeCookie'
import encodeCookie from '../encodeCookie'

describe('encodeCookie', () => {
  test('returns the proper encoding', () => {
    const obj = { token: 'abc-1' }
    const encodedCookie = encodeCookie(obj)
    expect(encodedCookie).toEqual('eyJ0b2tlbiI6ImFiYy0xIn0=')
    expect(decodeCookie(encodedCookie)).toEqual(obj)
  })
})
