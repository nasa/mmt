import { jwtDecode } from 'jwt-decode'
import createJwtToken from '../createJwtToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createJwtToken', () => {
  describe('creates a jwt token with a secret key', () => {
    test('returns a jwt token, decodes it to verify its data', async () => {
      const data = {
        foo: 'bar',
        alpha: 'beta'
      }

      const token = createJwtToken(data)
      expect(jwtDecode(token)).toEqual({
        foo: 'bar',
        alpha: 'beta'
      })
    })
  })
})
