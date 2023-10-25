import React from 'react'
import { useQuery } from '@apollo/client'
import { CollectionPreview } from '@edsc/metadata-preview'

import { GET_COLLECTION } from '../../operations/queries/getCollection'

const ExampleComponent = () => {
  // This conceptId should work in SIT, but not the local cmr setup
  const conceptId = 'C1000000201-EDF_OPS'
  const { data } = useQuery(GET_COLLECTION, {
    variables: {
      params: {
        conceptId,
        includeTags: '*'
      }
    }
  })

  console.log('🚀 ~ file: ExampleComponent.jsx:20 ~ ExampleComponent ~ data:', data)
  if (!data) return null

  const { collection } = data

  if (!collection) {
    return (
      <h1>No Collection Found</h1>
    )
  }

  return (
    <CollectionPreview
      collection={collection}
      conceptId={conceptId}
    />
  )
}

export default ExampleComponent
