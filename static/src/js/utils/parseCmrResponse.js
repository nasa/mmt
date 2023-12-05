import { cloneDeep, uniqWith } from 'lodash'

/*
* Helper function that traverses through a CMR facet response and builds a multidimensinal array of keywords.
* Given the node, it does an in order traversal of the tree.   When it visits the node, it adds node's
* value to the `path`list.   The `path` list represents the path for the given keyword set
* (i.e., [ATMOSPHERE, ATMOSPHERIC PHENOMENA, HURRICANES]).   Once the traversal hits the leaf node, it adds
* `path` array to `paths`
* You specify a "filter" array which specifies which fields you want to include in
* multidimensional array (e.g, 'category', 'topic', 'term', 'variable')
* @param {Object} node of the tree being traversed
* @param {string} parent node's name
* @param {string} child node's name
* @param {Array} path to where the keywords will be added for the set
* @param {Array} paths to where all keyword sets will be added
* @param {string} filter specify a "filter" array which specifies which fields you want to include in multidimensional array
*/
const traverse = (
  node,
  parent,
  name,
  path,
  paths,
  filter
) => {
  const children = node[name]
  // Only add the keyword if it is included in the filtered list of field names
  if (node.value && filter.includes(parent)) {
    path.push(node.value)
  }

  // In order traversal into children recursively
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
const parseCmrResponse = (response, filter) => {
  let paths = []
  const path = []

  traverse(response, 'root', Object.keys(response)[0], path, paths, filter)

  paths = paths.sort((value1, value2) => {
    const join1 = value1.join('>')
    const join2 = value2.join('>')

    return join1.localeCompare(join2)
  })

  paths = uniqWith(paths, (path1, path2) => path1.join('>') === path2.join('>'))

  return paths
}

export default parseCmrResponse
