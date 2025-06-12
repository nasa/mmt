import { GraphQLError } from 'graphql'

import { GET_COLLECTION } from '../../../../operations/queries/getCollection'

export const collectionRevisions = {
  request: {
    query: GET_COLLECTION,
    variables: {
      params: {
        conceptId: 'C1200000104-MMT_2'
      }
    }
  },
  result: {
    data: {
      collection: {
        abstract: "The 2012 Environmental Performance Index (EPI) ranks 132 countries on 22 performance indicators in the following 10 policy categories:  environmental burden of disease, water (effects on human health), air pollution (effects on human health), air pollution (ecosystem effects), water resources (ecosystem effects), biodiversity and habitat, forestry, fisheries, agriculture and climate change. These categories track performance and progress on two broad policy objectives, environmental health and ecosystem vitality. Each indicator has an associated environmental public health or ecosystem sustainability target. The EPI's proximity-to-target methodology facilitates cross-country comparisons among economic and regional peer groups.\n\n\n\n\nThe Pilot Trend Environmental Performance Index (Trend EPI) ranks countries on the change in their environmental performance over the last decade. As a complement to the EPI, the Trend EPI shows who is improving and who is declining over time.\n\n\n\n\nThe 2012 EPI and Pilot Trend EPI were formally released in Davos, Switzerland, at the annual meeting of the World Economic Forum on January 27, 2012. These are the result of collaboration between the Yale Center for Environmental Law and Policy (YCELP) and the Columbia University Center for International Earth Science Information Network (CIESIN). The Interactive Website for the 2012 EPI is at http://epi.yale.edu/.",
        associationDetails: [],
        accessConstraints: {
          description: 'None'
        },
        additionalAttributes: null,
        ancillaryKeywords: null,
        archiveAndDistributionInformation: {
          fileDistributionInformation: [
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'Excel'
            },
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'PDF'
            },
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'PNG'
            }
          ]
        },
        associatedDois: null,
        collectionCitations: null,
        collectionProgress: 'COMPLETE',
        conceptId: 'C1200000104-MMT_2',
        contactGroups: null,
        contactPersons: null,
        dataCenters: [
          {
            roles: [
              'DISTRIBUTOR'
            ],
            shortName: 'SEDAC',
            contactInformation: {
              contactMechanisms: [
                {
                  type: 'Telephone',
                  value: '+1 845-365-8920'
                },
                {
                  type: 'Fax',
                  value: '+1 845-365-8922'
                },
                {
                  type: 'Email',
                  value: 'ciesin.info@ciesin.columbia.edu'
                }
              ],
              addresses: [
                {
                  streetAddresses: [
                    'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                  ],
                  city: 'Palisades',
                  stateProvince: 'New York',
                  country: 'USA',
                  postalCode: '10964'
                }
              ]
            }
          },
          {
            roles: [
              'ARCHIVER'
            ],
            shortName: 'SEDAC',
            contactInformation: {
              contactMechanisms: [
                {
                  type: 'Telephone',
                  value: '+1 845-365-8920'
                },
                {
                  type: 'Fax',
                  value: '+1 845-365-8922'
                },
                {
                  type: 'Email',
                  value: 'ciesin.info@ciesin.columbia.edu'
                }
              ],
              addresses: [
                {
                  streetAddresses: [
                    'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                  ],
                  city: 'Palisades',
                  stateProvince: 'New York',
                  country: 'USA',
                  postalCode: '10964'
                }
              ]
            }
          }
        ],
        dataDates: [
          {
            date: '2012-08-28T01:00:00.000Z',
            type: 'CREATE'
          },
          {
            date: '2012-08-28T01:00:00.000Z',
            type: 'UPDATE'
          }
        ],
        directDistributionInformation: null,
        doi: {
          doi: '10.7927/H48913SG',
          authority: 'https://doi.org/'
        },
        granules: {
          count: 0,
          __typename: 'GranuleList'
        },
        isoTopicCategories: null,
        locationKeywords: [
          {
            category: 'OTHER',
            type: 'AUSTRALIA'
          },
          {
            category: 'CONTINENT',
            type: 'AFRICA',
            subregion1: 'CENTRAL AFRICA',
            subregion2: 'ANGOLA'
          },
          {
            category: 'OTHER',
            type: 'GLOBAL'
          },
          {
            category: 'OTHER',
            type: 'CANADA'
          },
          {
            category: 'OTHER',
            type: 'ALBANIA'
          },
          {
            category: 'OTHER',
            type: 'ALGERIA'
          },
          {
            category: 'CONTINENT',
            type: 'AFRICA',
            subregion1: 'CENTRAL AFRICA',
            subregion2: 'ANGOLA'
          },
          {
            category: 'OTHER',
            type: 'ARGENTINA'
          },
          {
            category: 'OTHER',
            type: 'ARMENIA'
          },
          {
            category: 'OTHER',
            type: 'AUSTRIA'
          },
          {
            category: 'OTHER',
            type: 'AZERBAIJAN'
          },
          {
            category: 'OTHER',
            type: 'BANGLADESH'
          },
          {
            category: 'OTHER',
            type: 'BELARUS'
          },
          {
            category: 'OTHER',
            type: 'BELGIUM'
          },
          {
            category: 'OTHER',
            type: 'BENIN'
          },
          {
            category: 'OTHER',
            type: 'BOLIVIA'
          },
          {
            category: 'OTHER',
            type: 'BOSNIA AND HERZEGOVINA'
          },
          {
            category: 'OTHER',
            type: 'BOTSWANA'
          },
          {
            category: 'OTHER',
            type: 'BRAZIL'
          },
          {
            category: 'OTHER',
            type: 'BULGARIA'
          },
          {
            category: 'OTHER',
            type: 'CAMBODIA'
          },
          {
            category: 'OTHER',
            type: 'CAMEROON'
          },
          {
            category: 'OTHER',
            type: 'CHILE'
          },
          {
            category: 'OTHER',
            type: 'COLOMBIA'
          },
          {
            category: 'OTHER',
            type: 'COSTA RICA'
          },
          {
            category: 'OTHER',
            type: "COTE D'IVOIRE"
          },
          {
            category: 'OTHER',
            type: 'CROATIA'
          },
          {
            category: 'OTHER',
            type: 'CUBA'
          },
          {
            category: 'OTHER',
            type: 'CYPRUS'
          },
          {
            category: 'OTHER',
            type: 'DENMARK'
          },
          {
            category: 'OTHER',
            type: 'DOMINICAN REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'ECUADOR'
          },
          {
            category: 'OTHER',
            type: 'EGYPT'
          },
          {
            category: 'OTHER',
            type: 'EL SALVADOR'
          },
          {
            category: 'OTHER',
            type: 'ERITREA'
          },
          {
            category: 'OTHER',
            type: 'ESTONIA'
          },
          {
            category: 'OTHER',
            type: 'ETHIOPIA'
          },
          {
            category: 'OTHER',
            type: 'FINLAND'
          },
          {
            category: 'OTHER',
            type: 'FRANCE'
          },
          {
            category: 'OTHER',
            type: 'GABON'
          },
          {
            category: 'CONTINENT',
            type: 'ASIA',
            subregion1: 'WESTERN ASIA',
            subregion2: 'GEORGIA'
          },
          {
            category: 'OTHER',
            type: 'GERMANY'
          },
          {
            category: 'OTHER',
            type: 'GHANA'
          },
          {
            category: 'OTHER',
            type: 'GREECE'
          },
          {
            category: 'OTHER',
            type: 'GUATEMALA'
          },
          {
            category: 'OTHER',
            type: 'HAITI'
          },
          {
            category: 'OTHER',
            type: 'HONDURAS'
          },
          {
            category: 'OTHER',
            type: 'HUNGARY'
          },
          {
            category: 'OTHER',
            type: 'ICELAND'
          },
          {
            category: 'OTHER',
            type: 'INDIA'
          },
          {
            category: 'OTHER',
            type: 'IRAN'
          },
          {
            category: 'OTHER',
            type: 'IRAQ'
          },
          {
            category: 'OTHER',
            type: 'IRELAND'
          },
          {
            category: 'OTHER',
            type: 'ISRAEL'
          },
          {
            category: 'OTHER',
            type: 'ITALY'
          },
          {
            category: 'OTHER',
            type: 'JAMAICA'
          },
          {
            category: 'OTHER',
            type: 'JAPAN'
          },
          {
            category: 'OTHER',
            type: 'JORDAN'
          },
          {
            category: 'OTHER',
            type: 'KAZAKHSTAN'
          },
          {
            category: 'OTHER',
            type: 'KENYA'
          },
          {
            category: 'OTHER',
            type: 'KUWAIT'
          },
          {
            category: 'OTHER',
            type: 'KYRGYZSTAN'
          },
          {
            category: 'OTHER',
            type: 'LATVIA'
          },
          {
            category: 'OTHER',
            type: 'LEBANON'
          },
          {
            category: 'OTHER',
            type: 'LITHUANIA'
          },
          {
            category: 'OTHER',
            type: 'LUXEMBOURG'
          },
          {
            category: 'OTHER',
            type: 'MALAYSIA'
          },
          {
            category: 'OTHER',
            type: 'MALTA'
          },
          {
            category: 'OTHER',
            type: 'MEXICO'
          },
          {
            category: 'OTHER',
            type: 'MOLDOVA'
          },
          {
            category: 'OTHER',
            type: 'MONGOLIA'
          },
          {
            category: 'OTHER',
            type: 'MOROCCO'
          },
          {
            category: 'OTHER',
            type: 'MOZAMBIQUE'
          },
          {
            category: 'OTHER',
            type: 'NAMIBIA'
          },
          {
            category: 'OTHER',
            type: 'NEPAL'
          },
          {
            category: 'OTHER',
            type: 'NETHERLANDS'
          },
          {
            category: 'OTHER',
            type: 'NEW ZEALAND'
          },
          {
            category: 'OTHER',
            type: 'NICARAGUA'
          },
          {
            category: 'OTHER',
            type: 'NIGERIA'
          },
          {
            category: 'OTHER',
            type: 'NORWAY'
          },
          {
            category: 'OTHER',
            type: 'OMAN'
          },
          {
            category: 'OTHER',
            type: 'PAKISTAN'
          },
          {
            category: 'OTHER',
            type: 'PANAMA'
          },
          {
            category: 'OTHER',
            type: 'PARAGUAY'
          },
          {
            category: 'OTHER',
            type: 'PERU'
          },
          {
            category: 'OTHER',
            type: 'PHILIPPINES'
          },
          {
            category: 'OTHER',
            type: 'POLAND'
          },
          {
            category: 'OTHER',
            type: 'PORTUGAL'
          },
          {
            category: 'OTHER',
            type: 'QATAR'
          },
          {
            category: 'OTHER',
            type: 'ROMANIA'
          },
          {
            category: 'OTHER',
            type: 'SAUDI ARABIA'
          },
          {
            category: 'OTHER',
            type: 'SENEGAL'
          },
          {
            category: 'OTHER',
            type: 'SINGAPORE'
          },
          {
            category: 'OTHER',
            type: 'SLOVAKIA'
          },
          {
            category: 'OTHER',
            type: 'SLOVENIA'
          },
          {
            category: 'OTHER',
            type: 'SOUTH AFRICA'
          },
          {
            category: 'OTHER',
            type: 'SOUTH KOREA'
          },
          {
            category: 'OTHER',
            type: 'SRI LANKA'
          },
          {
            category: 'OTHER',
            type: 'SUDAN'
          },
          {
            category: 'OTHER',
            type: 'SWEDEN'
          },
          {
            category: 'OTHER',
            type: 'SWITZERLAND'
          },
          {
            category: 'OTHER',
            type: 'TAIWAN'
          },
          {
            category: 'OTHER',
            type: 'TAJIKISTAN'
          },
          {
            category: 'OTHER',
            type: 'TANZANIA'
          },
          {
            category: 'OTHER',
            type: 'THAILAND'
          },
          {
            category: 'OTHER',
            type: 'TOGO'
          },
          {
            category: 'OTHER',
            type: 'TRINIDAD AND TOBAGO'
          },
          {
            category: 'OTHER',
            type: 'TUNISIA'
          },
          {
            category: 'OTHER',
            type: 'TURKEY'
          },
          {
            category: 'OTHER',
            type: 'TURKMENISTAN'
          },
          {
            category: 'OTHER',
            type: 'UKRAINE'
          },
          {
            category: 'OTHER',
            type: 'UNITED ARAB EMIRATES'
          },
          {
            category: 'OTHER',
            type: 'UNITED KINGDOM'
          },
          {
            category: 'OTHER',
            type: 'UNITED STATES OF AMERICA'
          },
          {
            category: 'OTHER',
            type: 'URUGUAY'
          },
          {
            category: 'OTHER',
            type: 'UZBEKISTAN'
          },
          {
            category: 'OTHER',
            type: 'VENEZUELA'
          },
          {
            category: 'OTHER',
            type: 'VIETNAM'
          },
          {
            category: 'OTHER',
            type: 'YEMEN'
          },
          {
            category: 'OTHER',
            type: 'ZAMBIA'
          },
          {
            category: 'OTHER',
            type: 'ZIMBABWE'
          },
          {
            category: 'OTHER',
            type: 'CONGO'
          },
          {
            category: 'OTHER',
            type: 'CONGO, DEMOCRATIC REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'LIBYA'
          },
          {
            category: 'OTHER',
            type: 'CHINA'
          },
          {
            category: 'OTHER',
            type: 'MYANMAR'
          },
          {
            category: 'OTHER',
            type: 'SYRIAN ARAB REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'CZECHIA'
          },
          {
            category: 'OTHER',
            type: 'RUSSIAN FEDERATION'
          },
          {
            category: 'OTHER',
            type: 'NORTH MACEDONIA'
          },
          {
            category: 'OTHER',
            type: 'SPAIN'
          },
          {
            category: 'OTHER',
            type: 'INDONESIA'
          },
          {
            category: 'OTHER',
            type: 'SERBIA'
          }
        ],
        nativeId: 'collection6',
        metadataAssociations: null,
        metadataDates: [
          {
            date: '2023-01-23T16:49:00.000Z',
            type: 'UPDATE'
          }
        ],
        paleoTemporalCoverages: null,
        platforms: [
          {
            type: 'Models',
            shortName: 'MODELS',
            longName: 'MODELS',
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
            shortName: 'EPI',
            longName: 'Environmental Performance Index'
          }
        ],
        providerId: 'MMT_2',
        publicationReferences: null,
        purpose: "To provide quantitative metrics for evaluating a country's environmental performance in different policy categories relative to clearly defined targets.",
        quality: null,
        relatedCollections: {
          count: 0,
          items: [],
          __typename: 'RelatedCollectionsList'
        },
        relatedUrls: [
          {
            description: 'Data Download Page',
            urlContentType: 'DistributionURL',
            type: 'GET DATA',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/data-download'
          },
          {
            description: 'Documentation Page',
            urlContentType: 'PublicationURL',
            type: 'VIEW RELATED INFORMATION',
            subtype: 'GENERAL DOCUMENTATION',
            url: 'http://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/docs'
          },
          {
            description: 'Data Set Overview Page',
            urlContentType: 'PublicationURL',
            type: 'VIEW RELATED INFORMATION',
            subtype: 'GENERAL DOCUMENTATION',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012'
          },
          {
            description: 'Sample browse graphic of the data set.',
            urlContentType: 'VisualizationURL',
            type: 'GET RELATED VISUALIZATION',
            url: 'https://sedac.ciesin.columbia.edu/downloads/maps/epi/epi-environmental-performance-index-pilot-trend-2012/2012-epi-thumbnail.jpg'
          },
          {
            description: 'Maps Download Page',
            urlContentType: 'VisualizationURL',
            type: 'GET RELATED VISUALIZATION',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/maps'
          }
        ],
        revisionDate: '2024-04-24T17:02:58.783Z',
        revisionId: '8',
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
        shortName: 'CIESIN_SEDAC_EPI_2012 Local',
        pageTitle: 'CIESIN_SEDAC_EPI_2012 Local',
        spatialExtent: {
          horizontalSpatialDomain: {
            geometry: {
              boundingRectangles: [
                {
                  westBoundingCoordinate: -180,
                  northBoundingCoordinate: 90,
                  eastBoundingCoordinate: 180,
                  southBoundingCoordinate: -55
                }
              ],
              coordinateSystem: 'CARTESIAN'
            }
          },
          spatialCoverageType: 'HORIZONTAL',
          granuleSpatialRepresentation: 'CARTESIAN'
        },
        spatialInformation: null,
        standardProduct: null,
        tags: null,
        tagDefinitions: null,
        temporalExtents: [
          {
            endsAtPresentFlag: false,
            rangeDateTimes: [
              {
                beginningDateTime: '2000-01-01T00:00:00.000Z',
                endingDateTime: '2010-12-31T00:00:00.000Z'
              }
            ]
          }
        ],
        temporalKeywords: null,
        tilingIdentificationSystems: null,
        title: '2012 Environmental Performance Index and Pilot Trend Environmental Performance Index',
        tools: {
          count: 0,
          items: null,
          __typename: 'ToolList'
        },
        ummMetadata: {
          SpatialExtent: {
            HorizontalSpatialDomain: {
              Geometry: {
                BoundingRectangles: [
                  {
                    WestBoundingCoordinate: -180,
                    NorthBoundingCoordinate: 90,
                    EastBoundingCoordinate: 180,
                    SouthBoundingCoordinate: -55
                  }
                ],
                CoordinateSystem: 'CARTESIAN'
              }
            },
            SpatialCoverageType: 'HORIZONTAL',
            GranuleSpatialRepresentation: 'CARTESIAN'
          },
          CollectionProgress: 'COMPLETE',
          ScienceKeywords: [
            {
              Category: 'EARTH SCIENCE',
              Topic: 'HUMAN DIMENSIONS',
              Term: 'SUSTAINABILITY',
              VariableLevel1: 'ENVIRONMENTAL SUSTAINABILITY'
            }
          ],
          TemporalExtents: [
            {
              EndsAtPresentFlag: false,
              RangeDateTimes: [
                {
                  BeginningDateTime: '2000-01-01T00:00:00.000Z',
                  EndingDateTime: '2010-12-31T00:00:00.000Z'
                }
              ]
            }
          ],
          ProcessingLevel: {
            Id: '4'
          },
          DOI: {
            DOI: '10.7927/H48913SG',
            Authority: 'https://doi.org/'
          },
          ShortName: 'CIESIN_SEDAC_EPI_2012 Local',
          EntryTitle: '2012 Environmental Performance Index and Pilot Trend Environmental Performance Index',
          AccessConstraints: {
            Description: 'None'
          },
          RelatedUrls: [
            {
              Description: 'Data Download Page',
              URLContentType: 'DistributionURL',
              Type: 'GET DATA',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/data-download'
            },
            {
              Description: 'Documentation Page',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'http://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/docs'
            },
            {
              Description: 'Data Set Overview Page',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012'
            },
            {
              Description: 'Sample browse graphic of the data set.',
              URLContentType: 'VisualizationURL',
              Type: 'GET RELATED VISUALIZATION',
              URL: 'https://sedac.ciesin.columbia.edu/downloads/maps/epi/epi-environmental-performance-index-pilot-trend-2012/2012-epi-thumbnail.jpg'
            },
            {
              Description: 'Maps Download Page',
              URLContentType: 'VisualizationURL',
              Type: 'GET RELATED VISUALIZATION',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/maps'
            }
          ],
          DataDates: [
            {
              Date: '2012-08-28T01:00:00.000Z',
              Type: 'CREATE'
            },
            {
              Date: '2012-08-28T01:00:00.000Z',
              Type: 'UPDATE'
            }
          ],
          Abstract: "The 2012 Environmental Performance Index (EPI) ranks 132 countries on 22 performance indicators in the following 10 policy categories:  environmental burden of disease, water (effects on human health), air pollution (effects on human health), air pollution (ecosystem effects), water resources (ecosystem effects), biodiversity and habitat, forestry, fisheries, agriculture and climate change. These categories track performance and progress on two broad policy objectives, environmental health and ecosystem vitality. Each indicator has an associated environmental public health or ecosystem sustainability target. The EPI's proximity-to-target methodology facilitates cross-country comparisons among economic and regional peer groups.\n\n\n\n\nThe Pilot Trend Environmental Performance Index (Trend EPI) ranks countries on the change in their environmental performance over the last decade. As a complement to the EPI, the Trend EPI shows who is improving and who is declining over time.\n\n\n\n\nThe 2012 EPI and Pilot Trend EPI were formally released in Davos, Switzerland, at the annual meeting of the World Economic Forum on January 27, 2012. These are the result of collaboration between the Yale Center for Environmental Law and Policy (YCELP) and the Columbia University Center for International Earth Science Information Network (CIESIN). The Interactive Website for the 2012 EPI is at http://epi.yale.edu/.",
          Purpose: "To provide quantitative metrics for evaluating a country's environmental performance in different policy categories relative to clearly defined targets.",
          LocationKeywords: [
            {
              Category: 'OTHER',
              Type: 'AUSTRALIA'
            },
            {
              Category: 'CONTINENT',
              Type: 'AFRICA',
              Subregion1: 'CENTRAL AFRICA',
              Subregion2: 'ANGOLA'
            },
            {
              Category: 'OTHER',
              Type: 'GLOBAL'
            },
            {
              Category: 'OTHER',
              Type: 'CANADA'
            },
            {
              Category: 'OTHER',
              Type: 'ALBANIA'
            },
            {
              Category: 'OTHER',
              Type: 'ALGERIA'
            },
            {
              Category: 'CONTINENT',
              Type: 'AFRICA',
              Subregion1: 'CENTRAL AFRICA',
              Subregion2: 'ANGOLA'
            },
            {
              Category: 'OTHER',
              Type: 'ARGENTINA'
            },
            {
              Category: 'OTHER',
              Type: 'ARMENIA'
            },
            {
              Category: 'OTHER',
              Type: 'AUSTRIA'
            },
            {
              Category: 'OTHER',
              Type: 'AZERBAIJAN'
            },
            {
              Category: 'OTHER',
              Type: 'BANGLADESH'
            },
            {
              Category: 'OTHER',
              Type: 'BELARUS'
            },
            {
              Category: 'OTHER',
              Type: 'BELGIUM'
            },
            {
              Category: 'OTHER',
              Type: 'BENIN'
            },
            {
              Category: 'OTHER',
              Type: 'BOLIVIA'
            },
            {
              Category: 'OTHER',
              Type: 'BOSNIA AND HERZEGOVINA'
            },
            {
              Category: 'OTHER',
              Type: 'BOTSWANA'
            },
            {
              Category: 'OTHER',
              Type: 'BRAZIL'
            },
            {
              Category: 'OTHER',
              Type: 'BULGARIA'
            },
            {
              Category: 'OTHER',
              Type: 'CAMBODIA'
            },
            {
              Category: 'OTHER',
              Type: 'CAMEROON'
            },
            {
              Category: 'OTHER',
              Type: 'CHILE'
            },
            {
              Category: 'OTHER',
              Type: 'COLOMBIA'
            },
            {
              Category: 'OTHER',
              Type: 'COSTA RICA'
            },
            {
              Category: 'OTHER',
              Type: "COTE D'IVOIRE"
            },
            {
              Category: 'OTHER',
              Type: 'CROATIA'
            },
            {
              Category: 'OTHER',
              Type: 'CUBA'
            },
            {
              Category: 'OTHER',
              Type: 'CYPRUS'
            },
            {
              Category: 'OTHER',
              Type: 'DENMARK'
            },
            {
              Category: 'OTHER',
              Type: 'DOMINICAN REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'ECUADOR'
            },
            {
              Category: 'OTHER',
              Type: 'EGYPT'
            },
            {
              Category: 'OTHER',
              Type: 'EL SALVADOR'
            },
            {
              Category: 'OTHER',
              Type: 'ERITREA'
            },
            {
              Category: 'OTHER',
              Type: 'ESTONIA'
            },
            {
              Category: 'OTHER',
              Type: 'ETHIOPIA'
            },
            {
              Category: 'OTHER',
              Type: 'FINLAND'
            },
            {
              Category: 'OTHER',
              Type: 'FRANCE'
            },
            {
              Category: 'OTHER',
              Type: 'GABON'
            },
            {
              Category: 'CONTINENT',
              Type: 'ASIA',
              Subregion1: 'WESTERN ASIA',
              Subregion2: 'GEORGIA'
            },
            {
              Category: 'OTHER',
              Type: 'GERMANY'
            },
            {
              Category: 'OTHER',
              Type: 'GHANA'
            },
            {
              Category: 'OTHER',
              Type: 'GREECE'
            },
            {
              Category: 'OTHER',
              Type: 'GUATEMALA'
            },
            {
              Category: 'OTHER',
              Type: 'HAITI'
            },
            {
              Category: 'OTHER',
              Type: 'HONDURAS'
            },
            {
              Category: 'OTHER',
              Type: 'HUNGARY'
            },
            {
              Category: 'OTHER',
              Type: 'ICELAND'
            },
            {
              Category: 'OTHER',
              Type: 'INDIA'
            },
            {
              Category: 'OTHER',
              Type: 'IRAN'
            },
            {
              Category: 'OTHER',
              Type: 'IRAQ'
            },
            {
              Category: 'OTHER',
              Type: 'IRELAND'
            },
            {
              Category: 'OTHER',
              Type: 'ISRAEL'
            },
            {
              Category: 'OTHER',
              Type: 'ITALY'
            },
            {
              Category: 'OTHER',
              Type: 'JAMAICA'
            },
            {
              Category: 'OTHER',
              Type: 'JAPAN'
            },
            {
              Category: 'OTHER',
              Type: 'JORDAN'
            },
            {
              Category: 'OTHER',
              Type: 'KAZAKHSTAN'
            },
            {
              Category: 'OTHER',
              Type: 'KENYA'
            },
            {
              Category: 'OTHER',
              Type: 'KUWAIT'
            },
            {
              Category: 'OTHER',
              Type: 'KYRGYZSTAN'
            },
            {
              Category: 'OTHER',
              Type: 'LATVIA'
            },
            {
              Category: 'OTHER',
              Type: 'LEBANON'
            },
            {
              Category: 'OTHER',
              Type: 'LITHUANIA'
            },
            {
              Category: 'OTHER',
              Type: 'LUXEMBOURG'
            },
            {
              Category: 'OTHER',
              Type: 'MALAYSIA'
            },
            {
              Category: 'OTHER',
              Type: 'MALTA'
            },
            {
              Category: 'OTHER',
              Type: 'MEXICO'
            },
            {
              Category: 'OTHER',
              Type: 'MOLDOVA'
            },
            {
              Category: 'OTHER',
              Type: 'MONGOLIA'
            },
            {
              Category: 'OTHER',
              Type: 'MOROCCO'
            },
            {
              Category: 'OTHER',
              Type: 'MOZAMBIQUE'
            },
            {
              Category: 'OTHER',
              Type: 'NAMIBIA'
            },
            {
              Category: 'OTHER',
              Type: 'NEPAL'
            },
            {
              Category: 'OTHER',
              Type: 'NETHERLANDS'
            },
            {
              Category: 'OTHER',
              Type: 'NEW ZEALAND'
            },
            {
              Category: 'OTHER',
              Type: 'NICARAGUA'
            },
            {
              Category: 'OTHER',
              Type: 'NIGERIA'
            },
            {
              Category: 'OTHER',
              Type: 'NORWAY'
            },
            {
              Category: 'OTHER',
              Type: 'OMAN'
            },
            {
              Category: 'OTHER',
              Type: 'PAKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'PANAMA'
            },
            {
              Category: 'OTHER',
              Type: 'PARAGUAY'
            },
            {
              Category: 'OTHER',
              Type: 'PERU'
            },
            {
              Category: 'OTHER',
              Type: 'PHILIPPINES'
            },
            {
              Category: 'OTHER',
              Type: 'POLAND'
            },
            {
              Category: 'OTHER',
              Type: 'PORTUGAL'
            },
            {
              Category: 'OTHER',
              Type: 'QATAR'
            },
            {
              Category: 'OTHER',
              Type: 'ROMANIA'
            },
            {
              Category: 'OTHER',
              Type: 'SAUDI ARABIA'
            },
            {
              Category: 'OTHER',
              Type: 'SENEGAL'
            },
            {
              Category: 'OTHER',
              Type: 'SINGAPORE'
            },
            {
              Category: 'OTHER',
              Type: 'SLOVAKIA'
            },
            {
              Category: 'OTHER',
              Type: 'SLOVENIA'
            },
            {
              Category: 'OTHER',
              Type: 'SOUTH AFRICA'
            },
            {
              Category: 'OTHER',
              Type: 'SOUTH KOREA'
            },
            {
              Category: 'OTHER',
              Type: 'SRI LANKA'
            },
            {
              Category: 'OTHER',
              Type: 'SUDAN'
            },
            {
              Category: 'OTHER',
              Type: 'SWEDEN'
            },
            {
              Category: 'OTHER',
              Type: 'SWITZERLAND'
            },
            {
              Category: 'OTHER',
              Type: 'TAIWAN'
            },
            {
              Category: 'OTHER',
              Type: 'TAJIKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'TANZANIA'
            },
            {
              Category: 'OTHER',
              Type: 'THAILAND'
            },
            {
              Category: 'OTHER',
              Type: 'TOGO'
            },
            {
              Category: 'OTHER',
              Type: 'TRINIDAD AND TOBAGO'
            },
            {
              Category: 'OTHER',
              Type: 'TUNISIA'
            },
            {
              Category: 'OTHER',
              Type: 'TURKEY'
            },
            {
              Category: 'OTHER',
              Type: 'TURKMENISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'UKRAINE'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED ARAB EMIRATES'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED KINGDOM'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED STATES OF AMERICA'
            },
            {
              Category: 'OTHER',
              Type: 'URUGUAY'
            },
            {
              Category: 'OTHER',
              Type: 'UZBEKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'VENEZUELA'
            },
            {
              Category: 'OTHER',
              Type: 'VIETNAM'
            },
            {
              Category: 'OTHER',
              Type: 'YEMEN'
            },
            {
              Category: 'OTHER',
              Type: 'ZAMBIA'
            },
            {
              Category: 'OTHER',
              Type: 'ZIMBABWE'
            },
            {
              Category: 'OTHER',
              Type: 'CONGO'
            },
            {
              Category: 'OTHER',
              Type: 'CONGO, DEMOCRATIC REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'LIBYA'
            },
            {
              Category: 'OTHER',
              Type: 'CHINA'
            },
            {
              Category: 'OTHER',
              Type: 'MYANMAR'
            },
            {
              Category: 'OTHER',
              Type: 'SYRIAN ARAB REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'CZECHIA'
            },
            {
              Category: 'OTHER',
              Type: 'RUSSIAN FEDERATION'
            },
            {
              Category: 'OTHER',
              Type: 'NORTH MACEDONIA'
            },
            {
              Category: 'OTHER',
              Type: 'SPAIN'
            },
            {
              Category: 'OTHER',
              Type: 'INDONESIA'
            },
            {
              Category: 'OTHER',
              Type: 'SERBIA'
            }
          ],
          MetadataDates: [
            {
              Date: '2023-01-23T16:49:00.000Z',
              Type: 'UPDATE'
            }
          ],
          Version: '2012.00',
          Projects: [
            {
              ShortName: 'EPI',
              LongName: 'Environmental Performance Index'
            }
          ],
          UseConstraints: {
            Description: 'Users are free to use, copy, distribute, transmit, and adapt the work for commercial and non-commercial purposes, without restriction, as long as clear attribution of the source is provided.'
          },
          CollectionDataType: 'SCIENCE_QUALITY',
          DataCenters: [
            {
              Roles: [
                'DISTRIBUTOR'
              ],
              ShortName: 'SEDAC',
              ContactInformation: {
                ContactMechanisms: [
                  {
                    Type: 'Telephone',
                    Value: '+1 845-365-8920'
                  },
                  {
                    Type: 'Fax',
                    Value: '+1 845-365-8922'
                  },
                  {
                    Type: 'Email',
                    Value: 'ciesin.info@ciesin.columbia.edu'
                  }
                ],
                Addresses: [
                  {
                    StreetAddresses: [
                      'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                    ],
                    City: 'Palisades',
                    StateProvince: 'New York',
                    Country: 'USA',
                    PostalCode: '10964'
                  }
                ]
              }
            },
            {
              Roles: [
                'ARCHIVER'
              ],
              ShortName: 'SEDAC',
              ContactInformation: {
                ContactMechanisms: [
                  {
                    Type: 'Telephone',
                    Value: '+1 845-365-8920'
                  },
                  {
                    Type: 'Fax',
                    Value: '+1 845-365-8922'
                  },
                  {
                    Type: 'Email',
                    Value: 'ciesin.info@ciesin.columbia.edu'
                  }
                ],
                Addresses: [
                  {
                    StreetAddresses: [
                      'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                    ],
                    City: 'Palisades',
                    StateProvince: 'New York',
                    Country: 'USA',
                    PostalCode: '10964'
                  }
                ]
              }
            }
          ],
          Platforms: [
            {
              Type: 'Models',
              ShortName: 'MODELS',
              LongName: 'MODELS',
              Instruments: [
                {
                  ShortName: 'Computer',
                  LongName: 'Computer'
                }
              ]
            }
          ],
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.0',
            Name: 'UMM-C',
            Version: '1.18.0'
          },
          ArchiveAndDistributionInformation: {
            FileDistributionInformation: [
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'Excel'
              },
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'PDF'
              },
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'PNG'
              }
            ]
          }
        },
        useConstraints: {
          description: 'Users are free to use, copy, distribute, transmit, and adapt the work for commercial and non-commercial purposes, without restriction, as long as clear attribution of the source is provided.'
        },
        userId: 'admin',
        variables: {
          count: 0,
          cursor: '',
          items: null,
          __typename: 'VariableList'
        },
        versionDescription: null,
        versionId: '2012.00',
        visualizations: [],
        revisions: {
          count: 8,
          items: [
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-28T18:00:00.000Z',
              revisionId: '8',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-27T18:00:00.000Z',
              revisionId: '7',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-26T18:00:00.000Z',
              revisionId: '6',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-24T18:00:00.000Z',
              revisionId: '5',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-23T18:00:00.000Z',
              revisionId: '4',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-22T18:00:00.000Z',
              revisionId: '3',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-21T18:00:00.000Z',
              revisionId: '2',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-20T18:00:00.000Z',
              revisionId: '1',
              userId: 'admin',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionRevisionList'
        },
        __typename: 'Collection'
      }
    }
  }
}

export const collectionRevisionsError = {
  request: {
    query: GET_COLLECTION,
    variables: {
      params: {
        conceptId: 'C1200000104-MMT_2'
      }
    }
  },
  result: {
    data: {
      collection: null
    },
    errors: [new GraphQLError('An error occurred')]
  }
}

export const revertCollectionRevision = {
  request: {
    query: GET_COLLECTION,
    variables: {
      params: {
        conceptId: 'C1200000104-MMT_2'
      }
    }
  },
  result: {
    data: {
      collection: {
        abstract: "The 2012 Environmental Performance Index (EPI) ranks 132 countries on 22 performance indicators in the following 10 policy categories:  environmental burden of disease, water (effects on human health), air pollution (effects on human health), air pollution (ecosystem effects), water resources (ecosystem effects), biodiversity and habitat, forestry, fisheries, agriculture and climate change. These categories track performance and progress on two broad policy objectives, environmental health and ecosystem vitality. Each indicator has an associated environmental public health or ecosystem sustainability target. The EPI's proximity-to-target methodology facilitates cross-country comparisons among economic and regional peer groups.\n\n\n\n\nThe Pilot Trend Environmental Performance Index (Trend EPI) ranks countries on the change in their environmental performance over the last decade. As a complement to the EPI, the Trend EPI shows who is improving and who is declining over time.\n\n\n\n\nThe 2012 EPI and Pilot Trend EPI were formally released in Davos, Switzerland, at the annual meeting of the World Economic Forum on January 27, 2012. These are the result of collaboration between the Yale Center for Environmental Law and Policy (YCELP) and the Columbia University Center for International Earth Science Information Network (CIESIN). The Interactive Website for the 2012 EPI is at http://epi.yale.edu/.",
        associationDetails: [],
        accessConstraints: {
          description: 'None'
        },
        additionalAttributes: null,
        ancillaryKeywords: null,
        archiveAndDistributionInformation: {
          fileDistributionInformation: [
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'Excel'
            },
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'PDF'
            },
            {
              formatType: 'Native',
              fees: '     0.00',
              format: 'PNG'
            }
          ]
        },
        associatedDois: null,
        collectionCitations: null,
        collectionProgress: 'COMPLETE',
        conceptId: 'C1200000104-MMT_2',
        contactGroups: null,
        contactPersons: null,
        dataCenters: [
          {
            roles: [
              'DISTRIBUTOR'
            ],
            shortName: 'SEDAC',
            contactInformation: {
              contactMechanisms: [
                {
                  type: 'Telephone',
                  value: '+1 845-365-8920'
                },
                {
                  type: 'Fax',
                  value: '+1 845-365-8922'
                },
                {
                  type: 'Email',
                  value: 'ciesin.info@ciesin.columbia.edu'
                }
              ],
              addresses: [
                {
                  streetAddresses: [
                    'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                  ],
                  city: 'Palisades',
                  stateProvince: 'New York',
                  country: 'USA',
                  postalCode: '10964'
                }
              ]
            }
          },
          {
            roles: [
              'ARCHIVER'
            ],
            shortName: 'SEDAC',
            contactInformation: {
              contactMechanisms: [
                {
                  type: 'Telephone',
                  value: '+1 845-365-8920'
                },
                {
                  type: 'Fax',
                  value: '+1 845-365-8922'
                },
                {
                  type: 'Email',
                  value: 'ciesin.info@ciesin.columbia.edu'
                }
              ],
              addresses: [
                {
                  streetAddresses: [
                    'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                  ],
                  city: 'Palisades',
                  stateProvince: 'New York',
                  country: 'USA',
                  postalCode: '10964'
                }
              ]
            }
          }
        ],
        dataDates: [
          {
            date: '2012-08-28T01:00:00.000Z',
            type: 'CREATE'
          },
          {
            date: '2012-08-28T01:00:00.000Z',
            type: 'UPDATE'
          }
        ],
        directDistributionInformation: null,
        doi: {
          doi: '10.7927/H48913SG',
          authority: 'https://doi.org/'
        },
        granules: {
          count: 0,
          __typename: 'GranuleList'
        },
        isoTopicCategories: null,
        locationKeywords: [
          {
            category: 'OTHER',
            type: 'AUSTRALIA'
          },
          {
            category: 'CONTINENT',
            type: 'AFRICA',
            subregion1: 'CENTRAL AFRICA',
            subregion2: 'ANGOLA'
          },
          {
            category: 'OTHER',
            type: 'GLOBAL'
          },
          {
            category: 'OTHER',
            type: 'CANADA'
          },
          {
            category: 'OTHER',
            type: 'ALBANIA'
          },
          {
            category: 'OTHER',
            type: 'ALGERIA'
          },
          {
            category: 'CONTINENT',
            type: 'AFRICA',
            subregion1: 'CENTRAL AFRICA',
            subregion2: 'ANGOLA'
          },
          {
            category: 'OTHER',
            type: 'ARGENTINA'
          },
          {
            category: 'OTHER',
            type: 'ARMENIA'
          },
          {
            category: 'OTHER',
            type: 'AUSTRIA'
          },
          {
            category: 'OTHER',
            type: 'AZERBAIJAN'
          },
          {
            category: 'OTHER',
            type: 'BANGLADESH'
          },
          {
            category: 'OTHER',
            type: 'BELARUS'
          },
          {
            category: 'OTHER',
            type: 'BELGIUM'
          },
          {
            category: 'OTHER',
            type: 'BENIN'
          },
          {
            category: 'OTHER',
            type: 'BOLIVIA'
          },
          {
            category: 'OTHER',
            type: 'BOSNIA AND HERZEGOVINA'
          },
          {
            category: 'OTHER',
            type: 'BOTSWANA'
          },
          {
            category: 'OTHER',
            type: 'BRAZIL'
          },
          {
            category: 'OTHER',
            type: 'BULGARIA'
          },
          {
            category: 'OTHER',
            type: 'CAMBODIA'
          },
          {
            category: 'OTHER',
            type: 'CAMEROON'
          },
          {
            category: 'OTHER',
            type: 'CHILE'
          },
          {
            category: 'OTHER',
            type: 'COLOMBIA'
          },
          {
            category: 'OTHER',
            type: 'COSTA RICA'
          },
          {
            category: 'OTHER',
            type: "COTE D'IVOIRE"
          },
          {
            category: 'OTHER',
            type: 'CROATIA'
          },
          {
            category: 'OTHER',
            type: 'CUBA'
          },
          {
            category: 'OTHER',
            type: 'CYPRUS'
          },
          {
            category: 'OTHER',
            type: 'DENMARK'
          },
          {
            category: 'OTHER',
            type: 'DOMINICAN REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'ECUADOR'
          },
          {
            category: 'OTHER',
            type: 'EGYPT'
          },
          {
            category: 'OTHER',
            type: 'EL SALVADOR'
          },
          {
            category: 'OTHER',
            type: 'ERITREA'
          },
          {
            category: 'OTHER',
            type: 'ESTONIA'
          },
          {
            category: 'OTHER',
            type: 'ETHIOPIA'
          },
          {
            category: 'OTHER',
            type: 'FINLAND'
          },
          {
            category: 'OTHER',
            type: 'FRANCE'
          },
          {
            category: 'OTHER',
            type: 'GABON'
          },
          {
            category: 'CONTINENT',
            type: 'ASIA',
            subregion1: 'WESTERN ASIA',
            subregion2: 'GEORGIA'
          },
          {
            category: 'OTHER',
            type: 'GERMANY'
          },
          {
            category: 'OTHER',
            type: 'GHANA'
          },
          {
            category: 'OTHER',
            type: 'GREECE'
          },
          {
            category: 'OTHER',
            type: 'GUATEMALA'
          },
          {
            category: 'OTHER',
            type: 'HAITI'
          },
          {
            category: 'OTHER',
            type: 'HONDURAS'
          },
          {
            category: 'OTHER',
            type: 'HUNGARY'
          },
          {
            category: 'OTHER',
            type: 'ICELAND'
          },
          {
            category: 'OTHER',
            type: 'INDIA'
          },
          {
            category: 'OTHER',
            type: 'IRAN'
          },
          {
            category: 'OTHER',
            type: 'IRAQ'
          },
          {
            category: 'OTHER',
            type: 'IRELAND'
          },
          {
            category: 'OTHER',
            type: 'ISRAEL'
          },
          {
            category: 'OTHER',
            type: 'ITALY'
          },
          {
            category: 'OTHER',
            type: 'JAMAICA'
          },
          {
            category: 'OTHER',
            type: 'JAPAN'
          },
          {
            category: 'OTHER',
            type: 'JORDAN'
          },
          {
            category: 'OTHER',
            type: 'KAZAKHSTAN'
          },
          {
            category: 'OTHER',
            type: 'KENYA'
          },
          {
            category: 'OTHER',
            type: 'KUWAIT'
          },
          {
            category: 'OTHER',
            type: 'KYRGYZSTAN'
          },
          {
            category: 'OTHER',
            type: 'LATVIA'
          },
          {
            category: 'OTHER',
            type: 'LEBANON'
          },
          {
            category: 'OTHER',
            type: 'LITHUANIA'
          },
          {
            category: 'OTHER',
            type: 'LUXEMBOURG'
          },
          {
            category: 'OTHER',
            type: 'MALAYSIA'
          },
          {
            category: 'OTHER',
            type: 'MALTA'
          },
          {
            category: 'OTHER',
            type: 'MEXICO'
          },
          {
            category: 'OTHER',
            type: 'MOLDOVA'
          },
          {
            category: 'OTHER',
            type: 'MONGOLIA'
          },
          {
            category: 'OTHER',
            type: 'MOROCCO'
          },
          {
            category: 'OTHER',
            type: 'MOZAMBIQUE'
          },
          {
            category: 'OTHER',
            type: 'NAMIBIA'
          },
          {
            category: 'OTHER',
            type: 'NEPAL'
          },
          {
            category: 'OTHER',
            type: 'NETHERLANDS'
          },
          {
            category: 'OTHER',
            type: 'NEW ZEALAND'
          },
          {
            category: 'OTHER',
            type: 'NICARAGUA'
          },
          {
            category: 'OTHER',
            type: 'NIGERIA'
          },
          {
            category: 'OTHER',
            type: 'NORWAY'
          },
          {
            category: 'OTHER',
            type: 'OMAN'
          },
          {
            category: 'OTHER',
            type: 'PAKISTAN'
          },
          {
            category: 'OTHER',
            type: 'PANAMA'
          },
          {
            category: 'OTHER',
            type: 'PARAGUAY'
          },
          {
            category: 'OTHER',
            type: 'PERU'
          },
          {
            category: 'OTHER',
            type: 'PHILIPPINES'
          },
          {
            category: 'OTHER',
            type: 'POLAND'
          },
          {
            category: 'OTHER',
            type: 'PORTUGAL'
          },
          {
            category: 'OTHER',
            type: 'QATAR'
          },
          {
            category: 'OTHER',
            type: 'ROMANIA'
          },
          {
            category: 'OTHER',
            type: 'SAUDI ARABIA'
          },
          {
            category: 'OTHER',
            type: 'SENEGAL'
          },
          {
            category: 'OTHER',
            type: 'SINGAPORE'
          },
          {
            category: 'OTHER',
            type: 'SLOVAKIA'
          },
          {
            category: 'OTHER',
            type: 'SLOVENIA'
          },
          {
            category: 'OTHER',
            type: 'SOUTH AFRICA'
          },
          {
            category: 'OTHER',
            type: 'SOUTH KOREA'
          },
          {
            category: 'OTHER',
            type: 'SRI LANKA'
          },
          {
            category: 'OTHER',
            type: 'SUDAN'
          },
          {
            category: 'OTHER',
            type: 'SWEDEN'
          },
          {
            category: 'OTHER',
            type: 'SWITZERLAND'
          },
          {
            category: 'OTHER',
            type: 'TAIWAN'
          },
          {
            category: 'OTHER',
            type: 'TAJIKISTAN'
          },
          {
            category: 'OTHER',
            type: 'TANZANIA'
          },
          {
            category: 'OTHER',
            type: 'THAILAND'
          },
          {
            category: 'OTHER',
            type: 'TOGO'
          },
          {
            category: 'OTHER',
            type: 'TRINIDAD AND TOBAGO'
          },
          {
            category: 'OTHER',
            type: 'TUNISIA'
          },
          {
            category: 'OTHER',
            type: 'TURKEY'
          },
          {
            category: 'OTHER',
            type: 'TURKMENISTAN'
          },
          {
            category: 'OTHER',
            type: 'UKRAINE'
          },
          {
            category: 'OTHER',
            type: 'UNITED ARAB EMIRATES'
          },
          {
            category: 'OTHER',
            type: 'UNITED KINGDOM'
          },
          {
            category: 'OTHER',
            type: 'UNITED STATES OF AMERICA'
          },
          {
            category: 'OTHER',
            type: 'URUGUAY'
          },
          {
            category: 'OTHER',
            type: 'UZBEKISTAN'
          },
          {
            category: 'OTHER',
            type: 'VENEZUELA'
          },
          {
            category: 'OTHER',
            type: 'VIETNAM'
          },
          {
            category: 'OTHER',
            type: 'YEMEN'
          },
          {
            category: 'OTHER',
            type: 'ZAMBIA'
          },
          {
            category: 'OTHER',
            type: 'ZIMBABWE'
          },
          {
            category: 'OTHER',
            type: 'CONGO'
          },
          {
            category: 'OTHER',
            type: 'CONGO, DEMOCRATIC REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'LIBYA'
          },
          {
            category: 'OTHER',
            type: 'CHINA'
          },
          {
            category: 'OTHER',
            type: 'MYANMAR'
          },
          {
            category: 'OTHER',
            type: 'SYRIAN ARAB REPUBLIC'
          },
          {
            category: 'OTHER',
            type: 'CZECHIA'
          },
          {
            category: 'OTHER',
            type: 'RUSSIAN FEDERATION'
          },
          {
            category: 'OTHER',
            type: 'NORTH MACEDONIA'
          },
          {
            category: 'OTHER',
            type: 'SPAIN'
          },
          {
            category: 'OTHER',
            type: 'INDONESIA'
          },
          {
            category: 'OTHER',
            type: 'SERBIA'
          }
        ],
        nativeId: 'collection6',
        metadataAssociations: null,
        metadataDates: [
          {
            date: '2023-01-23T16:49:00.000Z',
            type: 'UPDATE'
          }
        ],
        paleoTemporalCoverages: null,
        platforms: [
          {
            type: 'Models',
            shortName: 'MODELS',
            longName: 'MODELS',
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
            shortName: 'EPI',
            longName: 'Environmental Performance Index'
          }
        ],
        publicationReferences: null,
        purpose: "To provide quantitative metrics for evaluating a country's environmental performance in different policy categories relative to clearly defined targets.",
        quality: null,
        relatedCollections: {
          count: 0,
          items: [],
          __typename: 'RelatedCollectionsList'
        },
        relatedUrls: [
          {
            description: 'Data Download Page',
            urlContentType: 'DistributionURL',
            type: 'GET DATA',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/data-download'
          },
          {
            description: 'Documentation Page',
            urlContentType: 'PublicationURL',
            type: 'VIEW RELATED INFORMATION',
            subtype: 'GENERAL DOCUMENTATION',
            url: 'http://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/docs'
          },
          {
            description: 'Data Set Overview Page',
            urlContentType: 'PublicationURL',
            type: 'VIEW RELATED INFORMATION',
            subtype: 'GENERAL DOCUMENTATION',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012'
          },
          {
            description: 'Sample browse graphic of the data set.',
            urlContentType: 'VisualizationURL',
            type: 'GET RELATED VISUALIZATION',
            url: 'https://sedac.ciesin.columbia.edu/downloads/maps/epi/epi-environmental-performance-index-pilot-trend-2012/2012-epi-thumbnail.jpg'
          },
          {
            description: 'Maps Download Page',
            urlContentType: 'VisualizationURL',
            type: 'GET RELATED VISUALIZATION',
            url: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/maps'
          }
        ],
        revisionDate: '2024-04-24T17:00:00.783Z',
        revisionId: '8',
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
        shortName: 'CIESIN_SEDAC_EPI_2012 Local',
        pageTitle: 'CIESIN_SEDAC_EPI_2012 Local',
        spatialExtent: {
          horizontalSpatialDomain: {
            geometry: {
              boundingRectangles: [
                {
                  westBoundingCoordinate: -180,
                  northBoundingCoordinate: 90,
                  eastBoundingCoordinate: 180,
                  southBoundingCoordinate: -55
                }
              ],
              coordinateSystem: 'CARTESIAN'
            }
          },
          spatialCoverageType: 'HORIZONTAL',
          granuleSpatialRepresentation: 'CARTESIAN'
        },
        spatialInformation: null,
        standardProduct: null,
        tags: null,
        tagDefinitions: null,
        temporalExtents: [
          {
            endsAtPresentFlag: false,
            rangeDateTimes: [
              {
                beginningDateTime: '2000-01-01T00:00:00.000Z',
                endingDateTime: '2010-12-31T00:00:00.000Z'
              }
            ]
          }
        ],
        temporalKeywords: null,
        tilingIdentificationSystems: null,
        title: '2012 Environmental Performance Index and Pilot Trend Environmental Performance Index',
        tools: {
          count: 0,
          items: null,
          __typename: 'ToolList'
        },
        ummMetadata: {
          SpatialExtent: {
            HorizontalSpatialDomain: {
              Geometry: {
                BoundingRectangles: [
                  {
                    WestBoundingCoordinate: -180,
                    NorthBoundingCoordinate: 90,
                    EastBoundingCoordinate: 180,
                    SouthBoundingCoordinate: -55
                  }
                ],
                CoordinateSystem: 'CARTESIAN'
              }
            },
            SpatialCoverageType: 'HORIZONTAL',
            GranuleSpatialRepresentation: 'CARTESIAN'
          },
          CollectionProgress: 'COMPLETE',
          ScienceKeywords: [
            {
              Category: 'EARTH SCIENCE',
              Topic: 'HUMAN DIMENSIONS',
              Term: 'SUSTAINABILITY',
              VariableLevel1: 'ENVIRONMENTAL SUSTAINABILITY'
            }
          ],
          TemporalExtents: [
            {
              EndsAtPresentFlag: false,
              RangeDateTimes: [
                {
                  BeginningDateTime: '2000-01-01T00:00:00.000Z',
                  EndingDateTime: '2010-12-31T00:00:00.000Z'
                }
              ]
            }
          ],
          ProcessingLevel: {
            Id: '4'
          },
          DOI: {
            DOI: '10.7927/H48913SG',
            Authority: 'https://doi.org/'
          },
          ShortName: 'CIESIN_SEDAC_EPI_2012 Local',
          EntryTitle: '2012 Environmental Performance Index and Pilot Trend Environmental Performance Index',
          AccessConstraints: {
            Description: 'None'
          },
          RelatedUrls: [
            {
              Description: 'Data Download Page',
              URLContentType: 'DistributionURL',
              Type: 'GET DATA',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/data-download'
            },
            {
              Description: 'Documentation Page',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'http://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/docs'
            },
            {
              Description: 'Data Set Overview Page',
              URLContentType: 'PublicationURL',
              Type: 'VIEW RELATED INFORMATION',
              Subtype: 'GENERAL DOCUMENTATION',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012'
            },
            {
              Description: 'Sample browse graphic of the data set.',
              URLContentType: 'VisualizationURL',
              Type: 'GET RELATED VISUALIZATION',
              URL: 'https://sedac.ciesin.columbia.edu/downloads/maps/epi/epi-environmental-performance-index-pilot-trend-2012/2012-epi-thumbnail.jpg'
            },
            {
              Description: 'Maps Download Page',
              URLContentType: 'VisualizationURL',
              Type: 'GET RELATED VISUALIZATION',
              URL: 'https://sedac.ciesin.columbia.edu/data/set/epi-environmental-performance-index-pilot-trend-2012/maps'
            }
          ],
          DataDates: [
            {
              Date: '2012-08-28T01:00:00.000Z',
              Type: 'CREATE'
            },
            {
              Date: '2012-08-28T01:00:00.000Z',
              Type: 'UPDATE'
            }
          ],
          Abstract: "The 2012 Environmental Performance Index (EPI) ranks 132 countries on 22 performance indicators in the following 10 policy categories:  environmental burden of disease, water (effects on human health), air pollution (effects on human health), air pollution (ecosystem effects), water resources (ecosystem effects), biodiversity and habitat, forestry, fisheries, agriculture and climate change. These categories track performance and progress on two broad policy objectives, environmental health and ecosystem vitality. Each indicator has an associated environmental public health or ecosystem sustainability target. The EPI's proximity-to-target methodology facilitates cross-country comparisons among economic and regional peer groups.\n\n\n\n\nThe Pilot Trend Environmental Performance Index (Trend EPI) ranks countries on the change in their environmental performance over the last decade. As a complement to the EPI, the Trend EPI shows who is improving and who is declining over time.\n\n\n\n\nThe 2012 EPI and Pilot Trend EPI were formally released in Davos, Switzerland, at the annual meeting of the World Economic Forum on January 27, 2012. These are the result of collaboration between the Yale Center for Environmental Law and Policy (YCELP) and the Columbia University Center for International Earth Science Information Network (CIESIN). The Interactive Website for the 2012 EPI is at http://epi.yale.edu/.",
          Purpose: "To provide quantitative metrics for evaluating a country's environmental performance in different policy categories relative to clearly defined targets.",
          LocationKeywords: [
            {
              Category: 'OTHER',
              Type: 'AUSTRALIA'
            },
            {
              Category: 'CONTINENT',
              Type: 'AFRICA',
              Subregion1: 'CENTRAL AFRICA',
              Subregion2: 'ANGOLA'
            },
            {
              Category: 'OTHER',
              Type: 'GLOBAL'
            },
            {
              Category: 'OTHER',
              Type: 'CANADA'
            },
            {
              Category: 'OTHER',
              Type: 'ALBANIA'
            },
            {
              Category: 'OTHER',
              Type: 'ALGERIA'
            },
            {
              Category: 'CONTINENT',
              Type: 'AFRICA',
              Subregion1: 'CENTRAL AFRICA',
              Subregion2: 'ANGOLA'
            },
            {
              Category: 'OTHER',
              Type: 'ARGENTINA'
            },
            {
              Category: 'OTHER',
              Type: 'ARMENIA'
            },
            {
              Category: 'OTHER',
              Type: 'AUSTRIA'
            },
            {
              Category: 'OTHER',
              Type: 'AZERBAIJAN'
            },
            {
              Category: 'OTHER',
              Type: 'BANGLADESH'
            },
            {
              Category: 'OTHER',
              Type: 'BELARUS'
            },
            {
              Category: 'OTHER',
              Type: 'BELGIUM'
            },
            {
              Category: 'OTHER',
              Type: 'BENIN'
            },
            {
              Category: 'OTHER',
              Type: 'BOLIVIA'
            },
            {
              Category: 'OTHER',
              Type: 'BOSNIA AND HERZEGOVINA'
            },
            {
              Category: 'OTHER',
              Type: 'BOTSWANA'
            },
            {
              Category: 'OTHER',
              Type: 'BRAZIL'
            },
            {
              Category: 'OTHER',
              Type: 'BULGARIA'
            },
            {
              Category: 'OTHER',
              Type: 'CAMBODIA'
            },
            {
              Category: 'OTHER',
              Type: 'CAMEROON'
            },
            {
              Category: 'OTHER',
              Type: 'CHILE'
            },
            {
              Category: 'OTHER',
              Type: 'COLOMBIA'
            },
            {
              Category: 'OTHER',
              Type: 'COSTA RICA'
            },
            {
              Category: 'OTHER',
              Type: "COTE D'IVOIRE"
            },
            {
              Category: 'OTHER',
              Type: 'CROATIA'
            },
            {
              Category: 'OTHER',
              Type: 'CUBA'
            },
            {
              Category: 'OTHER',
              Type: 'CYPRUS'
            },
            {
              Category: 'OTHER',
              Type: 'DENMARK'
            },
            {
              Category: 'OTHER',
              Type: 'DOMINICAN REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'ECUADOR'
            },
            {
              Category: 'OTHER',
              Type: 'EGYPT'
            },
            {
              Category: 'OTHER',
              Type: 'EL SALVADOR'
            },
            {
              Category: 'OTHER',
              Type: 'ERITREA'
            },
            {
              Category: 'OTHER',
              Type: 'ESTONIA'
            },
            {
              Category: 'OTHER',
              Type: 'ETHIOPIA'
            },
            {
              Category: 'OTHER',
              Type: 'FINLAND'
            },
            {
              Category: 'OTHER',
              Type: 'FRANCE'
            },
            {
              Category: 'OTHER',
              Type: 'GABON'
            },
            {
              Category: 'CONTINENT',
              Type: 'ASIA',
              Subregion1: 'WESTERN ASIA',
              Subregion2: 'GEORGIA'
            },
            {
              Category: 'OTHER',
              Type: 'GERMANY'
            },
            {
              Category: 'OTHER',
              Type: 'GHANA'
            },
            {
              Category: 'OTHER',
              Type: 'GREECE'
            },
            {
              Category: 'OTHER',
              Type: 'GUATEMALA'
            },
            {
              Category: 'OTHER',
              Type: 'HAITI'
            },
            {
              Category: 'OTHER',
              Type: 'HONDURAS'
            },
            {
              Category: 'OTHER',
              Type: 'HUNGARY'
            },
            {
              Category: 'OTHER',
              Type: 'ICELAND'
            },
            {
              Category: 'OTHER',
              Type: 'INDIA'
            },
            {
              Category: 'OTHER',
              Type: 'IRAN'
            },
            {
              Category: 'OTHER',
              Type: 'IRAQ'
            },
            {
              Category: 'OTHER',
              Type: 'IRELAND'
            },
            {
              Category: 'OTHER',
              Type: 'ISRAEL'
            },
            {
              Category: 'OTHER',
              Type: 'ITALY'
            },
            {
              Category: 'OTHER',
              Type: 'JAMAICA'
            },
            {
              Category: 'OTHER',
              Type: 'JAPAN'
            },
            {
              Category: 'OTHER',
              Type: 'JORDAN'
            },
            {
              Category: 'OTHER',
              Type: 'KAZAKHSTAN'
            },
            {
              Category: 'OTHER',
              Type: 'KENYA'
            },
            {
              Category: 'OTHER',
              Type: 'KUWAIT'
            },
            {
              Category: 'OTHER',
              Type: 'KYRGYZSTAN'
            },
            {
              Category: 'OTHER',
              Type: 'LATVIA'
            },
            {
              Category: 'OTHER',
              Type: 'LEBANON'
            },
            {
              Category: 'OTHER',
              Type: 'LITHUANIA'
            },
            {
              Category: 'OTHER',
              Type: 'LUXEMBOURG'
            },
            {
              Category: 'OTHER',
              Type: 'MALAYSIA'
            },
            {
              Category: 'OTHER',
              Type: 'MALTA'
            },
            {
              Category: 'OTHER',
              Type: 'MEXICO'
            },
            {
              Category: 'OTHER',
              Type: 'MOLDOVA'
            },
            {
              Category: 'OTHER',
              Type: 'MONGOLIA'
            },
            {
              Category: 'OTHER',
              Type: 'MOROCCO'
            },
            {
              Category: 'OTHER',
              Type: 'MOZAMBIQUE'
            },
            {
              Category: 'OTHER',
              Type: 'NAMIBIA'
            },
            {
              Category: 'OTHER',
              Type: 'NEPAL'
            },
            {
              Category: 'OTHER',
              Type: 'NETHERLANDS'
            },
            {
              Category: 'OTHER',
              Type: 'NEW ZEALAND'
            },
            {
              Category: 'OTHER',
              Type: 'NICARAGUA'
            },
            {
              Category: 'OTHER',
              Type: 'NIGERIA'
            },
            {
              Category: 'OTHER',
              Type: 'NORWAY'
            },
            {
              Category: 'OTHER',
              Type: 'OMAN'
            },
            {
              Category: 'OTHER',
              Type: 'PAKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'PANAMA'
            },
            {
              Category: 'OTHER',
              Type: 'PARAGUAY'
            },
            {
              Category: 'OTHER',
              Type: 'PERU'
            },
            {
              Category: 'OTHER',
              Type: 'PHILIPPINES'
            },
            {
              Category: 'OTHER',
              Type: 'POLAND'
            },
            {
              Category: 'OTHER',
              Type: 'PORTUGAL'
            },
            {
              Category: 'OTHER',
              Type: 'QATAR'
            },
            {
              Category: 'OTHER',
              Type: 'ROMANIA'
            },
            {
              Category: 'OTHER',
              Type: 'SAUDI ARABIA'
            },
            {
              Category: 'OTHER',
              Type: 'SENEGAL'
            },
            {
              Category: 'OTHER',
              Type: 'SINGAPORE'
            },
            {
              Category: 'OTHER',
              Type: 'SLOVAKIA'
            },
            {
              Category: 'OTHER',
              Type: 'SLOVENIA'
            },
            {
              Category: 'OTHER',
              Type: 'SOUTH AFRICA'
            },
            {
              Category: 'OTHER',
              Type: 'SOUTH KOREA'
            },
            {
              Category: 'OTHER',
              Type: 'SRI LANKA'
            },
            {
              Category: 'OTHER',
              Type: 'SUDAN'
            },
            {
              Category: 'OTHER',
              Type: 'SWEDEN'
            },
            {
              Category: 'OTHER',
              Type: 'SWITZERLAND'
            },
            {
              Category: 'OTHER',
              Type: 'TAIWAN'
            },
            {
              Category: 'OTHER',
              Type: 'TAJIKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'TANZANIA'
            },
            {
              Category: 'OTHER',
              Type: 'THAILAND'
            },
            {
              Category: 'OTHER',
              Type: 'TOGO'
            },
            {
              Category: 'OTHER',
              Type: 'TRINIDAD AND TOBAGO'
            },
            {
              Category: 'OTHER',
              Type: 'TUNISIA'
            },
            {
              Category: 'OTHER',
              Type: 'TURKEY'
            },
            {
              Category: 'OTHER',
              Type: 'TURKMENISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'UKRAINE'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED ARAB EMIRATES'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED KINGDOM'
            },
            {
              Category: 'OTHER',
              Type: 'UNITED STATES OF AMERICA'
            },
            {
              Category: 'OTHER',
              Type: 'URUGUAY'
            },
            {
              Category: 'OTHER',
              Type: 'UZBEKISTAN'
            },
            {
              Category: 'OTHER',
              Type: 'VENEZUELA'
            },
            {
              Category: 'OTHER',
              Type: 'VIETNAM'
            },
            {
              Category: 'OTHER',
              Type: 'YEMEN'
            },
            {
              Category: 'OTHER',
              Type: 'ZAMBIA'
            },
            {
              Category: 'OTHER',
              Type: 'ZIMBABWE'
            },
            {
              Category: 'OTHER',
              Type: 'CONGO'
            },
            {
              Category: 'OTHER',
              Type: 'CONGO, DEMOCRATIC REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'LIBYA'
            },
            {
              Category: 'OTHER',
              Type: 'CHINA'
            },
            {
              Category: 'OTHER',
              Type: 'MYANMAR'
            },
            {
              Category: 'OTHER',
              Type: 'SYRIAN ARAB REPUBLIC'
            },
            {
              Category: 'OTHER',
              Type: 'CZECHIA'
            },
            {
              Category: 'OTHER',
              Type: 'RUSSIAN FEDERATION'
            },
            {
              Category: 'OTHER',
              Type: 'NORTH MACEDONIA'
            },
            {
              Category: 'OTHER',
              Type: 'SPAIN'
            },
            {
              Category: 'OTHER',
              Type: 'INDONESIA'
            },
            {
              Category: 'OTHER',
              Type: 'SERBIA'
            }
          ],
          MetadataDates: [
            {
              Date: '2023-01-23T16:49:00.000Z',
              Type: 'UPDATE'
            }
          ],
          Version: '2012.00',
          Projects: [
            {
              ShortName: 'EPI',
              LongName: 'Environmental Performance Index'
            }
          ],
          UseConstraints: {
            Description: 'Users are free to use, copy, distribute, transmit, and adapt the work for commercial and non-commercial purposes, without restriction, as long as clear attribution of the source is provided.'
          },
          CollectionDataType: 'SCIENCE_QUALITY',
          DataCenters: [
            {
              Roles: [
                'DISTRIBUTOR'
              ],
              ShortName: 'SEDAC',
              ContactInformation: {
                ContactMechanisms: [
                  {
                    Type: 'Telephone',
                    Value: '+1 845-365-8920'
                  },
                  {
                    Type: 'Fax',
                    Value: '+1 845-365-8922'
                  },
                  {
                    Type: 'Email',
                    Value: 'ciesin.info@ciesin.columbia.edu'
                  }
                ],
                Addresses: [
                  {
                    StreetAddresses: [
                      'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                    ],
                    City: 'Palisades',
                    StateProvince: 'New York',
                    Country: 'USA',
                    PostalCode: '10964'
                  }
                ]
              }
            },
            {
              Roles: [
                'ARCHIVER'
              ],
              ShortName: 'SEDAC',
              ContactInformation: {
                ContactMechanisms: [
                  {
                    Type: 'Telephone',
                    Value: '+1 845-365-8920'
                  },
                  {
                    Type: 'Fax',
                    Value: '+1 845-365-8922'
                  },
                  {
                    Type: 'Email',
                    Value: 'ciesin.info@ciesin.columbia.edu'
                  }
                ],
                Addresses: [
                  {
                    StreetAddresses: [
                      'CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000'
                    ],
                    City: 'Palisades',
                    StateProvince: 'New York',
                    Country: 'USA',
                    PostalCode: '10964'
                  }
                ]
              }
            }
          ],
          Platforms: [
            {
              Type: 'Models',
              ShortName: 'MODELS',
              LongName: 'MODELS',
              Instruments: [
                {
                  ShortName: 'Computer',
                  LongName: 'Computer'
                }
              ]
            }
          ],
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.0',
            Name: 'UMM-C',
            Version: '1.18.0'
          },
          ArchiveAndDistributionInformation: {
            FileDistributionInformation: [
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'Excel'
              },
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'PDF'
              },
              {
                FormatType: 'Native',
                Fees: '     0.00',
                Format: 'PNG'
              }
            ]
          }
        },
        useConstraints: {
          description: 'Users are free to use, copy, distribute, transmit, and adapt the work for commercial and non-commercial purposes, without restriction, as long as clear attribution of the source is provided.'
        },
        userId: 'admin',
        variables: {
          count: 0,
          cursor: '',
          items: null,
          __typename: 'VariableList'
        },
        versionDescription: null,
        versionId: '2012.00',
        visualizations: [],
        revisions: {
          count: 9,
          items: [
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-28T18:00:00.000Z',
              revisionId: '9',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-27T18:00:00.000Z',
              revisionId: '8',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-26T18:00:00.000Z',
              revisionId: '7',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-25T18:00:00.000Z',
              revisionId: '6',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-24T18:00:00.000Z',
              revisionId: '5',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-23T18:00:00.000Z',
              revisionId: '4',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-22T18:00:00.000Z',
              revisionId: '3',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-21T18:00:00.000Z',
              revisionId: '2',
              userId: 'admin',
              __typename: 'Collection'
            },
            {
              conceptId: 'C1200000104-MMT_2',
              revisionDate: '2000-02-20T18:00:00.000Z',
              revisionId: '1',
              userId: 'admin',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionRevisionList'
        },
        __typename: 'Collection'
      }
    }
  }
}
