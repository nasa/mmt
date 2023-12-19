/**
 * Given a string, this will return a . notation of the string
 * @param {String} property A string that needs to be converted.
 */
const convertToDottedNotation = (property) => property.replace(/_/g, '.')

export default convertToDottedNotation
