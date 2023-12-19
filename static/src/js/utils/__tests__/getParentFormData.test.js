import getParentFormData from '../getParentFormData'

describe('getParentFormData', () => {
  describe('Digs into the JSON to return the parent data of the specified path', () => {
    test('returns the JSON of the parent of the specified path', () => {
      const json = {
        foo: {
          bar: [
            {
              alpha: {
                beta: 'x',
                gamma: 1
              }
            },
            { omega: 'bar' }
          ]
        }
      }
      const fullPath = 'foo.bar[0].alpha.beta'
      const expectedResult = {
        beta: 'x',
        gamma: 1
      }
      expect(getParentFormData(fullPath, json)).toEqual(expectedResult)
    })
  })

  describe('If there is no dotted notation in the path, return the root', () => {
    test('returns the root path given there is no dotted notation in the path', () => {
      const json = {
        foo: {
          bar: [
            {
              alpha: {
                beta: 'x',
                gamma: 1
              }
            },
            { omega: 'bar' }
          ]
        }
      }
      const fullPath = 'foo'
      expect(getParentFormData(fullPath, json)).toEqual(json)
    })
  })
})
