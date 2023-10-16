import React from 'react'
import { useQuery } from '@apollo/client'
import { CollectionPreview } from '@edsc/metadata-preview'

import { GET_COLLECTION } from '../../operations/queries/getCollection'

const ExampleComponent = () => {
  const conceptId = 'C1200000033-SEDAC'
  const { data } = useQuery(GET_COLLECTION, {
    variables: {
      params: {
        conceptId,
        includeTags: '*'
      }
    }
  })

  if (!data) return null

  const { collection } = data

  return (
    <CollectionPreview
      collection={collection}
      conceptId={conceptId}
    />
  )
}

export default ExampleComponent
