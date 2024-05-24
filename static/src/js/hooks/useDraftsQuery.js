import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash-es'
import { useLazyQuery } from '@apollo/client'

import useAppContext from './useAppContext'

import conceptTypeDraftsQueries from '../constants/conceptTypeDraftsQueries'

const useDraftsQuery = ({ draftType, limit, offset }) => {
  const {
    providerId,
    setDraft,
    setOriginalDraft
  } = useAppContext()
  const [drafts, setDrafts] = useState({})
  const [error, setError] = useState()
  const [loading, setLoading] = useState()

  const [getDrafts, { loading: queryLoading }] = useLazyQuery(conceptTypeDraftsQueries[draftType], {
    // If the draft has already been loaded, skip this query
    skip: !isEmpty(drafts),
    notifyOnNetworkStatusChange: true,
    variables: {
      params: {
        limit,
        offset,
        conceptType: draftType,
        provider: providerId,
        sortKey: ['-revision_date']
      }
    },
    onCompleted: (getDraftsData) => {
      const { drafts: fetchedDrafts } = getDraftsData

      setDrafts(fetchedDrafts)
      setLoading(false)
    },
    onError: (fetchError) => {
      const regex = /Concept with concept-id \[.*\] and revision-id \[.*\] does not exist/
      const matchedError = fetchError?.message?.match(regex)

      // TODO put a max amount of retries in here somewhere
      if (matchedError) {
        // Fetch the drafts
        getDrafts()
      } else {
        setError(fetchError)
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    setLoading(queryLoading)
  }, [queryLoading])

  useEffect(() => {
    setLoading(true)

    // Fetch the drafts
    getDrafts()

    // Clear the draft and original draft to ensure navigating back to a draft page does not have saved data
    setDraft()
    setOriginalDraft()
  }, [draftType])

  return {
    loading,
    error,
    drafts
  }
}

export default useDraftsQuery
