import { getApplicationConfig } from './getConfig'

const sign = require('jwt-encode')

/**
 * Create a signed JWT Token with user information
 * @param {Object} user User object from database
 */
export const createJwtToken = (object) => {
  const { jwtSecret } = getApplicationConfig()

  return sign(object, jwtSecret)
}

export default createJwtToken
