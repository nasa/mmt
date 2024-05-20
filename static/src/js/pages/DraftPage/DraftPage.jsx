import React, {
  Suspense,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import pluralize from 'pluralize'

import {
  FaCopy,
  FaSave,
  FaTrash
} from 'react-icons/fa'

import getConceptTypeByDraftConceptId from '@/js/utils/getConceptTypeByDraftConceptId'
import createTemplate from '@/js/utils/createTemplate'
import errorLogger from '@/js/utils/errorLogger'

import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import usePublishMutation from '@/js/hooks/usePublishMutation'
import useAppContext from '@/js/hooks/useAppContext'

import conceptTypeDraftQueries from '@/js/constants/conceptTypeDraftQueries'
import conceptTypes from '@/js/constants/conceptTypes'

import { DELETE_DRAFT } from '@/js/operations/mutations/deleteDraft'

import CustomModal from '@/js/components/CustomModal/CustomModal'
import DraftPreview from '@/js/components/DraftPreview/DraftPreview'
import DraftPreviewPlaceholder from '@/js/components/DraftPreviewPlaceholder/DraftPreviewPlaceholder'
import ErrorBoundary from '@/js/components/ErrorBoundary/ErrorBoundary'
import MetadataPreviewPlaceholder from '@/js/components/MetadataPreviewPlaceholder/MetadataPreviewPlaceholder'
import Page from '@/js/components/Page/Page'
import PageHeader from '@/js/components/PageHeader/PageHeader'

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
        title={data?.draft?.previewMetadata?.pageTitle || '<Blank Name>'}
        titleBadge={providerId}
        pageType="secondary"
        breadcrumbs={
          [
            {
              label: `${derivedConceptType} Drafts`,
              to: `/drafts/${derivedConceptType.toLowerCase()}s`
            },
            {
              label: data?.draft?.previewMetadata?.pageTitle || '<Blank Name>',
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
              variant: 'success'
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

/*
 * Renders a `DraftPagePlaceholder` component.
 *
 * This component renders a loading table
 *
 * @param {DraftPagePlaceholder} props
 *
 * @component
 * @example <caption>Render the draft section placeholder</caption>
 * return (
 *   <DraftPagePlaceholder />
 * )
 */
const DraftPagePlaceholder = () => (
  <>
    <DraftPreviewPlaceholder />
    <MetadataPreviewPlaceholder />
  </>
)

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
      <Suspense fallback={<DraftPagePlaceholder />}>
        <DraftPreview />
      </Suspense>
    </ErrorBoundary>
  </Page>
)

export default DraftPage
