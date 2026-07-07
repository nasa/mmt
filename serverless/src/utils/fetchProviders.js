import jwt from 'jsonwebtoken'
import { print } from 'graphql'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'
import fetchEdlProfile from './fetchEdlProfile'
import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { downcaseKeys } from './downcaseKeys'

/**
 * Returns the list of provider ids the user has access to, based on the event provided
 * @param {Object} event Details about the HTTP request that it received
 */
const fetchProviders = async (event) => {
  const { env } = process
  const { JWT_SECRET } = env

  const { headers = {} } = event
  const { authorization: authorizationToken = '' } = downcaseKeys(headers)
  const [, token] = authorizationToken.split('Bearer ')

  // If we are working in development mode
  if (token === 'ABC-1') {
    return ['MMT_1', 'MMT_2']
  }

  const decodedJwt = jwt.verify(token, JWT_SECRET)
  const { edlToken } = decodedJwt

  const profile = await fetchEdlProfile(edlToken)
  const { uid } = profile

  const { graphQlHost } = getApplicationConfig()

  const variables = {
    params: {
      limit: 500,
      permittedUser: uid,
      target: 'PROVIDER_CONTEXT'
    }
  }

  const response = await fetch(graphQlHost, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${edlToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: print(GET_AVAILABLE_PROVIDERS),
      variables
    })
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors.map((error) => error.message).join('; '))
  }

  const { acls = {} } = json.data
  const { items = [] } = acls

  const providerIds = items.map((item) => item.providerIdentity.provider_id)

  return providerIds
}

export default fetchProviders
