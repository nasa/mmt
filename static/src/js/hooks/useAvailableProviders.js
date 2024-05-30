import { useEffect } from 'react'
import { useQuery } from '@apollo/client'

import useAuthContext from './useAuthContext'
import useAppContext from './useAppContext'

import { GET_AVAILABLE_PROVIDERS } from '../operations/queries/getAvailableProviders'

/**
 * Requests the user's available providers from CMR
 */
const useAvailableProviders = () => {
  const { providerId, setProviderId } = useAppContext()

  const { user } = useAuthContext()
  const { uid } = user || {}

  const { data = {} } = useQuery(GET_AVAILABLE_PROVIDERS, {
    variables: {
      params: {
        limit: 500,
        permittedUser: uid,
        target: 'PROVIDER_CONTEXT'
      }
    }
  })

  const { acls = {} } = data
  const { items = [] } = acls

  const providerIds = items.map(
    (item) => item.providerIdentity.provider_id
  )

  useEffect(() => {
    // If a provider has not been selected, and there are providers returned, select the first provider
    if (!providerId && providerIds?.length > 0) {
      setProviderId(providerIds[0])
    }
  }, [providerIds, providerId])

  return {
    providerIds
  }
}

export default useAvailableProviders
