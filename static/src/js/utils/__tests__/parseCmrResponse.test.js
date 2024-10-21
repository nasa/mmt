import parseCmrResponse from '../parseCmrResponse'
import relatedUrls from '../__mocks__/relatedUrls'

describe('cmrKeywords', () => {
  describe('can return a single list of keywords', () => {
    test('returns a parsed list of enums from CMR', () => {
      const cmrResponse = {
        mime_type: [
          {
            value: 'HDF4',
            uuid: 'e5c126f8-0435-4cef-880f-72a1d2d792f2'
          },
          {
            value: 'ZIP',
            uuid: '5c406abc-104d-4517-96b8-dbbcf515f00f'
          },
          {
            value: 'PNG',
            uuid: '4c406abc-104d-4517-96b8-dbbcf515f00f'
          },
          {
            value: 'HDF5',
            uuid: '1c406abc-104d-4517-96b8-dbbcf515f00f'
          },
          {
            value: 'NETCDF-CF',
            uuid: '3c406abc-104d-4517-96b8-dbbcf515f00f'
          },
          {
            value: 'JPEG',
            uuid: '7443bb2d-1dbb-44d1-bd29-0241d30fbc57'
          },
          {
            value: 'ASCII',
            uuid: '8e128326-b9cb-44c7-9e6b-4bd950a08753'
          },
          {
            value: 'CSV',
            uuid: '465809cc-e76c-4630-8594-bb8bd7a1a380'
          },
          {
            value: 'netCDF-4',
            uuid: '30ea4e9a-4741-42c9-ad8f-f10930b35294'
          },
          {
            value: 'HTML',
            uuid: '2c406abc-104d-4517-96b8-dbbcf515f00f'
          }
        ]
      }

      const expectedResult = [
        ['ASCII'],
        ['CSV'],
        ['HDF4'],
        ['HDF5'],
        ['HTML'],
        ['JPEG'],
        ['netCDF-4'],
        ['NETCDF-CF'],
        ['PNG'],
        ['ZIP']
      ]
      const result = parseCmrResponse(cmrResponse, ['mime_type'])

      expect(result).toEqual(expectedResult)
    })

    describe('can return a multiple keywords', () => {
      test('returns all the related url keywords', () => {
        const cmrResponse = relatedUrls
        const result = parseCmrResponse(cmrResponse, ['url_content_type', 'type', 'subtype'])
        expect(result).toEqual(
          [
            ['CollectionURL', 'DATA SET LANDING PAGE'],
            ['CollectionURL', 'EXTENDED METADATA', 'DMR++'],
            ['CollectionURL', 'EXTENDED METADATA', 'DMR++ MISSING DATA'],
            ['CollectionURL', 'PROFESSIONAL HOME PAGE'],
            ['CollectionURL', 'PROJECT HOME PAGE'],
            ['DataCenterURL', 'HOME PAGE'],
            ['DataContactURL', 'HOME PAGE'],
            ['DistributionURL', 'DOWNLOAD SOFTWARE', 'MOBILE APP'],
            ['DistributionURL', 'GET CAPABILITIES', 'GIBS'],
            ['DistributionURL', 'GET CAPABILITIES', 'OpenSearch'],
            ['DistributionURL', 'GET DATA VIA DIRECT ACCESS'],
            ['DistributionURL', 'GET DATA', 'APPEEARS'],
            ['DistributionURL', 'GET DATA', 'CERES Ordering Tool'],
            ['DistributionURL', 'GET DATA', 'DATA COLLECTION BUNDLE'],
            ['DistributionURL', 'GET DATA', 'DATA TREE'],
            ['DistributionURL', 'GET DATA', 'DATACAST URL'],
            ['DistributionURL', 'GET DATA', 'DIRECT DOWNLOAD'],
            ['DistributionURL', 'GET DATA', 'Earthdata Search'],
            ['DistributionURL', 'GET DATA', 'EOSDIS DATA POOL'],
            ['DistributionURL', 'GET DATA', 'GIOVANNI'],
            ['DistributionURL', 'GET DATA', 'GoLIVE Portal'],
            ['DistributionURL', 'GET DATA', 'IceBridge Portal'],
            ['DistributionURL', 'GET DATA', 'LAADS'],
            ['DistributionURL', 'GET DATA', 'LANCE'],
            ['DistributionURL', 'GET DATA', 'MIRADOR'],
            ['DistributionURL', 'GET DATA', 'MLHub'],
            ['DistributionURL', 'GET DATA', 'MODAPS'],
            ['DistributionURL', 'GET DATA', 'NOAA CLASS'],
            ['DistributionURL', 'GET DATA', 'NOMADS'],
            ['DistributionURL', 'GET DATA', 'Order'],
            ['DistributionURL', 'GET DATA', 'PORTAL'],
            ['DistributionURL', 'GET DATA', 'Sub-Orbital Order Tool'],
            ['DistributionURL', 'GET DATA', 'Subscribe'],
            ['DistributionURL', 'GET DATA', 'USGS EARTH EXPLORER'],
            ['DistributionURL', 'GET DATA', 'VERTEX'],
            ['DistributionURL', 'GET DATA', 'VIRTUAL COLLECTION'],
            ['DistributionURL', 'GOTO WEB TOOL', 'HITIDE'],
            ['DistributionURL', 'GOTO WEB TOOL', 'LIVE ACCESS SERVER (LAS)'],
            ['DistributionURL', 'GOTO WEB TOOL', 'MAP VIEWER'],
            ['DistributionURL', 'GOTO WEB TOOL', 'SIMPLE SUBSET WIZARD (SSW)'],
            ['DistributionURL', 'GOTO WEB TOOL', 'SUBSETTER'],
            ['DistributionURL', 'USE SERVICE API', 'GRADS DATA SERVER (GDS)'],
            ['DistributionURL', 'USE SERVICE API', 'MAP SERVICE'],
            ['DistributionURL', 'USE SERVICE API', 'OPENDAP DATA'],
            ['DistributionURL', 'USE SERVICE API', 'OpenSearch'],
            ['DistributionURL', 'USE SERVICE API', 'SERVICE CHAINING'],
            ['DistributionURL', 'USE SERVICE API', 'TABULAR DATA STREAM (TDS)'],
            ['DistributionURL', 'USE SERVICE API', 'THREDDS DATA'],
            [
              'DistributionURL',
              'USE SERVICE API',
              'WEB COVERAGE SERVICE (WCS)'
            ],
            ['DistributionURL', 'USE SERVICE API', 'WEB FEATURE SERVICE (WFS)'],
            ['DistributionURL', 'USE SERVICE API', 'WEB MAP SERVICE (WMS)'],
            [
              'DistributionURL',
              'USE SERVICE API',
              'WEB MAP TILE SERVICE (WMTS)'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'ALGORITHM DOCUMENTATION'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'ANOMALIES'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'CASE STUDY'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'DATA CITATION POLICY'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'DATA PRODUCT SPECIFICATION'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'DATA QUALITY'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'DATA RECIPE'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'DELIVERABLES CHECKLIST'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'GENERAL DOCUMENTATION'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'HOW-TO'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'IMPORTANT NOTICE'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'MICRO ARTICLE'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'PI DOCUMENTATION'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'PROCESSING HISTORY'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'PRODUCT HISTORY'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'PRODUCT QUALITY ASSESSMENT'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'PRODUCT USAGE'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'PRODUCTION HISTORY'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'PUBLICATIONS'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'READ-ME'],
            ['PublicationURL', 'VIEW RELATED INFORMATION', 'RELATED ARTICLES'],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'REQUIREMENTS AND DESIGN'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'SCIENCE DATA PRODUCT VALIDATION'
            ],
            [
              'PublicationURL',
              'VIEW RELATED INFORMATION',
              'USER FEEDBACK PAGE'
            ],
            ['PublicationURL', 'VIEW RELATED INFORMATION', "USER'S GUIDE"],
            ['VisualizationURL', 'Color Map', 'Giovanni'],
            ['VisualizationURL', 'Color Map', 'GITC'],
            ['VisualizationURL', 'Color Map', 'Harmony GDAL'],
            ['VisualizationURL', 'GET RELATED VISUALIZATION', 'GIOVANNI'],
            ['VisualizationURL', 'GET RELATED VISUALIZATION', 'GIS'],
            ['VisualizationURL', 'GET RELATED VISUALIZATION', 'MAP'],
            ['VisualizationURL', 'GET RELATED VISUALIZATION', 'SOTO'],
            ['VisualizationURL', 'GET RELATED VISUALIZATION', 'WORLDVIEW']
          ]
        )
      })
    })
  })

  describe('can return a multiple keywords', () => {
    test('returns all the related url keywords', () => {
      const cmrResponse = relatedUrls
      const result = parseCmrResponse(cmrResponse, ['url_content_type', 'type'])
      expect(result).toEqual([
        ['CollectionURL', 'DATA SET LANDING PAGE'],
        ['CollectionURL', 'EXTENDED METADATA'],
        ['CollectionURL', 'PROFESSIONAL HOME PAGE'],
        ['CollectionURL', 'PROJECT HOME PAGE'],
        ['DataCenterURL', 'HOME PAGE'],
        ['DataContactURL', 'HOME PAGE'],
        ['DistributionURL', 'DOWNLOAD SOFTWARE'],
        ['DistributionURL', 'GET CAPABILITIES'],
        ['DistributionURL', 'GET DATA'],
        ['DistributionURL', 'GET DATA VIA DIRECT ACCESS'],
        ['DistributionURL', 'GOTO WEB TOOL'],
        ['DistributionURL', 'USE SERVICE API'],
        ['PublicationURL', 'VIEW RELATED INFORMATION'],
        ['VisualizationURL', 'Color Map'],
        ['VisualizationURL', 'GET RELATED VISUALIZATION']
      ])
    })
  })

  describe('can return a single list of location keywords', () => {
    test('returns a parsed list of location keywords from CMR', () => {
      const cmrResponse = {
        category: [
          {
            value: 'GEOGRAPHIC REGION',
            uuid: '204270d9-8039-4768-851e-63635af5fb65',
            subfields: [
              'type'
            ],
            type: [
              {
                value: 'ARCTIC',
                uuid: 'd40d9651-aa19-4b2c-9764-7371bb64b9a7'
              }
            ]
          },
          {
            value: 'CONTINENT',
            uuid: '0a672f19-dad5-4114-819a-2eb55bdbb56a',
            subfields: [
              'type'
            ],
            type: [
              {
                value: 'ASIA',
                subfields: [
                  'subregion_1'
                ],
                subregion_1: [
                  {
                    value: 'WESTERN ASIA',
                    subfields: [
                      'subregion_2'
                    ],
                    subregion_2: [
                      {
                        value: 'MIDDLE EAST',
                        subfields: [
                          'subregion_3'
                        ],
                        subregion_3: [
                          {
                            value: 'GAZA STRIP',
                            uuid: '302ab5f2-5fa2-482d-9d22-8a7a1546a62d'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                value: 'AFRICA',
                uuid: '2ca1b865-5555-4375-aa81-72811335b695',
                subfields: [
                  'subregion_1'
                ],
                subregion_1: [
                  {
                    value: 'CENTRAL AFRICA',
                    uuid: 'f2ffbe58-8792-413b-805b-3e1c8de1c6ff',
                    subfields: [
                      'subregion_2'
                    ],
                    subregion_2: [
                      {
                        value: 'ANGOLA',
                        uuid: '9b0a194d-d617-4fed-9625-df176319892d'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            value: 'OCEAN',
            uuid: 'ff03e9fc-9882-4a5e-ad0b-830d8f1186cb',
            subfields: [
              'type'
            ],
            type: [
              {
                value: 'ATLANTIC OCEAN',
                uuid: 'cf249a36-2e82-4d32-84cd-23a4f40bb393',
                subfields: [
                  'subregion_1'
                ],
                subregion_1: [
                  {
                    value: 'NORTH ATLANTIC OCEAN',
                    uuid: 'a4202721-0cba-4fa1-853f-890f146b04f9',
                    subfields: [
                      'subregion_2'
                    ],
                    subregion_2: [
                      {
                        value: 'MEDITERRANEAN SEA',
                        subfields: [
                          'subregion_3'
                        ],
                        subregion_3: [
                          {
                            value: 'ADRIATIC SEA',
                            uuid: '7b93c892-2fc4-417b-a4da-5c8a2fca361b'
                          }
                        ]
                      },
                      {
                        value: 'BALTIC SEA',
                        uuid: '41cd228c-4677-4900-9507-70144d8b50bc'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }

      const expectedResult = [
        ['CONTINENT', 'AFRICA', 'CENTRAL AFRICA', 'ANGOLA'],
        ['CONTINENT', 'ASIA', 'WESTERN ASIA', 'MIDDLE EAST', 'GAZA STRIP'],
        ['GEOGRAPHIC REGION', 'ARCTIC'],
        ['OCEAN', 'ATLANTIC OCEAN', 'NORTH ATLANTIC OCEAN', 'BALTIC SEA'],
        [
          'OCEAN',
          'ATLANTIC OCEAN',
          'NORTH ATLANTIC OCEAN',
          'MEDITERRANEAN SEA',
          'ADRIATIC SEA'
        ]
      ]
      const result = parseCmrResponse(cmrResponse, ['locationkeywords', 'category', 'type', 'subregion_1', 'subregion_2', 'subregion_3', 'detailed_location'])

      expect(result).toEqual(expectedResult)
    })
  })
})
