import createResponseFromKeywords from '../createResponseFromKeywords'

describe('createResponseFromKeywords', () => {
  const keywords = [
    [
      'DistributionURL',
      'DOWNLOAD SOFTWARE',
      'MOBILE APP'
    ],
    [
      'DistributionURL',
      'DOWNLOAD SOFTWARE',
      ''
    ],
    [
      'DistributionURL',
      'GOTO WEB TOOL',
      'LIVE ACCESS SERVER (LAS)'
    ],
    [
      'DistributionURL',
      'GOTO WEB TOOL',
      'MAP VIEWER'
    ],
    [
      'DistributionURL',
      'GOTO WEB TOOL',
      'SIMPLE SUBSET WIZARD (SSW)'
    ],
    [
      'DistributionURL',
      'GOTO WEB TOOL',
      'SUBSETTER'
    ],
    [
      'DistributionURL',
      'GOTO WEB TOOL',
      ''
    ]
  ]

  const keys = ['url_content_type', 'type', 'subtype']

  const result = {
    url_content_type: [
      {
        subfields: [
          'type'
        ],
        value: 'DistributionURL',
        type: [
          {
            subfields: [
              'subtype'
            ],
            value: 'DOWNLOAD SOFTWARE',
            subtype: [
              {
                value: 'MOBILE APP'
              }
            ]
          },
          {
            subfields: [
              'subtype'
            ],
            value: 'GOTO WEB TOOL',
            subtype: [
              {
                value: 'LIVE ACCESS SERVER (LAS)'
              },
              {
                value: 'MAP VIEWER'
              },
              {
                value: 'SIMPLE SUBSET WIZARD (SSW)'
              },
              {
                value: 'SUBSETTER'
              }
            ]
          }
        ]
      }
    ]
  }

  describe('when given keyword data and keys', () => {
    test('returns the keyword structure', () => {
      expect(createResponseFromKeywords(keywords, keys)).toMatchObject(result)
    })
  })
})
