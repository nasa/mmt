import React, {
  Suspense,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaCopy,
  FaSave,
  FaTrash
} from 'react-icons/fa'

import { useMutation, useSuspenseQuery } from '@apollo/client'
import pluralize from 'pluralize'
import Page from '../../components/Page/Page'
import PageHeader from '../../components/PageHeader/PageHeader'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import CustomModal from '../../components/CustomModal/CustomModal'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import usePublishMutation from '../../hooks/usePublishMutation'
import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import createTemplate from '../../utils/createTemplate'
import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import errorLogger from '../../utils/errorLogger'
import { DELETE_DRAFT } from '../../operations/mutations/deleteDraft'
import DraftPreview from '../../components/DraftPreview/DraftPreview'
import conceptTypes from '../../constants/conceptTypes'

/**
 * Renders a DraftPageHeader component
 *
 * @component
 * @example <caption>Render a DraftPageHeader</caption>
 * return (
 *   <DraftPageHeader />
 * )
 */
const DraftPageHeader = () => {
  const { conceptId } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const navigate = useNavigate()

  const [deleteDraftMutation] = useMutation(DELETE_DRAFT)

  const { user } = useAppContext()

  const { addNotification } = useNotificationsContext()

  const { token } = user

  const {
    publishMutation,
    publishDraft
  } = usePublishMutation()

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft = {} } = data

  const {
    nativeId,
    providerId,
    ummMetadata
  } = draft

  const handlePublish = () => {
    if (derivedConceptType === 'Variable') {
      const { _private } = ummMetadata || {}
      const { CollectionAssociation } = _private || {}
      const { collectionConceptId } = CollectionAssociation || {}
      publishMutation(derivedConceptType, nativeId, collectionConceptId)
    } else {
      publishMutation(derivedConceptType, nativeId)
    }
  }

  useEffect(() => {
    if (publishDraft) {
      const { conceptId: publishConceptId, revisionId } = publishDraft

      navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${publishConceptId}/revisions/${revisionId}`)

      addNotification({
        message: 'Draft published',
        variant: 'success'
      })
    }
  }, [publishDraft])

  const handleTemplate = async () => {
    // SetLoading(true)
    const response = await createTemplate(providerId, token, {
      TemplateName: '',
      ...ummMetadata
    })

    if (response.id) {
      addNotification({
        message: 'Collection template created successfully',
        variant: 'success'
      })

      navigate(`/templates/collection/${response.id}`)
    } else {
      // SetLoading(false)
      errorLogger('Error creating template', 'DraftPreview: handleTemplate')
      addNotification({
        message: 'Error creating template',
        variant: 'danger'
      })
    }
  }

  const handleDelete = () => {
    deleteDraftMutation({
      variables: {
        conceptType: derivedConceptType,
        nativeId,
        providerId
      },
      onCompleted: () => {
        // Hide the modal
        toggleShowDeleteModal(false)

        // Navigate to the manage page
        navigate(`/drafts/${pluralize(derivedConceptType).toLowerCase()}`)

        // Add a success notification
        addNotification({
          message: 'Draft deleted successfully',
          variant: 'success'
        })
      },
      onError: (deleteDraftError) => {
        // Add an error notification
        addNotification({
          message: 'Error deleting draft',
          variant: 'danger'
        })

        // Send the error to the errorLogger
        errorLogger(deleteDraftError, 'DraftPreview: deleteDraftMutation')
      }
    })
  }

  return (
    <>
      <PageHeader
        title={data?.draft?.pageTitle || '<Blank Name>'}
        pageType="secondary"
        breadcrumbs={
          [
            {
              label: `${derivedConceptType} Drafts`,
              to: `/drafts/${derivedConceptType.toLowerCase()}s`
            },
            {
              label: data?.draft?.pageTitle || '<Blank Name>',
              active: true
            }
          ]
        }
        primaryActions={
          [
            {
              icon: FaSave,
              iconTitle: 'A save icon',
              onClick: handlePublish,
              title: 'Publish',
              variant: 'primary'
            },
            {
              icon: FaTrash,
              iconTitle: 'A trash icon',
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              variant: 'danger'
            },
            ...[(
              derivedConceptType === conceptTypes.Collection
                ? {
                  icon: FaCopy,
                  iconTitle: 'A copy icon',
                  onClick: handleTemplate,
                  title: 'Save as Template',
                  variant: 'light-dark'
                }
                : null
            )].filter(Boolean)
          ]
        }
      />
      <CustomModal
        message="Are you sure you want to delete this draft?"
        show={showDeleteModal}
        toggleModal={toggleShowDeleteModal}
        actions={
          [
            {
              label: 'No',
              variant: 'secondary',
              onClick: () => { toggleShowDeleteModal(false) }
            },
            {
              label: 'Yes',
              variant: 'primary',
              onClick: handleDelete
            }
          ]
        }
      />
    </>
  )
}

/**
 * Renders a `DraftPage` component
 *
 * @component
 * @example <caption>Renders a `DraftPage` component</caption>
 * return (
 *   <DraftPage />
 * )
 */
const DraftPage = () => (
  <Page
    pageType="secondary"
    header={<DraftPageHeader />}
  >
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <DraftPreview />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default DraftPage
