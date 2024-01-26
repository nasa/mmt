import React from 'react'
import {
  CollectionPreview,
  ServicePreview,
  ToolPreview,
  VariablePreview
} from '@edsc/metadata-preview'
import PropTypes from 'prop-types'
import toLowerKebabCase from '../../utils/toLowerKebabCase'

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
  previewMetadata,
  conceptId,
  conceptType
}) => {
  if (conceptType === 'Collection') {
    return (
      <CollectionPreview
        collection={previewMetadata}
        conceptId={conceptId}
        conceptType={toLowerKebabCase(conceptType)}
      />
    )
  }

  if (conceptType === 'Service') {
    return (
      <ServicePreview
        service={previewMetadata}
        conceptId={conceptId}
        conceptType={toLowerKebabCase(conceptType)}
      />
    )
  }

  if (conceptType === 'Tool') {
    return (
      <ToolPreview
        tool={previewMetadata}
        conceptId={conceptId}
        conceptType={toLowerKebabCase(conceptType)}
      />
    )
  }

  if (conceptType === 'Variable') {
    return (
      <VariablePreview
        variable={previewMetadata}
        conceptId={conceptId}
        conceptType={toLowerKebabCase(conceptType)}
      />
    )
  }

  return null
}

MetadataPreview.propTypes = {
  previewMetadata: PropTypes.shape({}).isRequired,
  conceptId: PropTypes.string.isRequired,
  conceptType: PropTypes.string.isRequired
}

export default MetadataPreview
