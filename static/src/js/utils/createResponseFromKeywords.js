import { cloneDeep } from 'lodash'

// Private function used by buildMap function to parse through a multidimensional array of keywords and build a map, see exported/public interface below.
function traverseArrays(parent, tokens) {
  if (tokens.length > 0) {
    const token = tokens.shift()
    if (token === '') {
      traverseArrays(parent, tokens)

      return
    }

    if (!parent[token]) {
      const p = parent
      p[token] = {}
    }

    traverseArrays(parent[token], tokens)
  }
}

// This parses through the response of parseCmrResponse below (which is a multidimensional array of keywords) and
// produces a map of keywords used by the controlled fields widget.   The map is used like below:
// map['atmosphere']['atmospheric phenomema'] returns ['hurricanes']
export function buildMap(paths) {
  const map = {}
  paths.forEach((tokens) => {
    traverseArrays(map, tokens)
  })

  return map
}

const walkMap = (
  node,
  current,
  level,
  cmrResponse
) => {
  const key = level.shift()
  const children = Object.keys(node)

  // eslint-disable-next-line no-param-reassign
  if (current) { cmrResponse[current] = [] }

  children.forEach((field) => {
    if (key) {
      const value = node[field]
      const dict = {
        subfields: [key],
        value: field
      }
      cmrResponse[current].push(dict)
      walkMap(value, key, level, dict)
    } else {
      const value = node[field]
      const dict = { value: field }
      cmrResponse[current].push(dict)
      walkMap(value, key, level, dict)
    }
  })
}

// Given array of keyowrds, i.e.,
// ['DistributionURL', 'DOWNLOAD SOFTWARE', 'MOBILE APP'],
// ['DistributionURL', 'DOWNLOAD SOFTWARE'],
// ['DistributionURL', 'GOTO WEB TOOL', 'LIVE ACCESS SERVER (LAS)'],
// ['DistributionURL', 'GOTO WEB TOOL', 'SUBSETTER'],
// ['DistributionURL', 'GOTO WEB TOOL']
// with array of keys (i.e., ['url_content_type', 'type', 'subtype'])
// it will return a cmr response object, i.e,
// field: [
// {subfields: ..., value:..., subfield1:...},
// {subfields: ..., value:..., subfield1:...},
// ]
const createResponseFromKeywords = (keywords, keys) => {
  const map = buildMap(cloneDeep(keywords))
  const current = cloneDeep(keys.shift())
  const response = {}
  walkMap(map, current, keys, response)

  return response
}

export default createResponseFromKeywords
