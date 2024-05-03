/**
 * Converts a string to title case.
 *
 * @param {String} str The string to convert.
 * @returns {String} The converted string.
 */
const toTitleCase = (str) => (str[0].toLowerCase() + str.slice(1))
  .replace(/([-])/g, ' ')
  .replace(/([A-Z-])/g, ' $1')
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ')

export default toTitleCase
