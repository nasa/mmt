import { XMLBuilder } from 'fast-xml-parser'
import removeEmpty from '@/js/utils/removeEmpty'

/**
 * Converts form data to RDF XML format
 * @param {Object} formData - The form data to be converted
 * @returns {string} The RDF XML string
 */
export const convertFormDataToRdf = (formData, userNote, scheme, uid) => {
  // Initialize XML builder with specific options
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    attributeNamePrefix: '@_'
  })
  /**
   * Ensures that the input is an array
   * @param {*} data - The input data
   * @returns {Array} An array of the input data
   */
  const ensureArray = (data) => {
    if (Array.isArray(data)) {
      return data
    }

    if (data) {
      return [data]
    }

    return []
  }

  const createNewChangeNote = () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const userIdPart = uid ? `User Id=${uid}` : ''
    const parts = [
      `Date=${currentDate}`,
      userIdPart,
      `User Note=${userNote.trim()}`
    ].filter(Boolean)

    return parts.join(' ')
  }

  // Construct the RDF object structure
  const rdfObj = {
    'rdf:RDF': {
      // RDF namespaces and attributes
      '@_xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      '@_xmlns:skos': 'http://www.w3.org/2004/02/skos/core#',
      '@_xmlns:gcmd': 'https://gcmd.earthdata.nasa.gov/kms#',
      '@_xmlns:dcterms': 'http://purl.org/dc/terms/',
      '@_xml:base': 'https://gcmd.earthdata.nasa.gov/kms/concept/',
      'skos:Concept': {
        // Map form data to RDF properties
        '@_rdf:about': formData.KeywordUUID,
        'skos:broader': ensureArray(formData.BroaderKeywords).map((bk) => ({
          '@_rdf:resource': bk.BroaderUUID
        })),
        'skos:inScheme': {
          '@_rdf:resource': `https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/${scheme.name}`
        },
        'gcmd:reference': formData.DefinitionReference ? {
          '@_gcmd:text': formData.DefinitionReference,
          '@_xml:lang': 'en'
        } : undefined,
        'skos:prefLabel': {
          '#text': formData.PreferredLabel,
          '@_xml:lang': 'en'
        },
        'skos:narrower': ensureArray(formData.NarrowerKeywords).map((nk) => ({
          '@_rdf:resource': nk.NarrowerUUID
        })),
        'skos:changeNote': [
          ...(formData.ChangeLogs
            ? formData.ChangeLogs.split('\n\n').map((note) => ({ '#text': note }))
            : []),
          ...(userNote && userNote.trim()
            ? [{
              '#text': createNewChangeNote(),
              '@_rdf:parseType': 'Literal'
            }]
            : [])
        ],
        'skos:definition': {
          '#text': formData.Definition,
          '@_xml:lang': 'en'
        },
        'gcmd:resource': ensureArray(formData.Resources).map((res) => ({
          '@_gcmd:type': res.ResourceType,
          '@_gcmd:url': res.ResourceUri
        })),
        'gcmd:altLabel': ensureArray(formData.AlternateLabels).map((al) => ({
          '@_gcmd:text': al.LabelName,
          '@_xml:lang': 'en',
          '@_gcmd:category': al.LabelType
        })),
        'skos:related': ensureArray(formData.RelatedKeywords)
          .filter((rk) => rk.RelationshipType === 'Related')
          .map((rk) => ({ '@_rdf:resource': rk.UUID })),
        'gcmd:hasInstrument': ensureArray(formData.RelatedKeywords)
          .filter((rk) => rk.RelationshipType === 'Has Instrument')
          .map((rk) => ({ '@_rdf:resource': rk.UUID })),
        'gcmd:isOnPlatform': ensureArray(formData.RelatedKeywords)
          .filter((rk) => rk.RelationshipType === 'On Platform')
          .map((rk) => ({ '@_rdf:resource': rk.UUID })),
        'gcmd:hasSensor': ensureArray(formData.RelatedKeywords)
          .filter((rk) => rk.RelationshipType === 'Has Sensor')
          .map((rk) => ({ '@_rdf:resource': rk.UUID }))
      }
    }
  }

  // Clean up the object by removing undefined properties
  removeEmpty(rdfObj)

  // Build the XML string from the RDF object
  const xmlContent = builder.build(rdfObj)

  // Add XML declaration
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n'

  // Return the complete XML string
  return xmlDeclaration + xmlContent
}
