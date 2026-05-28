import React, { useState } from 'react'
import {
  CitationPreview,
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview,
  VisualizationPreview
} from '@edsc/metadata-preview'
import { useParams } from 'react-router'
import { useQuery } from '@apollo/client'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import PropTypes from 'prop-types'
import Row from 'react-bootstrap/Row'
import getConceptTypeByDraftConceptId from '@/js/utils/getConceptTypeByDraftConceptId'
import parseError from '@/js/utils/parseError'
import LoadingBanner from '../LoadingBanner/LoadingBanner'
import ErrorBanner from '../ErrorBanner/ErrorBanner'

import conceptTypeDraftQueries from '../../constants/conceptTypeDraftQueries'
import conceptTypeQueries from '../../constants/conceptTypeQueries'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

import '@edsc/metadata-preview/dist/style.min.css'
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
  const { cmrHost, conceptsResultLimit } = getApplicationConfig()

  const conceptsResultLimitInt = parseInt(conceptsResultLimit, 10) || 1000

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

  const citationParams = (conceptType === 'Collection') ? { limit: conceptsResultLimitInt } : null
  const serviceParams = (conceptType === 'Collection') ? { limit: conceptsResultLimitInt } : null
  const variableParams = (conceptType === 'Collection') ? { limit: conceptsResultLimitInt } : null
  const collectionsParams = (conceptType !== 'Collection' && !isDraft) ? { limit: conceptsResultLimitInt } : null

  // State variables needed in case we need to fetch more variables for a collection
  const [variableItems, setVariableItems] = useState([])

  const { loading: conceptLoading, error: conceptError, data } = useQuery(query, {
    variables: {
      params,
      citationParams,
      serviceParams,
      variableParams,
      collectionsParams
    },
    onCompleted: (responseData) => {
      if (conceptType === 'Collection' && !isDraft) {
        const { collection } = responseData
        const { variables } = collection
        const { items } = variables
        setVariableItems(items)
      } else {
        setVariableItems([])
      }
    }
  })

  let { [conceptKey]: concept } = data || {}

  // The following variables are needed when we need to fetch extra variables from a collection
  const variables = concept?.associationDetails?.variables ?? []
  const variableCount = variables.length
  const excludeSet = new Set(variableItems.map((v) => v.conceptId))

  const variableConceptIds = variables
    .map((v) => v.conceptId)
    .filter((id) => !excludeSet.has(id))
    .slice(0, conceptsResultLimitInt)

  // Returns a conceptsResultLimitInt-limited set of data until there are no newItems left
  const { loading: varLoading, error: varError } = useQuery(conceptTypeQueries.Variables, {
    skip: (variableItems.length === 0)
      || (variableItems.length >= variableCount)
      || variableCount <= conceptsResultLimitInt,
    variables: {
      params: {
        limit: conceptsResultLimitInt,
        conceptId: variableConceptIds
      }
    },
    onCompleted: (responseData) => {
      const { variables: responseVariables } = responseData
      const { items: newItems } = responseVariables
      setVariableItems([...variableItems, ...newItems])
    }
  })

  // Display loading banner
  if (conceptLoading) {
    return (
      <Row>
        <LoadingBanner />
      </Row>
    )
  }

  // Display loading banner if we need to load additional variables and it hasn't completed yet
  if (varLoading
    || ((variableCount > conceptsResultLimitInt)
    && (!varError && (variableItems.length < variableCount)))) {
    return (
      <>
        <div>
          <Alert className="fst-italic fs-6" variant="warning">
            <i className="eui-icon eui-fa-info-circle" />
            {' '}
            This collection has many associated variables that may require extra load time.
          </Alert>
        </div>
        <Row>
          <LoadingBanner />
        </Row>
      </>
    )
  }

  if (conceptError || varError) {
    const message = parseError(conceptError || varError)

    return (
      <Row>
        <ErrorBanner message={message} />
      </Row>
    )
  }

  if (isDraft) {
    concept = concept.previewMetadata
  }

  const type = isDraft ? `${conceptType.toLowerCase()}-draft` : conceptType.toLowerCase()

  // Replace collection.variables.items if we had to make additional calls to get more variables
  const newConcept = (conceptType === 'Collection' && variableCount > conceptsResultLimitInt)
    ? {
      ...concept,
      variables: {
        ...concept.variables,
        items: variableItems
      }
    } : concept

  return (
    <Row>
      <Col className="publish-preview__preview" md={12}>
        {
          conceptType === 'Collection' && (
            <CollectionPreview
              cmrHost={cmrHost}
              collection={newConcept}
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
        {
          conceptType === 'Visualization' && (
            <VisualizationPreview
              cmrHost={cmrHost}
              visualization={concept}
              conceptId={conceptId}
              conceptType={type}
            />
          )
        }
        {
          conceptType === 'Citation' && (
            <CitationPreview
              cmrHost={cmrHost}
              citation={concept}
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
