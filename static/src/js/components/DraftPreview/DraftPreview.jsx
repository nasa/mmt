import { Alert } from 'react-bootstrap'
import { FaExclamationTriangle } from 'react-icons/fa'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import validator from '@rjsf/validator-ajv8'

import formConfigurations from '../../schemas/uiForms'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import PreviewProgress from '../PreviewProgress/PreviewProgress'

import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import getUmmSchema from '../../utils/getUmmSchema'

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

  const derivedConceptType = getConceptTypeByDraftConceptId(conceptId)

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[derivedConceptType], {
    variables: {
      params: {
        conceptId,
        conceptType: derivedConceptType
      }
    }
  })

  const { draft } = data
  let schemaVersionError = false

  // This may be due to a CMR lag error and affects functionality in ErrorBanner
  if (!draft) {
    throw new Error('draft is null')
  }

  const {
    ummMetadata
  } = draft

  // If a user has saved a draft with a pervious schema version that is no longer compatible with the current version, let schemaVersionError to true
  if (derivedConceptType === 'Collection' && (typeof ummMetadata.Quality === 'string')) {
    schemaVersionError = true
  }

  // Get the UMM Schema for the draft
  const schema = getUmmSchema(derivedConceptType)

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, schema)

  const { errors } = ummMetadata

  // Pull the formSections out of the formConfigurations
  const formSections = formConfigurations[derivedConceptType]

  return (
    <Container id="metadata-form" fluid className="px-0">
      {
        errors ? (
          <Row>
            <Col md={12}>
              This record does not exist in CMR, please contact support@earthdata.nasa.gov
              if you believe this is an error.
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={12}>
              {
                schemaVersionError && (
                  <Row>
                    <Alert className="rounded-0 d-flex align-items-center justify-content-center p-3 flex-column flex-sm-row" variant="warning">
                      <span className="d-inline-flex align-items-center gap-1 me-3">
                        <FaExclamationTriangle />
                        <strong>Caution</strong>
                      </span>
                      <span className="text-center">
                        This draft contains deprecated data for the field: Quality.
                        Please delete and recreate before proceeding.
                      </span>
                    </Alert>
                  </Row>
                )
              }
              <Row>
                <Col className="mb-5">
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
              <Col md={12} className="draft-preview__preview">
                <h2 className="fw-bold fs-4">Preview</h2>
                <ErrorBoundary>
                  <MetadataPreview
                    conceptId={conceptId}
                    conceptType={derivedConceptType}
                  />
                </ErrorBoundary>
              </Col>
            </Row>
          </Row>
        )
      }
    </Container>
  )
}

export default DraftPreview
