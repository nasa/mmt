
def dif_id
  'C1200000031-SEDAC'
end

def iso_id
  'C1200000089-LARC'
end

def echo_id
  'C1200000040-SEDAC'
end

def iso_json_report
  {
    "format" => "application/iso:smap+xml",
    "1. -: /DS_Series/schemaLocation" => "http://www.isotc211.org/2005/gmi http://cdn.earthdata.nasa.gov/iso/schema/1.0/ISO19115-2_EOS.xsd",
    "2. -: /DS_Series/seriesMetadata/MI_Metadata/fileIdentifier/FileName" => "L4_SM_aup",
    "3. -: /DS_Series/seriesMetadata/MI_Metadata/characterSet/MD_CharacterSetCode" => "utf8",
    "4. -: /DS_Series/seriesMetadata/MI_Metadata/hierarchyLevel/MD_ScopeCode" => "series",
    "5. +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/attributeDescription" => nil,
    "6. +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/contentType" => nil,
    "7. +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/processingLevelCode/MD_Identifier/code/CharacterString" => "Not provided",
    "8. +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/processingLevelCode/MD_Identifier/codeSpace/CharacterString" => "gov.nasa.esdis.umm.processinglevelid",
    "9. -: /DS_Series/seriesMetadata/MI_Metadata/metadataStandardName/CharacterString" => "ISO 19115-2 Geographic information - Metadata - Part 2: Extensions for imagery and gridded data",
    "10. +: /DS_Series/seriesMetadata/MI_Metadata/dataQualityInfo/DQ_DataQuality/scope/DQ_Scope/level/MD_ScopeCode" => "series",
    "11. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/id" => "dba588298-ef6b-4e0f-9092-d1bfe87001ea",
    "12. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/identifier/MD_Identifier/code/CharacterString" => "Not provided",
    "13. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/identifier/MD_Identifier/codeSpace/CharacterString" => "gov.nasa.esdis.umm.platformshortname",
    "14. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/description/CharacterString" => "Not provided",
    "15. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/instrument/nilReason" => "inapplicable",
    "16. -: /DS_Series/seriesMetadata/MI_Metadata/metadataStandardVersion/CharacterString" => "ISO 19115-2:2009-02-15",
    "17. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[0]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "SMAP L4 Global 3-hourly 9 km Surface and Rootzone Soil Moisture Analysis Update"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "Date" => "2016-04-29"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, "edition" => {
              "CharacterString" => "Vv2010"
            }, "identifier" => [{
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SPL4SMAU"
                }, "codeSpace" => {
                  "CharacterString" => "http://gmao.gsfc.nasa.gov"
                }, "description" => {
                  "CharacterString" => "The ECS Short Name"
                }
              }
            }, {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "002"
                }, "codeSpace" => {
                  "CharacterString" => "gov.nasa.esdis"
                }, "description" => {
                  "CharacterString" => "The ECS Version ID"
                }
              }
            }, {
              "MD_Identifier" => {
                "code" => {
                  "Anchor" => "doi:10.5067/JJY2V0GJNFRZ"
                }, "codeSpace" => {
                  "CharacterString" => "gov.nasa.esdis"
                }, "description" => {
                  "CharacterString" => "A Digital Object Identifier (DOI) that provides a persistent interoperable means to locate the SMAP Level 4 Radar data product."
                }
              }
            }], "citedResponsibleParty" => [{
              "CI_ResponsibleParty" => {
                "organisationName" => {
                  "CharacterString" => "National Aeronautics and Space Administration"
                }, "role" => {
                  "CI_RoleCode" => "resourceProvider"
                }
              }
            }, {
              "CI_ResponsibleParty" => {
                "organisationName" => {
                  "CharacterString" => "Global Modeling and Assimilation Office"
                }, "role" => {
                  "CI_RoleCode" => "originator"
                }
              }
            }], "presentationForm" => {
              "CI_PresentationFormCode" => "documentDigital"
            }, "series" => {
              "CI_Series" => {
                "name" => {
                  "CharacterString" => "L4_SM"
                }
              }
            }, "otherCitationDetails" => {
              "CharacterString" => "The first Validated Release of the SMAP Level 4 Science Processing Software."
            }
          }
        }, "abstract" => {
          "CharacterString" => "The SMAP L4_SM data product provides global, 3-hourly surface and root zone soil moisture at 9 km resolution. The L4_SM data product consists of three Collections: geophysical, analysis update and land-model-constants."
        }, "purpose" => {
          "CharacterString" => "The SMAP L4_SM data product provides spatially and temporally complete surface and root zone soil moisture information for science and applications users."
        }, "credit" => {
          "CharacterString" => "The software that generates the L4_SM data product and the data system that automates its production were designed and implemented at the NASA Global Modeling and Assimilation Office, Goddard Space Flight Center, Greenbelt, Maryland, USA."
        }, "status" => {
          "MD_ProgressCode" => "onGoing"
        }, "pointOfContact" => {
          "CI_ResponsibleParty" => {
            "organisationName" => {
              "CharacterString" => "PVC"
            }, "role" => {
              "CI_RoleCode" => "distributor"
            }
          }
        }, "resourceMaintenance" => {
          "MD_MaintenanceInformation" => {
            "maintenanceAndUpdateFrequency" => {
              "MD_MaintenanceFrequencyCode" => "As Needed"
            }, "dateOfNextUpdate" => {
              "Date" => "2016-11-01"
            }, "updateScope" => {
              "MD_ScopeCode" => "series"
            }
          }
        }, "resourceFormat" => {
          "MD_Format" => {
            "name" => {
              "CharacterString" => "HDF5"
            }, "version" => {
              "CharacterString" => "Version 1.8.9"
            }
          }
        }, "descriptiveKeywords" => [{
          "MD_Keywords" => {
            "keyword" => [{
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT"
            }, {
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT > NONE > NONE > SURFACE SOIL MOISTURE"
            }, {
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT > NONE > NONE > ROOT ZONE SOIL MOISTURE"
            }], "type" => {
              "MD_KeywordTypeCode" => "theme"
            }, "thesaurusName" => {
              "CI_Citation" => {
                "title" => {
                  "CharacterString" => "NASA/GCMD Earth Science Keywords"
                }, "date" => {
                  "gco:nilReason" => "missing"
                }
              }
            }
          }
        }, {
          "MD_Keywords" => {
            "keyword" => {
              "CharacterString" => "Earth Remote Sensing Instruments > Active Remote Sensing > NONE > SMAP L-BAND RADAR > SMAP L-Band Radar"
            }, "type" => {
              "MD_KeywordTypeCode" => "theme"
            }, "thesaurusName" => {
              "CI_Citation" => {
                "title" => {
                  "CharacterString" => "NASA/GCMD Earth Science Keywords"
                }, "date" => {
                  "gco:nilReason" => "missing"
                }
              }
            }
          }
        }, {
          "MD_Keywords" => {
            "keyword" => {
              "CharacterString" => "Earth Observation Satellites > NASA Decadal Survey > SMAP > Soil Moisture Active and Passive Observatory"
            }, "type" => {
              "MD_KeywordTypeCode" => "theme"
            }, "thesaurusName" => {
              "CI_Citation" => {
                "title" => {
                  "CharacterString" => "NASA/GCMD Earth Science Keywords"
                }, "date" => {
                  "gco:nilReason" => "missing"
                }
              }
            }
          }
        }, {
          "MD_Keywords" => {
            "keyword" => {
              "CharacterString" => "GEOGRAPHIC REGION > GLOBAL"
            }, "type" => {
              "MD_KeywordTypeCode" => "theme"
            }, "thesaurusName" => {
              "CI_Citation" => {
                "title" => {
                  "CharacterString" => "NASA/GCMD Earth Science Keywords"
                }, "date" => {
                  "gco:nilReason" => "missing"
                }
              }
            }
          }
        }], "aggregationInfo" => {
          "MD_AggregateInformation" => {
            "aggregateDataSetIdentifier" => {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SMAP"
                }
              }
            }, "associationType" => {
              "DS_AssociationTypeCode" => "largerWorkCitation"
            }, "initiativeType" => {
              "DS_InitiativeTypeCode" => "mission"
            }
          }
        }, "language" => {
          "CharacterString" => "eng"
        }, "characterSet" => {
          "MD_CharacterSetCode" => "utf8"
        }, "topicCategory" => {
          "MD_TopicCategoryCode" => "geoscientificInformation"
        }, "environmentDescription" => {
          "CharacterString" => "Data product generated by the SMAP mission in HDF5 format with metadata that conforms to the ISO 19115 model."
        }, "extent" => {
          "EX_Extent" => {
            "description" => {
              "CharacterString" => "Global land excluding inland water and permanent ice."
            }, "geographicElement" => {
              "EX_GeographicBoundingBox" => {
                "extentTypeCode" => {
                  "Boolean" => "1"
                }, "westBoundLongitude" => {
                  "Decimal" => "-180"
                }, "eastBoundLongitude" => {
                  "Decimal" => "180"
                }, "southBoundLatitude" => {
                  "Decimal" => "-85.04456"
                }, "northBoundLatitude" => {
                  "Decimal" => "85.04456"
                }
              }
            }, "temporalElement" => {
              "EX_TemporalExtent" => {
                "extent" => {
                  "TimePeriod" => {
                    "gml:id" => "swathTemporalExtent", "beginPosition" => "2015-03-31T01:30:00.000Z", "endPosition" => "2021-01-01T01:29:59.999Z"
                  }
                }
              }
            }
          }
        }
      }
    },
    "18. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[1]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "Soil Moisture Active Passive Mission Level 4 Surface and Root Zone Soil Moisture (L4_SM) Product Specification Document"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "Date" => "2015-10-31"
                }, "dateType" => {
                  "CI_DateTypeCode" => "publication"
                }
              }
            }, "edition" => {
              "CharacterString" => "1.4"
            }, "identifier" => {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "L4_SM"
                }, "codeSpace" => {
                  "CharacterString" => "http://gmao.gsfc.nasa.gov"
                }, "description" => {
                  "CharacterString" => "A short name used by the Soil Moisture Active Passive (SMAP) mission to identify the Level 4 Radar product."
                }
              }
            }, "presentationForm" => {
              "CI_PresentationFormCode" => "documentDigital"
            }, "series" => {
              "CI_Series" => {
                "name" => {
                  "CharacterString" => "L4_SM"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "The SMAP L4_SM data product provides global, 3-hourly surface and root zone soil moisture at 9 km resolution. The L4_SM data product consists of three Collections: geophysical, analysis update and land-model-constants."
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "19. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[2]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "DataSetId"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-12T11:50:19.050Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "DataSetId"
        }, "aggregationInfo" => {
          "MD_AggregateInformation" => {
            "aggregateDataSetIdentifier" => {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SMAP L4 Global 3-hourly 9 km Surface and Rootzone Soil Moisture Analysis Update V002"
                }
              }
            }, "associationType" => nil
          }
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "20. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[3]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "InsertTime"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-08T09:16:24.835Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "creation"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "InsertTime"
        }, "purpose" => {
          "CharacterString" => "InsertTime"
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "21. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[4]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "UpdateTime"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-12T11:50:19.050Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "UpdateTime"
        }, "purpose" => {
          "CharacterString" => "UpdateTime"
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "22. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[5]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "DIFID"
            }, "date" => {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-12T11:50:19.050Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, "identifier" => {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SPL4SMAU"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "DIFID"
        }, "purpose" => {
          "CharacterString" => "DIFID"
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "23. +: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[0]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "SMAP L4 Global 3-hourly 9 km Surface and Rootzone Soil Moisture Analysis Update"
            }, "date" => [{
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-04-29T00:00:00.000Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-12T11:50:19.050Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-08T09:16:24.835Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "creation"
                }
              }
            }], "edition" => {
              "CharacterString" => "Vv2010"
            }, "identifier" => [{
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SPL4SMAU"
                }, "description" => {
                  "CharacterString" => "The ECS Short Name"
                }
              }
            }, {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "002"
                }, "description" => {
                  "CharacterString" => "The ECS Version ID"
                }
              }
            }, {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "doi:10.5067/JJY2V0GJNFRZ"
                }, "codeSpace" => {
                  "CharacterString" => "gov.nasa.esdis.umm.doi"
                }, "description" => {
                  "CharacterString" => "DOI"
                }
              }
            }], "presentationForm" => {
              "CI_PresentationFormCode" => "documentDigital"
            }, "series" => {
              "CI_Series" => {
                "name" => {
                  "CharacterString" => "L4_SM"
                }
              }
            }, "otherCitationDetails" => {
              "CharacterString" => "The first Validated Release of the SMAP Level 4 Science Processing Software."
            }
          }
        }, "abstract" => {
          "CharacterString" => "The SMAP L4_SM data product provides global, 3-hourly surface and root zone soil moisture at 9 km resolution. The L4_SM data product consists of three Collections: geophysical, analysis update and land-model-constants."
        }, "purpose" => {
          "gco:nilReason" => "missing", "CharacterString" => "The SMAP L4_SM data product provides spatially and temporally complete surface and root zone soil moisture information for science and applications users."
        }, "status" => {
          "MD_ProgressCode" => "onGoing"
        }, "pointOfContact" => {
          "CI_ResponsibleParty" => {
            "organisationName" => {
              "CharacterString" => "PVC"
            }, "role" => {
              "CI_RoleCode" => "distributor"
            }
          }
        }, "descriptiveKeywords" => [{
          "MD_Keywords" => {
            "keyword" => [{
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT > NONE > NONE > NONE"
            }, {
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT > NONE > NONE > SURFACE SOIL MOISTURE"
            }, {
              "CharacterString" => "EARTH SCIENCE > LAND SURFACE > SOILS > SOIL MOISTURE/WATER CONTENT > NONE > NONE > ROOT ZONE SOIL MOISTURE"
            }], "type" => {
              "MD_KeywordTypeCode" => "theme"
            }, "thesaurusName" => {
              "gco:nilReason" => "unknown"
            }
          }
        }, {
          "MD_Keywords" => {
            "keyword" => {
              "CharacterString" => "Aircraft > Not provided > Not provided > "
            }
          }
        }], "language" => {
          "CharacterString" => "eng"
        }, "topicCategory" => {
          "MD_TopicCategoryCode" => "geoscientificInformation"
        }, "extent" => {
          "EX_Extent" => {
            "geographicElement" => {
              "EX_GeographicBoundingBox" => {
                "extentTypeCode" => {
                  "Boolean" => "1"
                }, "westBoundLongitude" => {
                  "Decimal" => "-180.0"
                }, "eastBoundLongitude" => {
                  "Decimal" => "180.0"
                }, "southBoundLatitude" => {
                  "Decimal" => "-85.04456"
                }, "northBoundLatitude" => {
                  "Decimal" => "85.04456"
                }
              }
            }, "temporalElement" => {
              "EX_TemporalExtent" => {
                "extent" => {
                  "TimePeriod" => {
                    "gml:id" => "dc46625fa-ae1e-4c95-a6ae-b15dd90fe8d3", "beginPosition" => "2015-03-31T01:30:00.000Z", "endPosition" => "2021-01-01T01:29:59.999Z"
                  }
                }
              }
            }
          }
        }, "processingLevel" => {
          "MD_Identifier" => {
            "code" => {
              "CharacterString" => "Not provided"
            }, "codeSpace" => {
              "CharacterString" => "gov.nasa.esdis.umm.processinglevelid"
            }
          }
        }
      }
    },
    "24. +: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[1]" => {
      "MD_DataIdentification" => {
        "citation" => {
          "CI_Citation" => {
            "title" => {
              "CharacterString" => "DataSetId"
            }, "date" => [{
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-04-29T00:00:00.000Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-12T11:50:19.050Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "revision"
                }
              }
            }, {
              "CI_Date" => {
                "date" => {
                  "DateTime" => "2016-09-08T09:16:24.835Z"
                }, "dateType" => {
                  "CI_DateTypeCode" => "creation"
                }
              }
            }], "citedResponsibleParty" => {
              "CI_ResponsibleParty" => {
                "organisationName" => {
                  "CharacterString" => "Global Modeling and Assimilation Office"
                }, "role" => {
                  "CI_RoleCode" => "originator"
                }
              }
            }
          }
        }, "abstract" => {
          "CharacterString" => "DataSetId"
        }, "resourceFormat" => {
          "MD_Format" => {
            "name" => {
              "CharacterString" => "HDF5"
            }, "version" => {
              "gco:nilReason" => "unknown"
            }
          }
        }, "aggregationInfo" => {
          "MD_AggregateInformation" => {
            "aggregateDataSetIdentifier" => {
              "MD_Identifier" => {
                "code" => {
                  "CharacterString" => "SMAP L4 Global 3-hourly 9 km Surface and Rootzone Soil Moisture Analysis Update V002"
                }
              }
            }, "associationType" => {
              "DS_AssociationTypeCode" => "largerWorkCitation"
            }
          }
        }, "language" => {
          "CharacterString" => "eng"
        }
      }
    },
    "25. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/organisationName/CharacterString" => "NSIDC DAAC > National Snow and Ice Data Center DAAC", "26. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/contactInfo/CI_Contact/address/CI_Address/electronicMailAddress/CharacterString" => "nsidc@nsidc.org", "27. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/contactInfo/CI_Contact/onlineResource/CI_OnlineResource/linkage/URL" => "http://nsidc.org/daac/", "28. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/role/CI_RoleCode" => "pointOfContact", "29. +: /DS_Series/seriesMetadata/MI_Metadata/contact/href" => "#alaskaSARContact", "30. -: /DS_Series/seriesMetadata/MI_Metadata/dateStamp/Date" => "2016-04-29", "31. +: /DS_Series/seriesMetadata/MI_Metadata/dateStamp/Date" => "2013-01-02"
  }
end

def dif_json_report
  {
  "format" => "application/dif10+xml",
  "1. -: /DIF/Temporal_Coverage/Temporal_Range_Type" => "Long Range",
  "2. -: /DIF/Related_URL[1]" => {
    "URL_Content_Type" => {
      "Type" => "VIEW DATA SET LANDING PAGE"
    }, "URL" => "http://dx.doi.org/10.7927/H4NK3BZJ", "Description" => "data set DOI and homepage"
  },
  "3. +: /DIF/Related_URL[1]" => {
    "URL_Content_Type" => {
      "Type" => "DATA SET LANDING PAGE"
    }, "URL" => "http://dx.doi.org/10.7927/H4NK3BZJ", "Description" => "data set DOI and homepage"
  }
}
end

def echo_json_report
  {
  "format" => "application/echo10+xml",
  "1. -: /Collection/Orderable" => "true",
  "2. -: /Collection/Visible" => "true",
  "3. -: /Collection/MaintenanceAndUpdateFrequency" => "As needed",
  "4. +: /Collection/Temporal/EndsAtPresentFlag" => "false",
  "5. +: /Collection/Temporal/RangeDateTime/BeginningDateTime" => "1970-01-01T00:00:00.000Z",
  "6. +: /Collection/Platforms/Platform/ShortName" => "Not provided",
  "7. +: /Collection/Platforms/Platform/LongName" => "Not provided",
  "8. +: /Collection/Platforms/Platform/Type" => "Not provided",
  "9. -: /Collection/AssociatedDIFs/DIF/EntryId" => "CIESIN_SEDAC_ANTHROMES_v2_1700",
  "10. -: /Collection/InsertTime" => "2014-05-13T00:00:00Z",
  "11. +: /Collection/InsertTime" => "2014-05-13T00:00:00.000Z",
  "12. -: /Collection/LastUpdate" => "2015-08-04T00:00:00Z",
  "13. +: /Collection/LastUpdate" => "2015-08-04T00:00:00.000Z",
  "14. -: /Collection/LongName" => "Anthropogenic Biomes of the World, Version 2: 1700",
  "15. +: /Collection/LongName" => "Not provided",
  "16. -: /Collection/CollectionState" => "Final",
  "17. +: /Collection/CollectionState" => "NOT PROVIDED",
  "18. -: /Collection/Price" => "0",
  "19. +: /Collection/Price" => "     0.00",
  "20. -: /Collection/SpatialKeywords/Keyword[0]" => "Africa",
  "21. -: /Collection/SpatialKeywords/Keyword[1]" => "Asia",
  "22. +: /Collection/SpatialKeywords/Keyword[0]" => "AFRICA",
  "23. +: /Collection/SpatialKeywords/Keyword[1]" => "GAZA STRIP",
  "24. -: /Collection/Contacts/Contact[0]" => {
    "Role" => "Archive", "HoursOfService" => "9:00 A.M. to 5:00 P.M., Monday to Friday", "OrganizationName" => "Socioeconomic Data and Applications Center (SEDAC)", "OrganizationAddresses" => {
      "Address" => {
        "StreetAddress" => "CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000", "City" => "Palisades", "StateProvince" => "NY", "PostalCode" => "10964", "Country" => "USA"
      }
    }, "OrganizationPhones" => {
      "Phone" => [{
        "Number" => "+1 845-365-8920",
        "Type" => "Telephone"
      }, {
        "Number" => "+1 845-365-8922",
        "Type" => "Fax"
      }]
    }, "OrganizationEmails" => {
      "Email" => "ciesin.info@ciesin.columbia.edu"
    }, "ContactPersons" => {
      "ContactPerson" => {
        "FirstName" => "SEDAC", "MiddleName" => "User", "LastName" => "Services"
      }
    }
  },
  "25. +: /Collection/Contacts/Contact[0]" => {
    "Role" => "PROCESSOR", "OrganizationName" => "SEDAC"
  },
  "26. +: /Collection/Contacts/Contact[1]" => {
    "Role" => "ARCHIVER", "OrganizationName" => "SEDAC"
  },
  "27. +: /Collection/Contacts/Contact[2]" => {
    "Role" => "ARCHIVER", "HoursOfService" => "9:00 A.M. to 5:00 P.M., Monday to Friday", "OrganizationName" => "Socioeconomic Data and Applications Center (SEDAC)", "OrganizationAddresses" => {
      "Address" => {
        "StreetAddress" => "CIESIN, Columbia University, 61 Route 9W, P.O. Box 1000", "City" => "Palisades", "StateProvince" => "NY", "PostalCode" => "10964", "Country" => "USA"
      }
    }, "OrganizationPhones" => {
      "Phone" => [{
        "Number" => "+1 845-365-8920",
        "Type" => "Telephone"
      }, {
        "Number" => "+1 845-365-8922",
        "Type" => "Fax"
      }]
    }, "OrganizationEmails" => {
      "Email" => "ciesin.info@ciesin.columbia.edu"
    }, "ContactPersons" => {
      "ContactPerson" => {
        "FirstName" => "SEDAC", "MiddleName" => "User", "LastName" => "Services", "JobPosition" => "TECHNICAL CONTACT"
      }
    }
  },
  "28. -: /Collection/SpatialInfo/SpatialCoverageType" => "Horizontal",
  "29. +: /Collection/SpatialInfo/SpatialCoverageType" => "HORIZONTAL",
  "30. -: /Collection/OnlineResources/OnlineResource/Type" => "DOI URL",
  "31. +: /Collection/OnlineResources/OnlineResource/Type" => "CollectionURL : DATA SET LANDING PAGE",
  "32. -: /Collection/Spatial/SpatialCoverageType" => "Horizontal",
  "33. +: /Collection/Spatial/SpatialCoverageType" => "HORIZONTAL",
  "34. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/WestBoundingCoordinate" => "-180.000000",
  "35. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/WestBoundingCoordinate" => "-180.0",
  "36. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/NorthBoundingCoordinate" => "90.000000",
  "37. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/NorthBoundingCoordinate" => "90.0",
  "38. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/EastBoundingCoordinate" => "180.000000",
  "39. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/EastBoundingCoordinate" => "180.0",
  "40. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/SouthBoundingCoordinate" => "-90.000000",
  "41. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/SouthBoundingCoordinate" => "-90.0"
}
end

def iso_text_report
  'application/iso:smap+xml

  1.  -: /DS_Series/schemaLocation
  2.  -: /DS_Series/seriesMetadata/MI_Metadata/fileIdentifier/FileName
  3.  -: /DS_Series/seriesMetadata/MI_Metadata/characterSet/MD_CharacterSetCode
  4.  -: /DS_Series/seriesMetadata/MI_Metadata/hierarchyLevel/MD_ScopeCode
  5.  +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/attributeDescription
  6.  +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/contentType
  7.  +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/processingLevelCode/MD_Identifier/code/CharacterString
  8.  +: /DS_Series/seriesMetadata/MI_Metadata/contentInfo/MD_ImageDescription/processingLevelCode/MD_Identifier/codeSpace/CharacterString
  9.  -: /DS_Series/seriesMetadata/MI_Metadata/metadataStandardName/CharacterString
  10. +: /DS_Series/seriesMetadata/MI_Metadata/dataQualityInfo/DQ_DataQuality/scope/DQ_Scope/level/MD_ScopeCode
  11. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/id
  12. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/identifier/MD_Identifier/code/CharacterString
  13. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/identifier/MD_Identifier/codeSpace/CharacterString
  14. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/description/CharacterString
  15. +: /DS_Series/seriesMetadata/MI_Metadata/acquisitionInformation/MI_AcquisitionInformation/platform/EOS_Platform/instrument/nilReason
  16. -: /DS_Series/seriesMetadata/MI_Metadata/metadataStandardVersion/CharacterString
  17. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[0]
  18. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[1]
  19. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[2]
  20. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[3]
  21. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[4]
  22. -: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[5]
  23. +: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[0]
  24. +: /DS_Series/seriesMetadata/MI_Metadata/identificationInfo[1]
  25. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/organisationName/CharacterString
  26. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/contactInfo/CI_Contact/address/CI_Address/electronicMailAddress/CharacterString
  27. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/contactInfo/CI_Contact/onlineResource/CI_OnlineResource/linkage/URL
  28. -: /DS_Series/seriesMetadata/MI_Metadata/contact/CI_ResponsibleParty/role/CI_RoleCode
  29. +: /DS_Series/seriesMetadata/MI_Metadata/contact/href
  30. -: /DS_Series/seriesMetadata/MI_Metadata/dateStamp/Date
  31. +: /DS_Series/seriesMetadata/MI_Metadata/dateStamp/Date'
end

def echo_text_report
  'application/echo10+xml

  1.  -: /Collection/Orderable
  2.  -: /Collection/Visible
  3.  -: /Collection/MaintenanceAndUpdateFrequency
  4.  +: /Collection/Temporal/EndsAtPresentFlag
  5.  +: /Collection/Temporal/RangeDateTime/BeginningDateTime
  6.  +: /Collection/Platforms/Platform/ShortName
  7.  +: /Collection/Platforms/Platform/LongName
  8.  +: /Collection/Platforms/Platform/Type
  9.  -: /Collection/AssociatedDIFs/DIF/EntryId
  10. -: /Collection/InsertTime
  11. +: /Collection/InsertTime
  12. -: /Collection/LastUpdate
  13. +: /Collection/LastUpdate
  14. -: /Collection/LongName
  15. +: /Collection/LongName
  16. -: /Collection/CollectionState
  17. +: /Collection/CollectionState
  18. -: /Collection/Price
  19. +: /Collection/Price
  20. -: /Collection/SpatialKeywords/Keyword[0]
  21. -: /Collection/SpatialKeywords/Keyword[1]
  22. +: /Collection/SpatialKeywords/Keyword[0]
  23. +: /Collection/SpatialKeywords/Keyword[1]
  24. -: /Collection/Contacts/Contact[0]
  25. +: /Collection/Contacts/Contact[0]
  26. +: /Collection/Contacts/Contact[1]
  27. +: /Collection/Contacts/Contact[2]
  28. -: /Collection/SpatialInfo/SpatialCoverageType
  29. +: /Collection/SpatialInfo/SpatialCoverageType
  30. -: /Collection/OnlineResources/OnlineResource/Type
  31. +: /Collection/OnlineResources/OnlineResource/Type
  32. -: /Collection/Spatial/SpatialCoverageType
  33. +: /Collection/Spatial/SpatialCoverageType
  34. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/WestBoundingCoordinate
  35. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/WestBoundingCoordinate
  36. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/NorthBoundingCoordinate
  37. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/NorthBoundingCoordinate
  38. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/EastBoundingCoordinate
  39. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/EastBoundingCoordinate
  40. -: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/SouthBoundingCoordinate
  41. +: /Collection/Spatial/HorizontalSpatialDomain/Geometry/BoundingRectangle/SouthBoundingCoordinate'
end

def dif_text_report
  'application/dif10+xml

  1.  -: /DIF/Temporal_Coverage/Temporal_Range_Type
  2.  -: /DIF/Related_URL[1]
  3.  +: /DIF/Related_URL[1]'
end
