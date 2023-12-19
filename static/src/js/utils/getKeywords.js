// Helper function
// Given the specified `cmrResponse` and `filter`, this function will traverse the CMR response tree and visit each node.
// Once it encounters the the node with the specified `type`, it will begin adding the keywords under
// that node into the `list` array passed in.   The `keys` be provided to tell the parser the names of the
// fields in the response.
const addKeywordsToList = (
  cmrResponse,
  type,
  filter,
  keys,
  list
) => {
  const node = cmrResponse
  const { value, subfields, ...rest } = node
  const array = Object.keys(rest)

  array.forEach((key) => {
    const child = node[key]

    // We found the node with the specified `type`
    if (type === key) {
      const finalNode = node[type]
      // Now just add the values under that node to the `list`
      finalNode.forEach((n) => {
        list.push(n.value)
      })
    } else {
      // The node is not the specified type, we need to go deeper into the tree.
      // eslint-disable-next-line no-lonely-if
      if (Array.isArray(child)) {
        child.forEach((item) => {
          // Only branch into the tree if the node is in the specified list of `types`
          if (keys.includes(key)) {
            const { value: itemValue } = item

            // If a `filter` is provided, we want to branch only into that part of the tree
            // specified in the filter
            if (itemValue === filter[key]) {
              addKeywordsToList(item, type, filter, keys, list)
            }
          } else {
            addKeywordsToList(item, type, filter, keys, list)
          }
        })
      }
    }
  })
}

/**
 * Given the specified cmr response object and corresponding filter values, will return a list of keywords.
 * i.e., type='subtype', filter={ url_content_type: 'PublicationURL', type: 'VIEW RELATED INFORMATION' }
 * it will return a list of all keywords under PublicationURL>VIEW RELATED INFORMATION hierarchy
 * @param {Object} response A response body.
 * @param {String} type A type from CMR. (e.x subType)
 * @param {String} filter specify a "filter"
 * @param {Array} keys Object keys
 */
const getKeywords = (
  response,
  type,
  filter,
  keys
) => {
  const list = []
  addKeywordsToList(response, type, filter, keys, list)

  return list
}

export default getKeywords
