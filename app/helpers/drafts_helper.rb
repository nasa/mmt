module DraftsHelper
  AltitudeDistanceUnitsOptions = [
    ['HectoPascals'],
    ['Kilometers'],
    ['Millibars']
  ]
  ArchiveDistributionFormatTypeOptions = [
    ['Native'],
    ['Supported']
  ]
  ArchiveDistributionUnitOptions = [
    ['KB'],
    ['MB'],
    ['GB'],
    ['TB'],
    ['PB'],
    ['NA']
  ]
  CollectionDataTypeOptions = [
    ['Science Quality', 'SCIENCE_QUALITY'],
    ['Near Real Time', 'NEAR_REAL_TIME'],
    ['Other', 'OTHER']
  ]
  CollectionProgressOptions = [
    ['Active', 'ACTIVE'],
    ['Planned', 'PLANNED'],
    ['Complete', 'COMPLETE'],
    ['Not Applicable', 'NOT APPLICABLE'],
    ['Not Provided', 'NOT PROVIDED']
  ]
  CoordinateSystemOptions = [
    ['Cartesian', 'CARTESIAN'],
    ['Geodetic', 'GEODETIC']
  ]
  ContactMechanismTypeOptions = [
    ['Direct Line'],
    ['Email'],
    ['Facebook'],
    ['Fax'],
    ['Mobile'],
    ['Modem'],
    ['Primary'],
    ['TDD/TTY Phone'],
    ['Telephone'],
    ['Twitter'],
    ['U.S. toll free'],
    ['Other']
  ]
  DataCenterRoleOptions = [
    ['Archiver', 'ARCHIVER'],
    ['Distributor', 'DISTRIBUTOR'],
    ['Originator', 'ORIGINATOR'],
    ['Processor', 'PROCESSOR']
  ]
  DataContactRoleOptions = [
    ['Data Center Contact'],
    ['Technical Contact'],
    ['Science Contact'],
    ['Investigator'],
    ['Metadata Author'],
    ['User Services'],
    ['Science Software Development']
  ]
  DataContactTypeOptions = [
    ['Data Center Contact Person', 'DataCenterContactPerson'],
    ['Data Center Contact Group', 'DataCenterContactGroup'],
    ['Non Data Center Contact Person', 'NonDataCenterContactPerson'],
    ['Non Data Center Contact Group', 'NonDataCenterContactGroup']
  ]
  DataTypeOptions = [
    ['String', 'STRING'],
    ['Float', 'FLOAT'],
    ['Integer', 'INT'],
    ['Boolean', 'BOOLEAN'],
    ['Date', 'DATE'],
    ['Time', 'TIME'],
    ['Date time', 'DATETIME'],
    ['Date String', 'DATE_STRING'],
    ['Time String', 'TIME_STRING'],
    ['Date Time String', 'DATETIME_STRING']
  ]
  DepthDistanceUnitsOptions = [
    ['Fathoms'],
    ['Feet'],
    ['HectoPascals'],
    ['Meters'],
    ['Millibars']
  ]
  DurationOptions = [
    ['Day', 'DAY'],
    ['Month', 'MONTH'],
    ['Year', 'YEAR']
  ]
  DateTypeOptions = [
    ['Creation', 'CREATE'],
    ['Last Revision', 'UPDATE'],
    ['Future Review', 'REVIEW'],
    ['Planned Deletion', 'DELETE']
  ]
  FileSizeUnitTypeOptions = [
    ['KB'],
    ['MB'],
    ['GB'],
    ['TB'],
    ['PB']
  ]
  GeographicCoordinateUnitsOptions = [
    ['Decimal Degrees'],
    ['Kilometers'],
    ['Meters']
  ]
  GetDataTypeFormatOptions = [
    ['ascii'],
    ['binary'],
    ['GRIB'],
    ['BUFR'],
    ['HDF4'],
    ['HDF5'],
    ['HDF-EOS4'],
    ['HDF-EOS5'],
    ['jpeg'],
    ['png'],
    ['tiff'],
    ['geotiff'],
    ['kml'],
    ['Not provided']
  ]
  GranuleSpatialRepresentationOptions = [
    ['Cartesian', 'CARTESIAN'],
    ['Geodetic', 'GEODETIC'],
    ['Orbit', 'ORBIT'],
    ['No Spatial', 'NO_SPATIAL']
  ]
  HorizontalDataResolutionUnitEnumOptions = [
    ['Decimal Degrees'],
    ['Kilometers'],
    ['Meters'],
    ['Statute Miles'],
    ['Nautical Miles'],
    ['Not provided']
  ]
  HorizontalResolutionProcessingLevelEnumOptions = [
    ['Gridded'],
    ['Gridded Range'],
    ['Non Gridded'],
    ['Non Gridded Range'],
    ['Not provided'],
    ['Point'],
    ['Varies']
  ]
  HorizontalResolutionScanDirectionTypeOptions = [
    ['Along Track'],
    ['Cross Track']
  ]
  HorizontalResolutionViewingAngleTypeOptions = [
    ['At Nadir'],
    ['Scan Extremes']
  ]
  MetadataAssociationTypeOptions = [
    ['Science Associated', 'SCIENCE ASSOCIATED'],
    ['Dependent', 'DEPENDENT'],
    ['Input', 'INPUT'],
    ['Parent', 'PARENT'],
    ['Child', 'CHILD'],
    ['Related', 'RELATED'],
    ['Larger Citation Works', 'LARGER CITATION WORKS']
  ]
  MimeTypeOptions = [
    ['application/json'],
    ['application/xml'],
    ['application/x-netcdf'],
    ['application/gml+xml'],
    ['application/vnd.google-earth.kml+xml'],
    ['image/gif'],
    ['image/tiff'],
    ['image/bmp'],
    ['text/csv'],
    ['text/xml'],
    ['application/pdf'],
    ['application/x-hdf'],
    ['application/xhdf5'],
    ['application/octet-stream'],
    ['application/vnd.google-earth.kmz'],
    ['image/jpeg'],
    ['image/png'],
    ['image/vnd.collada+xml'],
    ['text/html'],
    ['text/plain'],
    ['Not provided']
  ]
  ProcessingLevelIdOptions = [
    ['Not Provided'],
    ['0'],
    ['1'],
    ['1A'],
    ['1B'],
    ['1C'],
    ['1T'],
    ['2'],
    ['2G'],
    ['2P'],
    ['3'],
    ['4'],
    ['NA']
  ]
  ProtocolOptions = [
    ['HTTP'],
    ['HTTPS'],
    ['FTP'],
    ['FTPS'],
    ['Not provided']
  ]
  RoleOptions = [
    ['Resource Provider', 'RESOURCEPROVIDER'],
    ['Custodian', 'CUSTODIAN'],
    ['Owner', 'OWNER'],
    ['User', 'USER'],
    ['Distributor', 'DISTRIBUTOR'],
    ['Originator', 'ORIGINATOR'],
    ['Point of Contact', 'POINTOFCONTACT'],
    ['Principal Investigator', 'PRINCIPALINVESTIGATOR'],
    ['Processor', 'PROCESSOR'],
    ['Publisher', 'PUBLISHER'],
    ['Author', 'AUTHOR'],
    ['Sponsor', 'SPONSOR'],
    ['Co-Author', 'COAUTHOR'],
    ['Collaborator', 'COLLABORATOR'],
    ['Editor', 'EDITOR'],
    ['Mediator', 'MEDIATOR'],
    ['Rights Holder', 'RIGHTSHOLDER'],
    ['Contributor', 'CONTRIBUTOR'],
    ['Funder', 'FUNDER'],
    ['Stakeholder', 'STAKEHOLDER']
  ]
  SpatialCoverageTypeOptions = [
    ['Horizontal', 'HORIZONTAL'],
    ['Vertical', 'VERTICAL'],
    ['Orbital', 'ORBITAL'],
    ['Horizontal and Vertical', 'HORIZONTAL_VERTICAL'],
    ['Orbital and Vertical', 'ORBITAL_VERTICAL']
  ]
  TilingIdentificationSystemNameOptions = [
    ['CALIPSO'],
    ['MISR'],
    ['MODIS Tile EASE'],
    ['MODIS Tile SIN'],
    ['WELD Alaska Tile'],
    ['WELD CONUS Tile'],
    ['WRS-1'],
    ['WRS-2']
  ]
  url_content_type_map_for_umm_s = {
    'CollectionURL' => {
      'text' => 'Collection URL',
      'types' => {
        'DATA SET LANDING PAGE' => {
          'text' => 'Data Set Landing Page',
          'subtypes' => []
        },
        'DOI' => {
          'text' => 'DOI',
          'subtypes' => []
        },
        'EXTENDED METADATA' => {
          'text' => 'Extended Metadata',
          'subtypes' => []
        },
        'PROFESSIONAL HOME PAGE' => {
          'text' => 'Professional Home Page',
          'subtypes' => []
        },
        'PROJECT HOME PAGE' => {
          'text' => 'Project Home Page',
          'subtypes' => []
        }
      }
    },
    'PublicationURL' => {
      'text' => 'Publication URL',
      'types' => {
        'VIEW RELATED INFORMATION' => {
          'text' => 'View Related Information',
          'subtypes' => [
            ['Algorithm Theoretical Basis Document', 'ALGORITHM THEORETICAL BASIS DOCUMENT'],
            ['Calibration Data Documentation', 'CALIBRATION DATA DOCUMENTATION'],
            ['Case Study', 'CASE STUDY'],
            ['Data Quality', 'DATA QUALITY'],
            ['Data Usage', 'DATA USAGE'],
            ['Deliverables Checklist', 'DELIVERABLES CHECKLIST'],
            ['General Documentation', 'GENERAL DOCUMENTATION'],
            ['How To', 'HOW-TO'],
            ['PI Documentation', 'PI DOCUMENTATION'],
            ['Processing History', 'PROCESSING HISTORY'],
            ['Production Version History', 'PRODUCTION VERSION HISTORY'],
            ['Product Quality Assessment', 'PRODUCT QUALITY ASSESSMENT'],
            ['Product Usage', 'PRODUCT USAGE'],
            ['Product History', 'PRODUCT HISTORY'],
            ['Publications', 'PUBLICATIONS'],
            ['Radiometric And Geometric Calibration Methods', 'RADIOMETRIC AND GEOMETRIC CALIBRATION METHODS'],
            ['Read Me', 'READ-ME'],
            ['Recipe', 'RECIPE'],
            ['Requirements And Design', 'REQUIREMENTS AND DESIGN'],
            ['Science Data Product Software Documentation', 'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION'],
            ['Science Data Product Validation', 'SCIENCE DATA PRODUCT VALIDATION'],
            ['User Feedback', 'USER FEEDBACK'],
            ["User's Guide", "USER'S GUIDE"]
          ]
        }
      }
    },
    'DataCenterURL' => {
      'text' => 'Data Center URL',
      'types' => {
        'HOME PAGE' => {
          'text' => 'Home Page',
          'subtypes' => []
        }
      }
    },
    'DataContactURL' => {
      'text' => 'Data Contact URL',
      'types' => {
        'HOME PAGE' => {
          'text' => 'Home Page',
          'subtypes' => []
        }
      }
    },
    'DistributionURL' => {
      'text' => 'Distribution URL',
      'types' => {
        'GET DATA' => {
          'text' => 'Get Data',
          'subtypes' => [
            ['Datacast URL', 'DATACAST URL'],
            ['Earthdata Search', 'EARTHDATA SEARCH'],
            ['ECHO', 'ECHO'],
            ['EDG', 'EDG'],
            ['EOSDIS Data Pool', 'EOSDIS DATA POOL'],
            ['GDS', 'GDS'],
            ['GIOVANNI', 'GIOVANNI'],
            ['KML', 'KML'],
            ['LAADS', 'LAADS'],
            ['LANCE', 'LANCE'],
            ['LAS', 'LAS'],
            ['Mirador', 'MIRADOR'],
            ['MODAPS', 'MODAPS'],
            ['NOAA Class', 'NOAA CLASS'],
            ['On Line Archive', 'ON-LINE ARCHIVE'],
            ['Reverb', 'REVERB']
          ]
        },
        'GET SERVICE' => {
          'text' => 'Get Service',
          'subtypes' => [
            ['Access Map Viewer', 'ACCESS MAP VIEWER'],
            ['Access Mobile App', 'ACCESS MOBILE APP'],
            ['Access Web Service', 'ACCESS WEB SERVICE'],
            ['DIF', 'DIF'],
            ['Map Service', 'MAP SERVICE'],
            ['NOMADS', 'NOMADS'],
            ['OPeNDAP Data', 'OPENDAP DATA'],
            ['OPeNDAP Data (Dods)', 'OPENDAP DATA (DODS)'],
            ['OPeNDAP Directory (Dods)', 'OPENDAP DIRECTORY (DODS)'],
            ['Open Search', 'OpenSearch'],
            ['SERF', 'SERF'],
            ['Software Package', 'SOFTWARE PACKAGE'],
            ['SSW', 'SSW'],
            ['Subsetter', 'SUBSETTER'],
            ['Thredds Catalog', 'THREDDS CATALOG'],
            ['Thredds Data', 'THREDDS DATA'],
            ['Thredds Directory', 'THREDDS DIRECTORY'],
            ['Web Coverage Service (WCS)', 'WEB COVERAGE SERVICE (WCS)'],
            ['Web Feature Service (WFS)', 'WEB FEATURE SERVICE (WFS)'],
            ['Web Map For Time Series', 'WEB MAP FOR TIME SERIES'],
            ['Web Map Service (WMS)', 'WEB MAP SERVICE (WMS)'],
            ['Workflow (Service Chain)', 'WORKFLOW (SERVICE CHAIN)']
          ]
        }
      }
    },
    'VisualizationURL' => {
      'text' => 'Visualization URL',
      'types' => {
        'GET RELATED VISUALIZATION' => {
          'text' => 'Get Related Visualization',
          'subtypes' => [
            ['GIBS', 'GIBS'],
            ['GIOVANNI', 'GIOVANNI'],
            ['MAP', 'MAP']
          ]
        }
      }
    }
  }
  url_content_type_map = {
    'CollectionURL' => {
      'text' => 'Collection URL',
      'types' => {
        'DATA SET LANDING PAGE' => {
          'text' => 'Data Set Landing Page',
          'subtypes' => []
        },
        'EXTENDED METADATA' => {
          'text' => 'Extended Metadata',
          'subtypes' => []
        },
        'PROFESSIONAL HOME PAGE' => {
          'text' => 'Professional Home Page',
          'subtypes' => []
        },
        'PROJECT HOME PAGE' => {
          'text' => 'Project Home Page',
          'subtypes' => []
        }
      }
    },
    'PublicationURL' => {
      'text' => 'Publication URL',
      'types' => {
        'VIEW RELATED INFORMATION' => {
          'text' => 'View Related Information',
          'subtypes' => [
            ['Algorithm Documentation', 'ALGORITHM DOCUMENTATION'],
            ['Algorithm Theoretical Basis Document (ATBD)', 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'],
            ['Anomalies', 'ANOMALIES'],
            ['Case Study', 'CASE STUDY'],
            ['Data Citation Policy', 'DATA CITATION POLICY'],
            ['Data Quality', 'DATA QUALITY'],
            ['Data Recipe', 'DATA RECIPE'],
            ['Deliverables Checklist', 'DELIVERABLES CHECKLIST'],
            ['General Documentation', 'GENERAL DOCUMENTATION'],
            ['How To', 'HOW-TO'],
            ['Important Notice', 'IMPORTANT NOTICE'],
            ['Instrument/Sensor Calibration Documentation', 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'],
            ['Micro Article', 'MICRO ARTICLE'],
            ['PI Documentation', 'PI DOCUMENTATION'],
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
            ['User Feedback Page', 'USER FEEDBACK PAGE'],
            ["User's Guide", "USER'S GUIDE"]
          ]
        }
      }
    },
    'DataCenterURL' => {
      'text' => 'Data Center URL',
      'types' => {
        'HOME PAGE' => {
          'text' => 'Home Page',
          'subtypes' => []
        }
      }
    },
    'DataContactURL' => {
      'text' => 'Data Contact URL',
      'types' => {
        'HOME PAGE' => {
          'text' => 'Home Page',
          'subtypes' => []
        }
      }
    },
    'DistributionURL' => {
      'text' => 'Distribution URL',
      'types' => {
        'DOWNLOAD SOFTWARE' => {
          'text' => 'Download Software',
          'subtypes' => [
            ['Mobile App', 'MOBILE APP']
          ]
        },
        'GET DATA' => {
          'text' => 'Get Data',
          'subtypes' => [
            ['AppEEARS', 'APPEEARS'],
            ['Data Collection Bundle', 'DATA COLLECTION BUNDLE'],
            ['Data Tree', 'DATA TREE'],
            ['Datacast URL', 'DATACAST URL'],
            ['Direct Download', 'DIRECT DOWNLOAD'],
            ['Earthdata Search', 'Earthdata Search'],
            ['EOSDIS Data Pool', 'EOSDIS DATA POOL'],
            ['GIOVANNI', 'GIOVANNI'],
            ['GoLIVE Portal', 'GoLIVE Portal'],
            ['IceBridge Portal', 'IceBridge Portal'],
            ['LAADS', 'LAADS'],
            ['LANCE', 'LANCE'],
            ['Mirador', 'MIRADOR'],
            ['MODAPS', 'MODAPS'],
            ['NOAA Class', 'NOAA CLASS'],
            ['NOMADS', 'NOMADS'],
            ['Order', 'Order'],
            ['PORTAL', 'PORTAL'],
            ['Subscribe', 'Subscribe'],
            ['USGS Earth Explorer', 'USGS EARTH EXPLORER'],
            ['Vertex', 'VERTEX'],
            ['Virtual Collection', 'VIRTUAL COLLECTION']
          ]
        },
        'GOTO WEB TOOL' => {
          'text' => 'Goto Web Tool',
          'subtypes' => [
            ['Live Access Server (LAS)', 'LIVE ACCESS SERVER (LAS)'],
            ['Map Viewer', 'MAP VIEWER'],
            ['Simple Subset Wizard (SSW)', 'SIMPLE SUBSET WIZARD (SSW)'],
            ['Subsetter', 'SUBSETTER']
          ]
        },
        'USE SERVICE API' => {
          'text' => 'Use Service API',
          'subtypes' => [
            ['GrADS Data Server (GDS)', 'GRADS DATA SERVER (GDS)'],
            ['Map Service', 'MAP SERVICE'],
            ['OPeNDAP Data', 'OPENDAP DATA'],
            ['Open Search', 'OpenSearch'],
            ['Service Chaining', 'SERVICE CHAINING'],
            ['Tabular Data Stream (TDS)', 'TABULAR DATA STREAM (TDS)'],
            ['Thredds Data', 'THREDDS DATA'],
            ['Web Coverage Service (WCS)', 'WEB COVERAGE SERVICE (WCS)'],
            ['Web Feature Service (WFS)', 'WEB FEATURE SERVICE (WFS)'],
            ['Web Map Service (WMS)', 'WEB MAP SERVICE (WMS)'],
            ['Web Map Tile Service (WMTS)', 'WEB MAP TILE SERVICE (WMTS)']
          ]
        }
      }
    },
    'VisualizationURL' => {
      'text' => 'Visualization URL',
      'types' => {
        'GET RELATED VISUALIZATION' => {
          'text' => 'Get Related Visualization',
          'subtypes' => [
            ['GIOVANNI', 'GIOVANNI'],
            ['MAP', 'MAP'],
            ['Worldview', 'WORLDVIEW']
          ]
        }
      }
    }
  }
  URLContentTypeMap = url_content_type_map.deep_dup
  # UMM-S v1.1 added TOOL to GET SERVICE subtypes
  umm_s_url_content_type_map = url_content_type_map_for_umm_s.deep_dup
  umm_s_url_content_type_map['DistributionURL']['types']['GET SERVICE']['subtypes'] << ['Tool','TOOL']
  umm_s_url_content_type_map['DistributionURL']['types']['GET SERVICE']['subtypes'].sort!
  UMMSURLContentTypeMap = umm_s_url_content_type_map
  URLContentTypeOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Publication URL', 'PublicationURL'],
    ['Data Center URL', 'DataCenterURL'],
    ['Distribution URL', 'DistributionURL'],
    ['Data Contact URL', 'DataContactURL'],
    ['Visualization URL', 'VisualizationURL']
  ]
  URLContentTypeRelatedURLsOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Publication URL', 'PublicationURL'],
    ['Distribution URL', 'DistributionURL'],
    ['Visualization URL', 'VisualizationURL']
  ]
  URLContentTypeDataCenterOptions = [
    ['Data Center URL', 'DataCenterURL']
  ]
  URLContentTypeDataContactOptions = [
    ['Data Contact URL', 'DataContactURL']
  ]
  UMMCURLTypeOptions = [
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
  UMMSURLTypeOptions = [
    ['Get Data', 'GET DATA'],
    ['Data Set Landing Page', 'DATA SET LANDING PAGE'],
    ['DOI', 'DOI'],
    ['Extended Metadata', 'EXTENDED METADATA'],
    ['Get Related Visualization', 'GET RELATED VISUALIZATION'],
    ['Get Service', 'GET SERVICE'],
    ['Home Page', 'HOME PAGE'],
    ['Professional Home Page', 'PROFESSIONAL HOME PAGE'],
    ['Project Home Page', 'PROJECT HOME PAGE'],
    ['View Related Information', 'VIEW RELATED INFORMATION']
  ]
  URLTypeDataCenterOptions = [
    ['Home Page', 'HOME PAGE']
  ]
  UMMCURLSubtypeOptions = [
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
  UMMSURLSubtypeOptions = [
    ['Access Map Viewer', 'ACCESS MAP VIEWER'],
    ['Access Mobile App', 'ACCESS MOBILE APP'],
    ['Access Web Service', 'ACCESS WEB SERVICE'],
    ['Algorithm Theoretical Basis Document', 'ALGORITHM THEORETICAL BASIS DOCUMENT'],
    ['Calibration Data Documentation', 'CALIBRATION DATA DOCUMENTATION'],
    ['Case Study', 'CASE STUDY'],
    ['Data Quality', 'DATA QUALITY'],
    ['Data Usage', 'DATA USAGE'],
    ['Datacast URL', 'DATACAST URL'],
    ['Deliverables Checklist', 'DELIVERABLES CHECKLIST'],
    ['DIF', 'DIF'],
    ['Earthdata Search', 'EARTHDATA SEARCH'],
    ['ECHO', 'ECHO'],
    ['EDG', 'EDG'],
    ['EOSDIS Data Pool', 'EOSDIS DATA POOL'],
    ['GDS', 'GDS'],
    ['General Documentation', 'GENERAL DOCUMENTATION'],
    ['GIBS', 'GIBS'],
    ['Giovanni', 'GIOVANNI'],
    ['How To', 'HOW-TO'],
    ['KML', 'KML'],
    ['LAADS', 'LAADS'],
    ['LANCE', 'LANCE'],
    ['LAS', 'LAS'],
    ['Map Service', 'MAP SERVICE'],
    ['MAP', 'MAP'],
    ['Mirador', 'MIRADOR'],
    ['MODAPS', 'MODAPS'],
    ['NOAA Class', 'NOAA CLASS'],
    ['NOMADS', 'NOMADS'],
    ['On Line Archive', 'ON-LINE ARCHIVE'],
    ['Open Search', 'OpenSearch'],
    ['OPeNDAP Data (Dods)', 'OPENDAP DATA (DODS)'],
    ['OPeNDAP Data', 'OPENDAP DATA'],
    ['OPeNDAP Directory (Dods)', 'OPENDAP DIRECTORY (DODS)'],
    ['PI Documentation', 'PI DOCUMENTATION'],
    ['Processing History', 'PROCESSING HISTORY'],
    ['Product History', 'PRODUCT HISTORY'],
    ['Product Quality Assessment', 'PRODUCT QUALITY ASSESSMENT'],
    ['Product Usage', 'PRODUCT USAGE'],
    ['Production Version History', 'PRODUCTION VERSION HISTORY'],
    ['Publications', 'PUBLICATIONS'],
    ['Radiometric And Geometric Calibration Methods', 'RADIOMETRIC AND GEOMETRIC CALIBRATION METHODS'],
    ['Read Me', 'READ-ME'],
    ['Recipe', 'RECIPE'],
    ['Requirements And Design', 'REQUIREMENTS AND DESIGN'],
    ['Reverb', 'REVERB'],
    ['Science Data Product Software Documentation', 'SCIENCE DATA PRODUCT SOFTWARE DOCUMENTATION'],
    ['Science Data Product Validation', 'SCIENCE DATA PRODUCT VALIDATION'],
    ['SERF', 'SERF'],
    ['Software Package', 'SOFTWARE PACKAGE'],
    ['SSW', 'SSW'],
    ['Subsetter', 'SUBSETTER'],
    ['Threads Catalog', 'THREADS CATALOG'],
    ['Threads Data', 'THREADS DATA'],
    ['Thredds Directory', 'THREDDS DIRECTORY'],
    ['User Feedback', 'USER FEEDBACK'],
    ['Web Coverage Service (WCS)', 'WEB COVERAGE SERVICE (WCS)'],
    ['Web Feature Service (WFS)', 'WEB FEATURE SERVICE (WFS)'],
    ['Web Map For Time Series', 'WEB MAP FOR TIME SERIES'],
    ['Web Map Service (WMS)', 'WEB MAP SERVICE (WMS)'],
    ['Workflow (Service Chain)', 'WORKFLOW (SERVICE CHAIN)'],
    ["User's Guide", "USER'S GUIDE"]
  ]
  VerticalSpatialDomainTypeOptions = [
    ['Atmosphere Layer'],
    ['Maximum Altitude'],
    ['Maximum Depth'],
    ['Minimum Altitude'],
    ['Minimum Depth']
  ]

  SINGLE_FIELDSET_FORMS = %w(
    collection_information
    collection_citations
    data_centers
    data_contacts
    related_urls
  )

  def construct_keyword_string(hash_obj, str)
    # Assumes hash is passed in as ordered
    hash_obj.each do |_key, value|
      if value.is_a?(String)
        str << ' > ' unless str.blank?
        str = str << value
      else # Use tail recursion to construct the string found in the sub-hash
        str = construct_keyword_string(value, str)
      end
    end
    str
  end

  # Takes a html element name (draft_|metadata_lineage|_index_role) and
  # outputs a param name (draft[metadata_lineage][index][role])
  # Words that should keep their underscore should be wrapped in pipes, like "_|metadata_lineage|_"
  # For param elements that need to be an array (update_value[contact_information][related_urls][][url]), use two underscores in a row
  def name_to_param(name)
    # convert good words (wrapped in pipes) to dashes
    name.gsub!(/(_?)\|(\w+)\|(_?)/) { "#{Regexp.last_match[1]}#{Regexp.last_match[2].dasherize}#{Regexp.last_match[3]}" }

    # split words on underscores, wrap in brackets, and convert good words back to underscores
    name = name.split('_').map.with_index do |word, index|
      word = word.gsub(/(?<!new)index/, '').underscore
      if index == 0
        word
      else
        "[#{word}]"
      end
    end

    # join wrapped words
    name.join
  end

  def remove_pipes(string)
    string.delete('|')
  end

  def keyword_string(keywords)
    keywords.map { |_key, value| value }.join(' > ')
  end

  def options_for_subregion_select(country, value = nil)
    return nil unless country

    # TODO This is currently implemented to use the coded alias values as well for StateProvince.
    # The coded alias can be used for Country Names as well. We should attempt to use the coded values
    # for matching, as well as try and match various cases and use of periods

    options = country.subregions.map(&:name).sort
    options.unshift ['Select State/Province', '']
    if value && invalid_select_option(options, value)
      # there is an invalid selection
      if country.subregions.coded(value)
        # if the subregion (StateProvince) value matches a valid Carmen code/alias, save use the main value
        value = country.subregions.coded(value)
        disabled_options = nil
      else
        # append invalid disabled option
        options.unshift value
        disabled_options = value
      end
    end
    options_for_select(options, selected: value, disabled: disabled_options)
  end

  def short_name_header(draft_type)
    if draft_type == 'variable_draft'
      'Name'
    else
      'Short Name'
    end
  end

  def entry_title_header(draft_type)
    if draft_type == 'variable_draft'
      'Long Name'
    else
      'Entry Title'
    end
  end

  def titleize_form_name(form_name)
    return 'Related URLs' if form_name == 'related_urls'
    form_name.titleize
  end

  def horizontal_resolution_processing_level_selected(value)
    case value
    when 'Point' || 'Varies'
      'blah'
    when 'Non Gridded'
      'non-gridded-fields'
    when 'Non Gridded Range'
      'non-gridded-range-fields'
    when 'Gridded' || 'Not provided'
      'gridded-and-not-provided-fields'
    when 'Gridded Range'
      'gridded-range-fields'
    else
      nil
    end
  end
end
