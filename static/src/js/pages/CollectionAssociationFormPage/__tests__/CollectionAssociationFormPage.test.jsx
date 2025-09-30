import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router'

import { GET_TOOL } from '@/js/operations/queries/getTool'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'

import CollectionAssociationForm from '@/js/components/CollectionAssociationForm/CollectionAssociationForm'
import CollectionAssociationFormPage from '../CollectionAssociationFormPage'

vi.mock('@/js/components/CollectionAssociationForm/CollectionAssociationForm')

const mockTool = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: {
    collections: [
      { conceptId: 'C1200000035-SEDAC' },
      { conceptId: 'C1200000034-SEDAC' }
    ]
  },
  conceptId: 'T1234-MMT',
  contactGroups: null,
  contactPersons: null,
  description: 'mock description',
  doi: null,
  nativeId: 'MMT_e090f57a-d611-48eb-a5d2-c6a94073f3f9',
  lastUpdatedDate: null,
  longName: 'mock long name',
  metadataSpecification: {
    url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    name: 'UMM-T',
    version: '1.2.0'
  },
  name: 'Mock Tool',
  pageTitle: 'Mock Tool',
  organizations: [
    {
      roles: ['PUBLISHER'],
      shortName: 'UCAR/NCAR/EOL/CEOPDM',
      longName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
      urlValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
    }
  ],
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisionId: '1',
  revisionDate: '2024-03-21T15:01:58.533Z',
  revisions: {
    count: 1,
    items: {
      conceptId: 'T1234-MMT',
      revisionDate: '2024-03-21T15:01:58.533Z',
      revisionId: '1',
      userId: 'user1'
    }
  },
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
  type: 'Downloadable Tool',
  ummMetadata: {
    URL: {
      URLContentType: 'DistributionURL',
      Type: 'GOTO WEB TOOL',
      URLValue: 'mock url'
    },
    Type: 'Downloadable Tool',
    Description: 'mock description',
    Version: '1',
    ToolKeywords: [
      {
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: 'CALIBRATION/VALIDATION'
      }
    ],
    Name: 'Mock Test',
    Organizations: [
      {
        Roles: ['PUBLISHER'],
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
    LongName: 'mock long name'
  },
  url: {
    urlContentType: 'DistributionURL',
    type: 'GOTO WEB TOOL',
    urlValue: 'mock url'
  },
  useConstraints: null,
  version: '1',
  versionDescription: null,
  collections: {
    count: 2,
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
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Tool'
}

const setup = ({
  mocks,
  pageUrl
}) => {
  render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={[pageUrl]}>
        <Routes>
          <Route
            path="/:conceptType/:conceptId/collection-association-search"
            element={
              (
                <Suspense fallback="Loading...">
                  <CollectionAssociationFormPage />
                </Suspense>
              )
            }
          />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  )
}

describe('CollectionAssociationFormPage', () => {
  describe('when showing the header for a Tool', () => {
    test('should render the header', async () => {
      const mocks = [{
        request: {
          query: GET_TOOL,
          variables: { params: { conceptId: 'T1234-MMT' } }
        },
        result: {
          data: {
            tool: mockTool
          }
        }
      }]

      setup({
        mocks,
        pageUrl: '/tools/T1234-MMT/collection-association-search'
      })

      expect(await screen.findByText('Tools')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Mock Tool Collection Associations' })).toBeInTheDocument()
    })
  })

  describe('when showing the header for an Order Option', () => {
    test('should render the header', async () => {
      const mocks = [{
        request: {
          query: GET_ORDER_OPTION,
          variables: {
            params: { conceptId: 'OO1234-MMT' }
          }
        },
        result: {
          data: {
            orderOption: {
              associationDetails: {
                collections: [
                  { conceptId: 'C1200000001-PROVIDER' },
                  { conceptId: 'C1200000002-PROVIDER' }
                ]
              },
              conceptId: 'OO1234-MMT',
              deprecated: false,
              description: 'Test Order Option Description',
              form: 'Test Form',
              name: 'Test Order Option',
              nativeId: 'OO1234-MMT',
              pageTitle: 'Test Order Option',
              providerId: 'MMT_2',
              revisionId: '1',
              revisionDate: '2024-03-22T10:00:00.000Z',
              scope: 'PROVIDER',
              sortKey: 'Test Order Option',
              collections: {
                count: 2,
                items: [
                  {
                    title: 'Test Collection 1',
                    conceptId: 'C1200000001-PROVIDER',
                    entryTitle: 'Test Collection 1',
                    shortName: 'TEST_COLL_1',
                    version: '1',
                    provider: 'PROVIDER'
                  },
                  {
                    title: 'Test Collection 2',
                    conceptId: 'C1200000002-PROVIDER',
                    entryTitle: 'Test Collection 2',
                    shortName: 'TEST_COLL_2',
                    version: '1',
                    provider: 'PROVIDER'
                  }
                ]
              }
            }
          }
        }
      }]

      setup({
        mocks,
        pageUrl: '/order-options/OO1234-MMT/collection-association-search'
      })

      expect(await screen.findByText('Order Options')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Test Order Option Collection Associations' })).toBeInTheDocument()
    })
  })

  describe('when rendering the CollectionAssociationForm', () => {
    test('should pass the correct props', async () => {
      const mocks = [{
        request: {
          query: GET_TOOL,
          variables: { params: { conceptId: 'T1234-MMT' } }
        },
        result: {
          data: {
            tool: mockTool
          }
        }
      }]

      setup({
        mocks,
        pageUrl: '/tools/T1234-MMT/collection-association-search'
      })

      // Wait for the query to resolve
      await screen.findByText('Mock Tool Collection Associations')

      // Check if CollectionAssociationForm is rendered with correct props
      expect(CollectionAssociationForm).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            conceptId: 'T1234-MMT',
            name: 'Mock Tool'
          })
        }),
        expect.anything()
      )
    })
  })

  describe('breadcrumbs', () => {
    test('should render correct breadcrumbs for tools', async () => {
      const mocks = [{
        request: {
          query: GET_TOOL,
          variables: { params: { conceptId: 'T1234-MMT' } }
        },
        result: {
          data: {
            tool: mockTool
          }
        }
      }]

      setup({
        mocks,
        pageUrl: '/tools/T1234-MMT/collection-association-search'
      })

      expect(await screen.findByText('Tools')).toBeInTheDocument()
      expect(screen.getByText('Mock Tool')).toBeInTheDocument()
      expect(screen.getByText('Collection Associations')).toBeInTheDocument()
      expect(screen.getByText('Collection Association Search')).toBeInTheDocument()
    })
  })
})
