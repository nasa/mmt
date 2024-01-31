/**
 * Given a ummMetadata object, removes all the keys that are given in the
 * keys array.
 * @param {Object} metadata An object containing the keys and value
 * @param {Array} keys An array that has all the keys that needs to be removed
 */
const removeMetadataKeys = (metadata, keys) => {
  keys.forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    delete metadata[key]
  })

  return metadata
}

export default removeMetadataKeys
