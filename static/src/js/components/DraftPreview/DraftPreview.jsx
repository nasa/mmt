import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'
import validator from '@rjsf/validator-ajv8'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import formConfigurations from '../../schemas/uiForms'
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

  const {
    ummMetadata
  } = draft

  // Get the UMM Schema for the draft
  const schema = getUmmSchema(derivedConceptType)

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, schema)

  // Pull the formSections out of the formConfigurations
  const formSections = formConfigurations[derivedConceptType]

  return (
    <Container id="metadata-form" fluid className="px-0">
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
            </Col>
          </Row>
        </Col>
        <Row>
          <Col md={12} className="draft-preview__preview">
            <h2 className="fw-bold fs-4">Preview</h2>
            <ErrorBoundary previousUrl={window.location.pathname}>
              <MetadataPreview
                conceptId={conceptId}
                conceptType={derivedConceptType}
              />
            </ErrorBoundary>
          </Col>
        </Row>
      </Row>
    </Container>
  )
}

export default DraftPreview
