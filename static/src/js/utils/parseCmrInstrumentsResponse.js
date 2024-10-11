import { cloneDeep, uniqWith } from 'lodash-es'

/*
* Helper function that traverses through a CMR facet response and builds a multidimensinal array of keywords.
* Given the node, it does an in order traversal of the tree.   When it visits the node, it adds node's
* value to the `path`list.   The `path` list represents the path for the given keyword set
* (i.e., [ATMOSPHERE, ATMOSPHERIC PHENOMENA, HURRICANES]).
* You specify a "filter" array which specifies which fields you want to include in
* multidimensional array (e.g, 'category', 'topic', 'term', 'variable')
* @param {node} node of the tree being traversed
* @param {Array} path to where the keywords will be added for the set as it traverses down to the leaf
* @param {string} filter specify a "filter" array which specifies which fields you want to include in multidimensional array
@ returns the multidimensional array of keywords
*/
const traverseCmrResponse = (
  node,
  filter,
  path = {}
) => {
  // Example of `data` being passed in the node object:
  // {
  //   "value": "VisualizationURL",
  //   "subfields": [
  //     "type"
  //   ],
  //   "type": [
  //     {
  //       "value": "Color Map",
  //       "subfields": [
  //         "subtype"
  //       ],
  //       "subtype": [
  //         {
  //           "value": "Giovanni",
  //         },
  //         {
  //           "value": "GITC",
  //         }
  //       ]
  //     }
  const {
    data,
    parentName,
    name
  } = node

  const children = data[name]
  // Only add the keyword if it is included in the filtered list of field names
  if (data.value && filter.includes(name)) {
    // eslint-disable-next-line no-param-reassign
    path[parentName] = data.value
  }

  let paths = []

  // In order traversal into children recursively
  children.forEach((child) => {
    const childPath = cloneDeep(path)

    if (child.subfields) {
      child.subfields.forEach((subfield) => {
        paths = paths.concat(traverseCmrResponse({
          data: child,
          parentName: name,
          name: subfield
        }, filter, cloneDeep(childPath)))
      })
    } else {
      if (child.value && filter.includes(name)) {
        childPath[name] = child.value
      }

      paths.push(childPath)
    }
  })

  paths = paths.sort((value1, value2) => {
    const join1 = Object.values(value1).join('>')
    const join2 = Object.values(value2).join('>')

    return join1.localeCompare(join2)
  })

  paths = uniqWith(paths, (path1, path2) => Object.values(path1).join('>') === Object.values(path2).join('>'))

  return paths
}

/**
 * This parses the cmr response and produces an multidimensional array that looks like this:
 * [
 *   ['atmosphere', 'atmospheric phenomena', 'hurricanes'],
 *   ['oceans', 'ocean temperature', 'sea surface temperature'],
 *   ['land surface', 'soils', 'carbon', 'soil organic'],
 * ]
 * You specify a "filter" array which specifies which fields you want to include in
 * multidimensional array (e.g, 'category', 'topic', 'term', 'variable')
 * @param {Object} response response from CMR
 * @param {string} filter specify a "filter" array which specifies which fields you want to include in multidimensional array
 */
const parseCmrInstrumentsResponse = (response, filter) => {
  const paths = traverseCmrResponse({
    name: Object.keys(response)[0],
    data: response
  }, filter)

  return paths
}

export default parseCmrInstrumentsResponse
