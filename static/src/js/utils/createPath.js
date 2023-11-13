/**
 * Converts a JSON Schema error `property` into a path used to traverse the JSON object
 * @param {String} property JSON Schema error `property` field
 */
const createPath = (property) => {
  let path = property

  path = path.replace(/\.(\d)/g, '[$1')
  path = path.replace(/(\d)\./g, '$1].')

  if (path.match(/^.*\d$/)) { // Ends with a digit
    path += ']'
  }

  return path
}

export default createPath
