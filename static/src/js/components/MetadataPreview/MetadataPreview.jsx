import React from 'react'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import PropTypes from 'prop-types'

import { useSuspenseQuery } from '@apollo/client'
import { useParams } from 'react-router'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import conceptTypeQueries from '../../constants/conceptTypeQueries'

import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'


/**
 * MetadataPreview
 * @typedef {Object} MetadataPreview
 * @property {Object} previewMetadata An object with the metadata
 * @property {string} conceptId A conceptId of the record
 * @property {string} conceptType A conceptType of the record
 */
/**
 * Renders a Metadata based on a given conceptType
 *
 * @component
 * @example <caption>Render a MetadataPreview</caption>
 * return (
 *   <MetadataPreview />
 * )
 */
const MetadataPreview = ({
  conceptId,
  conceptType
}) => {
  const { cmrHost } = getApplicationConfig()

  const { draftType } = useParams()

  const isDraft = Boolean(draftType)

  let params = {
    conceptId
  }

  let query = conceptTypeQueries[conceptType]
  let conceptKey = conceptType.toLowerCase()

  if (isDraft) {
    conceptKey = 'draft'
    query = conceptTypeDraftQueries[getConceptTypeByDraftConceptId(conceptId)]

    params = {
      ...params,
      conceptType: getConceptTypeByDraftConceptId(conceptId)
    }
  }

  const { data } = useSuspenseQuery(query, {
    variables: {
      params
    }
  })

  let { [conceptKey]: concept } = data

  if (isDraft) {
    concept = concept.previewMetadata
  }

  const type = isDraft ? `${conceptType.toLowerCase()}-draft` : conceptType.toLowerCase()

  return (
    <Row>
      <Col className="publish-preview__preview" md={12}>
        {
          conceptType === 'Collection' && (
            <CollectionPreview
              cmrHost={cmrHost}
              collection={concept}
              conceptId={conceptId}
              conceptType={type}
            />
          )
        }
        {
          conceptType === 'Service' && (
            <ServicePreview
              cmrHost={cmrHost}
              service={concept}
              conceptId={conceptId}
              conceptType={type}
            />
          )
        }

        {
          conceptType === 'Tool' && (
            <ToolPreview
              cmrHost={cmrHost}
              tool={concept}
              conceptId={conceptId}
              conceptType={type}
            />
          )
        }

        {
          conceptType === 'Variable' && (
            <VariablePreview
              cmrHost={cmrHost}
              variable={concept}
              conceptId={conceptId}
              conceptType={type}
            />
          )
        }
      </Col>
    </Row>
  )
}

MetadataPreview.propTypes = {
  conceptId: PropTypes.string.isRequired,
  conceptType: PropTypes.string.isRequired
}

export default MetadataPreview
