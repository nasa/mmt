import isTokenExpired from '../isTokenExpired'

describe('isTokenExpired', () => {
  describe('when the token is expired', () => {
    test('returns true', () => {
      expect(isTokenExpired(new Date().getTime() - 1)).toEqual(true)
    })
  })

  describe('when the token is not expired', () => {
    test('returns false', () => {
      expect(isTokenExpired(new Date().getTime() + 1)).toEqual(false)
    })
  })

  describe('when the token does not exist', () => {
    test('returns true', () => {
      expect(isTokenExpired()).toEqual(true)
    })
  })
})
