import { buildMap, parseCmrResponse } from '../cmr_keywords'
import { cmrResponse } from '../../data/test/cmr_keywords_response'

describe('parses a cmr response', () => {
  it('produces multidimensional array', async () => {
    const response = cmrResponse
    const array = parseCmrResponse(response, ['url_content_type', 'type', 'subtype'])
    const first = array[0]
    const last = array[array.length - 1]
    expect(first).toEqual(['CollectionURL', 'DATA SET LANDING PAGE'])
    expect(last).toEqual(['VisualizationURL',
      'GET RELATED VISUALIZATION',
      'WORLDVIEW'])
  })

  it('can build a map object for related urls', async () => {
    const response = cmrResponse
    const paths = parseCmrResponse(response, ['url_content_type', 'type', 'subtype'])
    const map = buildMap(paths)
    const expectedResponse = {
      CollectionURL: {
        'DATA SET LANDING PAGE': {},
        'EXTENDED METADATA': { 'DMR++': {}, 'DMR++ MISSING DATA': {} },
        'PROFESSIONAL HOME PAGE': {},
        'PROJECT HOME PAGE': {}
      },
      DataCenterURL: { 'HOME PAGE': {} },
      DataContactURL: { 'HOME PAGE': {} },
      DistributionURL: {
        'DOWNLOAD SOFTWARE': { 'MOBILE APP': {} },
        'GET CAPABILITIES': { GIBS: {}, OpenSearch: {} },
        'GET DATA VIA DIRECT ACCESS': {},
        'GET DATA': {
          APPEEARS: {},
          'CERES Ordering Tool': {},
          'DATA COLLECTION BUNDLE': {},
          'DATA TREE': {},
          'DATACAST URL': {},
          'DIRECT DOWNLOAD': {},
          'Earthdata Search': {},
          'EOSDIS DATA POOL': {},
          GIOVANNI: {},
          'GoLIVE Portal': {},
          'IceBridge Portal': {},
          LAADS: {},
          LANCE: {},
          MIRADOR: {},
          MLHub: {},
          MODAPS: {},
          'NOAA CLASS': {},
          NOMADS: {},
          Order: {},
          PORTAL: {},
          'Sub-Orbital Order Tool': {},
          Subscribe: {},
          'USGS EARTH EXPLORER': {},
          VERTEX: {},
          'VIRTUAL COLLECTION': {}
        },
        'GOTO WEB TOOL': {
          HITIDE: {},
          'LIVE ACCESS SERVER (LAS)': {},
          'MAP VIEWER': {},
          'SIMPLE SUBSET WIZARD (SSW)': {},
          SUBSETTER: {}
        },
        'USE SERVICE API': {
          'GRADS DATA SERVER (GDS)': {},
          'MAP SERVICE': {},
          'OPENDAP DATA': {},
          OpenSearch: {},
          'SERVICE CHAINING': {},
          'TABULAR DATA STREAM (TDS)': {},
          'THREDDS DATA': {},
          'WEB COVERAGE SERVICE (WCS)': {},
          'WEB FEATURE SERVICE (WFS)': {},
          'WEB MAP SERVICE (WMS)': {},
          'WEB MAP TILE SERVICE (WMTS)': {}
        }
      },
      PublicationURL: {
        'VIEW RELATED INFORMATION': {
          'ALGORITHM DOCUMENTATION': {},
          'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)': {},
          ANOMALIES: {},
          'CASE STUDY': {},
          'DATA CITATION POLICY': {},
          'DATA PRODUCT SPECIFICATION': {},
          'DATA QUALITY': {},
          'DATA RECIPE': {},
          'DELIVERABLES CHECKLIST': {},
          'GENERAL DOCUMENTATION': {},
          'HOW-TO': {},
          'IMPORTANT NOTICE': {},
          'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION': {},
          'MICRO ARTICLE': {},
          'PI DOCUMENTATION': {},
          'PROCESSING HISTORY': {},
          'PRODUCT HISTORY': {},
          'PRODUCT QUALITY ASSESSMENT': {},
          'PRODUCT USAGE': {},
          'PRODUCTION HISTORY': {},
          PUBLICATIONS: {},
          'READ-ME': {},
          'REQUIREMENTS AND DESIGN': {},
          'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION': {},
          'SCIENCE DATA PRODUCT VALIDATION': {},
          'USER FEEDBACK PAGE': {},
          "USER'S GUIDE": {}
        }
      },
      VisualizationURL: {
        'Color Map': { Giovanni: {}, GITC: {}, 'Harmony GDAL': {} },
        'GET RELATED VISUALIZATION': {
          GIOVANNI: {}, GIS: {}, MAP: {}, SOTO: {}, WORLDVIEW: {}
        }
      }
    }

    expect(map).toEqual(expectedResponse)
  })

  it('can build a map object without type and subtype (just urlcontenttype)', async () => {
    const response = cmrResponse
    const paths = parseCmrResponse(response, ['url_content_type'])
    const map = buildMap(paths)
    const expectedResponse = {
      CollectionURL: {},
      DataCenterURL: {},
      DataContactURL: {},
      DistributionURL: {},
      PublicationURL: {},
      VisualizationURL: {}
    }
    expect(map).toEqual(expectedResponse)
  })
})
