import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { GET_AVAILABLE_PROVIDERS } from '@/js/operations/queries/getAvailableProviders'

import errorLogger from '@/js/utils/errorLogger'

import useAuthContext from './useAuthContext'
import useAppContext from './useAppContext'

/**
 * Requests the user's available providers from CMR
 */
const useAvailableProviders = () => {
  const { providerId, setProviderId } = useAppContext()

  const [providerIds, setProviderIds] = useState([])

  const { user } = useAuthContext()
  const { uid } = user || {}

  useQuery(GET_AVAILABLE_PROVIDERS, {
    variables: {
      params: {
        limit: 500,
        permittedUser: uid,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: (data) => {
      const { acls = {} } = data
      const { items = [] } = acls

      setProviderIds(items.map(
        (item) => item.providerIdentity.provider_id
      ))
    },
    onError: (error) => {
      errorLogger('Failed fetching available providers', error)
    }
  })

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
