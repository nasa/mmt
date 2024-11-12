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
})
