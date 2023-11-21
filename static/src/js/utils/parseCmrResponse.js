import traverse from './traverse'

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
  paths = paths.sort((a, b) => {
    const j1 = a.join('>')
    const j2 = b.join('>')

    return j1.localeCompare(j2)
  })

  return paths
}

export default parseCmrResponse
