import createFormDataFromRdf from '../createFormDataFromRdf'

describe('createFormDataFromRdf', () => {
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
          <gcmd:altLabel gcmd:text="TC" gcmd:category="Acronym"/>
          <gcmd:reference gcmd:text="http://example.com/reference"/>
          <gcmd:resource gcmd:url="http://example.com" gcmd:type="provider"/>
          <skos:related rdf:resource="http://example.com/concept/related"/>
          <skos:changeNote>Updated on 2023-01-01</skos:changeNote>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should parse RDF data correctly', () => {
      const result = createFormDataFromRdf(validRdfXml)

      expect(result).toEqual({
        KeywordUUID: 'http://example.com/concept/123',
        PreferredLabel: 'Test Concept',
        Definition: 'This is a test concept',
        BroaderKeyword: 'http://example.com/concept/parent',
        NarrowerKeywords: [
          { NarrowerUUID: 'http://example.com/concept/child1' },
          { NarrowerUUID: 'http://example.com/concept/child2' }
        ],
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
      expect(() => createFormDataFromRdf(invalidRdfXml)).toThrow('Could not find skos:Concept element in the XML')
    })
  })

  describe('when given RDF XML data with a single resource', () => {
    const singleResourceRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <gcmd:resource gcmd:url="https://example.com" gcmd:type="Website"/>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly parse a single resource', () => {
      const result = createFormDataFromRdf(singleResourceRdfXml)
      expect(result.Resources).toEqual([
        {
          ResourceType: 'Website',
          ResourceUri: 'https://example.com'
        }
      ])
    })
  })

  describe('when given RDF XML data with a single alternate label', () => {
    const singleAltLabelRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <gcmd:altLabel gcmd:text="TC" gcmd:category="Acronym"/>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly parse a single alternate label', () => {
      const result = createFormDataFromRdf(singleAltLabelRdfXml)
      expect(result.AlternateLabels).toEqual([
        {
          LabelName: 'TC',
          LabelType: 'Acronym'
        }
      ])
    })
  })

  describe('when given RDF XML data with multiple related keywords', () => {
    const multipleRelatedKeywordsRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#"
              xmlns:gcmd="https://gcmd.earthdata.nasa.gov/kms#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:related rdf:resource="http://example.com/concept/related1"/>
          <skos:related rdf:resource="http://example.com/concept/related2"/>
          <gcmd:hasInstrument rdf:resource="http://example.com/instrument/1"/>
          <gcmd:isOnPlatform rdf:resource="http://example.com/platform/1"/>
          <gcmd:hasSensor rdf:resource="http://example.com/sensor/1"/>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly parse multiple related keywords', () => {
      const result = createFormDataFromRdf(multipleRelatedKeywordsRdfXml)
      expect(result.RelatedKeywords).toEqual([
        {
          UUID: 'http://example.com/concept/related1',
          RelationshipType: 'Related'
        },
        {
          UUID: 'http://example.com/concept/related2',
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

  describe('when given RDF XML data with multiple change notes', () => {
    const multipleChangeNotesRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:changeNote>Updated on 2023-01-01</skos:changeNote>
          <skos:changeNote>Updated on 2023-02-01</skos:changeNote>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly join multiple change notes', () => {
      const result = createFormDataFromRdf(multipleChangeNotesRdfXml)
      expect(result.ChangeLogs).toBe('Updated on 2023-01-01\n\nUpdated on 2023-02-01')
    })
  })

  describe('when given RDF XML data with empty or missing elements', () => {
    const sparseRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:prefLabel>Test Concept</skos:prefLabel>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should return an object with only non-empty properties', () => {
      const result = createFormDataFromRdf(sparseRdfXml)

      expect(result).toEqual({
        KeywordUUID: 'http://example.com/concept/123',
        PreferredLabel: 'Test Concept',
        BroaderKeyword: '',
        NarrowerKeywords: [],
        AlternateLabels: [],
        Definition: '',
        DefinitionReference: '',
        Resources: [],
        RelatedKeywords: [],
        ChangeLogs: ''
      })
    })
  })

  describe('when given RDF XML data with complex text content', () => {
    const complexTextRdfXml = `
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
              xmlns:skos="http://www.w3.org/2004/02/skos/core#">
        <skos:Concept rdf:about="http://example.com/concept/123">
          <skos:definition xml:lang="en">This is a complex definition</skos:definition>
        </skos:Concept>
      </rdf:RDF>
    `

    test('should correctly handle complex text content', () => {
      const result = createFormDataFromRdf(complexTextRdfXml)
      expect(result.Definition).toBe('This is a complex definition')
    })
  })

  describe('when given invalid XML data', () => {
    const invalidXml = '<invalid>XML</invalid>'

    test('should throw an error', () => {
      expect(() => createFormDataFromRdf(invalidXml)).toThrow()
    })
  })
})
