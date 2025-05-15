import { XMLBuilder } from 'fast-xml-parser'

export const convertFormDataToRdf = (formData) => {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressEmptyNode: true,
    attributeNamePrefix: '@_',
    tagValueProcessor: (tagName, tagValue) => {
      if (typeof tagValue === 'string') {
        return tagValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }

      return tagValue
    }
  })

  const ensureArray = (data) => {
    if (Array.isArray(data)) {
      return data
    }

    if (data) {
      return [data]
    }

    return []
  }

  const rdfObj = {
    'rdf:RDF': {
      '@_xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      '@_xmlns:skos': 'http://www.w3.org/2004/02/skos/core#',
      '@_xmlns:gcmd': 'http://gcmd.gsfc.nasa.gov/rdf#',
      '@_xmlns:dcterms': 'http://purl.org/dc/terms/',
      '@_xml:base': 'https://gcmd.earthdata.nasa.gov/kms/concept/',
      'skos:Concept': {
        '@_rdf:about': formData.KeywordUUID,
        'skos:broader': ensureArray(formData.BroaderKeywords).map((bk) => ({
          '@_rdf:resource': bk.BroaderUUID
        })),
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
        'skos:changeNote': formData.ChangeLogs ? formData.ChangeLogs.split('\n\n').map((note) => ({ '#text': note })) : undefined,
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
  // Remove undefined properties
  const removeUndefined = (obj) => Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined).map(([key, value]) => [
      key,
      value && typeof value === 'object' ? removeUndefined(value) : value
    ])
  )

  // Clean up the object
  removeUndefined(rdfObj)

  // Build the XML string
  const xmlContent = builder.build(rdfObj)

  // Add XML declaration
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n'

  return xmlDeclaration + xmlContent
}
