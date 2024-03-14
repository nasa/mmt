import { getApplicationConfig } from './getConfig'

/**
 *Logic to determine permittedUser based on environment
 * @param {Object} user A user object
 */
const getPermittedUser = (user) => {
  const { version } = getApplicationConfig()
  // For development environment
  if (version === 'development') {
    return 'typical'
  }

  // For SIT environment
  return user?.uid
}

export default getPermittedUser
