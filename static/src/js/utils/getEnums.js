import fetchCmrKeywords from './fetchCmrKeywords'
import parseCmrResponse from './parseCmrResponse'

/**
 * This will call fetchCmrKeywords and retrieve the list of enums and parse the enums
 * @param {String} scheme keyword name for CMR
 * @param {String} filter specify a "filter"
 */
const getEnums = async (scheme, filter) => {
  const cmrEnums = await fetchCmrKeywords(scheme)

  const paths = parseCmrResponse(cmrEnums, filter)

  return paths.map((path) => path[0])
}

export default getEnums
