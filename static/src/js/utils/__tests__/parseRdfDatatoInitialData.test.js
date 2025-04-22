import parseRdfDataToInitialData from '../parseRdfDatatoInitialData'

describe('parseRdfDataToInitialData', () => {
  describe('when given valid RDF XML data', () => {
    const validRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#"
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:prefLabel>Test Concept</skos:prefLabel>
          <skos:definition>This is a test concept</skos:definition>
          <skos:broader rdf:resource="http://example.com/concept/parent"/>
          <skos:narrower rdf:resource="http://example.com/concept/child1"/>
          <skos:narrower rdf:resource="http://example.com/concept/child2"/>
          <skos:altLabel gcmd:category="Acronym">TC</skos:altLabel>
          <gcmd:reference gcmd:text="http://example.com/reference"/>
          <gcmd:resource gcmd:type="provider" gcmd:url="http://example.com"/>
          <skos:related rdf:resource="http://example.com/concept/related"/>
          <skos:changeNote>Updated on 2023-01-01</skos:changeNote>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should parse RDF data correctly', () => {
      const result = parseRdfDataToInitialData(validRdfXml)

      expect(result).toEqual({
        KeywordUUID: 'http://example.com/concept/123',
        PreferredLabel: 'Test Concept',
        Definition: 'This is a test concept',
        BroaderKeyword: 'http://example.com/concept/parent',
        NarrowerKeyword: [{
          NarrowerUUID: 'http://example.com/concept/child1'
        }, {
          NarrowerUUID: 'http://example.com/concept/child2'
        }],
        AlternateLabels: [{
          LabelName: 'TC',
          LabelType: 'Acronym'
        }],
        DefinitionReference: 'http://example.com/reference',
        Resources: [{
          ResourceType: 'provider',
          ResourceUri: 'http://example.com'
        }],
        RelatedKeywords: [{
          UUID: 'http://example.com/concept/related',
          RelationshipType: 'Related'
        }],
        ChangeLogs: 'Updated on 2023-01-01'
      })
    })
  })

  describe('when given RDF XML data without a skos:Concept element', () => {
    const invalidRdfXml = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF>'

    test('should throw an error', () => {
      expect(() => parseRdfDataToInitialData(invalidRdfXml)).toThrow('Could not find skos:Concept element in the XML')
    })
  })

  describe('when given RDF XML data with multiple elements of the same type', () => {
    const multipleElementsRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
               xmlns:skos="http://www.w3.org/2004/02/skos/core#"
               xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:prefLabel>Test Concept</skos:prefLabel>
          <skos:altLabel gcmd:category="Acronym">TC1</skos:altLabel>
          <skos:altLabel gcmd:category="Abbreviation">TC2</skos:altLabel>
          <gcmd:resource gcmd:type="Website" gcmd:url="http://example1.com"/>
          <gcmd:resource gcmd:type="Document" gcmd:url="http://example2.com"/>
          <skos:changeNote>Updated on 2023-01-01</skos:changeNote>
          <skos:changeNote>Updated on 2023-02-01</skos:changeNote>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly handle multiple elements', () => {
      const result = parseRdfDataToInitialData(multipleElementsRdfXml)

      expect(result.AlternateLabels).toEqual([
        {
          LabelName: 'TC1',
          LabelType: 'Acronym'
        },
        {
          LabelName: 'TC2',
          LabelType: 'Abbreviation'
        }
      ])

      expect(result.Resources).toEqual([
        {
          ResourceType: 'Website',
          ResourceUri: 'http://example1.com'
        },
        {
          ResourceType: 'Document',
          ResourceUri: 'http://example2.com'
        }
      ])

      expect(result.ChangeLogs).toBe('Updated on 2023-01-01\n\nUpdated on 2023-02-01')
    })
  })

  describe('when given RDF XML data with special relationship types', () => {
    const specialRelationshipsRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#"
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:prefLabel>Test Concept</skos:prefLabel>
          <gcmd:hasInstrument rdf:resource="http://example.com/instrument/1"/>
          <gcmd:isOnPlatform rdf:resource="http://example.com/platform/1"/>
          <gcmd:hasSensor rdf:resource="http://example.com/sensor/1"/>
          <skos:related rdf:resource="http://example.com/related/1"/>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly handle special relationship types', () => {
      const result = parseRdfDataToInitialData(specialRelationshipsRdfXml)

      expect(result.RelatedKeywords).toEqual([
        {
          UUID: 'http://example.com/related/1',
          RelationshipType: 'Related'
        },
        {
          UUID: 'http://example.com/instrument/1',
          RelationshipType: 'Has Instrument'
        },
        {
          UUID: 'http://example.com/platform/1',
          RelationshipType: 'On Platform'
        },
        {
          UUID: 'http://example.com/sensor/1',
          RelationshipType: 'Has Sensor'
        }
      ])
    })
  })

  describe('when given RDF XML data with namespaces', () => {
    const namespacedRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#"
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#"
              xmlns:dcterms="http://purl.org/dc/terms/">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:prefLabel>Test Concept</skos:prefLabel>
          <dcterms:modified>2023-03-01</dcterms:modified>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly handle namespaced elements', () => {
      const result = parseRdfDataToInitialData(namespacedRdfXml)

      expect(result.KeywordUUID).toBe('http://example.com/concept/123')
      expect(result.PreferredLabel).toBe('Test Concept')
    })
  })

  describe('when given invalid XML data', () => {
    const invalidXml = '<invalid>XML</invalid>'

    test('should throw an error', () => {
      expect(() => parseRdfDataToInitialData(invalidXml)).toThrow()
    })
  })

  describe('when given empty input', () => {
    test('should throw an error for empty string', () => {
      expect(() => parseRdfDataToInitialData('')).toThrow()
    })

    test('should throw an error for null', () => {
      expect(() => parseRdfDataToInitialData(null)).toThrow()
    })

    test('should throw an error for undefined', () => {
      expect(() => parseRdfDataToInitialData(undefined)).toThrow()
    })
  })
})
