import getPermittedUser from '../getPermittedUser'

describe('getPermittedUser function', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return "typical" for development environment', () => {
    process.env.NODE_ENV = 'development'

    expect(getPermittedUser()).toEqual('typical')
  })

  it('should return the user\'s uid for non-development environment', () => {
    process.env.NODE_ENV = 'production'

    const user = { uid: 'some_user_uid' }
    expect(getPermittedUser(user)).toEqual('some_user_uid')
  })
})
