/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useNavigate, useParams } from 'react-router'
import { useLazyQuery, useMutation } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import { startCase } from 'lodash-es'

import pluralize from 'pluralize'

import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'
import PreviewProgress from '../PreviewProgress/PreviewProgress'

import useAccessibleEvent from '../../hooks/useAccessibleEvent'
import useAppContext from '../../hooks/useAppContext'
import useNotificationsContext from '../../hooks/useNotificationsContext'

import formConfigurations from '../../schemas/uiForms'

import errorLogger from '../../utils/errorLogger'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'

import { DELETE_DRAFT } from '../../operations/mutations/deleteDraft'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import usePublishMutation from '../../hooks/usePublishMutation'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import CustomModal from '../CustomModal/CustomModal'

import CollectionAssociationPreviewProgress from '../CollectionAssociationPreviewProgress/CollectionAssociationPreviewProgress'
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
    setSavedDraft
  } = useAppContext()

  const { addNotification } = useNotificationsContext()
  const navigate = useNavigate()

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [retries, setRetries] = useState(0)

  const [deleteDraftMutation] = useMutation(DELETE_DRAFT)
  const publishMutation = usePublishMutation()

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

  const {
    conceptType,
    name,
    nativeId,
    previewMetadata,
    providerId,
    ummMetadata
  } = draft || {}

  // Handle the user selecting publish draft
  const handlePublish = () => {
    // Calls publish mutation hook
    publishMutation(derivedConceptType, nativeId)
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
        setShowDeleteModal(false)

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

  // Accessible event props for the delete link
  const accessibleEventProps = useAccessibleEvent(() => {
    setShowDeleteModal(true)
  })

  return (
    <Page
      title={name || '<Blank Name>'}
      pageType="secondary"
      breadcrumbs={
        [
          {
            label: `${derivedConceptType} Drafts`,
            to: `/drafts/${derivedConceptType.toLowerCase()}s`
          },
          {
            label: name || '<Blank Name>',
            active: true
          }
        ]
      }
    >
      <Container id="metadata-form" className="px-0">
        {
          derivedConceptType === 'Variable'
          && (
            <CollectionAssociationPreviewProgress
              draftJson={ummMetadata}
            />
          )
        }
        <Row>
          <Col md={12} className="mb-3" />
        </Row>
        <Row>
          <Col className="mb-5" md={12}>
            <Button
              className="eui-btn--blue display-modal"
              onClick={
                () => {
                  handlePublish()
                }
              }
            >
              Publish
              {' '}
              {startCase(conceptType)}
            </Button>

            <Button
              className="ms-2"
              variant="outline-danger"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...accessibleEventProps}
            >
              Delete
              {' '}
              {startCase(conceptType)}
            </Button>

            <CustomModal
              message="Are you sure you want to delete this draft?"
              openModal={showDeleteModal}
              actions={
                [
                  {
                    label: 'No',
                    variant: 'secondary',
                    onClick: () => { setShowDeleteModal(false) }
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
              <Col>
                <h3 className="sr-only">Metadata Fields</h3>
                <PreviewProgress
                  draftJson={ummMetadata}
                  schema={schema}
                  sections={formSections}
                  validationErrors={validationErrors}
                />
              </Col>
            </Row>
          </Col>
          <Row>
            <Col md={12}>
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
