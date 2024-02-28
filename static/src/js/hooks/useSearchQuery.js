import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash-es'
import { useLazyQuery } from '@apollo/client'

import conceptTypeQueries from '../constants/conceptTypeQueries'
import conceptTypes from '../constants/conceptTypes'

/**
 * Creates a query that can be used to search across the published types.
 * @param {String} type The CMR type to be queried
 * @param {String} [keyword] A string to be used as the keyword for the CMR search
 * @param {Number} [limit] The number of results to be returned per page
 * @param {Number} [offset] The number of results to offset the search by
 * @param {String} [sortKey] The CMR sort to be applied (eg. 'shortName', '-revisionDate', etc)
 */
const useSearchQuery = ({
  type,
  keyword,
  limit,
  offset,
  sortKey
}) => {
  const [results, setResults] = useState({})
  const [error, setError] = useState()
  const [loading, setLoading] = useState()

  let conditionalParams = {}

  if (type === conceptTypes.Collections) {
    conditionalParams = {
      ...conditionalParams,
      includeTags: '*'
    }
  }

  const [getResults, { loading: queryLoading }] = useLazyQuery(conceptTypeQueries[type], {
    // If the search results has already been loaded, skip this query
    skip: !isEmpty(results),
    notifyOnNetworkStatusChange: true,
    variables: {
      params: {
        limit,
        offset,
        keyword,
        sortKey,
        ...conditionalParams
      }
    },
    onCompleted: (getResultsData) => {
      const { [type.toLowerCase()]: searchResults } = getResultsData

      setResults(searchResults)
      setLoading(false)
    },
    onError: (fetchError) => {
      setError(fetchError)
      setLoading(false)
    }
  })

  useEffect(() => {
    setLoading(queryLoading)
  }, [queryLoading])

  useEffect(() => {
    setLoading(true)

    // Fetch the search results
    getResults()
  }, [type, sortKey])

  return {
    loading,
    error,
    results
  }
}

export default useSearchQuery
