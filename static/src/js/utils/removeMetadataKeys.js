import { cloneDeep } from 'lodash-es'

/**
 * Given a ummMetadata object, removes all the keys that are given in the
 * keys array.
 * @param {Object} metadata An object containing the keys and value
 * @param {Array} keys An array that has all the keys that needs to be removed
 */
const removeMetadataKeys = (metadata, keys) => {
  const modifiedMetadata = cloneDeep(metadata)

  Object.keys(metadata).forEach((key) => {
    if (keys.includes(key)) {
      delete modifiedMetadata[key]
    }
  })

  return modifiedMetadata
}

export default removeMetadataKeys
