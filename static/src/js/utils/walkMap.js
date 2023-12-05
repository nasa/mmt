/**
 * Given node object, e.g.,
 * {
 * DistributionURL: {
 *   'DOWNLOAD SOFTWARE': {
 *    'MOBILE APP': {}
 *   },
 *   'GOTO WEB TOOL': {
 *    'LIVE ACCESS SERVER (LAS)': {},
 *     'MAP VIEWER': {},
 *    'SIMPLE SUBSET WIZARD (SSW)': {},
 *    SUBSETTER: {}
 *   }
 * }
}
 * and keyword at top level, e.g., 'url_content_type'
 * and array of keywords lower level, e.g.,
 * ['type', 'subtype']
 * it will add elements to the response object, e.g.,
 * url_content_type: [
 * {subfields: ..., value:..., subfield1:...},
 * {subfields: ..., value:..., subfield1:...},
 * ]
 * @param {Object} node Existing object
 * @param {String} token Keyword at top level
 * @param {Array} level Array of keywords lower levels
 * @param {Object} cmrResponse Passed in response object
 */
const walkMap = (
  node,
  token,
  level,
  cmrResponse
) => {
  const key = level.shift()
  const children = Object.keys(node)
  const response = cmrResponse

  if (token) {
    response[token] = []
  }

  children.forEach((field) => {
    if (key) {
      const value = node[field]
      const dict = {
        subfields: [key],
        value: field
      }

      response[token].push(dict)
      walkMap(value, key, level, dict)
    } else {
      const value = node[field]
      const dict = { value: field }

      response[token].push(dict)
      walkMap(value, key, level, dict)
    }
  })

  return response
}

export default walkMap
