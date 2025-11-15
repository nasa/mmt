import jwt from 'jsonwebtoken'

/**
 * Creates the JWT to return to the client
 * @param {String} edlToken User's access token
 * @param {String} refreshToken User's refresh token
 * @param {Object} edlProfile User's EDL Profile
 */
const createJwt = (edlToken, refreshToken, expiresAt, edlProfile) => {
  const { env } = process
  const {
    JWT_SECRET
  } = env

  // Convert expiresAt to seconds since Unix epoch
  const expirationTime = Math.floor(new Date(expiresAt).getTime() / 1000)

  const data = {
    edlToken,
    refreshToken,
    edlProfile,
    exp: expirationTime
  }

  console.log('data=', data)

  const token = jwt.sign(
    data,
    JWT_SECRET
  )

  return token
}

export default createJwt
