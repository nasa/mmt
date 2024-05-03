/**
 * Converts a string to title case.
 *
 * @param {String} str The string to convert.
 * @returns {String} The converted string.
 */
const toTitleCase = (str) => str
  .replace(/([A-Z-])/g, ' $1')
  .replace(/([-])/g, ' ')
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ')

export default toTitleCase
