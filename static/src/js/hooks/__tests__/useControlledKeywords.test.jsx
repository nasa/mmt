import React from 'react'
import { render, screen } from '@testing-library/react'

import Providers from '@/js/providers/Providers/Providers'
import fetchCmrKeywords from '@/js/utils/fetchCmrKeywords'

import useControlledKeywords from '../useControlledKeywords'

vi.mock('@/js/utils/fetchCmrKeywords')

const TestComponent = ({
  /* eslint-disable react/prop-types */
  keywordType,
  schemaKeywords,
  controlledKeywordsMap
  /* eslint-enable */
}) => {
  const {
    keywords,
    isLoading
  } = useControlledKeywords(keywordType, schemaKeywords, controlledKeywordsMap)

  return (
    <div>
      {
        isLoading && (
          <span>Loading</span>
        )
      }
      {
        keywords && (
          <pre>{JSON.stringify(keywords)}</pre>
        )
      }
    </div>
  )
}

const setup = (keywordType, schemaKeywords, controlledKeywordsMap) => {
  render(
    <Providers>
      <TestComponent
        keywordType={keywordType}
        schemaKeywords={schemaKeywords}
        controlledKeywordsMap={controlledKeywordsMap}
      />
    </Providers>
  )
}

const mockKeywords = {
  url_content_type: [{
    value: 'DataCenterURL',
    uuid: 'b2df0d8e-d236-4fd2-a4f6-12951b3bb17a',
    subfields: ['type'],
    type: [{
      value: 'HOME PAGE',
      uuid: '05c685ab-8ce0-4b8a-8eba-b15fc6bbddfa'
    }]
  }, {
    value: 'DataContactURL',
    uuid: '65373de8-3fb3-4882-a8ca-cfe23a4ff58e',
    subfields: ['type'],
    type: [{
      value: 'HOME PAGE',
      uuid: 'e5803df8-c802-4f3f-96f5-53e534835887'
    }]
  }]
}

beforeEach(() => {
  fetchCmrKeywords.mockResolvedValue(mockKeywords)
})

describe('useDraftsQuery', () => {
  describe('when the request has resolved', () => {
    test('loading is set to false and the items are displayed', async () => {
      setup('related-urls')

      expect(screen.getByText('Loading')).toBeInTheDocument()

      expect(await screen.findByText(JSON.stringify(mockKeywords))).toBeInTheDocument()
    })
  })

  describe('when the keywords are coming from schemaKeywords', () => {
    test('the items are displayed', async () => {
      setup(undefined, [
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
      ], {
        URLContentType: 'url_content_type',
        Type: 'type',
        Subtype: 'subtype'
      })

      expect(await screen.findByText(JSON.stringify({
        url_content_type: [{
          subfields: ['type'],
          value: 'DistributionURL',
          type: [{
            subfields: ['subtype'],
            value: 'DOWNLOAD SOFTWARE',
            subtype: [{ value: 'MOBILE APP' }]
          }, {
            subfields: ['subtype'],
            value: 'GOTO WEB TOOL',
            subtype: [{ value: 'LIVE ACCESS SERVER (LAS)' }, { value: 'MAP VIEWER' }, { value: 'SIMPLE SUBSET WIZARD (SSW)' }, { value: 'SUBSETTER' }]
          }]
        }]
      }))).toBeInTheDocument()
    })
  })
})
