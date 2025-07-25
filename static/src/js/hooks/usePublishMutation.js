import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import { PUBLISH_DRAFT } from '../operations/mutations/publishDraft'

import getUmmVersion from '../utils/getUmmVersion'
import getHumanizedNameFromTypeParam from '../utils/getHumanizedNameFromTypeParam'

/**
 * A custom hook for publishing a draft concept.
 *
 * @param {string} queryName - The name of the query to be used for cache updates.
 *
 * @returns {Object} An object containing:
 *   @property {Error|undefined} error - Any error that occurred during the publish operation.
 *   @property {boolean} loading - Indicates whether a publish operation is in progress.
 *   @property {Object|undefined} publishDraft - The data of the successfully published draft.
 *   @property {Function} publishMutation - A function to trigger the publish mutation.
 *     @param {string} conceptType - The type of the concept being published.
 *     @param {string} nativeId - The native ID of the concept.
 *     @param {string} savedConceptId - The ID of the saved draft concept.
 *     @param {Function} onPublishSuccess - Callback function to be called on successful publish.
 *       @param {Object} publishedDraftResponse - The response data from a successful publish.
 */

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

  const publishMutation = useCallback(async (
    conceptType,
    nativeId,
    savedConceptId,
    onPublishSuccess
  ) => {
    // Can be removed once CMR-10545 is complete
    let publishNativeId = nativeId

    if (conceptType === 'Visualization') {
      // Remove '-draft' from the end of nativeId if it exists
      publishNativeId = nativeId.endsWith('-draft')
        ? nativeId.slice(0, -6)
        : nativeId
    }

    setLoading(true)

    try {
      const { data } = await publishDraftMutation({
        variables: {
          draftConceptId: savedConceptId,
          nativeId: publishNativeId,
          ummVersion: getUmmVersion(conceptType)
        }
      })

      const { publishDraft: publishedDraftResponse } = data
      setPublishDraft(publishedDraftResponse)
      setLoading(false)

      // Call the onPublishSuccess callback with the published draft data
      onPublishSuccess(publishedDraftResponse)
    } catch (publishError) {
      setError(publishError)
      setLoading(false)
    }
  })

  return {
    error,
    loading,
    publishDraft,
    publishMutation
  }
}

export default usePublishMutation
