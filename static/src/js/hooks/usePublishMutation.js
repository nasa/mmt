import { useMutation } from '@apollo/client'
import pluralize from 'pluralize'
import { useNavigate, useParams } from 'react-router'
import { PUBLISH_DRAFT } from '../operations/mutations/publishDraft'
import errorLogger from '../utils/errorLogger'
import getUmmVersion from '../utils/getUmmVersion'
import useNotificationsContext from './useNotificationsContext'

const usePublishMutation = () => {
  const [publishDraftMutation] = useMutation(PUBLISH_DRAFT)
  const { conceptId } = useParams()

  const navigate = useNavigate()
  const { addNotification } = useNotificationsContext()

  const publishMutation = (conceptType, nativeId, collectionConceptId) => {
    publishDraftMutation({
      variables: {
        draftConceptId: conceptId,
        nativeId,
        collectionConceptId,
        ummVersion: getUmmVersion(conceptType),
      },
      onCompleted: (getPublishedData) => {
        const { publishDraft } = getPublishedData
        const { conceptId: publishConceptId, revisionId } = publishDraft

        // Add a success notification
        addNotification({
          message: `${publishConceptId} Published`,
          variant: 'success'
        })

        navigate(`/${pluralize(conceptType).toLowerCase()}/${publishConceptId}/${revisionId}`)
      },
      onError: (getPublishError) => {
        const { message } = getPublishError
        const parseErr = message.split(',')
        // TODO: Trevor said when he has time he will look into how to display this. This is just temporary
        parseErr.map((err) => (
          addNotification({
            message: err,
            variant: 'danger'
          })
        ))

        errorLogger(message, 'PublishMutation: publishMutation')
      }
    })
  }

  return publishMutation
}

export default usePublishMutation
