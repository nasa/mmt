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
      edlProfile,
      exp: Math.floor(new Date().getTime() / 1000) + parseInt(JWT_VALID_TIME, 10)
    },
    JWT_SECRET
  )

  return token
}

export default createJwt
