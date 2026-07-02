import jwt from 'jsonwebtoken'
import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from '@apollo/client'
import fetchEdlProfile from './fetchEdlProfile'
import { getApplicationConfig } from '../../../sharedUtils/getConfig'
import { downcaseKeys } from './downcaseKeys'

/**
 * Returns the user's EDL profile based on the event provided
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
  const client = new ApolloClient({
    link: new HttpLink({
      uri: graphQlHost,
      headers: {
        Authorization: `Bearer ${edlToken}`
      }
    }),
    cache: new InMemoryCache()
  })

  const variables = {
    params: {
      limit: 500,
      permittedUser: uid,
      target: 'PROVIDER_CONTEXT'
    }
  }

  let providerIds = []

  await client.query({
    query: GET_AVAILABLE_PROVIDERS,
    variables
  })
    .then((response) => {
      const { acls = {} } = response.data
      const { items = [] } = acls

      providerIds = items.map(
        (item) => item.providerIdentity.provider_id
      )
    })
    .catch((error) => {
      console.error('Error fetching GraphQL data:', error)
    })

  return providerIds
}

export default fetchProviders
