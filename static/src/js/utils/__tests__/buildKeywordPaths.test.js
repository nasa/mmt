import buildKeywordPaths from '../buildKeywordPaths'

const keywords = {
  category: [
    {
      value: 'EARTH SCIENCE',
      subfields: ['topic'],
      topic: [
        {
          value: 'ATMOSPHERE',
          subfields: ['term'],
          term: [
            {
              value: 'CLOUDS'
            }
          ]
        }
      ]
    },
    {
      value: 'OCEANS',
      subfields: ['topic'],
      topic: [
        {
          value: 'OCEAN TEMPERATURE'
        }
      ]
    }
  ]
}

const uiSchema = {
  'ui:keyword_scheme_column_names': ['science_keywords', 'category', 'topic', 'term'],
  'ui:picker_title': 'SCIENCE KEYWORD'
}

describe('buildKeywordPaths', () => {
  test('wraps the response under the picker title and returns every path', () => {
    const paths = buildKeywordPaths(keywords, uiSchema)

    expect(paths).toEqual([
      ['SCIENCE KEYWORD', 'EARTH SCIENCE', 'ATMOSPHERE', 'CLOUDS'],
      ['SCIENCE KEYWORD', 'OCEANS', 'OCEAN TEMPERATURE']
    ])
  })

  test('filters to only the paths matching ui:filter', () => {
    const paths = buildKeywordPaths(keywords, {
      ...uiSchema,
      'ui:filter': 'EARTH SCIENCE'
    })

    expect(paths).toEqual([
      ['SCIENCE KEYWORD', 'EARTH SCIENCE', 'ATMOSPHERE', 'CLOUDS']
    ])
  })
})
