/**
 * This returns a usable string when JSON.stringify can't be used due to
 * a circular reference.
 * @param {Object} obj The circular JSON to be modified
 * @returns {string} stringified circular JSON
 */

const stringifyCircularJSON = (obj) => {
  const seen = new WeakSet()

  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return
      seen.add(v)
    }

    // eslint-disable-next-line consistent-return
    return v
  })
}

export default stringifyCircularJSON
