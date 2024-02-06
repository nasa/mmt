import React from 'react'
import { useQuery } from '@apollo/client'
import ACLS from '../../operations/queries/getAcls'

const ProviderDropdown = () => {
  const { loading, error, data } = useQuery(ACLS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const providers = data.getProviders

  return (
    <select>
      {providers.map(provider => (
        <option key={provider.provider_id} value={provider.provider_id}>
          {provider.name}
        </option>
      ))}
    </select>
  )
}

export default ProviderDropdown;
