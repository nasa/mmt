import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useNavigate, useParams } from 'react-router'
import { useLazyQuery, useMutation } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import { startCase } from 'lodash-es'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import pluralize from 'pluralize'

import DeleteDraftModal from '../DeleteDraftModal/DeleteDraftModal'
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

  // Determine which MetadataPreview component to show
  const metadataPreviewComponent = () => {
    if (derivedConceptType === 'Collection') {
      return (
        <CollectionPreview
          collection={previewMetadata}
          conceptId={conceptId}
          conceptType="collection-draft"
        />
      )
    }

    if (derivedConceptType === 'Service') {
      return (
        <ServicePreview
          conceptId={conceptId}
          conceptType="service-draft"
          service={previewMetadata}
        />
      )
    }

    if (derivedConceptType === 'Tool') {
      return (
        <ToolPreview
          conceptId={conceptId}
          conceptType="tool-draft"
          tool={previewMetadata}
        />
      )
    }

    if (derivedConceptType === 'Variable') {
      return (
        <VariablePreview
          conceptId={conceptId}
          conceptType="variable-draft"
          variable={previewMetadata}
        />
      )
    }

    return null
  }

  // Accessible event props for the delete link
  const accessibleEventProps = useAccessibleEvent(() => {
    setShowDeleteModal(true)
  })

  return (
    <Page title={name || '<Blank Name>'}>
      <Container id="metadata-form">
        <Row>
          <Col md={12}>
            <Button
              className="eui-btn--blue display-modal"
              data-testid="detailed-progress-view-publish-draft-btn"
              onClick={
                () => {
                  // TODO MMT-3411
                  console.log('Publish draft')
                }
              }
            >
              Publish
              {' '}
              {startCase(conceptType)}
            </Button>

            <span
              className="draft-preview__delete-draft"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...accessibleEventProps}
            >
              Delete
              {' '}
              {startCase(conceptType)}
            </span>

            <DeleteDraftModal
              show={showDeleteModal}
              closeModal={() => setShowDeleteModal(false)}
              onDelete={handleDelete}
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Row className="draft-preview__header">
              <Col md={12} className="draft-preview__header--col">
                Metadata Fields
              </Col>
            </Row>

            <Row>
              <Col>
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
              {metadataPreviewComponent()}
            </Col>
          </Row>
        </Row>
      </Container>
    </Page>
  )
}

export default DraftPreview
