import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash-es'
import { useLazyQuery } from '@apollo/client'

import conceptTypeQueries from '../constants/conceptTypeQueries'
import { GET_COLLECTION_REVISIONS } from '../operations/queries/getCollectionRevisions'

const useRevisionsQuery = ({
  type,
  conceptId: revisionConceptId,
  limit,
  offset,
  sortKey
}) => {
  const [revisions, setRevisions] = useState({})
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  if (type === 'Collections') {
    const [getRevisions, { loading: queryLoading }] = useLazyQuery(
      GET_COLLECTION_REVISIONS,
      {
      // If the revision results have already been loaded, skip this query
        skip: !isEmpty(revisions),
        notifyOnNetworkStatusChange: true,
        variables: {
          params: {
            conceptId: revisionConceptId,
            allRevisions: true,
            limit,
            offset,
            sortKey
          }
        },
        onCompleted: (getRevisionsData) => {
          const { [type.toLowerCase()]: revisionsResult } = getRevisionsData

          setRevisions(revisionsResult)
          setLoading(false)
        },
        onError: (fetchError) => {
          setError(fetchError)
          setLoading(false)
        }
      }
    )
    useEffect(() => {
      setLoading(queryLoading)
    }, [queryLoading])

    useEffect(() => {
      setLoading(true)

      // Fetch the search results
      getRevisions()
    }, [revisionConceptId])
  } else {
    const [getRevisions, { loading: queryLoading }] = useLazyQuery(
      conceptTypeQueries[type],
      {
      // If the revision results have already been loaded, skip this query
        skip: !isEmpty(revisions),
        notifyOnNetworkStatusChange: true,
        variables: {
          params: {
            conceptId: revisionConceptId,
            allRevisions: true,
            limit,
            offset,
            sortKey
          }
        },
        onCompleted: (getRevisionsData) => {
          const { [type.toLowerCase()]: revisionsResult } = getRevisionsData

          setRevisions(revisionsResult)
          setLoading(false)
        },
        onError: (fetchError) => {
          setError(fetchError)
          setLoading(false)
        }
      }
    )

    useEffect(() => {
      setLoading(queryLoading)
    }, [queryLoading])

    useEffect(() => {
      setLoading(true)
      // Fetch the search results
      getRevisions()
    }, [revisionConceptId])
  }

  return {
    loading,
    error,
    revisions
  }
}

export default useRevisionsQuery
