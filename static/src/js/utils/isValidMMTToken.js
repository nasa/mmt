import jwt from 'jsonwebtoken'

/**
 * Checks that a value looks like an MMT JWT issue by this deployment.
 * @param {String} token The string being checked
 * @returns {Boolean} 'true' when the string supplied is a valid, non-expired JWT token
 */
const isValidMMTToken = (token) => {
  if (typeof token !== 'string' || token.length === 0) return false

  let decodedToken

  // Jwt.decode returns null for anything it cannot parse
  try {
    decodedToken = jwt.decode(token)
  } catch (error) {
    return false
  }

  if (!decodedToken || typeof decodedToken !== 'object') return false

  const {
    edlProfile,
    edlToken,
    exp,
    refreshToken
  } = decodedToken

  if (!edlToken || !refreshToken || !edlProfile) return false

  if (typeof exp !== 'number') return false

  // Convert exp to Date.now milliseconds and check that it is not expired.
  return exp * 1000 > Date.now()
}

export default isValidMMTToken
