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

    // Set environment to development
    process.env.NODE_ENV = 'development'

    expect(getPermittedUser()).toEqual('typical')
  })

  it('should return the user\'s uid for non-development environment', () => {
    // Mock the application config to return 'production' version
    getApplicationConfig.mockReturnValue({ version: 'production' })

    // Set environment to production
    process.env.NODE_ENV = 'production'

    const user = { uid: 'some_user_uid' }
    expect(getPermittedUser(user)).toEqual('some_user_uid')
  })
})
