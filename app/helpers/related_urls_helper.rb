module RelatedUrlsHelper
  # TODO: need to refactor the mappings
  url_content_type_map_for_umm_t = {
    'DistributionURL' => {
      'text' => 'Distribution URL',
      'types' => {
        'DOWNLOAD SOFTWARE' => {
          'text' => 'Download Software',
          'subtypes' => [
            ['Mobile App', 'MOBILE APP']
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
        }
      }
    }
  }

  related_url_content_type_map_for_umm_t = {
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
    'VisualizationURL' => {
      'text' => 'Visualization URL',
      'types' => {
        'BROWSE' => {
          'text' => 'Browse',
          'subtypes' => []
        },
        'GET RELATED VISUALIZATION' => {
          'text' => 'Get Related Visualization',
          'subtypes' => [
            ['Giovanni', 'GIOVANNI'],
            ['Map', 'MAP'],
            ['Worldview', 'WORLDVIEW']
          ]
        }
      }
    }
  }

  related_url_content_type_map_for_umm_s = {
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
            ['Giovanni', 'GIOVANNI'],
            ['Map', 'MAP']
          ]
        }
      }
    }
  }

  related_url_content_type_map = {
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
            ['Giovanni', 'GIOVANNI'],
            ['Map', 'MAP'],
            ['Worldview', 'WORLDVIEW']
          ]
        }
      }
    }
  }

  # TODO: need to verify if all these options are necessary if they get changed
  # by our coffee files through the mappings.
  UMMCRelatedURLContentTypeMap = related_url_content_type_map.deep_dup
  # UMM-S v1.1 added TOOL to GET SERVICE subtypes
  umm_s_related_url_content_type_map = related_url_content_type_map_for_umm_s.deep_dup
  umm_s_related_url_content_type_map['DistributionURL']['types']['GET SERVICE']['subtypes'] << ['Tool','TOOL']
  umm_s_related_url_content_type_map['DistributionURL']['types']['GET SERVICE']['subtypes'].sort!
  UMMSRelatedURLContentTypeMap = umm_s_related_url_content_type_map
  UMMTURLContentTypeMap = url_content_type_map_for_umm_t
  UMMTRelatedURLContentTypeMap = related_url_content_type_map_for_umm_t

  RelatedURLContentTypeOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Data Center URL', 'DataCenterURL'],
    ['Data Contact URL', 'DataContactURL'],
    ['Distribution URL', 'DistributionURL'],
    ['Publication URL', 'PublicationURL'],
    ['Visualization URL', 'VisualizationURL']
  ]
  UMMCRelatedURLContentTypeOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Distribution URL', 'DistributionURL'],
    ['Publication URL', 'PublicationURL'],
    ['Visualization URL', 'VisualizationURL']
  ]
  UMMTRelatedURLContentTypeOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Publication URL', 'PublicationURL'],
    ['Visualization URL', 'VisualizationURL']
  ]
  UMMTURLContentTypeOptions = [
    ['Distribution URL', 'DistributionURL']
  ]
  URLContentTypeDataCenterOptions = [
    ['Data Center URL', 'DataCenterURL']
  ]
  URLContentTypeDataContactOptions = [
    ['Data Contact URL', 'DataContactURL']
  ]

  UMMCRelatedURLTypeOptions = [
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
  UMMSRelatedURLTypeOptions = [
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
  UMMTRelatedURLTypeOptions = [
    ['Browse', 'BROWSE'],
    ['Data Set Landing Page', 'DATA SET LANDING PAGE'],
    ['Get Related Visualization', 'GET RELATED VISUALIZATION'],
    ['Extended Metadata', 'EXTENDED METADATA'],
    ['Professional Home Page', 'PROFESSIONAL HOME PAGE'],
    ['Project Home Page', 'PROJECT HOME PAGE'],
    ['View Related Information', 'VIEW RELATED INFORMATION']
  ]
  UMMTURLTypeOptions = [
    ['Download Software', 'DOWNLOAD SOFTWARE'],
    ['Goto Web Tool', 'GOTO WEB TOOL']
  ]
  URLTypeDataCenterOptions = [
    ['Home Page', 'HOME PAGE']
  ]

  UMMCRelatedURLSubtypeOptions = [
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
    ['Map', 'MAP'],
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
  UMMSRelatedURLSubtypeOptions = [
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
    ['Map', 'MAP'],
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
  UMMTRelatedURLSubtypeOptions = [
    ['Algorithm Documentation', 'ALGORITHM DOCUMENTATION'],
    ['Algorithm Theoretical Basis Document (ATBD)', 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)'],
    ['Anomalies', 'ANOMALIES'],
    ['Case Study', 'CASE STUDY'],
    ['Data Citation Policy', 'DATA CITATION POLICY'],
    ['Data Quality', 'DATA QUALITY'],
    ['Data Recipe', 'DATA RECIPE'],
    ['Deliverables Checklist', 'DELIVERABLES CHECKLIST'],
    ['General Documentation', 'GENERAL DOCUMENTATION'],
    ['Giovanni', 'GIOVANNI'],
    ['How To', 'HOW-TO'],
    ['Important Notice', 'IMPORTANT NOTICE'],
    ['Instrument/Sensor Calibration Documentation', 'INSTRUMENT/SENSOR CALIBRATION DOCUMENTATION'],
    ['Map', 'MAP'],
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
    ['Worldview', 'WORLDVIEW'],
    ["User's Guide", "USER'S GUIDE"]
  ]
  UMMTURLSubtypeOptions = [
    ['Live Access Server (LAS)', 'LIVE ACCESS SERVER (LAS)'],
    ['Map Viewer', 'MAP VIEWER'],
    ['Mobile App', 'MOBILE APP'],
    ['Simple Subset Wizard (SSW)', 'SIMPLE SUBSET WIZARD (SSW)'],
    ['Subsetter', 'SUBSETTER']
  ]
end
