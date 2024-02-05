import { useMutation } from '@apollo/client'
import pluralize from 'pluralize'
import { useNavigate } from 'react-router'
import { INGEST_DRAFT } from '../operations/mutations/ingestDraft'
import getUmmVersion from '../utils/getUmmVersion'
import errorLogger from '../utils/errorLogger'
import useNotificationsContext from './useNotificationsContext'

const useIngestDraftMutation = () => {
  const [ingestDraftMutation] = useMutation(INGEST_DRAFT)

  const navigate = useNavigate()

  const { addNotification } = useNotificationsContext()

  const ingestMutation = (conceptType, metadata, nativeId, providerId) => {
    ingestDraftMutation({
      variables: {
        conceptType,
        metadata,
        nativeId,
        providerId,
        ummVersion: getUmmVersion(conceptType)
      },
      onCompleted: (getDraftData) => {
        const { ingestDraft } = getDraftData
        const { conceptId } = ingestDraft
        navigate(`/drafts/${pluralize(conceptType).toLowerCase()}/${conceptId}`)
        addNotification({
          message: 'Draft created successfully',
          variant: 'success'
        })
      },
      onError: (getMutationError) => {
        // Send the error to the errorLogger
        errorLogger(getMutationError, 'PublishPreview ingestDraftMutation Query')
        addNotification({
          message: 'Error creating draft',
          variant: 'danger'
        })
      }
    })
  }

  return ingestMutation
}

export default useIngestDraftMutation
