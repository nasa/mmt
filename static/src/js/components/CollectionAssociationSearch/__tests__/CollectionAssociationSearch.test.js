import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'
import conceptTypeQueries from '../../../constants/conceptTypeQueries'
import AppContext from '../../../context/AppContext'
import NotificationsContext from '../../../context/NotificationsContext'
import CollectionAssociationSearch from '../CollectionAssociationSearch'
import errorLogger from '../../../utils/errorLogger'
import ErrorBanner from '../../ErrorBanner/ErrorBanner'

jest.mock('../../ErrorBanner/ErrorBanner')
jest.mock('../../../utils/errorLogger')

const mock = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: {
    collections: [
      {
        conceptId: 'C1200000035-SEDAC'
      },
      {
        conceptId: 'C1200000049-SEDAC'
      },
      {
        conceptId: 'C1200000034-SEDAC'
      }
    ]
  },
  conceptId: 'TL1200000094-MMT_2',
  contactGroups: null,
  contactPersons: null,
  description: 'safd',
  doi: null,
  nativeId: 'MMT_45b39a08-3e2a-4a1e-974f-9c739fa0d06d',
  lastUpdatedDate: null,
  longName: 'Test record',
  metadataSpecification: {
    url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    name: 'UMM-T',
    version: '1.2.0'
  },
  name: 'Testing tools association ',
  organizations: [
    {
      roles: [
        'PUBLISHER'
      ],
      shortName: 'UCAR/NCAR/EOL/CEOPDM',
      longName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
      urlValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
    }
  ],
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisionId: '2',
  revisionDate: '2024-03-14T20:17:06.507Z',
  relatedUrls: null,
  searchAction: null,
  supportedBrowsers: null,
  supportedInputFormats: null,
  supportedOperatingSystems: null,
  supportedOutputFormats: null,
  supportedSoftwareLanguages: null,
  toolKeywords: [
    {
      toolCategory: 'EARTH SCIENCE SERVICES',
      toolTopic: 'DATA ANALYSIS AND VISUALIZATION',
      toolTerm: 'CALIBRATION/VALIDATION'
    }
  ],
  type: 'Web User Interface',
  ummMetadata: {
    URL: {
      URLContentType: 'DistributionURL',
      Type: 'GOTO WEB TOOL',
      URLValue: 'fasd'
    },
    Type: 'Web User Interface',
    Description: 'safd',
    Version: '1.0',
    ToolKeywords: [
      {
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: 'CALIBRATION/VALIDATION'
      }
    ],
    Name: 'Testing tools association ',
    Organizations: [
      {
        Roles: [
          'PUBLISHER'
        ],
        ShortName: 'UCAR/NCAR/EOL/CEOPDM',
        LongName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
        URLValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
      Name: 'UMM-T',
      Version: '1.2.0'
    },
    LongName: 'Test record'
  },
  url: {
    urlContentType: 'DistributionURL',
    type: 'GOTO WEB TOOL',
    urlValue: 'fasd'
  },
  useConstraints: null,
  version: '1.0',
  versionDescription: null,
  collections: {
    count: 3,
    items: [
      {
        title: '2000 Pilot Environmental Sustainability Index (ESI)',
        conceptId: 'C1200000034-SEDAC',
        entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2000',
        version: '2000.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      },
      {
        title: '2001 Environmental Sustainability Index (ESI)',
        conceptId: 'C1200000035-SEDAC',
        entryTitle: '2001 Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2001',
        version: '2001.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      },
      {
        title: 'Archive of Census Related Products (ACRP): 1990 Census Block Statistics',
        conceptId: 'C1200000049-SEDAC',
        entryTitle: 'Archive of Census Related Products (ACRP): 1990 Census Block Statistics',
        shortName: 'CIESIN_SEDAC_ACRP_1990_CBS',
        version: '1.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Tool'
}

const setup = ({
  additionalMocks = [],
  overrideMocks = false
}) => {
  const mocks = [{
    request: {
      query: conceptTypeQueries.Tool,
      variables: { params: { conceptId: 'TL12000000-MMT_2' } }
    },
    result: {
      data: {
        tool: mock
      }
    }
  }, ...additionalMocks]

  const notificationContext = {
    addNotification: jest.fn()
  }

  render(
    <AppContext.Provider value={
      {
        user: {
          providerId: 'MMT_2'
        },
        keywords: {}
      }
    }
    >
      <NotificationsContext.Provider value={notificationContext}>
        <MemoryRouter initialEntries={['/tools/TL12000000-MMT_2/collection-association-search']}>
          <MockedProvider
            mocks={overrideMocks || mocks}
          >
            <Routes>
              <Route
                path="tools/:conceptId/collection-association-search"
                element={<CollectionAssociationSearch />}
              />
            </Routes>
          </MockedProvider>
        </MemoryRouter>
      </NotificationsContext.Provider>
    </AppContext.Provider>
  )

  return {
    user: userEvent.setup()
  }
}

describe('CollectionAssociationSearch', () => {
  describe('when the collection association search page is requested', () => {
    test('should display results from search query', async () => {
      setup({})

      await waitForResponse()

      expect(screen.getByText('Testing tools association')).toBeInTheDocument()
    })
  })

  describe('when the request results in an error', () => {
    test('should call errorLogger and renders an ErrorBanner', async () => {
      setup({
        overrideMocks: [{
          request: {
            query: conceptTypeQueries.Tool,
            variables: { params: { conceptId: 'TL12000000-MMT_2' } }
          },
          error: new Error('An error occurred')
        }]
      })

      await waitForResponse()

      expect(errorLogger).toHaveBeenCalledTimes(1)
      expect(errorLogger).toHaveBeenCalledWith('Unable to retrieve draft', 'Collection Association: getDraft Query')
      expect(ErrorBanner).toHaveBeenCalledTimes(1)
    })
  })
})
