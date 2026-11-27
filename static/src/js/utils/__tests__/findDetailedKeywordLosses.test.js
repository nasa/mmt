import findDetailedKeywordLosses, {
  getDetailedKeywordFieldConfig,
  isDetailedKeywordCheckNeeded
} from '../findDetailedKeywordLosses'

describe('isDetailedKeywordCheckNeeded', () => {
  test.each([
    ['SCIENCE_KEYWORDS', 'CLEAR_ALL_AND_REPLACE', true],
    ['SCIENCE_KEYWORDS', 'FIND_AND_REPLACE', true],
    ['SCIENCE_KEYWORDS', 'FIND_AND_REMOVE', true],
    ['LOCATION_KEYWORDS', 'CLEAR_ALL_AND_REPLACE', true],
    ['SCIENCE_KEYWORDS', 'ADD_TO_EXISTING', false],
    ['SCIENCE_KEYWORDS', 'FIND_AND_UPDATE', false],
    ['DATA_CENTERS', 'CLEAR_ALL_AND_REPLACE', false],
    ['PLATFORMS', 'FIND_AND_REMOVE', false]
  ])('isDetailedKeywordCheckNeeded(%s, %s) returns %s', (updateField, updateType, expected) => {
    expect(isDetailedKeywordCheckNeeded(updateField, updateType)).toBe(expected)
  })
})

describe('getDetailedKeywordFieldConfig', () => {
  test('returns the DetailedVariable config for SCIENCE_KEYWORDS', () => {
    expect(getDetailedKeywordFieldConfig('SCIENCE_KEYWORDS')).toEqual({
      detailedKey: 'DetailedVariable',
      keywordProperty: 'scienceKeywords'
    })
  })

  test('returns the DetailedLocation config for LOCATION_KEYWORDS', () => {
    expect(getDetailedKeywordFieldConfig('LOCATION_KEYWORDS')).toEqual({
      detailedKey: 'DetailedLocation',
      keywordProperty: 'locationKeywords'
    })
  })

  test('returns undefined for a field with no detailed-keyword concept', () => {
    expect(getDetailedKeywordFieldConfig('DATA_CENTERS')).toBeUndefined()
  })
})

// CMR's GraphQL API returns scienceKeywords/locationKeywords entries with ordinary GraphQL
// camelCase keys (category, detailedVariable, ...), not UMM-C's own PascalCase -- verified
// directly against SIT's cmr-graphql list query. findValue, by contrast, stays PascalCase
// (Category, ...), since that's what's typed into the bulk-update Find form and sent
// straight to CMR's bulk-update mutation.
describe('findDetailedKeywordLosses', () => {
  const conceptType = 'collections'

  test('CLEAR_ALL_AND_REPLACE: flags every entry with a non-blank detailedVariable', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        scienceKeywords: [
          {
            category: 'EARTH SCIENCE',
            topic: 'ATMOSPHERE',
            term: 'CLOUDS',
            detailedVariable: 'Cloud Base Height'
          },
          {
            category: 'EARTH SCIENCE',
            topic: 'OCEANS',
            term: 'SALINITY'
          }
        ]
      },
      {
        conceptId: 'C2',
        shortName: 'Short2',
        version: '2',
        scienceKeywords: [
          {
            category: 'EARTH SCIENCE',
            topic: 'ATMOSPHERE',
            term: 'PRECIPITATION'
          }
        ]
      }
    ]

    const losses = findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'CLEAR_ALL_AND_REPLACE',
      findValue: {}
    })

    expect(losses).toEqual([
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        lostEntries: [
          { pathLabel: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > DetailedVariable: Cloud Base Height' }
        ]
      }
    ])
  })

  test('FIND_AND_REPLACE: only flags entries matching every filled findValue key', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        scienceKeywords: [
          {
            category: 'EARTH SCIENCE',
            topic: 'ATMOSPHERE',
            term: 'CLOUDS',
            detailedVariable: 'Cloud Base Height'
          },
          {
            category: 'EARTH SCIENCE',
            topic: 'OCEANS',
            term: 'SALINITY',
            detailedVariable: 'Sea Surface Salinity'
          }
        ]
      }
    ]

    const losses = findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'FIND_AND_REPLACE',
      findValue: { Topic: 'ATMOSPHERE' }
    })

    expect(losses).toEqual([
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        lostEntries: [
          { pathLabel: 'EARTH SCIENCE > ATMOSPHERE > CLOUDS > DetailedVariable: Cloud Base Height' }
        ]
      }
    ])
  })

  test('FIND_AND_REMOVE: uses detailedLocation/locationKeywords for LOCATION_KEYWORDS', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        locationKeywords: [
          {
            category: 'CONTINENT',
            type: 'AFRICA',
            detailedLocation: 'Sahara Desert'
          }
        ]
      }
    ]

    const losses = findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'LOCATION_KEYWORDS',
      updateType: 'FIND_AND_REMOVE',
      findValue: { Category: 'CONTINENT' }
    })

    expect(losses).toEqual([
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        lostEntries: [
          { pathLabel: 'CONTINENT > AFRICA > DetailedLocation: Sahara Desert' }
        ]
      }
    ])
  })

  test('returns an empty array when no collection has a lost value', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        scienceKeywords: [{
          category: 'EARTH SCIENCE',
          topic: 'ATMOSPHERE',
          term: 'CLOUDS'
        }]
      }
    ]

    expect(findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'CLEAR_ALL_AND_REPLACE',
      findValue: {}
    })).toEqual([])
  })

  test('returns an empty array for a field with no detailed-keyword concept', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        dataCenters: []
      }
    ]

    expect(findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'DATA_CENTERS',
      updateType: 'CLEAR_ALL_AND_REPLACE',
      findValue: {}
    })).toEqual([])
  })

  test('does not match a findValue key against the wrong entry (camelCase mix-up regression)', () => {
    const collections = [
      {
        conceptId: 'C1',
        shortName: 'Short1',
        version: '1',
        scienceKeywords: [
          {
            category: 'EARTH SCIENCE',
            topic: 'OCEANS',
            term: 'SALINITY',
            detailedVariable: 'Sea Surface Salinity'
          }
        ]
      }
    ]

    const losses = findDetailedKeywordLosses(collections, {
      conceptType,
      updateField: 'SCIENCE_KEYWORDS',
      updateType: 'FIND_AND_REPLACE',
      findValue: { Topic: 'ATMOSPHERE' }
    })

    expect(losses).toEqual([])
  })
})
