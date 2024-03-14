/**
 *Logic to determine permittedUser based on environment
 */
const getPermittedUser = () => {
  // For development environment
  if (process.env.NODE_ENV === 'development') {
    return 'typical'
  }

  // For SIT environment
  return process.env.REACT_APP_SIT_PERMITTED_USER
}

export default getPermittedUser
