/**
 * Given keyword object, e.g.,
 * {
 *    DistributionURL: {
 *       'DOWNLOAD SOFTWARE': {
 *        'MOBILE APP': {}
 *       }
 *     }
 *  }
 * and array of tokens, e.g.,
 * ['DistributionURL', 'GOTO WEB TOOL', 'LIVE ACCESS SERVER (LAS)']
 * it will add elements to the map base on given tokens, e.g.,
 * {
 *     DistributionURL: {
 *       'DOWNLOAD SOFTWARE': {
 *         'MOBILE APP': {}
 *       },
 *      'GOTO WEB TOOL': {
 *         'LIVE ACCESS SERVER (LAS)': {}
 *       }
 *     }
 *  }
 * @param {Object} parent Existing object
 * @param {Array} tokens Array of tokens
 */
const traverseArrays = (parent, tokens) => {
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

export default traverseArrays
