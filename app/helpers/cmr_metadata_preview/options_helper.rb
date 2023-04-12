module CmrMetadataPreview
  module OptionsHelper
    COLLECTION_PROGRESS_OPTIONS = [
      ['Planned', 'PLANNED'],
      ['In work', 'IN WORK'],
      ['Complete', 'COMPLETE']
    ]

    DATE_TYPE_OPTIONS = [
      ['Creation', 'CREATE'],
      ['Last Revision', 'UPDATE'],
      ['Future Review', 'REVIEW'],
      ['Planned Deletion', 'DELETE']
    ]

    METADATA_ASSOCIATION_TYPE_OPTIONS = [
      ['Science Associated', 'SCIENCE ASSOCIATED'],
      ['Dependent', 'DEPENDENT'],
      ['Input', 'INPUT'],
      ['Parent', 'PARENT'],
      ['Child', 'CHILD'],
      ['Related', 'RELATED'],
      ['Larger Citation Works', 'LARGER CITATION WORKS']
    ]

    URL_CONTENT_TYPE_OPTIONS = [
      ['Collection URL', 'CollectionURL'],
      ['Publication URL', 'PublicationURL'],
      ['Data Center URL', 'DataCenterURL'],
      ['Distribution URL', 'DistributionURL'],
      ['Data Contact URL', 'DataContactURL'],
      ['Visualization URL', 'VisualizationURL']
    ]

    URL_TYPE_OPTIONS = [
      ['Data Set Landing Page', 'DATA SET LANDING PAGE'],
      ['Download Software', 'DOWNLOAD SOFTWARE'],
      ['Extended Metadata', 'EXTENDED METADATA'],
      ['Get Data', 'GET DATA'],
      ['Get Related Visualization', 'GET RELATED VISUALIZATION'],
      ['Goto Web Tool', 'GOTO WEB TOOL'],
      ['Home Page', 'HOME PAGE'],
      ['Professional Home Page', 'PROFESSIONAL HOME PAGE'],
      ['Project Home Page', 'PROJECT HOME PAGE'],
      ['Use Service API', 'USE SERVICE API'],
      ['View Related Information', 'VIEW RELATED INFORMATION']
    ]

    URL_SUBTYPE_OPTIONS = [
      ['Algorithm Documentation', 'ALGORITHM DOCUMENTATION'],
      ['Algorithm Theoretical Basis Document (ATBD)', 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'],
      ['Anomalies', 'ANOMALIES'],
      ['AppEEARS', 'APPEEARS'],
      ['Case Study', 'CASE STUDY'],
      ['Data Citation Policy', 'DATA CITATION POLICY'],
      ['Data Collection Bundle', 'DATA COLLECTION BUNDLE'],
      ['Data Quality', 'DATA QUALITY'],
      ['Data Recipe', 'DATA RECIPE'],
      ['Data Tree', 'DATA TREE'],
      ['Datacast URL', 'DATACAST URL'],
      ['Deliverables Checklist', 'DELIVERABLES CHECKLIST'],
      ['Direct Download', 'DIRECT DOWNLOAD'],
      ['Earthdata Search', 'Earthdata Search'],
      ['EOSDIS Data Pool', 'EOSDIS DATA POOL'],
      ['General Documentation', 'GENERAL DOCUMENTATION'],
      ['Giovanni', 'GIOVANNI'],
      ['GoLIVE Portal', 'GoLIVE Portal'],
      ['GrADS Data Server (GDS)', 'GRADS DATA SERVER (GDS)'],
      ['How To', 'HOW-TO'],
      ['IceBridge Portal', 'IceBridge Portal'],
      ['Important Notice', 'IMPORTANT NOTICE'],
      ['Instrument/Sensor Calibration Documentation', 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'],
      ['LAADS', 'LAADS'],
      ['LANCE', 'LANCE'],
      ['Live Access Server (LAS)', 'LIVE ACCESS SERVER (LAS)'],
      ['Map Service', 'MAP SERVICE'],
      ['Map Viewer', 'MAP VIEWER'],
      ['MAP', 'MAP'],
      ['Micro Article', 'MICRO ARTICLE'],
      ['Mirador', 'MIRADOR'],
      ['Mobile App', 'MOBILE APP'],
      ['MODAPS', 'MODAPS'],
      ['NOAA Class', 'NOAA CLASS'],
      ['NOMADS', 'NOMADS'],
      ['Open Search', 'OpenSearch'],
      ['OPeNDAP Data', 'OPENDAP DATA'],
      ['Order', 'Order'],
      ['PI Documentation', 'PI DOCUMENTATION'],
      ['PORTAL', 'PORTAL'],
      ['Processing History', 'PROCESSING HISTORY'],
      ['Product History', 'PRODUCT HISTORY'],
      ['Product Quality Assessment', 'PRODUCT QUALITY ASSESSMENT'],
      ['Product Usage', 'PRODUCT USAGE'],
      ['Production History', 'PRODUCTION HISTORY'],
      ['Publications', 'PUBLICATIONS'],
      ['Read Me', 'READ-ME'],
      ['Requirements And Design', 'REQUIREMENTS AND DESIGN'],
      ['Science Data Product Software Documentation', 'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION'],
      ['Science Data Product Validation', 'SCIENCE DATA PRODUCT VALIDATION'],
      ['Service Chaining', 'SERVICE CHAINING'],
      ['Simple Subset Wizard (SSW)', 'SIMPLE SUBSET WIZARD (SSW)'],
      ['Subscribe', 'Subscribe'],
      ['Subsetter', 'SUBSETTER'],
      ['Tabular Data Stream (TDS)', 'TABULAR DATA STREAM (TDS)'],
      ['Threads Data', 'THREADS DATA'],
      ['User Feedback Page', 'USER FEEDBACK PAGE'],
      ['USGS Earth Explorer', 'USGS EARTH EXPLORER'],
      ['Vertex', 'VERTEX'],
      ['Virtual Collection', 'VIRTUAL COLLECTION'],
      ['Web Coverage Service (WCS)', 'WEB COVERAGE SERVICE (WCS)'],
      ['Web Feature Service (WFS)', 'WEB FEATURE SERVICE (WFS)'],
      ['Web Map Service (WMS)', 'WEB MAP SERVICE (WMS)'],
      ['Web Map Tile Service (WMTS)', 'WEB MAP TILE SERVICE (WMTS)'],
      ['Worldview', 'WORLDVIEW'],
      ["User's Guide", "USER'S GUIDE"]
    ]

    PhoneContactTypes ||= ['Direct Line', 'Mobile', 'Primary', 'TDD/TTY Phone',
                           'Telephone', 'U.S. toll free']
  end
end
