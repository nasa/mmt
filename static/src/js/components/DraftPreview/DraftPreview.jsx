import { useParams } from 'react-router'
import { useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'
import validator from '@rjsf/validator-ajv8'

import { capitalize, trimEnd } from 'lodash-es'

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import MetadataPreview from '../MetadataPreview/MetadataPreview'
import PreviewProgress from '../PreviewProgress/PreviewProgress'

import formConfigurations from '../../schemas/uiForms'

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
  const { conceptId, draftType } = useParams()

  const formattedDraftType = capitalize(trimEnd(draftType, 's'))

  const { data } = useSuspenseQuery(conceptTypeDraftQueries[formattedDraftType], {
    variables: {
      params: {
        conceptId,
        conceptType: formattedDraftType
      }
    }
  })

  const { draft } = data

  // This may be due to a CMR lag error and affects functionality in ErrorBanner
  if (!draft) {
    throw new Error('draft is null')
  }

  const {
    ummMetadata
  } = draft

  // Get the UMM Schema for the draft
  const schema = getUmmSchema(formattedDraftType)

  // Validate ummMetadata
  const { errors: validationErrors } = validator.validateFormData(ummMetadata, schema)

  const { errors } = ummMetadata

  // Pull the formSections out of the formConfigurations
  const formSections = formConfigurations[formattedDraftType]

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
                    conceptType={formattedDraftType}
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
