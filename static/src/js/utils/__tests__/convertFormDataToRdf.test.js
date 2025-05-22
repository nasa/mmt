import {
  describe,
  expect,
  test
} from 'vitest'
import { convertFormDataToRdf } from '../convertFormDataToRdf'

const scheme = { name: 'aName' }
const userNote = 'aNote'

vi.mock('@/js/hooks/useAuthContext', () => ({
  default: vi.fn(() => ({
    user: { uid: 'test-user-id' }
  }))
}))

describe('convertFormDataToRdf', () => {
  describe('When given valid form data', () => {
    const validFormData = {
      KeywordUUID: 'test-uuid',
      PreferredLabel: 'Test Label',
      Definition: 'Test Definition',
      BroaderKeywords: [{ BroaderUUID: 'broader-uuid' }],
      NarrowerKeywords: [{ NarrowerUUID: 'narrower-uuid' }],
      AlternateLabels: [{
        LabelName: 'Alt Label',
        LabelType: 'Acronym'
      }],
      Resources: [{
        ResourceType: 'Web Page',
        ResourceUri: 'http://example.com'
      }],
      RelatedKeywords: [
        {
          RelationshipType: 'Related',
          UUID: 'related-uuid'
        },
        {
          RelationshipType: 'Has Instrument',
          UUID: 'instrument-uuid'
        }
      ],
      ChangeLogs: 'Change 1\n\nChange 2',
      DefinitionReference: 'Reference'
    }

    test('should return a valid RDF XML string', () => {
      const result = convertFormDataToRdf(validFormData, userNote, scheme)
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rdf:RDF')
      expect(result).toContain('<skos:Concept')
      expect(result).toContain('rdf:about="test-uuid"')
      expect(result).toContain('<skos:inScheme rdf:resource="https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/aName"/>')
    })

    test('should include all provided form data in the XML', () => {
      const result = convertFormDataToRdf(validFormData, userNote, scheme)
      expect(result).toContain('<skos:prefLabel xml:lang="en">Test Label</skos:prefLabel>')
      expect(result).toContain('<skos:definition xml:lang="en">Test Definition</skos:definition>')
      expect(result).toContain('<skos:broader rdf:resource="broader-uuid"/>')
      expect(result).toContain('<skos:narrower rdf:resource="narrower-uuid"/>')
      expect(result).toContain('<gcmd:altLabel gcmd:text="Alt Label" xml:lang="en" gcmd:category="Acronym"/>')
      expect(result).toContain('<gcmd:resource gcmd:type="Web Page" gcmd:url="http://example.com"/>')
      expect(result).toContain('<skos:related rdf:resource="related-uuid"/>')
      expect(result).toContain('<gcmd:hasInstrument rdf:resource="instrument-uuid"/>')
      expect(result).toContain('<skos:changeNote>Change 1</skos:changeNote>')
      expect(result).toContain('<skos:changeNote>Change 2</skos:changeNote>')
      expect(result).toContain('<gcmd:reference gcmd:text="Reference" xml:lang="en"/>')
    })
  })

  describe('When given form data with scheme', () => {
    const formDataWithScheme = {
      KeywordUUID: 'with-scheme-uuid',
      PreferredLabel: 'With Scheme',
      Definition: 'Test Definition'
    }

    test('should include scheme information when scheme is provided', () => {
      const result = convertFormDataToRdf(formDataWithScheme, userNote, scheme)
      expect(result).toContain('<skos:inScheme rdf:resource="https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/aName"/>')
    })
  })

  describe('When given form data with missing optional fields', () => {
    const minimalFormData = {
      KeywordUUID: 'minimal-uuid',
      PreferredLabel: 'Minimal Label',
      Definition: 'Minimal Definition'
    }

    test('should return a valid RDF XML string with only required fields', () => {
      const result = convertFormDataToRdf(minimalFormData, userNote, scheme)
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rdf:RDF')
      expect(result).toContain('<skos:Concept')
      expect(result).toContain('rdf:about="minimal-uuid"')
      expect(result).toContain('<skos:prefLabel xml:lang="en">Minimal Label</skos:prefLabel>')
      expect(result).toContain('<skos:definition xml:lang="en">Minimal Definition</skos:definition>')
    })

    test('should not include optional fields when they are not provided', () => {
      const result = convertFormDataToRdf(minimalFormData, userNote, scheme)
      expect(result).not.toContain('<skos:broader')
      expect(result).not.toContain('<skos:narrower')
      expect(result).not.toContain('<gcmd:altLabel')
      expect(result).not.toContain('<gcmd:resource')
      expect(result).not.toContain('<skos:related')
      expect(result).not.toContain('<gcmd:hasInstrument')
      expect(result).not.toContain('<gcmd:reference')
    })
  })

  describe('When given form data with special characters', () => {
    const specialCharFormData = {
      KeywordUUID: 'special-uuid',
      PreferredLabel: 'Label with & and <',
      Definition: 'Definition with > and &'
    }

    test('should escape special characters in XML', () => {
      const result = convertFormDataToRdf(specialCharFormData, userNote, scheme)
      expect(result).toContain('<skos:prefLabel xml:lang="en">Label with &amp;amp; and &amp;lt;</skos:prefLabel>')
      expect(result).toContain('<skos:definition xml:lang="en">Definition with &amp;gt; and &amp;amp;</skos:definition>')
    })
  })

  describe('When given form data with non-string values', () => {
    const nonStringValueData = {
      KeywordUUID: 'non-string-uuid',
      PreferredLabel: 'Non-String Value',
      Definition: 42,
      BooleanValue: true,
      NullValue: null
    }

    test('should handle non-string values correctly', () => {
      const result = convertFormDataToRdf(nonStringValueData, userNote, scheme)

      // Check that the XML is still valid
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rdf:RDF')
      expect(result).toContain('<skos:Concept')

      // Check that string values are processed normally
      expect(result).toContain('<skos:prefLabel xml:lang="en">Non-String Value</skos:prefLabel>')
      expect(result).toContain('<skos:definition xml:lang="en">42</skos:definition>')

      // Check that the KeywordUUID is correctly included
      expect(result).toContain('rdf:about="non-string-uuid"')

      // Check that the change note is included
      expect(result).toContain('<skos:changeNote rdf:parseType="Literal">')
      expect(result).toContain('User Id=test-user-id')
      expect(result).toContain('User Note=aNote')
    })
  })

  describe('When given form data with multiple related keywords of different types', () => {
    const multipleRelatedKeywordsData = {
      KeywordUUID: 'multi-related-uuid',
      PreferredLabel: 'Multiple Related',
      Definition: 'Test Definition',
      RelatedKeywords: [
        {
          RelationshipType: 'Related',
          UUID: 'related-uuid-1'
        },
        {
          RelationshipType: 'Related',
          UUID: 'related-uuid-2'
        },
        {
          RelationshipType: 'Has Instrument',
          UUID: 'instrument-uuid-1'
        },
        {
          RelationshipType: 'Has Instrument',
          UUID: 'instrument-uuid-2'
        },
        {
          RelationshipType: 'On Platform',
          UUID: 'platform-uuid'
        },
        {
          RelationshipType: 'Has Sensor',
          UUID: 'sensor-uuid'
        }
      ]
    }

    test('should correctly group related keywords by relationship type', () => {
      const result = convertFormDataToRdf(multipleRelatedKeywordsData, userNote, scheme)
      expect(result).toContain('<skos:related rdf:resource="related-uuid-1"/>')
      expect(result).toContain('<skos:related rdf:resource="related-uuid-2"/>')
      expect(result).toContain('<gcmd:hasInstrument rdf:resource="instrument-uuid-1"/>')
      expect(result).toContain('<gcmd:hasInstrument rdf:resource="instrument-uuid-2"/>')
      expect(result).toContain('<gcmd:isOnPlatform rdf:resource="platform-uuid"/>')
      expect(result).toContain('<gcmd:hasSensor rdf:resource="sensor-uuid"/>')
    })
  })

  describe('When given form data with empty arrays', () => {
    const emptyArraysFormData = {
      KeywordUUID: 'empty-arrays-uuid',
      PreferredLabel: 'Empty Arrays',
      Definition: 'Test Definition',
      BroaderKeywords: [],
      NarrowerKeywords: [],
      AlternateLabels: [],
      Resources: [],
      RelatedKeywords: []
    }

    test('should not include empty array fields in the XML', () => {
      const result = convertFormDataToRdf(emptyArraysFormData, userNote, scheme)
      expect(result).not.toContain('<skos:broader')
      expect(result).not.toContain('<skos:narrower')
      expect(result).not.toContain('<gcmd:altLabel')
      expect(result).not.toContain('<gcmd:resource')
      expect(result).not.toContain('<skos:related')
      expect(result).not.toContain('<gcmd:hasInstrument')
      expect(result).not.toContain('<gcmd:isOnPlatform')
      expect(result).not.toContain('<gcmd:hasSensor')
    })
  })

  describe('When given form data with multiple change logs', () => {
    const multipleChangeLogsData = {
      KeywordUUID: 'change-logs-uuid',
      PreferredLabel: 'Change Logs',
      Definition: 'Test Definition',
      ChangeLogs: 'Change 1\n\nChange 2\n\nChange 3'
    }

    test('should correctly split and include multiple change notes', () => {
      const result = convertFormDataToRdf(multipleChangeLogsData, userNote, scheme)
      expect(result).toContain('<skos:changeNote>Change 1</skos:changeNote>')
      expect(result).toContain('<skos:changeNote>Change 2</skos:changeNote>')
      expect(result).toContain('<skos:changeNote>Change 3</skos:changeNote>')
    })
  })

  describe('When given form data with a single item in array fields', () => {
    const singleItemArraysData = {
      KeywordUUID: 'single-item-uuid',
      PreferredLabel: 'Single Item Arrays',
      Definition: 'Test Definition',
      BroaderKeywords: { BroaderUUID: 'single-broader-uuid' },
      NarrowerKeywords: { NarrowerUUID: 'single-narrower-uuid' },
      AlternateLabels: {
        LabelName: 'Single Alt',
        LabelType: 'Acronym'
      },
      Resources: {
        ResourceType: 'Web Page',
        ResourceUri: 'http://example.com'
      },
      RelatedKeywords: {
        RelationshipType: 'Related',
        UUID: 'single-related-uuid'
      }
    }

    test('should correctly handle single items as arrays', () => {
      const result = convertFormDataToRdf(singleItemArraysData, userNote, scheme)
      expect(result).toContain('<skos:broader rdf:resource="single-broader-uuid"/>')
      expect(result).toContain('<skos:narrower rdf:resource="single-narrower-uuid"/>')
      expect(result).toContain('<gcmd:altLabel gcmd:text="Single Alt" xml:lang="en" gcmd:category="Acronym"/>')
      expect(result).toContain('<gcmd:resource gcmd:type="Web Page" gcmd:url="http://example.com"/>')
      expect(result).toContain('<skos:related rdf:resource="single-related-uuid"/>')
    })
  })

  describe('When given invalid form data', () => {
    test('should handle missing required fields gracefully', () => {
      const invalidFormData = {
        KeywordUUID: 'invalid-uuid'
      }
      expect(() => convertFormDataToRdf(invalidFormData, userNote, scheme)).not.toThrow()
    })

    test('should return a string even with invalid data', () => {
      const invalidFormData = {
        KeywordUUID: 'invalid-uuid'
      }
      const result = convertFormDataToRdf(invalidFormData, userNote, scheme)
      expect(typeof result).toBe('string')
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result).toContain('<rdf:RDF')
      expect(result).toContain('<skos:Concept')
      expect(result).toContain('rdf:about="invalid-uuid"')
    })
  })
})
