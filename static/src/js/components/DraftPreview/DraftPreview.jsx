import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router'
import { useMutation, useLazyQuery } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'
import { startCase } from 'lodash'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'

import ErrorBanner from '../ErrorBanner/ErrorBanner'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import Page from '../Page/Page'

import DeleteDraftModal from '../DeleteDraftModal/DeleteDraftModal'
import PreviewProgress from '../PreviewProgress/PreviewProgress'

import useAccessibleEvent from '../../hooks/useAccessibleEvent'

import formConfigurations from '../../schemas/uiForms'

import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getUmmSchema from '../../utils/getUmmSchema'
import parseError from '../../utils/parseError'

import { DELETE_DRAFT } from '../../operations/mutations/deleteDraft'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'

import useAppContext from '../../hooks/useAppContext'

import './DraftPreview.scss'

// TODO Needs tests

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
    setDraft
  } = useAppContext()

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [deleteDraftMutation, {
    // TODO how to use this information?
    // data: deleteData,
    // loading: deleteLoading,
    // error: deleteError
  }] = useMutation(DELETE_DRAFT)

  const { loading, error } = useLazyQuery(conceptTypeDraftQueries[derivedConceptType], {
    // If the draft has already been loaded, skip this query
    skip: draft,
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    },
    onCompleted: (getDraftData) => {
      const { draft: fetchedDraft } = getDraftData

      setDraft(fetchedDraft)
    }
  })

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

  if (!draft) {
    return (
      <Page>
        <ErrorBanner message="Draft could not be loaded." />
      </Page>
    )
  }

  console.log('🚀 ~ file: DraftPreview.jsx:117 ~ DraftPreview ~ draft:', draft)

  const {
    conceptType,
    name,
    nativeId,
    previewMetadata,
    providerId,
    ummMetadata
  } = draft

  // Handle the user selecting delete from the delete draft modal
  const handleDelete = () => {
    deleteDraftMutation({
      variables: {
        conceptType,
        nativeId,
        providerId
      },
      onCompleted: () => {
        setShowDeleteModal(false)

        // TODO navigate back to tool-drafts
      },
      onError: () => {}
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
          <Col sm={12}>
            {/* // TODO Error messages */}
            {/* {
              editor.status && (
                <Alert
                  key={editor.status.type}
                  variant={editor.status.type}
                  onClose={() => { editor.status = null }}
                  dismissible
                >
                  {editor.status.message}
                </Alert>
              )
            }
            {
              editor.publishErrors && editor.publishErrors.length > 0 && (
                <Alert key={JSON.stringify(editor.status.message)} variant="warning" onClose={() => { editor.publishErrors = null }} dismissible>
                  <h5>Error Publishing Draft</h5>
                  {editor.publishErrors.map((error) => (<div key={error}>{error}</div>))}
                </Alert>
              )
            } */}
          </Col>
        </Row>
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
