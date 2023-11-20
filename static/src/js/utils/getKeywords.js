// Helper function
const collectKeywords = (
  response,
  type,
  filter,
  keys,
  list
) => {
  const node = response
  const { _value, _subfields, ...rest } = node
  const array = Object.keys(rest)
  array.forEach((key) => {
    const value = node[key]
    if (type === key) {
      const finalNode = node[type] ?? []
      finalNode.forEach((n) => {
        list.push(n.value)
      })
    } else if (value) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (keys.includes(key)) {
            const { value: itemValue } = item
            if (itemValue === filter[key]) {
              collectKeywords(item, type, filter, keys, list)
            }
          } else {
            collectKeywords(item, type, filter, keys, list)
          }
        })
      }
    }
  })
}

/**
 * Given the specified cmr response object and corresponding default values, will return a list of keywords.
 * i.e., type='subtype', values= { url_content_type: 'PublicationURL', type: 'VIEW RELATED INFORMATION' }
 * it will return a list of all keywords for PublicationURL>VIEW RELATED INFORMATION hierachy
 */
const getKeywords = (
  response,
  type,
  filter,
  keys
) => {
  const list = []
  collectKeywords(response, type, filter, keys, list)

  return list
}

export default getKeywords
