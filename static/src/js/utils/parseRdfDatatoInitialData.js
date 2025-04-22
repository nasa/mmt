const parseRdfDataToInitialData = (rdfData) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(rdfData, 'text/xml')

  const namespaces = {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    gcmd: 'https://gcmd.earthdata.nasa.gov/kms#',
    dcterms: 'http://purl.org/dc/terms/'
  }

  const getElementText = (element, namespace, localName) => {
    const el = element.getElementsByTagNameNS(namespace, localName)[0]

    return el ? el.textContent : ''
  }

  const getAttributeValue = (element, attributeName) => element?.getAttribute(attributeName) || ''

  const conceptElement = xmlDoc.getElementsByTagNameNS(namespaces.skos, 'Concept')[0]

  if (!conceptElement) {
    throw new Error('Could not find skos:Concept element in the XML')
  }

  const keywordUUID = getAttributeValue(conceptElement, 'rdf:about')
  const preferredLabel = getElementText(conceptElement, namespaces.skos, 'prefLabel')
  const definition = getElementText(conceptElement, namespaces.skos, 'definition')
  const broaderKeyword = getAttributeValue(conceptElement.getElementsByTagNameNS(namespaces.skos, 'broader')[0], 'rdf:resource')

  const narrowerKeywords = Array.from(conceptElement.getElementsByTagNameNS(namespaces.skos, 'narrower'))
    .map((narrower) => getAttributeValue(narrower, 'rdf:resource'))
    .join(', ')

  const alternateLevels = Array.from(conceptElement.getElementsByTagNameNS(namespaces.skos, 'altLabel'))
    .map((altLabel) => ({
      LabelName: altLabel.textContent,
      LabelType: getAttributeValue(altLabel, 'gcmd:category')
    }))

  const definitionReference = getAttributeValue(
    conceptElement.getElementsByTagNameNS(namespaces.gcmd, 'reference')[0],
    'gcmd:text'
  )

  const resources = Array.from(conceptElement.getElementsByTagNameNS(namespaces.gcmd, 'resource'))
    .map((resource) => ({
      ResourceType: getAttributeValue(resource, 'gcmd:type'),
      ResourceLabel: getAttributeValue(resource, 'gcmd:url')
    }))

  const relatedKeywords = [
    ...Array.from(conceptElement.getElementsByTagNameNS(namespaces.skos, 'related'))
      .map((related) => ({
        UUID: getAttributeValue(related, 'rdf:resource'),
        RelationshipType: 'Similar'
      })),
    ...Array.from(conceptElement.getElementsByTagNameNS(namespaces.gcmd, 'hasInstrument'))
      .map((related) => ({
        UUID: getAttributeValue(related, 'rdf:resource'),
        RelationshipType: 'Has Instrument'
      })),
    ...Array.from(conceptElement.getElementsByTagNameNS(namespaces.gcmd, 'isOnPlatform'))
      .map((related) => ({
        UUID: getAttributeValue(related, 'rdf:resource'),
        RelationshipType: 'On Platform'
      })),
    ...Array.from(conceptElement.getElementsByTagNameNS(namespaces.gcmd, 'hasSensor'))
      .map((related) => ({
        UUID: getAttributeValue(related, 'rdf:resource'),
        RelationshipType: 'Has Sensor'
      }))
  ]

  const transformedData = {
    KeywordUUID: keywordUUID,
    BroaderKeyword: broaderKeyword,
    NarrowerKeyword: narrowerKeywords,
    PreferredLabel: preferredLabel,
    AlternateLabels: alternateLevels.map((label) => ({
      LabelName: label.LabelName,
      LabelType: label.LabelType
    })),
    Definition: definition,
    DefinitionReference: definitionReference,
    Resources: resources.map((resource) => ({
      ResourceType: resource.ResourceType,
      ResourceLabel: resource.ResourceLabel
    })),
    RelatedKeywords: relatedKeywords.map((keyword) => ({
      UUID: keyword.UUID,
      RelationshipType: keyword.RelationshipType
    })),
    ChangeLogs: Array.from(conceptElement.getElementsByTagNameNS(namespaces.skos, 'changeNote'))
      .map((note) => note.textContent)
      .join('\n\n')
  }

  // // Remove any properties that are empty arrays, empty objects, or null/undefined
  // const removeEmpty = (obj) => Object.fromEntries(
  //   Object.entries(obj)
  //     .filter(([value]) => value != null && value !== '')
  //     .map(([key, value]) => {
  //       if (value && typeof value === 'object') {
  //         if (Array.isArray(value)) {
  //           if (value.length) {
  //             return [key, value.map((v) => removeEmpty(v))]
  //           }

  //           return [key, undefined]
  //         }

  //         return [key, removeEmpty(value)]
  //       }

  //       return [key, value]
  //     })
  // )

  // return removeEmpty(transformedData)
  return transformedData
}

export default parseRdfDataToInitialData
