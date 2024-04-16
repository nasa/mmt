/**
 * Logic to determine permittedUser based on environment
 * @param {Object} user A user object
 */
const getPermittedUser = (user) => {
  // For development environment
  if (process.env.NODE_ENV === 'development') {
    return 'typical'
  }

  // For Production environments
  const { uid } = user

  return uid
}

export default getPermittedUser
