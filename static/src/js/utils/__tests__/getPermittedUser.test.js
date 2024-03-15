import getPermittedUser from '../getPermittedUser'
import { getApplicationConfig } from '../getConfig'

jest.mock('../getConfig', () => ({
  getApplicationConfig: jest.fn()
}))

describe('getPermittedUser function', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return "typical" for development environment', () => {
    // Mock the application config to return 'development' version
    getApplicationConfig.mockReturnValue({ version: 'development' })

    expect(getPermittedUser()).toEqual('typical')
  })

  it('should return the user\'s uid for non-development environment', () => {
    // Mock the application config to return 'production' version
    getApplicationConfig.mockReturnValue({ version: 'production' })

    const user = { uid: 'some_user_uid' }
    expect(getPermittedUser(user)).toEqual('some_user_uid')
  })
})
