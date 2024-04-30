import React from 'react'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import PropTypes from 'prop-types'
import { useSuspenseQuery } from '@apollo/client'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { useParams } from 'react-router'
import toLowerKebabCase from '../../utils/toLowerKebabCase'

import conceptTypeQueries from '../../constants/conceptTypeQueries'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import getConceptTypeByDraftConceptId from '../../utils/getConceptTypeByDraftConceptId'

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
  const { draftType } = useParams()
  const isDraft = Boolean(draftType)

  let params = {
    conceptId
  }

  let query = conceptTypeQueries[conceptType]

  if (isDraft) {
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

  let conceptKey = conceptType.toLowerCase()

  if (isDraft) {
    conceptKey = 'draft'
  }

  let { [conceptKey]: concept } = data

  if (isDraft) {
    concept = concept.previewMetadata
  }

  return (
    <Row>
      <Col className="publish-preview__preview" md={12}>
        {
          conceptType === 'Collection'
            && (
              <CollectionPreview
                collection={concept}
                conceptId={conceptId}
                conceptType={toLowerKebabCase(conceptType)}
              />
            )
        }
        {
          conceptType === 'Service' && (
            <ServicePreview
              service={concept}
              conceptId={conceptId}
              conceptType={toLowerKebabCase(conceptType)}
            />
          )
        }

        {
          conceptType === 'Tool' && (
            <ToolPreview
              tool={concept}
              conceptId={conceptId}
              conceptType={toLowerKebabCase(conceptType)}
            />
          )
        }

        {
          conceptType === 'Variable' && (
            <VariablePreview
              variable={concept}
              conceptId={conceptId}
              conceptType={toLowerKebabCase(conceptType)}
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
