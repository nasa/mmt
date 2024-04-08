import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { PUBLISH_DRAFT } from '../operations/mutations/publishDraft'

import getUmmVersion from '../utils/getUmmVersion'

const usePublishMutation = () => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [publishDraft, setPublishDraft] = useState()

  const [publishDraftMutation] = useMutation(PUBLISH_DRAFT)

  const { conceptId } = useParams()

  const publishMutation = useCallback(async (
    conceptType,
    nativeId,
    collectionConceptId
    // ConceptId
  ) => {
    await publishDraftMutation({
      variables: {
        collectionConceptId,
        draftConceptId: conceptId,
        nativeId,
        ummVersion: getUmmVersion(conceptType)
      },
      onCompleted: (getPublishedData) => {
        const { publishDraft: publishedDraftResponse } = getPublishedData
        setPublishDraft(publishedDraftResponse)
        setLoading(false)
      },
      onError: (getError) => {
        setLoading(true)
        setError(getError)
        setLoading(false)
      }
    }, [publishDraftMutation])
  })

  return {
    error,
    loading,
    publishDraft,
    publishMutation
  }
}

export default usePublishMutation
