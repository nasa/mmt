import React, {
  Suspense,
  useEffect,
  useState
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import pluralize from 'pluralize'
import {
  FaCopy,
  FaSave,
  FaTrash
} from 'react-icons/fa'

import getConceptTypeByDraftConceptId from '@/js/utils/getConceptTypeByDraftConceptId'
import createTemplate from '@/js/utils/createTemplate'
import errorLogger from '@/js/utils/errorLogger'
import getUmmSchema from '@/js/utils/getUmmSchema'

import useMMTCookie from '@/js/hooks/useMMTCookie'
import useNotificationsContext from '@/js/hooks/useNotificationsContext'
import usePublishMutation from '@/js/hooks/usePublishMutation'

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
  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const navigate = useNavigate()

  const [deleteDraftMutation] = useMutation(DELETE_DRAFT, {
    update: (cache) => {
      cache.modify({
        fields: {
          // Remove the list of drafts from the cache. This ensures that if the user returns to the list page they will see the correct data.
          drafts: () => {}
        }
      })
    }
  })

  const { mmtJwt } = useMMTCookie()

  const { addNotification } = useNotificationsContext()

  const {
    publishMutation,
    publishDraft,
    error: publishErrors
  } = usePublishMutation(pluralize(derivedConceptType).toLowerCase())

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft = {} } = data

  // This may be due to a CMR lag error and affects functionality in ErrorBanner
  if (!draft) {
    throw new Error('draft is null')
  }

  const {
    nativeId,
    providerId,
    ummMetadata,
    previewMetadata
  } = draft

  // Get the UMM Schema for the draft
  const schema = getUmmSchema(derivedConceptType)

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, schema)

  // Check to see if special CMR lag use case is true
  const { errors } = ummMetadata

  const handlePublish = () => {
    publishMutation(derivedConceptType, nativeId)
  }

  useEffect(() => {
    if (publishDraft) {
      const { conceptId: publishConceptId } = publishDraft

      navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${publishConceptId}`)

      addNotification({
        message: 'Draft published',
        variant: 'success'
      })
    }
  }, [publishDraft])

  useEffect(() => {
    if (publishErrors) {
      const { message } = publishErrors
      addNotification({
        message,
        variant: 'danger'
      })

      errorLogger(message, 'PublishMutation: publishMutation')
    }
  }, [publishErrors])

  const handleTemplate = async () => {
    const response = await createTemplate(providerId, mmtJwt, {
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
        title={previewMetadata?.pageTitle || '<Blank Name>'}
        titleBadge={providerId}
        pageType="secondary"
        breadcrumbs={
          [
            {
              label: `${derivedConceptType} Drafts`,
              to: `/drafts/${derivedConceptType.toLowerCase()}s`
            },
            {
              label: previewMetadata?.pageTitle || '<Blank Name>',
              active: true
            }
          ]
        }
        primaryActions={
          [
            {
              disabled: validationErrors.length > 0,
              disabledTooltipText: 'Publishing disabled due to errors in metadata record.',
              icon: FaSave,
              iconTitle: 'A save icon',
              onClick: handlePublish,
              title: 'Publish',
              variant: 'success'
            },
            {
              disabled: !!errors,
              icon: FaTrash,
              iconTitle: 'A trash icon',
              onClick: () => toggleShowDeleteModal(true),
              title: 'Delete',
              variant: 'danger'
            },
            ...[(
              derivedConceptType === conceptTypes.Collection
                ? {
                  disabled: !!errors,
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
