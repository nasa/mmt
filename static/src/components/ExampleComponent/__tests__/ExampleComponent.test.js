import React from 'react'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import ExampleComponent from '../ExampleComponent'

import { GET_COLLECTION } from '../../../operations/getCollection'

describe('Example component', () => {
  test('renders the example text', async () => {
    render(
      <MockedProvider
        mocks={
          [{
            request: {
              query: GET_COLLECTION,
              variables: {
                params: {
                  conceptId: 'C1200000033-SEDAC',
                  includeTags: '*'
                }
              }
            },
            result: {
              data: {
                collection: {
                  abstract: "The 2000 Pilot Environmental Sustainability Index (ESI) is an exploratory effort to construct an index that measures the ability of a nation's economy to achieve sustainable development, with the long term goal of finding a single indicator for environmental sustainability analagous to that of the Gross Domestic Product (GDP). The index covering 56 countries is a composite measure of the current status of a nation's environmental systems, pressures on those systems, human vulnerability to environmental change, national capacity to respond, and contributions to global environmental stewardship. The index was unveiled at the World Economic Forum's annual meeting, January 2000, Davos, Switzerland. The 2000 Pilot ESI is the result of collaboration among the World Economic Forum (WEF), Yale Center for Environmental Law and Policy (YCELP), and the Columbia University Center for International Earth Science Information Network (CIESIN).",
                  accessConstraints: {
                    description: 'None'
                  },
                  additionalAttributes: null,
                  ancillaryKeywords: null,
                  archiveAndDistributionInformation: {
                    fileDistributionInformation: [
                      {
                        formatType: 'Native',
                        fees: '0',
                        format: 'PDF'
                      }
                    ]
                  },
                  associatedDois: null,
                  collectionCitations: [
                    {
                      creator: 'World Economic Forum - WEF - Global Leaders for Tomorrow Environment Task Force, Yale Center for Environmental Law and Policy - YCELP - Yale University, and Center for International Earth Science Information Network - CIESIN - Columbia University',
                      releasePlace: 'New Haven, CT',
                      title: '2000 Pilot Environmental Sustainability Index (ESI)',
                      onlineResource: {
                        linkage: 'https://doi.org/10.7927/H4NK3BZJ'
                      },
                      publisher: 'Yale Center for Environmental Law and Policy (YCELP)/Yale University',
                      releaseDate: '2000-12-31T00:00:00.000Z',
                      version: '2000.00'
                    }
                  ],
                  collectionProgress: 'COMPLETE',
                  conceptId: 'C1200000033-SEDAC',
                  contactGroups: [
                    {
                      roles: [
                        'Metadata Author'
                      ],
                      contactInformation: {
                        contactMechanisms: [
                          {
                            type: 'Email',
                            value: 'metadata@ciesin.columbia.edu'
                          },
                          {
                            type: 'Fax',
                            value: '+1 845-365-8922'
                          },
                          {
                            type: 'Telephone',
                            value: '+1 845-365-8988'
                          }
                        ],
                        addresses: [
                          {
                            streetAddresses: [
                              'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                            ],
                            city: 'Palisades',
                            stateProvince: 'NY',
                            country: 'USA',
                            postalCode: '10964'
                          }
                        ]
                      },
                      groupName: 'CIESIN METADATA ADMINISTRATION'
                    }
                  ],
                  contactPersons: null,
                  dataCenters: [
                    {
                      roles: [
                        'DISTRIBUTOR'
                      ],
                      shortName: 'SEDAC',
                      longName: 'Socioeconomic Data and Applications Center',
                      contactPersons: [
                        {
                          roles: [
                            'Data Center Contact'
                          ],
                          lastName: 'Not provided'
                        }
                      ],
                      contactInformation: {
                        relatedUrls: [
                          {
                            urlContentType: 'DataCenterURL',
                            type: 'HOME PAGE',
                            url: 'https://sedac.ciesin.columbia.edu'
                          }
                        ]
                      }
                    },
                    {
                      roles: [
                        'ARCHIVER'
                      ],
                      shortName: 'SEDAC',
                      longName: 'Socioeconomic Data and Applications Center',
                      contactPersons: [
                        {
                          roles: [
                            'Data Center Contact'
                          ],
                          lastName: 'Not provided'
                        }
                      ],
                      contactInformation: {
                        relatedUrls: [
                          {
                            urlContentType: 'DataCenterURL',
                            type: 'HOME PAGE',
                            url: 'https://sedac.ciesin.columbia.edu'
                          }
                        ]
                      }
                    }
                  ],
                  dataDates: [
                    {
                      date: '2000-12-31T00:00:00.000Z',
                      type: 'CREATE'
                    },
                    {
                      date: '2000-12-31T00:00:00.000Z',
                      type: 'UPDATE'
                    }
                  ],
                  directDistributionInformation: null,
                  doi: {
                    doi: '10.7927/H4NK3BZJ'
                  },
                  isoTopicCategories: null,
                  locationKeywords: [
                    {
                      category: 'CONTINENT',
                      type: 'AFRICA',
                      subregion1: 'CENTRAL AFRICA',
                      subregion2: 'ANGOLA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'EASTERN ASIA',
                      subregion2: 'CHINA',
                      subregion3: 'HONG KONG'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'CENTRAL AMERICA',
                      subregion2: 'BELIZE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'CENTRAL EUROPE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'WESTERN ASIA',
                      subregion2: 'MIDDLE EAST',
                      subregion3: 'BAHRAIN'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'CANADA'
                    },
                    {
                      category: 'GEOGRAPHIC REGION',
                      type: 'OCEANIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'AMAZONIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'ARGENTINA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'AUSTRALIA/NEW ZEALAND',
                      subregion1: 'AUSTRALIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'AUSTRIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'BELGIUM'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'BOLIVIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'BRAZIL'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'BULGARIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'CANADA',
                      subregion2: 'GREAT LAKES',
                      subregion3: 'CANADA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'CHILE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'EASTERN ASIA',
                      subregion2: 'CHINA',
                      subregion3: 'HONG KONG'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'COLOMBIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'CENTRAL AMERICA',
                      subregion2: 'COSTA RICA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'CZECH REPUBLIC'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'SCANDINAVIA',
                      subregion3: 'DENMARK'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'ECUADOR'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'AFRICA',
                      subregion1: 'NORTHERN AFRICA',
                      subregion2: 'EGYPT'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'CENTRAL AMERICA',
                      subregion2: 'EL SALVADOR'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'SCANDINAVIA',
                      subregion3: 'FINLAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'FRANCE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'GERMANY'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'SOUTHERN EUROPE',
                      subregion2: 'GREECE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'HUNGARY'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'ICELAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'SOUTHCENTRAL ASIA',
                      subregion2: 'INDIA'
                    },
                    {
                      category: 'OCEAN',
                      type: 'INDIAN OCEAN',
                      subregion1: 'INDONESIA',
                      subregion2: 'SUMATRA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'BRITISH ISLES',
                      subregion3: 'IRELAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'WESTERN ASIA',
                      subregion2: 'MIDDLE EAST',
                      subregion3: 'ISRAEL'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'SOUTHERN EUROPE',
                      subregion2: 'ITALY'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'EASTERN ASIA',
                      subregion2: 'JAPAN'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'WESTERN ASIA',
                      subregion2: 'MIDDLE EAST',
                      subregion3: 'JORDAN'
                    },
                    {
                      category: 'OCEAN',
                      type: 'INDIAN OCEAN',
                      subregion1: 'MALAYSIA'
                    },
                    {
                      category: 'OCEAN',
                      type: 'INDIAN OCEAN',
                      subregion1: 'MAURITIUS'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'NORTH AMERICA',
                      subregion1: 'MEXICO'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'NETHERLANDS'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'AUSTRALIA/NEW ZEALAND',
                      subregion1: 'NEW ZEALAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'EASTERN ASIA',
                      subregion2: 'NORTH KOREA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'SCANDINAVIA',
                      subregion3: 'NORWAY'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'PERU'
                    },
                    {
                      category: 'OCEAN',
                      type: 'PACIFIC OCEAN',
                      subregion1: 'WESTERN PACIFIC OCEAN',
                      subregion2: 'PHILIPPINES'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'POLAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'PORTUGAL'
                    },
                    {
                      category: 'OCEAN',
                      type: 'INDIAN OCEAN',
                      subregion1: 'SINGAPORE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'SLOVAKIA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'AFRICA',
                      subregion1: 'SOUTHERN AFRICA',
                      subregion2: 'SOUTH AFRICA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'EASTERN ASIA',
                      subregion2: 'SOUTH KOREA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'SOUTHERN EUROPE',
                      subregion2: 'SPAIN',
                      subregion3: 'GIBRALTAR'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'SCANDINAVIA',
                      subregion3: 'SWEDEN'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'WESTERN EUROPE',
                      subregion2: 'SWITZERLAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'SOUTHEASTERN ASIA',
                      subregion2: 'THAILAND'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'WESTERN ASIA',
                      subregion2: 'TURKEY'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'EASTERN EUROPE',
                      subregion2: 'UKRAINE'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'EUROPE',
                      subregion1: 'NORTHERN EUROPE',
                      subregion2: 'BRITISH ISLES',
                      subregion3: 'UNITED KINGDOM'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'SOUTH AMERICA',
                      subregion1: 'VENEZUELA'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'ASIA',
                      subregion1: 'SOUTHEASTERN ASIA',
                      subregion2: 'VIETNAM'
                    },
                    {
                      category: 'CONTINENT',
                      type: 'AFRICA',
                      subregion1: 'EASTERN AFRICA',
                      subregion2: 'ZIMBABWE'
                    },
                    {
                      category: 'GEOGRAPHIC REGION',
                      type: 'GLOBAL'
                    }
                  ],
                  metadataAssociations: null,
                  metadataDates: [
                    {
                      date: '2012-12-12T00:00:00.000Z',
                      type: 'CREATE'
                    },
                    {
                      date: '2021-03-02T00:00:00.000Z',
                      type: 'UPDATE'
                    }
                  ],
                  paleoTemporalCoverages: null,
                  platforms: [
                    {
                      type: 'Models/Analyses',
                      shortName: 'MODELS',
                      instruments: [
                        {
                          shortName: 'Computer',
                          longName: 'Computer'
                        }
                      ]
                    }
                  ],
                  processingLevel: {
                    id: '4'
                  },
                  projects: [
                    {
                      shortName: 'ESI',
                      longName: 'Environmental Sustainability Index'
                    }
                  ],
                  publicationReferences: [
                    {
                      publicationDate: '2001-12-31T00:00:00.000Z',
                      title: '2001 Environmental Sustainability Index (ESI)',
                      doi: {
                        doi: '10.7927/H4X34VDM'
                      },
                      edition: '2001.00',
                      publisher: 'Yale Center for Environmental Law and Policy (YCELP)/Yale University',
                      author: 'World Economic Forum - WEF - Global Leaders for Tomorrow Environment Task Force, Yale Center for Environmental Law and Policy - YCELP - Yale University, and Center for International Earth Science Information Network - CIESIN - Columbia University',
                      publicationPlace: 'New Haven, CT'
                    },
                    {
                      publicationDate: '2002-12-31T00:00:00.000Z',
                      title: '2002 Environmental Sustainability Index (ESI)',
                      doi: {
                        doi: '10.7927/H4SB43P8'
                      },
                      edition: '2002.00',
                      publisher: 'Yale Center for Environmental Law and Policy (YCELP)/Yale University',
                      author: 'World Economic Forum - WEF - Global Leaders for Tomorrow Environment Task Force, Yale Center for Environmental Law and Policy - YCELP - Yale University, and Center for International Earth Science Information Network - CIESIN - Columbia University',
                      publicationPlace: 'New Haven, CT'
                    },
                    {
                      publicationDate: '2005-12-31T00:00:00.000Z',
                      title: '2005 Environmental Sustainability Index (ESI)',
                      doi: {
                        doi: '10.7927/H40V89R6'
                      },
                      edition: '2005.00',
                      publisher: 'Yale Center for Environmental Law and Policy (YCELP)/Yale University',
                      author: 'Yale Center for Environmental Law and Policy - YCELP - Yale University, Center for International Earth Science Information Network - CIESIN - Columbia University, World Economic Forum - WEF, and Joint Research Centre - JRC - European Commission',
                      publicationPlace: 'New Haven, CT'
                    }
                  ],
                  purpose: 'To test the feasibility of creating a comparative index of national-level environmental sustainability.',
                  quality: null,
                  relatedCollections: {
                    count: 0,
                    items: [],
                    __typename: 'RelatedCollectionsList'
                  },
                  relatedUrls: [
                    {
                      description: 'Sample browse graphic of the data set.',
                      urlContentType: 'VisualizationURL',
                      type: 'GET RELATED VISUALIZATION',
                      url: 'https://sedac.ciesin.columbia.edu/downloads/maps/esi/esi-environmental-sustainability-index-2000/sedac-logo.jpg'
                    },
                    {
                      description: 'Data Download Page',
                      urlContentType: 'DistributionURL',
                      type: 'GET DATA',
                      subtype: 'DIRECT DOWNLOAD',
                      url: 'https://sedac.ciesin.columbia.edu/data/set/esi-pilot-environmental-sustainability-index-2000/data-download'
                    },
                    {
                      description: 'Data Set Overview Page',
                      urlContentType: 'PublicationURL',
                      type: 'VIEW RELATED INFORMATION',
                      subtype: 'GENERAL DOCUMENTATION',
                      url: 'https://sedac.ciesin.columbia.edu/data/set/esi-pilot-environmental-sustainability-index-2000'
                    }
                  ],
                  scienceKeywords: [
                    {
                      category: 'EARTH SCIENCE',
                      topic: 'HUMAN DIMENSIONS',
                      term: 'SUSTAINABILITY',
                      variableLevel1: 'ENVIRONMENTAL SUSTAINABILITY'
                    }
                  ],
                  services: {
                    count: 0,
                    items: null,
                    __typename: 'ServiceList'
                  },
                  shortName: 'CIESIN_SEDAC_ESI_2000',
                  spatialExtent: {
                    spatialCoverageType: 'HORIZONTAL',
                    horizontalSpatialDomain: {
                      geometry: {
                        coordinateSystem: 'CARTESIAN',
                        boundingRectangles: [
                          {
                            westBoundingCoordinate: -180,
                            northBoundingCoordinate: 90,
                            eastBoundingCoordinate: 180,
                            southBoundingCoordinate: -55
                          }
                        ]
                      }
                    },
                    granuleSpatialRepresentation: 'CARTESIAN'
                  },
                  spatialInformation: null,
                  standardProduct: null,
                  tags: null,
                  temporalExtents: [
                    {
                      endsAtPresentFlag: false,
                      rangeDateTimes: [
                        {
                          beginningDateTime: '1978-01-01T00:00:00.000Z',
                          endingDateTime: '1999-12-31T00:00:00.000Z'
                        }
                      ]
                    }
                  ],
                  temporalKeywords: null,
                  tilingIdentificationSystems: null,
                  title: '2000 Pilot Environmental Sustainability Index (ESI)',
                  tools: {
                    count: 0,
                    items: null,
                    __typename: 'ToolList'
                  },
                  useConstraints: {
                    description: 'Users are free to use, copy, distribute, transmit, and adapt the work for commercial and non-commercial purposes, without restriction, as long as clear attribution of the source is provided.'
                  },
                  variables: {
                    count: 0,
                    items: null,
                    __typename: 'VariableList'
                  },
                  versionDescription: null,
                  versionId: '2000.00',
                  __typename: 'Collection'
                }
              }
            }
          }]
        }
        addTypename={false}
      >
        <ExampleComponent />
      </MockedProvider>
    )

    await waitForResponse()
    screen.debug()

    expect(screen.getByText('C1200000033-SEDAC')).toBeInTheDocument()
  })
})
