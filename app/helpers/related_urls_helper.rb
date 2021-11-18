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

  # TODO: need to verify if all these options are necessary if they get changed
  # by our coffee files through the mappings.
  UMMTURLContentTypeMap = url_content_type_map_for_umm_t

  # for UMM-T v1.0 and UMM-S v1.4, Related URLs use the same mappings and enums.
  # When KMS has added Related URL Content Type as part of the Related URL
  # keywords provided, and UMM-T is updated to use KMS, then UMM-T and UMM-S
  # will both use KMS for Related URL mappings and enums
  UMMTRelatedURLContentTypeMap = related_url_content_type_map_for_umm_t

  RelatedURLContentTypeOptions = [
    ['Collection URL', 'CollectionURL'],
    ['Data Center URL', 'DataCenterURL'],
    ['Data Contact URL', 'DataContactURL'],
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
