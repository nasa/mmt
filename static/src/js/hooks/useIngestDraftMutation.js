import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { INGEST_DRAFT } from '../operations/mutations/ingestDraft'
import getUmmVersion from '../utils/getUmmVersion'

const useIngestDraftMutation = () => {
  const [ingestDraft, setIngestDraft] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()

  const [ingestDraftMutation] = useMutation(INGEST_DRAFT, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of drafts from the cache. This ensures that if the user returns to the list page they will see the correct data.
          drafts: () => {}
        }
      })
    }
  })

  const ingestMutation = useCallback(async (conceptType, metadata, nativeId, providerId) => {
    let draftNativeId = nativeId

    if (conceptType === 'Visualization') {
      // Add '-draft' to the end of nativeId if it doesn't already end with it
      draftNativeId = nativeId.endsWith('-draft')
        ? nativeId
        : `${nativeId}-draft`
    }

    await ingestDraftMutation({
      variables: {
        conceptType,
        metadata,
        nativeId: draftNativeId,
        providerId,
        ummVersion: getUmmVersion(conceptType)
      },
      onCompleted: (getDraftData) => {
        setIngestDraft(getDraftData)
        setLoading(false)
      },
      onError: (fetchError) => {
        setError(fetchError)
        setLoading(false)
      }
    })
  }, [ingestDraftMutation])

  return {
    ingestMutation,
    ingestDraft,
    error,
    loading
  }
}

export default useIngestDraftMutation
