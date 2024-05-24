import jwt from 'jsonwebtoken'

/**
 * Creates the JWT to return to the client
 * @param {String} launchpadToken User's Launchpad token
 * @param {Object} edlProfile User's EDL Profile
 */
const createJwt = (launchpadToken, edlProfile) => {
  const { env } = process
  const {
    JWT_SECRET,
    JWT_VALID_TIME
  } = env

  const token = jwt.sign(
    {
      launchpadToken,
      edlProfile
    },
    JWT_SECRET,
    {
      expiresIn: `${JWT_VALID_TIME}ms`
    }
  )

  return token
}

export default createJwt
