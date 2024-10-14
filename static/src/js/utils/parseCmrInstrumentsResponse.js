import { cloneDeep, uniqWith } from 'lodash-es'

/*
* Helper function that traverses through a CMR facet response and builds an array of keyword objects.
* Given the node, it does an in order traversal of the tree.   When it visits the node, it adds node's
* name and value to the keyword object.   The `path` represents the keyword object for the given keyword set
* (i.e., {
*   category: 'Earth Remote Sensing Instruments',
*   class: 'Active Remote Sensing',
*   type: 'Altimeters',
*   subtype: 'Lidar/Laser Altimeters',
*   short_name: 'ATM',
*   long_name: 'Airborne Topographic Mapper'
* }).
* You specify a "filter" array which specifies which fields you want to include in
* keyword map (e.g, 'category', 'class', 'type', 'subtype', 'short_name', 'long_name')
* @param {node} node of the tree being traversed
* @param {Array} path to where the keywords will be added for the set as it traverses down to the leaf
* @param {string} filter specify a "filter" array which specifies which fields you want to include in multidimensional array
@ returns the multidimensional array of keywords
*/
const traverseCmrResponse = (
  node,
  filter,
  keywordParam = {}
) => {
  const {
    data,
    parentName,
    name
  } = node

  const children = data[name]
  const keyword = cloneDeep(keywordParam)
  // Only add the keyword if it is included in the filtered list of field names
  if (data.value && filter.includes(name)) {
    keyword[parentName] = data.value
  }

  let keywords = []

  // In order traversal into children recursively
  children.forEach((child) => {
    const childPath = cloneDeep(keyword)

    if (child.subfields) {
      child.subfields.forEach((subfield) => {
        keywords = keywords.concat(traverseCmrResponse({
          data: child,
          parentName: name,
          name: subfield
        }, filter, cloneDeep(childPath)))
      })
    } else {
      if (child.value && filter.includes(name)) {
        childPath[name] = child.value
      }

      keywords.push(childPath)
    }
  })

  keywords = keywords.sort((obj1, obj2) => {
    const join1 = Object.values(obj1).join('>')
    const join2 = Object.values(obj2).join('>')

    return join1.localeCompare(join2)
  })

  keywords = uniqWith(keywords, (obj1, obj2) => Object.values(obj1).join('>') === Object.values(obj2).join('>'))

  return keywords
}

/**
 * This parses the cmr response and produces an array of keyword ohjects that looks like this:
 * [{
 *   category: 'Earth Remote Sensing Instruments',
 *   class: 'Active Remote Sensing',
 *   type: 'Altimeters',
 *   subtype: 'Lidar/Laser Altimeters',
 *   short_name: 'ATM',
 *   long_name: 'Airborne Topographic Mapper'
 * },{
 *   category: 'Earth Remote Sensing Instruments',
 *   class: 'Active Remote Sensing',
 *   type: 'Altimeters',
 *   subtype: 'Lidar/Laser Altimeters',
 *   short_name: 'LVIS',
 *   long_name: 'Land, Vegetation, and Ice Sensor'
 * }]
 * You specify a "filter" array which specifies which fields you want to include in
 * keyword objects (e.g, 'category', 'class', 'type', 'subtype', 'short_name', 'long_name')
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
