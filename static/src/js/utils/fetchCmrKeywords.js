import { getApplicationConfig } from './getConfig'
/**
 * Calls cmr /keywords/ endpoint to get a list of keywords
 * @param {string} scheme keyword name. e.x: related-urls
 */

const fetchCmrKeywords = async (scheme, completionHandler = null) => {
  const { cmrHost } = getApplicationConfig()

  let res = null
  await fetch(`${cmrHost}/keywords/${scheme}`)
    .then((response) => {
      res = response.json()
    })
    .catch((err) => {
      res = err
    })

  if (completionHandler) {
    completionHandler()
  }

  return res
}

export default fetchCmrKeywords