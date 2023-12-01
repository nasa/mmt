import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useLazyQuery } from '@apollo/client'

import useAppContext from './useAppContext'

import { GET_TOOL_DRAFTS } from '../operations/queries/getToolDrafts'

const useDraftsQuery = ({ draftType, limit }) => {
  const { user: { token, providerId } } = useAppContext()
  const [drafts, setDrafts] = useState({})

  // TODO Eventually will need to support dynamically choosing draft types before making the query
  const [getDrafts, { loading, error }] = useLazyQuery(GET_TOOL_DRAFTS, {
    // If the draft has already been loaded, skip this query
    skip: !isEmpty(drafts),
    notifyOnNetworkStatusChange: true,
    headers: {
      Authorization: token
    },
    variables: {
      params: {
        limit,
        conceptType: draftType,
        provider: providerId,
        sortKey: ['-revision_date']
      }
    },
    onCompleted: (getDraftsData) => {
      const { drafts: fetchedDrafts } = getDraftsData

      setDrafts(fetchedDrafts)
    }
  })

  useEffect(() => {
    getDrafts()
  }, [draftType])

  return {
    loading,
    error,
    drafts
  }
}

export default useDraftsQuery
