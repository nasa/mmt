import walkMap from '../walkMap'

const node = {
  DistributionURL: {
    'DOWNLOAD SOFTWARE': {
      'MOBILE APP': {}
    },
    'GOTO WEB TOOL': {
      'LIVE ACCESS SERVER (LAS)': {},
      'MAP VIEWER': {},
      'SIMPLE SUBSET WIZARD (SSW)': {},
      SUBSETTER: {}
    }
  }
}

const current = 'url_content_type'
const level = [
  'type',
  'subtype'
]
const cmrResponse = {}
const resultResponse = {
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

describe('walkMap', () => {
  describe('when given parameters', () => {
    test('returns the keyword structure', () => {
      expect(walkMap(node, current, level, cmrResponse)).toMatchObject(resultResponse)
    })
  })
})
