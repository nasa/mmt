import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useNavigate, useParams } from 'react-router'
import { useLazyQuery, useMutation } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import pluralize from 'pluralize'

import {
  FaCopy,
  FaSave,
  FaTrash
} from 'react-icons/fa'
import CollectionAssociationPreviewProgress from '../CollectionAssociationPreviewProgress/CollectionAssociationPreviewProgress'
import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'
import PreviewProgress from '../PreviewProgress/PreviewProgress'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import CustomModal from '../CustomModal/CustomModal'
import formConfigurations from '../../schemas/uiForms'

import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'
import usePublishMutation from '../../hooks/usePublishMutation'

import errorLogger from '../../utils/errorLogger'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'
import createTemplate from '../../utils/createTemplate'

import { DELETE_DRAFT } from '../../operations/mutations/deleteDraft'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

import './DraftPreview.scss'

/**
 * Renders a DraftPreview component
 *
 * @component
 * @example <caption>Render a DraftPreview</caption>
 * return (
 *   <DraftPreview />
 * )
 */
const DraftPreview = () => {
  const { conceptId } = useParams()
  const {
    draft,
    savedDraft,
    setDraft,
    setOriginalDraft,
    setSavedDraft,
    user
  } = useAppContext()

  const { token } = user

  const { addNotification } = useNotificationsContext()
  const navigate = useNavigate()

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [retries, setRetries] = useState(0)
  const [collectionAssociation, setCollectionAssociation] = useState()

  const [deleteDraftMutation] = useMutation(DELETE_DRAFT)

  const {
    publishMutation,
    publishDraft,
    error: publishDraftError,
    loading: publishDraftLoading = true
  } = usePublishMutation()

  const toggleShowDeleteModal = (nextState) => {
    setShowDeleteModal(nextState)
  }

  const [getDraft] = useLazyQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft: fetchedDraft } = getDraftData
      const { revisionId } = fetchedDraft || {}

      const { revisionId: savedRevisionId } = savedDraft || {}

      if (
        !fetchedDraft
        || !fetchedDraft.previewMetadata
        || (savedRevisionId && revisionId !== savedRevisionId)
      ) {
        // If the fetchedDraft doesn't exist, doesn't have previewMetadata or doesn't matched the savedRevisionId (if avaiable),
        // then call getDraft again
        setRetries(retries + 1)
        setDraft()
        setOriginalDraft()
      } else {
        // The correct version of the draft has been fetched, update the context and set loading to false
        setDraft(fetchedDraft)
        setOriginalDraft(fetchedDraft)

        // Clear the savedDraft, we don't need it anymore
        setSavedDraft()

        // Sets the Collection Association information if available
        const { ummMetadata } = fetchedDraft
        const { _private } = ummMetadata || {}
        const { CollectionAssociation } = _private || {}
        setCollectionAssociation(CollectionAssociation)

        setLoading(false)
      }
    },
    onError: (getDraftError) => {
      setError(getDraftError)
      setLoading(false)

      // Send the error to the errorLogger
      errorLogger(getDraftError, 'DraftPreview: getDraft Query')
    }
  })

  useEffect(() => {
    setLoading(true)
    getDraft()
  }, [])

  useEffect(() => {
    // Also check that revision id matches the revision saved from the mutation result
    if (
      (!draft || !draft.previewMetadata)
      && retries < 5
    ) {
      setLoading(true)
      getDraft()
    }

    if (retries >= 5) {
      setLoading(false)
      errorLogger('Max retries allowed', 'DraftPreview: getDraft Query')
      setError('Draft could not be loaded.')
    }
  }, [draft, retries])

  const {
    name,
    nativeId,
    previewMetadata,
    providerId,
    ummMetadata
  } = draft || {}
  const { ShortName: shortName } = ummMetadata || {}

  // Handle the user selecting publish draft
  const handlePublish = () => {
    // Calls publish mutation hook
    setLoading(true)

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

      addNotification({
        message: `${publishConceptId} Published`,
        variant: 'success'
      })

      navigate(`/${pluralize(derivedConceptType).toLowerCase()}/${publishConceptId}/${revisionId}`)
    }

    if (publishDraftError) {
      setLoading(publishDraftLoading)
      const { message } = publishDraftError
      const parseErr = message.split(',')
      parseErr.map((err) => (
        addNotification({
          message: err,
          variant: 'danger'
        })
      ))

      errorLogger(message, 'PublishMutation: publishMutation')
    }
  }, [publishDraftLoading, publishDraftError])

  const handleTemplate = async () => {
    setLoading(true)
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
      setLoading(false)
      errorLogger('Error creating template', 'DraftPreview: handleTemplate')
      addNotification({
        message: 'Error creating template',
        variant: 'danger'
      })
    }
  }

  // Handle the user selecting delete from the delete draft modal
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

        // Add a success notification
        addNotification({
          message: 'Draft deleted successfully',
          variant: 'success'
        })

        // Clear the draft context
        setDraft()
        setOriginalDraft()
        setSavedDraft()

        // Navigate to the manage page
        navigate(`/manage/${pluralize(derivedConceptType).toLowerCase()}`)
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

  // Get the UMM Schema for the draft
  const schema = getUmmSchema(derivedConceptType)

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, schema)

  // Pull the formSections out of the formConfigurations
  const formSections = formConfigurations[derivedConceptType]

  if (loading) {
    return (
      <Page>
        <LoadingBanner />
      </Page>
    )
  }

  if (error) {
    const message = parseError(error)

    return (
      <Page>
        <ErrorBanner message={message} />
      </Page>
    )
  }

  if (!draft && !loading) {
    return (
      <Page>
        <ErrorBanner message="Draft could not be loaded." />
      </Page>
    )
  }

  return (
    <Page
      title={name || shortName || '<Blank Name>'}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: name || shortName || '<Blank Name>',
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
          {
            icon: FaCopy,
            iconTitle: 'A copy icon',
            onClick: handleTemplate,
            title: 'Save as Template',
            variant: 'light-dark'
          }
        ]
      }
    >
      <Container id="metadata-form" fluid className="px-0">
        <Row>
          <Col className="mb-5" md={12}>
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
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row>
              <Col className="mb-5">
                <h3 className="sr-only">Metadata Fields</h3>
                <PreviewProgress
                  draftJson={ummMetadata}
                  schema={schema}
                  sections={formSections}
                  validationErrors={validationErrors}
                />
                {
                  derivedConceptType === 'Variable'
                && (
                  <CollectionAssociationPreviewProgress
                    collectionAssociationDetails={collectionAssociation}
                  />
                )
                }
              </Col>
            </Row>
          </Col>
          <Row>
            <Col md={12} className="draft-preview__preview">
              <h2 className="fw-bold fs-4 text-secondary">Metadata Preview</h2>
              <MetadataPreview
                previewMetadata={previewMetadata}
                conceptId={conceptId}
                conceptType={derivedConceptType}
              />
            </Col>
          </Row>
        </Row>
      </Container>
    </Page>
  )
}

export default DraftPreview
