import { XMLParser } from 'fast-xml-parser'

const createFormDataFromRdf = (rdfData) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseAttributeValue: true
  })
  const parsedXml = parser.parse(rdfData)

  const conceptElement = parsedXml['rdf:RDF']['skos:Concept']

  if (!conceptElement) {
    throw new Error('Could not find skos:Concept element in the XML')
  }

  const getTextContent = (element) => {
    if (typeof element === 'string') return element
    if (element && element['#text']) return element['#text']

    return ''
  }

  const ensureArray = (data) => {
    if (!data) return []

    return Array.isArray(data) ? data : [data]
  }

  const keywordUUID = conceptElement['@_rdf:about']
  const preferredLabel = getTextContent(conceptElement['skos:prefLabel'])
  const definition = getTextContent(conceptElement['skos:definition'])
  const broaderKeyword = conceptElement['skos:broader']?.['@_rdf:resource'] || ''

  const narrowerKeywords = ensureArray(conceptElement['skos:narrower'])
    .map((narrower) => ({
      NarrowerUUID: narrower['@_rdf:resource']
    }))

  const alternateLevels = ensureArray(conceptElement['gcmd:altLabel'])
    .map((altLabel) => ({
      LabelName: altLabel['@_gcmd:text'],
      LabelType: altLabel['@_gcmd:category']
    }))

  const definitionReference = conceptElement['gcmd:reference']?.['@_gcmd:text'] || ''

  const resources = ensureArray(conceptElement['gcmd:resource'])
    .map((resource) => ({
      ResourceType: resource['@_gcmd:type'],
      ResourceUri: resource['@_gcmd:url']
    }))

  const relatedKeywords = [
    ...ensureArray(conceptElement['skos:related']).map((related) => ({
      UUID: related['@_rdf:resource'],
      RelationshipType: 'Related'
    })),
    ...ensureArray(conceptElement['gcmd:hasInstrument']).map((related) => ({
      UUID: related['@_rdf:resource'],
      RelationshipType: 'Has Instrument'
    })),
    ...ensureArray(conceptElement['gcmd:isOnPlatform']).map((related) => ({
      UUID: related['@_rdf:resource'],
      RelationshipType: 'On Platform'
    })),
    ...ensureArray(conceptElement['gcmd:hasSensor']).map((related) => ({
      UUID: related['@_rdf:resource'],
      RelationshipType: 'Has Sensor'
    }))
  ]

  const transformedData = {
    KeywordUUID: keywordUUID,
    BroaderKeyword: broaderKeyword,
    NarrowerKeywords: narrowerKeywords,
    PreferredLabel: preferredLabel,
    AlternateLabels: alternateLevels,
    Definition: definition,
    DefinitionReference: definitionReference,
    Resources: resources,
    RelatedKeywords: relatedKeywords,
    ChangeLogs: Array.isArray(conceptElement['skos:changeNote'])
      ? conceptElement['skos:changeNote'].join('\n\n')
      : conceptElement['skos:changeNote'] || ''
  }

  return transformedData
}

export default createFormDataFromRdf
