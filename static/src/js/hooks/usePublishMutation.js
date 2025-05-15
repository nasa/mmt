import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { PUBLISH_DRAFT } from '../operations/mutations/publishDraft'

import getUmmVersion from '../utils/getUmmVersion'
import getHumanizedNameFromTypeParam from '../utils/getHumanizedNameFromTypeParam'

const usePublishMutation = (queryName) => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState()
  const [publishDraft, setPublishDraft] = useState()

  const [publishDraftMutation] = useMutation(PUBLISH_DRAFT, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of drafts from the cache. This ensures that if the user returns to the list page they will see the correct data.
          drafts: () => {},
          // Remove the list of published concepts from the cache. This ensures that if the user returns to the list page they will see the correct data.
          [queryName]: () => {},
          // Remove the list of published concept from the cache. This ensures that if the user returns to the preview page they will see the correct data.
          [getHumanizedNameFromTypeParam(queryName)]: () => {}
        }
      })
    }
  })

  const { conceptId } = useParams()

  const publishMutation = useCallback(async (
    conceptType,
    nativeId
  ) => {
    // Can be removed once CMR-10545 is complete
    let publishNativeId = nativeId

    if (conceptType === 'Visualization') {
      // Remove '-draft' from the end of nativeId if it exists
      publishNativeId = nativeId.endsWith('-draft')
        ? nativeId.slice(0, -6)
        : nativeId
    }

    console.log('🚀 ~ usePublishMutation ~ publishNativeId:', publishNativeId)

    await publishDraftMutation({
      variables: {
        draftConceptId: conceptId,
        nativeId: publishNativeId,
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
