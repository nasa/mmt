/**
 * Is the tokenExpires value in the past
 * @param {Date} tokenExpires
 * @returns {Boolean}
 */
const isTokenExpired = (tokenExpires = 0) => tokenExpires < new Date().getTime()

export default isTokenExpired
