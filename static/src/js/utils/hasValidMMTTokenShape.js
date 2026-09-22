import jwt from 'jsonwebtoken'

const allowedProperties = [
  'edlProfile',
  'edlToken',
  'exp',
  'iat',
  'refreshToken'
]
/**
 * Checks that a value contains the appropriate MMT Token shape.
 * @param {String} token The string being checked
 * @returns {Boolean} 'true' when the string supplied has the appropriate token shape and is not expired
 */
const hasValidMMTTokenShape = (token) => {
  if (typeof token !== 'string' || token.length === 0) return false

  let decodedToken

  // Jwt.decode returns null for anything it cannot parse
  try {
    decodedToken = jwt.decode(token)
  } catch (error) {
    return false
  }

  if (!decodedToken || typeof decodedToken !== 'object') return false

  // Check to see that token doesn't contain any properties we don't expect
  const hasUnexpectedProperty = Object.keys(decodedToken)
    .some((property) => !allowedProperties.includes(property))

  if (hasUnexpectedProperty) return false

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

export default hasValidMMTTokenShape
