import { cloneDeep } from 'lodash'
import traverseArray from './traverseArray'
import walkMap from './walkMap'
/**
 * Given array of keyowrds, i.e.,
 * ['DistributionURL', 'DOWNLOAD SOFTWARE', 'MOBILE APP'],
 * ['DistributionURL', 'DOWNLOAD SOFTWARE'],
 * ['DistributionURL', 'GOTO WEB TOOL', 'LIVE ACCESS SERVER (LAS)'],
 * ['DistributionURL', 'GOTO WEB TOOL', 'SUBSETTER'],
 * ['DistributionURL', 'GOTO WEB TOOL']
 * with array of keys (i.e., ['url_content_type', 'type', 'subtype'])
 * it will return a cmr response object, i.e,
 * field: [
 * {subfields: ..., value:..., subfield1:...},
 * {subfields: ..., value:..., subfield1:...},
 * ]
 * @param {Array} keywords Array of keywords
 * @param {Array} keys Array of keys
 */
const createResponseFromKeywords = (keywords, keys) => {
  const map = {}
  const paths = cloneDeep(keywords)
  paths.forEach((tokens) => {
    traverseArray(map, tokens)
  })

  const current = cloneDeep(keys.shift())
  const response = {}

  walkMap(map, current, keys, response)

  return response
}

export default createResponseFromKeywords
