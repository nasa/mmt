import { cloneDeep } from 'lodash'

// Private function used to traverse through the cmr keywords response and build a multidimensional array of keywords, see exported/public interface below.
function traverse(
  node,
  parent,
  name,
  path,
  paths,
  filter
) {
  const children = node[name]
  if (node.value && filter.includes(parent)) {
    path.push(node.value)
  }

  children.forEach((child) => {
    const childPath = cloneDeep(path)

    if (child.subfields) {
      child.subfields.forEach((subfield) => {
        traverse(child, name, subfield, cloneDeep(childPath), paths, filter)
      })
    } else {
      if (child.value && filter.includes(name)) {
        childPath.push(child.value)
      }

      paths.push(childPath)
    }
  })
}

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

// This parses the cmr response and produces an multidimensional array that looks like this:
// [
//   ['atmosphere', 'atmospheric phenomena', 'hurricanes'],
//   ['oceans', 'ocean temperature', 'sea surface temperature'],
//   ['land surface', 'soils', 'carbon', 'soil organic'],
// ]
// You specify a "filter" array which specifies which fields you want to include in
// multidimensional array (e.g, 'category', 'topic', 'term', 'variable')

export function parseCmrResponse(response, filter) {
  let paths = []
  const path = []

  traverse(response, 'root', Object.keys(response)[0], path, paths, filter)
  paths = paths.sort((a, b) => {
    const j1 = a.join('>')
    const j2 = b.join('>')

    return j1.localeCompare(j2)
  })

  return paths
}

function collectKeywords(
  response,
  type,
  filter,
  keys,
  list
) {
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
export function getKeywords(
  response,
  type,
  filter,
  keys
) {
  const list = []
  collectKeywords(response, type, filter, keys, list)

  return list
}

function walkMap(
  node,
  current,
  level,
  cmrResponse
) {
  const key = level.shift()
  const children = Object.keys(node)

  if (current) {
    // eslint-disable-next-line no-param-reassign
    cmrResponse[current] = []
  }

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
export function createResponseFromKeywords(keywords, keys) {
  const map = buildMap(cloneDeep(keywords))
  const current = cloneDeep(keys.shift())
  const response = {}
  walkMap(map, current, keys, response)

  return response
}
