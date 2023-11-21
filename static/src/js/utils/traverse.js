/**
 * Function used to traverse through the cmr keywords response and build a multidimensional array of keywords
 * @param {Object} node List of keywords from cmr
 * @param {string} parent 'root'
 * @param {string} name traverse name
 * @param {Array} path empty one dimension array
 * @param {Array} paths empty two dimension array
 * @param {string} filter specify a "filter" array which specifies which fields you want to include in multidimensional array
 */
import { cloneDeep } from 'lodash'

const traverse = (
  node,
  parent,
  name,
  path,
  paths,
  filter
) => {
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

export default traverse
