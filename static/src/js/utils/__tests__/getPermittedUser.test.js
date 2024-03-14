import getPermittedUser from '../getPermittedUser'

describe('getPermittedUser function', () => {
  it('should return "typical" for development environment', () => {
    // Set environment to development
    process.env.NODE_ENV = 'development'

    expect(getPermittedUser()).toEqual('typical')
  })

  it('should return SIT_PERMITTED_USER for SIT environment', () => {
    // Set environment to SIT
    process.env.NODE_ENV = 'test'
    process.env.REACT_APP_SIT_PERMITTED_USER = 'some_sit_user'

    expect(getPermittedUser()).toEqual('some_sit_user')
  })
})
