import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_COLLECTIONS } from '../operations/queries/getCollections'

const useCollectionsQuery = ({
  conceptId
}) => {
  const [collectionSearch, setCollectionSearch] = useState()
  const [getCollections] = useLazyQuery(GET_COLLECTIONS, {
    variables: {
      params: {
        conceptId
      }
    },
    onCompleted: (getCollectionsData) => {
      setCollectionSearch(getCollectionsData.collections)
    },
    onError: (getCollectionsError) => {
      console.log('error:', getCollectionsError)
    }
  })

  useEffect(() => {
    getCollections()
  }, [])

  return {
    collectionSearch
  }
}

export default useCollectionsQuery
