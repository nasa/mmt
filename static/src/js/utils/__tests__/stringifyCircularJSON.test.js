import stringifyCircularJSON from '../stringifyCircularJSON'

const circularObject = {
  name: 'Jane Doe'
}

circularObject.address = {
  city: 'Circuit City',
  owner: circularObject
}

describe('stringifyCircularJSON', () => {
  describe('when passed a circular JSON reference', () => {
    test('returns a usable string', () => {
      expect(stringifyCircularJSON(circularObject)).toEqual('{"name":"Jane Doe","address":{"city":"Circuit City"}}')
    })
  })
})
