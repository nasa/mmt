const ummCSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UMM-C',
  type: 'object',
  additionalProperties: false,
  properties: {
    MetadataLanguage: {
      description: 'The language used in the metadata record.',
      $ref: '#/definitions/LanguageType'
    },
    MetadataDates: {
      description: 'Dates related to activities involving the metadata record itself.  For example, Future Review date is the date that the metadata record is scheduled to be reviewed.',
      type: 'array',
      items: {
        $ref: '#/definitions/DateType'
      },
      minItems: 1
    },
    DirectoryNames: {
      description: 'Formerly called Internal Directory Name (IDN) Node (IDN_Node). This element has been used historically by the GCMD internally to identify association, responsibility and/or ownership of the dataset, service or supplemental information. Note: This field only occurs in the DIF. When a DIF record is retrieved in the ECHO10 or ISO 19115 formats, this element will not be translated. The controlled vocabulary for directory names is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: '#/definitions/DirectoryNameType'
      },
      minItems: 1
    },
    EntryTitle: {
      description: 'The title of the collection or service described by the metadata.',
      $ref: '#/definitions/EntryTitleType'
    },
    DOI: {
      description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. For those that want to specify that a DOI is not applicable or unknown use the second option.",
      $ref: '#/definitions/DoiType'
    },
    OtherIdentifiers: {
      description: 'Provides additional or provider defined identifiers of the collection.',
      type: 'array',
      items: {
        $ref: '#/definitions/OtherIdentifierType'
      },
      minItems: 1
    },
    FileNamingConvention: {
      description: "The File Naming Convention refers to the naming convention of the data set's (Collection's) data files along with a description of the granule file construction.",
      $ref: '#/definitions/FileNamingConventionType'
    },
    AssociatedDOIs: {
      description: "This element stores DOIs that are associated with the collection such as from campaigns and other related sources. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.",
      type: 'array',
      items: {
        $ref: '#/definitions/AssociatedDoiType'
      },
      minItems: 1
    },
    Abstract: {
      description: 'A brief description of the collection or service the metadata represents.',
      $ref: '#/definitions/AbstractType'
    },
    Purpose: {
      description: 'Suggested usage or purpose for the collection data or service.',
      $ref: '#/definitions/PurposeType'
    },
    DataLanguage: {
      description: 'Describes the language used in the preparation, storage, and description of the collection. It is the language of the collection data themselves.   It does not refer to the language used in the metadata record (although this may be the same language).',
      $ref: '#/definitions/LanguageType'
    },
    DataDates: {
      description: 'Dates related to activities involving the collection data.  For example, Creation date is the date that the collection data first entered the data archive system.',
      type: 'array',
      items: {
        $ref: '#/definitions/DateType'
      },
      minItems: 1
    },
    DataCenters: {
      description: 'Information about the data centers responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: '#/definitions/DataCenterType'
      },
      minItems: 1
    },
    ContactGroups: {
      description: 'Information about the personnel groups responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactGroupType'
      }
    },
    ContactPersons: {
      description: 'Information about the personnel responsible for this collection and its metadata.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactPersonType'
      }
    },
    CollectionDataType: {
      description: "This element is used to identify the collection's ready for end user consumption latency from when the data was acquired by an instrument. NEAR_REAL_TIME is defined to be ready for end user consumption 1 to 3 hours after data acquisition. LOW_LATENCY is defined to be ready for consumption 3 to 24 hours after data acquisition. EXPEDITED is defined to be 1 to 4 days after data acquisition. SCIENCE_QUALITY is defined to mean that a collection has been fully and completely processed which usually takes between 2 to 3 weeks after data acquisition. OTHER is defined for collection where the latency is between EXPEDITED and SCIENCE_QUALITY.",
      $ref: '#/definitions/CollectionDataTypeEnum'
    },
    StandardProduct: {
      description: 'This element is reserved for NASA records only. A Standard Product is a product that has been vetted to ensure that they are complete, consistent, maintain integrity, and satifies the goals of the Earth Observing System mission. The NASA product owners have also commmitted to archiving and maintaining the data products. More information can be found here: https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-standard-products.',
      type: 'boolean'
    },
    ProcessingLevel: {
      description: 'The identifier for the processing level of the collection (e.g., Level0, Level1A).',
      $ref: '#/definitions/ProcessingLevelType'
    },
    CollectionCitations: {
      description: 'Information required to properly cite the collection in professional scientific literature. This element provides information for constructing a citation for the item itself, and is not designed for listing bibliographic references of scientific research articles arising from search results. A list of references related to the research results should be in the Publication Reference element.',
      type: 'array',
      items: {
        $ref: '#/definitions/ResourceCitationType'
      },
      minItems: 1
    },
    CollectionProgress: {
      description: 'This element describes the production status of the data set. There are five choices for Data Providers: PLANNED refers to data sets to be collected in the future and are thus unavailable at the present time. For Example: The Hydro spacecraft has not been launched, but information on planned data sets may be available. ACTIVE refers to data sets currently in production or data that is continuously being collected or updated. For Example: data from the AIRS instrument on Aqua is being collected continuously. COMPLETE refers to data sets in which no updates or further data collection will be made. For Example: Nimbus-7 SMMR data collection has been completed. DEPRECATED refers to data sets that have been retired, but still can be retrieved. Usually newer products exist that replace the retired data set. NOT APPLICABLE refers to data sets in which a collection progress is not applicable such as a calibration collection. There is a sixth value of NOT PROVIDED that should not be used by a data provider. It is currently being used as a value when a correct translation cannot be done with the current valid values, or when the value is not provided by the data provider.',
      $ref: '#/definitions/CollectionProgressEnum'
    },
    DataMaturity: {
      description: "The Data Maturity element is used to inform users on where the collection is in a collection's life cycle.",
      type: 'string',
      enum: [
        'Beta',
        'Provisional',
        'Validated',
        'Stage 1 Validation',
        'Stage 2 Validation',
        'Stage 3 Validation',
        'Stage 4 Validation'
      ]
    },
    Quality: {
      description: 'Free text description of the quality of the collection data.  Description may include: 1) succinct description of the quality of data in the collection; 2) Any quality assurance procedures followed in producing the data in the collection; 3) indicators of collection quality or quality flags - both validated or invalidated; 4) recognized or potential problems with quality; 5) established quality control mechanisms; and 6) established quantitative quality measurements.',
      $ref: '#/definitions/QualityType'
    },
    UseConstraints: {
      description: 'Designed to protect privacy and/or intellectual property by allowing the author to specify how the collection may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness. Note: Use Constraints describe how the item may be used once access has been granted; and is distinct from Access Constraints, which refers to any constraints in accessing the item.',
      $ref: '#/definitions/UseConstraintsType'
    },
    AccessConstraints: {
      description: "Allows the author to constrain access to the collection. This includes any special restrictions, legal prerequisites, limitations and/or warnings on obtaining collection data. Some words that may be used in this element's value include: Public, In-house, Limited, None. The value field is used for special ACL rules (Access Control Lists (http://en.wikipedia.org/wiki/Access_control_list)). For example it can be used to hide metadata when it isn't ready for public consumption.",
      $ref: '#/definitions/AccessConstraintsType'
    },
    ArchiveAndDistributionInformation: {
      description: 'This element and all of its sub elements exist for display purposes. It allows a data provider to provide archive and distribution information up front to an end user, to help them decide if they can use the product.',
      $ref: '#/definitions/ArchiveAndDistributionInformationType'
    },
    DirectDistributionInformation: {
      description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
      $ref: '#/definitions/DirectDistributionInformationType'
    },
    PublicationReferences: {
      description: 'Describes key bibliographic citations pertaining to the collection.',
      type: 'array',
      items: {
        $ref: '#/definitions/PublicationReferenceType'
      },
      minItems: 1
    },
    ISOTopicCategories: {
      description: 'Identifies the topic categories from the EN ISO 19115-1:2014 Geographic Information – Metadata – Part 1: Fundamentals (http://www.isotc211.org/) Topic Category Code List that pertain to this collection, based on the Science Keywords associated with the collection. An ISO Topic Category is a high-level thematic classification to assist in the grouping of and search for available collections. The controlled vocabulary for ISO topic categories is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
        maxLength: 4000
      },
      minItems: 1
    },
    ScienceKeywords: {
      description: 'Controlled Science Keywords describing the collection.  The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: '#/definitions/ScienceKeywordType'
      },
      minItems: 1
    },
    AncillaryKeywords: {
      description: 'Allows authors to provide words or phrases outside of the controlled Science Keyword vocabulary, to further describe the collection.',
      type: 'array',
      items: {
        $ref: '#/definitions/AncillaryKeywordStringType'
      },
      minItems: 1
    },
    AdditionalAttributes: {
      description: 'The data’s distinctive attributes of the collection (i.e. attributes used to describe the unique characteristics of the collection which extend beyond those defined).',
      type: 'array',
      items: {
        $ref: '#/definitions/AdditionalAttributeType'
      },
      minItems: 1
    },
    MetadataAssociations: {
      description: 'This element is used to identify other services, collections, visualizations, granules, and other metadata types and resources that are associated with or dependent on the data described by the metadata. This element is also used to identify a parent metadata record if it exists. This usage should be reserved for instances where a group of metadata records are subsets that can be better represented by one parent metadata record, which describes the entire set. In some instances, a child may point to more than one parent. The EntryId is the same as the element described elsewhere in this document where it contains an ID and Version.',
      type: 'array',
      items: {
        $ref: '#/definitions/MetadataAssociationType'
      },
      minItems: 1
    },
    TemporalExtents: {
      description: 'This class contains attributes which describe the temporal range of a specific collection. Temporal Extent includes a specification of the Temporal Range Type of the collection, which is one of Range Date Time, Single Date Time, or Periodic Date Time',
      type: 'array',
      items: {
        $ref: '#/definitions/TemporalExtentType'
      },
      minItems: 1
    },
    PaleoTemporalCoverages: {
      description: 'For paleoclimate or geologic data, PaleoTemporalCoverage is the length of time represented by the data collected. PaleoTemporalCoverage should be used when the data spans time frames earlier than yyyy-mm-dd = 0001-01-01.',
      type: 'array',
      items: {
        $ref: '#/definitions/PaleoTemporalCoverageType'
      },
      minItems: 1
    },
    TemporalKeywords: {
      description: 'One or more words or phrases that describe the temporal resolution of the dataset.',
      type: 'array',
      items: {
        $ref: '#/definitions/KeywordStringType'
      },
      minItems: 1
    },
    SpatialExtent: {
      $ref: '#/definitions/SpatialExtentType'
    },
    TilingIdentificationSystems: {
      description: 'A listing of two-dimensional tiling systems for a collection. These were previously called TwoDCoordinateSystems.',
      type: 'array',
      items: {
        $ref: '#/definitions/TilingIdentificationSystemType'
      },
      minItems: 1
    },
    SpatialInformation: {
      description: 'The reference frame or system in which altitudes (elevations) are given. The information contains the datum name, distance units and encoding method, which provide the definition for the system. This field also stores the characteristics of the reference frame or system from which depths are measured. The additional information in the field is geometry reference data etc.',
      $ref: '#/definitions/SpatialInformationType'
    },
    SpatialKeywords: {
      description: 'This is deprecated and will be removed. Use LocationKeywords instead. Controlled hierarchical keywords used to specify the spatial location of the collection.   The controlled vocabulary for spatial keywords is maintained in the Keyword Management System (KMS).  The Spatial Keyword hierarchy includes one or more of the following layers: Location_Category (e.g., Continent), Location_Type (e.g. Africa), Location_Subregion1 (e.g., Central Africa), Location_Subregion2 (e.g., Cameroon), and Location_Subregion3.',
      type: 'array',
      items: {
        $ref: '#/definitions/KeywordStringType'
      },
      minItems: 1
    },
    LocationKeywords: {
      description: 'Controlled hierarchical keywords used to specify the spatial location of the collection.   The controlled vocabulary for spatial keywords is maintained in the Keyword Management System (KMS).  The Spatial Keyword hierarchy includes one or more of the following layers: Category (e.g., Continent), Type (e.g. Africa), Subregion1 (e.g., Central Africa), Subregion2 (e.g., Cameroon), and Subregion3. DetailedLocation exists outside the hierarchy.',
      type: 'array',
      items: {
        $ref: '#/definitions/LocationKeywordType'
      },
      minItems: 1
    },
    Platforms: {
      description: 'Information about the relevant platform(s) used to acquire the data in the collection. The controlled vocabulary for platform types is maintained in the Keyword Management System (KMS), and includes Spacecraft, Aircraft, Vessel, Buoy, Platform, Station, Network, Human, etc.',
      type: 'array',
      items: {
        $ref: '#/definitions/PlatformType'
      },
      minItems: 1
    },
    Projects: {
      description: 'The name of the scientific program, field campaign, or project from which the data were collected. This element is intended for the non-space assets such as aircraft, ground systems, balloons, sondes, ships, etc. associated with campaigns. This element may also cover a long term project that continuously creates new data sets — like MEaSUREs from ISCCP and NVAP or CMARES from MISR. Project also includes the Campaign sub-element to support multiple campaigns under the same project.',
      type: 'array',
      items: {
        $ref: '#/definitions/ProjectType'
      },
      minItems: 1
    },
    RelatedUrls: {
      description: 'This element describes any data/service related URLs that include project home pages, services, related data archives/servers, metadata extensions, direct links to online software packages, web mapping services, links to images, or other data.',
      type: 'array',
      items: {
        $ref: '#/definitions/RelatedUrlType'
      },
      minItems: 1
    },
    ShortName: {
      description: 'The short name associated with the collection.',
      $ref: '#/definitions/ShortNameType'
    },
    Version: {
      description: 'The Version of the collection.',
      $ref: '#/definitions/VersionType'
    },
    VersionDescription: {
      description: 'The Version Description of the collection.',
      $ref: '#/definitions/VersionDescriptionType'
    },
    MetadataSpecification: {
      description: "Requires the client, or user, to add in schema information into every collection record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: '#/definitions/MetadataSpecificationType'
    }
  },
  required: [
    'ShortName',
    'Version',
    'EntryTitle',
    'Abstract',
    'DOI',
    'DataCenters',
    'ProcessingLevel',
    'ScienceKeywords',
    'TemporalExtents',
    'SpatialExtent',
    'Platforms',
    'CollectionProgress',
    'MetadataSpecification'
  ],
  definitions: {
    LanguageType: {
      description: 'Describes the language used in the preparation, storage, and description of the collection. It is the language of the collection data themselves.   It does not refer to the language used in the metadata record (although this may be the same language). The name of the language used for this field is defined in ISO 639.',
      type: 'string',
      minLength: 1,
      maxLength: 25
    },
    DateType: {
      type: 'object',
      additionalProperties: false,
      description: 'Specifies the date and its type.',
      properties: {
        Date: {
          description: 'This is the date that an event associated with the collection or its metadata occurred.',
          format: 'date-time',
          type: 'string'
        },
        Type: {
          description: 'This is the type of event associated with the date.  For example, Creation, Last Revision.  Type is chosen from a picklist.',
          $ref: '#/definitions/LineageDateEnum'
        }
      },
      required: [
        'Date',
        'Type'
      ]
    },
    EntryIdType: {
      description: 'This is the ID of the metadata record.  It is only unique when combined with the version.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    DataCenterType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines a data center which is either an organization or institution responsible for distributing, archiving, or processing the data, etc.',
      properties: {
        Roles: {
          description: 'This is the roles of the data center.',
          type: 'array',
          items: {
            $ref: '#/definitions/DataCenterRoleEnum'
          },
          minItems: 1
        },
        ShortName: {
          description: 'This is the short name of the data center. The controlled vocabulary for data center short names is maintained in the Keyword Management System (KMS).',
          $ref: '#/definitions/DataCenterShortNameType'
        },
        LongName: {
          description: 'This is the long name of the data center.',
          $ref: '#/definitions/LongNameType'
        },
        Uuid: {
          description: 'Uuid of the data center.',
          $ref: '#/definitions/UuidType'
        },
        ContactGroups: {
          description: 'This is the contact groups of the data center.',
          type: 'array',
          items: {
            $ref: '#/definitions/ContactGroupType'
          }
        },
        ContactPersons: {
          description: 'This is the contact persons of the data center.',
          type: 'array',
          items: {
            $ref: '#/definitions/ContactPersonType'
          }
        },
        ContactInformation: {
          description: 'This is the contact information of the data center.',
          $ref: '#/definitions/ContactInformationType'
        }
      },
      required: [
        'Roles',
        'ShortName'
      ]
    },
    ContactGroupType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Roles: {
          description: 'This is the roles of the data contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/DataContactRoleEnum'
          },
          minItems: 1
        },
        Uuid: {
          description: 'Uuid of the data contact.',
          $ref: '#/definitions/UuidType'
        },
        NonDataCenterAffiliation: {
          description: 'This is the contact person or group that is not affiliated with the data centers.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInformation: {
          description: 'This is the contact information of the data contact.',
          $ref: '#/definitions/ContactInformationType'
        },
        GroupName: {
          description: 'This is the contact group name.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      },
      required: [
        'Roles',
        'GroupName'
      ]
    },
    ContactPersonType: {
      type: 'object',
      properties: {
        Roles: {
          description: 'This is the roles of the data contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/DataContactRoleEnum'
          },
          minItems: 1
        },
        Uuid: {
          description: 'Uuid of the data contact.',
          $ref: '#/definitions/UuidType'
        },
        NonDataCenterAffiliation: {
          description: 'This is the contact person or group that is not affiliated with the data centers.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInformation: {
          description: 'This is the contact information of the data contact.',
          $ref: '#/definitions/ContactInformationType'
        },
        FirstName: {
          description: 'First name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        MiddleName: {
          description: 'Middle name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        LastName: {
          description: 'Last name of the individual.',
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      },
      required: [
        'Roles',
        'LastName'
      ]
    },
    ContactInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines the contact information of a data center or data contact.',
      properties: {
        RelatedUrls: {
          description: 'A URL associated with the contact, e.g., the home page for the DAAC which is responsible for the collection.',
          type: 'array',
          items: {
            $ref: '#/definitions/RelatedUrlType'
          },
          minItems: 0
        },
        ServiceHours: {
          description: 'Time period when the contact answers questions or provides services.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ContactInstruction: {
          description: 'Supplemental instructions on how or when to contact the responsible party.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        ContactMechanisms: {
          description: 'Mechanisms of contacting.',
          type: 'array',
          items: {
            $ref: '#/definitions/ContactMechanismType'
          }
        },
        Addresses: {
          description: 'Contact addresses.',
          type: 'array',
          items: {
            $ref: '#/definitions/AddressType'
          }
        }
      }
    },
    ContactMechanismType: {
      type: 'object',
      additionalProperties: false,
      description: 'Method for contacting the data contact. A contact can be available via phone, email, Facebook, or Twitter.',
      properties: {
        Type: {
          description: 'This is the method type for contacting the responsible party - phone, email, Facebook, or Twitter.',
          $ref: '#/definitions/ContactMechanismTypeEnum'
        },
        Value: {
          description: 'This is the contact phone number, email address, Facebook address, or Twitter handle associated with the contact method.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'Type',
        'Value'
      ]
    },
    AddressType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity contains the physical address details for the contact.',
      properties: {
        StreetAddresses: {
          description: 'An address line for the street address, used for mailing or physical addresses of organizations or individuals who serve as contacts for the collection.',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 1024
          },
          minItems: 0
        },
        City: {
          description: 'The city portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        StateProvince: {
          description: 'The state or province portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        Country: {
          description: 'The country of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        PostalCode: {
          description: 'The zip or other postal code portion of the physical address.',
          type: 'string',
          minLength: 1,
          maxLength: 20
        }
      }
    },
    RelatedUrlType: {
      type: 'object',
      additionalProperties: false,
      description: 'Represents Internet sites that contain information related to the data, as well as related Internet sites such as project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data.',
      properties: {
        Description: {
          description: 'Description of the web page at this URL.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        URLContentType: {
          description: "A keyword describing the distinct content type of the online resource to this resource. (e.g., 'DATACENTER URL', 'DATA CONTACT URL', 'DISTRIBUTION URL'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Type: {
          description: "A keyword describing the type of the online resource to this resource. This helps the GUI to know what to do with this resource. (e.g., 'GET DATA', 'GET SERVICE', 'GET VISUALIZATION'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Subtype: {
          description: "A keyword describing the subtype of the online resource to this resource. This further helps the GUI to know what to do with this resource. (e.g., 'MEDIA', 'BROWSE', 'OPENDAP', 'OPENSEARCH', 'WEB COVERAGE SERVICES', 'WEB FEATURE SERVICES', 'WEB MAPPING SERVICES', 'SSW', 'ESI'). The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096?gtm_keyword=Related%20URL%20Content%20Types&gtm_scheme=rucontenttype.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URL: {
          description: "The URL for the relevant web page (e.g., the URL of the responsible organization's home page, the URL of the collection landing page, the URL of the download site for the collection).",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        GetData: {
          description: 'The data distribution information for the relevant web page (e.g., browse, media).',
          $ref: '#/definitions/GetDataType'
        },
        GetService: {
          description: 'The service distribution for the relevant web page (e.g., OPeNDAP, OpenSearch, WCS, WFS, WMS).',
          $ref: '#/definitions/GetServiceType'
        }
      },
      required: [
        'URL',
        'URLContentType',
        'Type'
      ]
    },
    GetDataType: {
      description: 'Represents the information needed for a DistributionURL where data is retrieved.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Format: {
          description: 'The format of the data.  The controlled vocabulary for formats is maintained in the Keyword Management System (KMS)',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        MimeType: {
          description: 'The mime type of the service.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Size: {
          description: 'The size of the data.',
          type: 'number',
          minimum: 0
        },
        Unit: {
          description: 'Unit of information, together with Size determines total size in bytes of the data.',
          type: 'string',
          enum: [
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
          ]
        },
        Fees: {
          description: 'The fee for ordering the collection data.  The fee is entered as a number, in US Dollars.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Checksum: {
          description: 'The checksum, usually a SHA1 or md5 checksum for the data file.',
          type: 'string',
          minLength: 1,
          maxLength: 50
        }
      },
      required: [
        'Format',
        'Size',
        'Unit'
      ]
    },
    GetServiceType: {
      description: 'Represents a Service through a URL where the service will act on data and return the result to the caller.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Format: {
          description: 'The format of the data.',
          $ref: '#/definitions/GetServiceTypeFormatEnum'
        },
        MimeType: {
          description: 'The mime type of the service.',
          $ref: '#/definitions/URLMimeTypeEnum'
        },
        Protocol: {
          description: 'The protocol of the service.',
          type: 'string',
          enum: [
            'HTTP',
            'HTTPS',
            'FTP',
            'FTPS',
            'Not provided'
          ]
        },
        FullName: {
          description: 'The full name of the service.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataID: {
          description: 'The data identifier of the data provided by the service. Typically, this is a file name.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataType: {
          description: 'The data type of the data provided by the service.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URI: {
          description: 'The URI of the data provided by the service.',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 1024
          },
          minItems: 1
        }
      },
      required: [
        'MimeType',
        'Protocol',
        'FullName',
        'DataID',
        'DataType'
      ]
    },
    OnlineResourceType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes the online resource pertaining to the data.',
      properties: {
        Linkage: {
          description: 'The URL of the website related to the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Protocol: {
          description: 'The protocol of the linkage for the online resource, such as https, svn, ftp, etc.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ApplicationProfile: {
          description: 'The application profile holds the name of the application that can service the data. For example if the URL points to a word document, then the applicationProfile is MS-Word.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Name: {
          description: 'The name of the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'The description of the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Function: {
          description: 'The function of the online resource. In ISO where this class originated the valid values are: download, information, offlineAccess, order, and search.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        MimeType: {
          description: 'The mime type of the online resource.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [
        'Linkage'
      ]
    },
    ResourceCitationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Building block text fields used to construct the recommended language for citing the collection in professional scientific literature.  The citation language constructed from these fields references the collection itself, and is not designed for listing bibliographic references of scientific research articles arising from search results. A list of references related to the research results should be in the Publication Reference element.',
      properties: {
        Version: {
          description: 'The version of the collection.',
          $ref: '#/definitions/VersionType'
        },
        Title: {
          description: 'The title of the collection; this is the same as the collection Entry Title.',
          $ref: '#/definitions/TitleType'
        },
        Creator: {
          description: "The name of the organization(s) or individual(s) with primary intellectual responsibility for the collection's development.",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Editor: {
          description: 'The individual(s) responsible for changing the data in the collection.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        SeriesName: {
          description: 'The name of the data series, or aggregate data of which the data is a part.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ReleaseDate: {
          description: 'The date when the collection was made available for release.',
          format: 'date-time',
          type: 'string'
        },
        ReleasePlace: {
          description: 'The name of the city (and state or province and country if needed) where the collection was made available for release.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Publisher: {
          description: 'The name of the individual or organization that made the collection available for release.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        IssueIdentification: {
          description: 'The volume or issue number of the publication (if applicable).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DataPresentationForm: {
          description: 'The mode in which the data are represented, e.g. atlas, image, profile, text, etc.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        OtherCitationDetails: {
          description: 'Additional free-text citation information.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        OnlineResource: {
          description: 'The URL of the landing page for the collection.',
          $ref: '#/definitions/OnlineResourceType'
        }
      }
    },
    DoiType: {
      oneOf: [
        {
          type: 'object',
          title: 'DOI is available',
          additionalProperties: false,
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. For those that want to specify that a DOI is not applicable or unknown for their record, use the second option.",
          properties: {
            DOI: {
              description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Authority: {
              description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
              $ref: '#/definitions/AuthorityType'
            },
            PreviousVersion: {
              $ref: '#/definitions/PreviousVersionType'
            }
          },
          required: [
            'DOI'
          ]
        },
        {
          type: 'object',
          title: 'DOI is not available or applicable',
          additionalProperties: false,
          description: 'This element stores the fact that the DOI (Digital Object Identifier) is not applicable or is unknown.',
          properties: {
            MissingReason: {
              description: 'This element stores the fact that a DOI (Digital Object Identifier) is not applicable or is unknown for this record.',
              type: 'string',
              enum: [
                'Not Applicable',
                'Unknown'
              ]
            },
            Explanation: {
              description: 'This element describes the reason the DOI is not applicable or unknown.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [
            'MissingReason'
          ]
        }
      ]
    },
    PreviousVersionType: {
      type: 'object',
      additionalProperties: false,
      description: "Provides a DOI of the previous version of this collection. This allows users to find historical data for this collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. For those that want to specify that a DOI is not applicable or unknown for their record, use the second option.",
      properties: {
        Version: {
          description: 'The version number if one exists.',
          $ref: '#/definitions/VersionType'
        },
        Description: {
          description: 'Short description of the previous version.',
          $ref: '#/definitions/VersionDescriptionType'
        },
        DOI: {
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Published: {
          description: 'Describes the pubished date for the previous version.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: [
        'DOI'
      ]
    },
    DoiDoiType: {
      type: 'object',
      additionalProperties: false,
      description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. NASA metadata providers are strongly encouraged to include DOI and DOI Authority for their collections using CollectionDOI property.",
      properties: {
        DOI: {
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Authority: {
          description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
          $ref: '#/definitions/AuthorityType'
        }
      },
      required: [
        'DOI'
      ]
    },
    AccessConstraintsType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about any constraints for accessing the data set. This includes any special restrictions, legal prerequisites, limitations and/or warnings on obtaining the data set.',
      properties: {
        Description: {
          description: 'Free-text description of the constraint.  In DIF, this field is called Access_Constraint.   In ECHO, this field is called RestrictionComment.  Examples of text in this field are Public, In-house, Limited.  Additional detailed instructions on how to access the collection data may be entered in this field.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        Value: {
          description: 'Numeric value that is used with Access Control Language (ACLs) to restrict access to this collection.  For example, a provider might specify a collection level ACL that hides all collections with a value element set to 15.   In ECHO, this field is called RestrictionFlag.  This field does not exist in DIF.',
          type: 'number'
        }
      },
      required: [
        'Description'
      ]
    },
    MetadataAssociationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Used to identify other services, collections, visualizations, granules, and other metadata types and resources that are associated with or dependent on this collection, including parent-child relationships.',
      properties: {
        Type: {
          description: 'The type of association between this collection metadata record and the target metadata record.   Choose type from the drop-down list.',
          $ref: '#/definitions/MetadataAssociateTypeEnum'
        },
        Description: {
          description: 'Free-text description of the association between this collection record and the target metadata record.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        EntryId: {
          description: 'ShortName of the target metadata record that is associated with this collection record.',
          $ref: '#/definitions/EntryIdType'
        },
        Version: {
          description: 'The version of the target metadata record that is associated with this collection record.',
          $ref: '#/definitions/VersionType'
        }
      },
      required: [
        'EntryId'
      ]
    },
    PublicationReferenceType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes key bibliographic citations pertaining to the data.',
      properties: {
        OnlineResource: {
          description: 'The URL of the website related to the bibliographic citation.',
          $ref: '#/definitions/OnlineResourceType'
        },
        Title: {
          description: 'The title of the publication in the bibliographic citation.',
          $ref: '#/definitions/TitleType'
        },
        Publisher: {
          description: 'The publisher of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        DOI: {
          description: 'The Digital Object Identifier (DOI) of the publication.',
          $ref: '#/definitions/DoiDoiType'
        },
        Author: {
          description: 'The author of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        PublicationDate: {
          description: 'The date of the publication.',
          format: 'date-time',
          type: 'string'
        },
        Series: {
          description: 'The name of the series of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Edition: {
          description: 'The edition of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Volume: {
          description: 'The publication volume number.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Issue: {
          description: 'The issue of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ReportNumber: {
          description: 'The report number of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        PublicationPlace: {
          description: 'The publication place of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Pages: {
          description: 'The publication pages that are relevant.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ISBN: {
          description: 'The ISBN of the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 13
        },
        OtherReferenceDetails: {
          description: 'Additional free-text reference information about the publication.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      }
    },
    ScienceKeywordType: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science keywords related to the collection.  The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      properties: {
        Category: {
          $ref: '#/definitions/KeywordStringType'
        },
        Topic: {
          $ref: '#/definitions/KeywordStringType'
        },
        Term: {
          $ref: '#/definitions/KeywordStringType'
        },
        VariableLevel1: {
          $ref: '#/definitions/KeywordStringType'
        },
        VariableLevel2: {
          $ref: '#/definitions/KeywordStringType'
        },
        VariableLevel3: {
          $ref: '#/definitions/KeywordStringType'
        },
        DetailedVariable: {
          $ref: '#/definitions/KeywordStringType'
        }
      },
      required: [
        'Category',
        'Topic',
        'Term'
      ]
    },
    AdditionalAttributeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Additional unique attributes of the collection, beyond those defined in the UMM model, which the data provider deems useful for end-user understanding of the data in the collection.  Additional attributes are also called Product Specific Attributes (PSAs) or non-core attributes.  Examples are HORIZONTALTILENUMBER, VERTICALTILENUMBER.',
      properties: {
        Name: {
          description: 'The name (1 word description) of the additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'Free-text description of the additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Value: {
          description: 'Value of the additional attribute if it is the same for all granules across the collection.  If the value of the additional attribute may differ by granule, leave this collection-level value blank.',
          type: 'string',
          minLength: 1,
          maxLength: 500
        },
        DataType: {
          description: 'Data type of the values of the additional attribute.',
          $ref: '#/definitions/DataTypeEnum'
        },
        MeasurementResolution: {
          description: 'The smallest unit increment to which the additional attribute value is measured.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterRangeBegin: {
          description: 'The minimum value of the additional attribute over the whole collection.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterRangeEnd: {
          description: 'The maximum value of the additional attribute over the whole collection.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterUnitsOfMeasure: {
          description: 'The standard unit of measurement for the additional attribute.  For example, meters, hertz.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ParameterValueAccuracy: {
          description: 'An estimate of the accuracy of the values of the additional attribute. For example, for AVHRR: Measurement error or precision-measurement error or precision of a data product parameter. This can be specified in percent or the unit with which the parameter is measured.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ValueAccuracyExplanation: {
          description: 'Describes the method used for determining the parameter value accuracy that is given for this additional attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Group: {
          description: 'Identifies a namespace for the additional attribute name.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        UpdateDate: {
          description: 'The date this additional attribute information was updated.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: [
        'Name',
        'DataType',
        'Description'
      ]
    },
    PlatformType: {
      type: 'object',
      additionalProperties: false,
      description: 'Describes the relevant platforms used to acquire the data in the collection. The controlled vocabularies for platform types and names are maintained in the Keyword Management System (KMS).',
      properties: {
        Type: {
          description: 'The most relevant platform type.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        ShortName: {
          $ref: '#/definitions/PlatformShortNameType'
        },
        LongName: {
          $ref: '#/definitions/PlatformLongNameType'
        },
        Characteristics: {
          description: 'Platform-specific characteristics, e.g., Equator Crossing Time, Inclination Angle, Orbital Period. The characteristic names must be unique on this platform; however the names do not have to be unique across platforms.',
          type: 'array',
          items: {
            $ref: '#/definitions/CharacteristicType'
          },
          minItems: 0
        },
        Instruments: {
          type: 'array',
          items: {
            $ref: '#/definitions/InstrumentType'
          },
          minItems: 1
        }
      },
      required: [
        'ShortName'
      ]
    },
    CharacteristicType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity is used to define characteristics.',
      properties: {
        Name: {
          description: 'The name of the characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'Description of the Characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Value: {
          description: 'The value of the Characteristic attribute.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Unit: {
          description: 'Units associated with the Characteristic attribute value.',
          type: 'string',
          minLength: 1,
          maxLength: 20
        },
        DataType: {
          description: 'The datatype of the Characteristic/attribute.',
          $ref: '#/definitions/DataTypeEnum'
        }
      },
      required: [
        'Name',
        'Description',
        'DataType',
        'Unit',
        'Value'
      ]
    },
    InstrumentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about the device used to measure or record data in this collection, including direct human observation. In cases where instruments have a single child instrument or the instrument and child instrument are used synonymously (e.g. AVHRR), both Instrument and ComposedOf should be recorded. The child instrument information is represented in a separate section. The controlled vocabulary for instrument names is maintained in the Keyword Management System (KMS).',
      properties: {
        ShortName: {
          $ref: '#/definitions/PlatformShortNameType'
        },
        LongName: {
          $ref: '#/definitions/PlatformLongNameType'
        },
        Characteristics: {
          description: 'Instrument-specific characteristics, e.g., Wavelength, SwathWidth, Field of View. The characteristic names must be unique on this instrument; however the names do not have to be unique across instruments.',
          type: 'array',
          items: {
            $ref: '#/definitions/CharacteristicType'
          },
          minItems: 0
        },
        Technique: {
          description: "The expanded name of the primary sensory instrument. (e.g. Advanced Spaceborne Thermal Emission and Reflective Radiometer, Clouds and the Earth's Radiant Energy System, Human Observation).",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        NumberOfInstruments: {
          description: 'Number of instruments used on the instrument when acquiring the granule data.',
          type: 'integer'
        },
        ComposedOf: {
          type: 'array',
          items: {
            $ref: '#/definitions/InstrumentChildType'
          },
          minItems: 0
        },
        OperationalModes: {
          description: 'The operation mode applied on the instrument when acquiring the granule data.',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 20
          },
          minItems: 0
        }
      },
      required: [
        'ShortName'
      ]
    },
    InstrumentChildType: {
      type: 'object',
      additionalProperties: false,
      description: 'Child object on an instrument. Has all the same fields as instrument, minus the list of child instruments.',
      properties: {
        ShortName: {
          $ref: '#/definitions/PlatformShortNameType'
        },
        LongName: {
          $ref: '#/definitions/PlatformLongNameType'
        },
        Characteristics: {
          description: 'Instrument-specific characteristics, e.g., Wavelength, SwathWidth, Field of View. The characteristic names must be unique on this instrument; however the names do not have to be unique across instruments.',
          type: 'array',
          items: {
            $ref: '#/definitions/CharacteristicType'
          },
          minItems: 0
        },
        Technique: {
          description: "The expanded name of the primary sensory instrument. (e.g. Advanced Spaceborne Thermal Emission and Reflective Radiometer, Clouds and the Earth's Radiant Energy System, Human Observation).",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        }
      },
      required: [
        'ShortName'
      ]
    },
    ProjectType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information describing the scientific endeavor(s) with which the collection is associated. Scientific endeavors include campaigns, projects, interdisciplinary science investigations, missions, field experiments, etc. The controlled vocabularies for project names are maintained in the Keyword Management System (KMS)',
      properties: {
        ShortName: {
          description: 'The unique identifier by which a project or campaign/experiment is known. The campaign/project is the scientific endeavor associated with the acquisition of the collection. Collections may be associated with multiple campaigns.',
          type: 'string',
          minLength: 1,
          maxLength: 40
        },
        LongName: {
          description: 'The expanded name of the campaign/experiment (e.g. Global climate observing system).',
          type: 'string',
          minLength: 1,
          maxLength: 300
        },
        Campaigns: {
          description: 'The name of the campaign/experiment (e.g. Global climate observing system).',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 80
          },
          minItems: 0
        },
        StartDate: {
          description: 'The starting date of the campaign.',
          format: 'date-time',
          type: 'string'
        },
        EndDate: {
          description: 'The ending data of the campaign.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: [
        'ShortName'
      ]
    },
    TemporalExtentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information which describes the temporal range or extent of a specific collection.',
      properties: {
        PrecisionOfSeconds: {
          description: 'The precision (position in number of places to right of decimal point) of seconds used in measurement.',
          type: 'integer'
        },
        EndsAtPresentFlag: {
          description: "Setting the Ends At Present Flag to 'True' indicates that a data collection which covers, temporally, a discontinuous range, currently ends at the present date.  Setting the Ends at Present flag to 'True' eliminates the need to continuously update the Range Ending Time for collections where granules are continuously being added to the collection inventory.",
          type: 'boolean'
        },
        RangeDateTimes: {
          description: 'Stores the start and end date/time of a collection.',
          type: 'array',
          items: {
            $ref: '#/definitions/RangeDateTimeType'
          },
          minItems: 1
        },
        SingleDateTimes: {
          type: 'array',
          items: {
            format: 'date-time',
            type: 'string'
          },
          minItems: 1
        },
        PeriodicDateTimes: {
          description: 'Temporal information about a collection having granules collected at a regularly occurring period.   Information includes the start and end dates of the period, duration unit and value, and cycle duration unit and value.',
          type: 'array',
          items: {
            $ref: '#/definitions/PeriodicDateTimeType'
          },
          minItems: 1
        },
        TemporalResolution: {
          $ref: '#/definitions/TemporalResolutionType'
        }
      },
      oneOf: [
        {
          required: [
            'RangeDateTimes'
          ]
        },
        {
          required: [
            'SingleDateTimes'
          ]
        },
        {
          required: [
            'PeriodicDateTimes'
          ]
        }
      ]
    },
    TemporalResolutionType: {
      oneOf: [
        {
          type: 'object',
          title: 'Constant or Varies Resolution',
          additionalProperties: false,
          description: 'Describes the amount of time between measurements.',
          properties: {
            Unit: {
              description: 'Describes a constant or varies temporal resolution.',
              type: 'string',
              enum: [
                'Constant',
                'Varies'
              ]
            }
          },
          required: [
            'Unit'
          ]
        },
        {
          type: 'object',
          title: 'Numerical Resolution',
          additionalProperties: false,
          description: 'Describes the amount of time between measurements.',
          properties: {
            Value: {
              description: 'The temporal resolution value.',
              type: 'number'
            },
            Unit: {
              description: 'Describes a constant or varies temporal resolution.',
              type: 'string',
              enum: [
                'Second',
                'Minute',
                'Hour',
                'Day',
                'Week',
                'Month',
                'Year',
                'Diurnal'
              ]
            }
          },
          required: [
            'Value',
            'Unit'
          ]
        }
      ]
    },
    RangeDateTimeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Stores the start and end date/time of a collection.',
      properties: {
        BeginningDateTime: {
          description: 'The time when the temporal coverage period being described began.',
          format: 'date-time',
          type: 'string'
        },
        EndingDateTime: {
          description: 'The time when the temporal coverage period being described ended.',
          format: 'date-time',
          type: 'string'
        }
      },
      required: [
        'BeginningDateTime'
      ]
    },
    PeriodicDateTimeType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about Periodic Date Time collections, including the name of the temporal period in addition to the start and end dates, duration unit and value, and cycle duration unit and value.',
      properties: {
        Name: {
          description: "The name given to the recurring time period. e.g. 'spring - north hemi.'",
          type: 'string',
          minLength: 1,
          maxLength: 30
        },
        StartDate: {
          description: 'The date (day and time) of the first occurrence of this regularly occurring period which is relevant to the collection coverage.',
          format: 'date-time',
          type: 'string'
        },
        EndDate: {
          description: 'The date (day and time) of the end occurrence of this regularly occurring period which is relevant to the collection coverage.',
          format: 'date-time',
          type: 'string'
        },
        DurationUnit: {
          description: 'The unit specification for the period duration.',
          $ref: '#/definitions/DurationUnitEnum'
        },
        DurationValue: {
          description: "The number of PeriodDurationUnits in the RegularPeriodic period. e.g. the RegularPeriodic event 'Spring-North Hemi' might have a PeriodDurationUnit='MONTH' PeriodDurationValue='3' PeriodCycleDurationUnit='YEAR' PeriodCycleDurationValue='1' indicating that Spring-North Hemi lasts for 3 months and has a cycle duration of 1 year. The unit for the attribute is the value of the attribute PeriodDurationValue.",
          type: 'integer'
        },
        PeriodCycleDurationUnit: {
          description: 'The unit specification of the period cycle duration.',
          $ref: '#/definitions/DurationUnitEnum'
        },
        PeriodCycleDurationValue: {
          type: 'integer'
        }
      },
      required: [
        'Name',
        'StartDate',
        'EndDate',
        'DurationUnit',
        'DurationValue',
        'PeriodCycleDurationUnit',
        'PeriodCycleDurationValue'
      ]
    },
    UuidType: {
      description: 'A Level 3 UUID, see wiki link http://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29',
      type: 'string',
      pattern: '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}'
    },
    LineageDateEnum: {
      description: 'The name of supported lineage date types',
      type: 'string',
      enum: [
        'CREATE',
        'UPDATE',
        'DELETE',
        'REVIEW'
      ]
    },
    VersionType: {
      description: 'The version of the metadata record.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    VersionDescriptionType: {
      description: 'Free-text description of the version of the resource such as a Collection.',
      type: 'string',
      minLength: 1,
      maxLength: 2048
    },
    AuthorityType: {
      description: 'The Authority (who created it or owns it) of a unique identifier.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    EntryTitleType: {
      description: 'The title of the data described by the metadata.',
      $ref: '#/definitions/TitleType'
    },
    TitleType: {
      description: 'A title type that defines the min and max lengths of all titles.',
      type: 'string',
      minLength: 1,
      maxLength: 1030
    },
    AbstractType: {
      description: 'A brief description of the collection. This allows potential users to determine if the collection is useful for their needs.',
      type: 'string',
      minLength: 1,
      maxLength: 40000
    },
    PurposeType: {
      description: 'Describes the purpose and/or intended use of data in this collection.',
      type: 'string',
      minLength: 1,
      maxLength: 10000
    },
    DataCenterRoleEnum: {
      description: 'Defines the possible values of a data center role.',
      type: 'string',
      enum: [
        'ARCHIVER',
        'DISTRIBUTOR',
        'PROCESSOR',
        'ORIGINATOR'
      ]
    },
    DataContactRoleEnum: {
      description: 'Defines the possible values of a data contact role.',
      type: 'string',
      enum: [
        'Data Center Contact',
        'Technical Contact',
        'Science Contact',
        'Investigator',
        'Metadata Author',
        'User Services',
        'Science Software Development'
      ]
    },
    ContactMechanismTypeEnum: {
      description: 'Defines the possible contact mechanism types.',
      type: 'string',
      enum: [
        'Direct Line',
        'Email',
        'Facebook',
        'Fax',
        'Mobile',
        'Modem',
        'Primary',
        'TDD/TTY Phone',
        'Telephone',
        'Twitter',
        'U.S. toll free',
        'Other'
      ]
    },
    ShortNameType: {
      description: 'The unique name.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    DataCenterShortNameType: {
      description: 'The unique name of the data center.',
      type: 'string',
      minLength: 1,
      maxLength: 85,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,84}"
    },
    PlatformShortNameType: {
      description: 'The unique name of the platform.',
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
    },
    LongNameType: {
      description: 'The expanded or long name related to the short name.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    PlatformLongNameType: {
      description: 'The expanded or long name related to the short name of the platform.',
      type: 'string',
      minLength: 1,
      maxLength: 1024,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{0,1023}"
    },
    QualityType: {
      description: 'Free-text information about the quality of the data in the collection or any quality assurance procedures followed in producing the data described in the metadata. Suggestions for information to include in the Quality field: Description should be succinct. Include indicators of data quality or quality flags. Include recognized or potential problems with quality. Established quality control mechanisms should be included. Established quantitative quality measurements should be included.',
      type: 'string',
      minLength: 1,
      maxLength: 12000
    },
    MetadataAssociateTypeEnum: {
      description: 'The set of supported values for MetadataAssociationType.Type.',
      type: 'string',
      enum: [
        'SCIENCE ASSOCIATED',
        'DEPENDENT',
        'INPUT',
        'PARENT',
        'CHILD',
        'RELATED',
        'LARGER CITATION WORKS'
      ]
    },
    KeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
    },
    AncillaryKeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,254}"
    },
    DataTypeEnum: {
      description: 'This entity contains the additional attribute data types.',
      type: 'string',
      enum: [
        'STRING',
        'FLOAT',
        'INT',
        'BOOLEAN',
        'DATE',
        'TIME',
        'DATETIME',
        'DATE_STRING',
        'TIME_STRING',
        'DATETIME_STRING'
      ]
    },
    DurationUnitEnum: {
      type: 'string',
      enum: [
        'DAY',
        'MONTH',
        'YEAR'
      ]
    },
    URLMimeTypeEnum: {
      type: 'string',
      enum: [
        'application/json',
        'application/xml',
        'application/x-netcdf',
        'application/gml+xml',
        'application/opensearchdescription+xml',
        'application/vnd.google-earth.kml+xml',
        'image/gif',
        'image/tiff',
        'image/bmp',
        'text/csv',
        'text/xml',
        'application/pdf',
        'application/x-hdf',
        'application/xhdf5',
        'application/octet-stream',
        'application/vnd.google-earth.kmz',
        'image/jpeg',
        'image/png',
        'image/vnd.collada+xml',
        'application/x-vnd.iso.19139-2+xml',
        'text/html',
        'text/plain',
        'application/geo+json',
        'Not provided'
      ]
    },
    GetServiceTypeFormatEnum: {
      type: 'string',
      enum: [
        'ascii',
        'binary',
        'GRIB',
        'BUFR',
        'HDF4',
        'HDF5',
        'HDF-EOS4',
        'HDF-EOS5',
        'jpeg',
        'png',
        'tiff',
        'geotiff',
        'kml',
        'Not provided'
      ]
    },
    UseConstraintsDescriptionType: {
      type: 'object',
      additionalProperties: false,
      description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
      properties: {
        Description: {
          description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      }
    },
    UseConstraintsDescType: {
      description: 'This sub-element either contains a license summary or free-text description that details the permitted use or limitation of this collection.',
      type: 'string',
      minLength: 1,
      maxLength: 4000
    },
    FreeAndOpenDataType: {
      description: "This sub-element if true, describes to end users and machines that this collection's data is free of charge and open for any use the user sees fit.",
      type: 'boolean'
    },
    EULAIdentifierType: {
      description: 'Allows an End User License Agreement to be associated with a collection. This allows a service to check if an end user has accepted a EULA for this collection (data set) before it will allow data to be downloaded or used.',
      type: 'string',
      minLength: 1,
      maxLength: 40
    },
    UseConstraintsType: {
      description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
      oneOf: [
        {
          type: 'object',
          title: 'Description without License URL or Text.',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: {
              $ref: '#/definitions/UseConstraintsDescType'
            },
            FreeAndOpenData: {
              $ref: '#/definitions/FreeAndOpenDataType'
            },
            EULAIdentifiers: {
              description: 'A list of End User license Agreement identifiers that are associated to a collection. These identifiers can be found in the Earthdata Login application where End User License Agreements are stored. These identifiers allow services to check if an end user has accepted a license agreement before allowing data to be downloaded.',
              type: 'array',
              items: {
                $ref: '#/definitions/EULAIdentifierType'
              },
              minItems: 1
            }
          },
          required: [
            'Description'
          ]
        },
        {
          type: 'object',
          title: 'License URL',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: {
              $ref: '#/definitions/UseConstraintsDescType'
            },
            LicenseURL: {
              description: 'This element holds the URL and associated information to access the License on the web. If this element is used the LicenseText element cannot be used.',
              $ref: '#/definitions/OnlineResourceType'
            },
            FreeAndOpenData: {
              $ref: '#/definitions/FreeAndOpenDataType'
            },
            EULAIdentifiers: {
              description: 'A list of End User license Agreement identifiers that are associated to a collection. These identifiers can be found in the Earthdata Login application where End User License Agreements are stored. These identifiers allow services to check if an end user has accepted a license agreement before allowing data to be downloaded.',
              type: 'array',
              items: {
                $ref: '#/definitions/EULAIdentifierType'
              },
              minItems: 1
            }
          },
          required: [
            'LicenseURL'
          ]
        },
        {
          type: 'object',
          title: 'License Text',
          additionalProperties: false,
          description: 'This element defines how the data may or may not be used after access is granted to assure the protection of privacy or intellectual property. This includes license text, license URL, or any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the data set. Data providers may request acknowledgement of the data from users and claim no responsibility for quality and completeness of data.',
          properties: {
            Description: {
              $ref: '#/definitions/UseConstraintsDescType'
            },
            LicenseText: {
              description: 'This element holds the actual license text. If this element is used the LicenseUrl element cannot be used.',
              type: 'string',
              minLength: 1,
              maxLength: 20000
            },
            FreeAndOpenData: {
              $ref: '#/definitions/FreeAndOpenDataType'
            },
            EULAIdentifiers: {
              description: 'A list of End User license Agreement identifiers that are associated to a collection. These identifiers can be found in the Earthdata Login application where End User License Agreements are stored. These identifiers allow services to check if an end user has accepted a license agreement before allowing data to be downloaded.',
              type: 'array',
              items: {
                $ref: '#/definitions/EULAIdentifierType'
              },
              minItems: 1
            }
          },
          required: [
            'LicenseText'
          ]
        }
      ]
    },
    DirectoryNameType: {
      type: 'object',
      additionalProperties: false,
      description: 'Formerly called Internal Directory Name (IDN) Node (IDN_Node). This element has been used historically by the GCMD internally to identify association, responsibility and/or ownership of the dataset, service or supplemental information. Note: This field only occurs in the DIF. When a DIF record is retrieved in the ECHO10 or ISO 19115 formats, this element will not be translated.',
      properties: {
        ShortName: {
          $ref: '#/definitions/ShortNameType'
        },
        LongName: {
          $ref: '#/definitions/LongNameType'
        }
      },
      required: [
        'ShortName'
      ]
    },
    ProcessingLevelType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains the Processing Level Id and the Processing Level Description',
      properties: {
        ProcessingLevelDescription: {
          description: "Description of the meaning of the Processing Level Id, e.g., the Description for the Level4 Processing Level Id might be 'Model output or results from analyses of lower level data'",
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Id: {
          description: 'An identifier indicating the level at which the data in the collection are processed, ranging from Level0 (raw instrument data at full resolution) to Level4 (model output or analysis results).  The value of Processing Level Id is chosen from a controlled vocabulary.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [
        'Id'
      ]
    },
    PaleoTemporalCoverageType: {
      type: 'object',
      additionalProperties: false,
      description: 'For paleoclimate or geologic data, PaleoTemporalCoverage is the length of time represented by the data collected. PaleoTemporalCoverage should be used when the data spans time frames earlier than yyyy-mm-dd = 0001-01-01.',
      properties: {
        ChronostratigraphicUnits: {
          description: 'Hierarchy of terms indicating units of geologic time, i.e., eon (e.g, Phanerozoic), era (e.g., Cenozoic), period (e.g., Paleogene), epoch (e.g., Oligocene), and stage or age (e.g, Chattian).',
          type: 'array',
          items: {
            $ref: '#/definitions/ChronostratigraphicUnitType'
          },
          minItems: 0
        },
        StartDate: {
          description: 'A string indicating the number of years furthest back in time, including units, e.g., 100 Ga.  Units may be Ga (billions of years before present), Ma (millions of years before present), ka (thousands of years before present) or ybp (years before present).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        EndDate: {
          description: 'A string indicating the number of years closest to the present time, including units, e.g., 10 ka.  Units may be Ga (billions of years before present), Ma (millions of years before present), ka (thousands of years before present) or ybp (years before present).',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      }
    },
    ChronostratigraphicUnitType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Eon: {
          $ref: '#/definitions/KeywordStringType'
        },
        Era: {
          $ref: '#/definitions/KeywordStringType'
        },
        Epoch: {
          $ref: '#/definitions/KeywordStringType'
        },
        Stage: {
          $ref: '#/definitions/KeywordStringType'
        },
        DetailedClassification: {
          $ref: '#/definitions/KeywordStringType'
        },
        Period: {
          $ref: '#/definitions/KeywordStringType'
        }
      },
      required: [
        'Eon'
      ]
    },
    SpatialExtentType: {
      type: 'object',
      additionalProperties: false,
      description: 'Specifies the geographic and vertical (altitude, depth) coverage of the data.',
      properties: {
        SpatialCoverageType: {
          description: "Denotes whether the collection's spatial coverage requires horizontal, vertical, horizontal and vertical, orbit, or vertical and orbit in the spatial domain and coordinate system definitions.",
          $ref: '#/definitions/SpatialCoverageTypeEnum'
        },
        HorizontalSpatialDomain: {
          $ref: '#/definitions/HorizontalSpatialDomainType'
        },
        VerticalSpatialDomains: {
          type: 'array',
          items: {
            $ref: '#/definitions/VerticalSpatialDomainType'
          }
        },
        OrbitParameters: {
          $ref: '#/definitions/OrbitParametersType'
        },
        GranuleSpatialRepresentation: {
          $ref: '#/definitions/GranuleSpatialRepresentationEnum'
        }
      },
      required: [
        'GranuleSpatialRepresentation'
      ],
      allOf: [
        {
          $ref: '#/definitions/OrbitParameterExistsIfGranuleSpatialRepresentationIsOrbit'
        }
      ]
    },
    SpatialCoverageTypeEnum: {
      type: 'string',
      enum: [
        'EARTH/GLOBAL',
        'HORIZONTAL',
        'VERTICAL',
        'ORBITAL',
        'HORIZONTAL_VERTICAL',
        'ORBITAL_VERTICAL',
        'HORIZONTAL_ORBITAL',
        'HORIZONTAL_VERTICAL_ORBITAL',
        'LUNAR'
      ]
    },
    HorizontalSpatialDomainType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information about a collection with horizontal spatial coverage.',
      properties: {
        ZoneIdentifier: {
          description: "The appropriate numeric or alpha code used to identify the various zones in the collection's grid coordinate system.",
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Geometry: {
          $ref: '#/definitions/GeometryType'
        },
        ResolutionAndCoordinateSystem: {
          description: 'Specifies the horizontal spatial extents coordinate system and its resolution.',
          $ref: '#/definitions/ResolutionAndCoordinateSystemType'
        }
      },
      required: [
        'Geometry'
      ]
    },
    GeometryType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        CoordinateSystem: {
          $ref: '#/definitions/CoordinateSystemEnum'
        },
        Points: {
          type: 'array',
          items: {
            $ref: '#/definitions/PointType'
          },
          minItems: 1
        },
        BoundingRectangles: {
          type: 'array',
          items: {
            $ref: '#/definitions/BoundingRectangleType'
          },
          minItems: 1
        },
        GPolygons: {
          type: 'array',
          items: {
            $ref: '#/definitions/GPolygonType'
          },
          minItems: 1
        },
        Lines: {
          type: 'array',
          items: {
            $ref: '#/definitions/LineType'
          },
          minItems: 1
        }
      },
      required: [
        'CoordinateSystem'
      ],
      anyOf: [
        {
          required: [
            'Points'
          ]
        },
        {
          required: [
            'BoundingRectangles'
          ]
        },
        {
          required: [
            'GPolygons'
          ]
        },
        {
          required: [
            'Lines'
          ]
        }
      ]
    },
    CoordinateSystemEnum: {
      type: 'string',
      enum: [
        'CARTESIAN',
        'GEODETIC'
      ]
    },
    PointType: {
      type: 'object',
      additionalProperties: false,
      description: 'The longitude and latitude values of a spatially referenced point in degrees.',
      properties: {
        Longitude: {
          $ref: '#/definitions/LongitudeType'
        },
        Latitude: {
          $ref: '#/definitions/LatitudeType'
        }
      },
      required: [
        'Longitude',
        'Latitude'
      ]
    },
    LatitudeType: {
      description: 'The latitude value of a spatially referenced point, in degrees.  Latitude values range from -90 to 90.',
      type: 'number',
      minimum: -90,
      maximum: 90
    },
    LongitudeType: {
      description: 'The longitude value of a spatially referenced point, in degrees.  Longitude values range from -180 to 180.',
      type: 'number',
      minimum: -180,
      maximum: 180
    },
    BoundingRectangleType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        WestBoundingCoordinate: {
          $ref: '#/definitions/LongitudeType'
        },
        NorthBoundingCoordinate: {
          $ref: '#/definitions/LatitudeType'
        },
        EastBoundingCoordinate: {
          $ref: '#/definitions/LongitudeType'
        },
        SouthBoundingCoordinate: {
          $ref: '#/definitions/LatitudeType'
        }
      },
      required: [
        'WestBoundingCoordinate',
        'NorthBoundingCoordinate',
        'EastBoundingCoordinate',
        'SouthBoundingCoordinate'
      ]
    },
    GPolygonType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Boundary: {
          $ref: '#/definitions/BoundaryType'
        },
        ExclusiveZone: {
          $ref: '#/definitions/ExclusiveZoneType'
        }
      },
      required: [
        'Boundary'
      ]
    },
    BoundaryType: {
      type: 'object',
      additionalProperties: false,
      description: 'A boundary is set of points connected by straight lines representing a polygon on the earth. It takes a minimum of three points to make a boundary. Points must be specified in counter-clockwise order and closed (the first and last vertices are the same).',
      properties: {
        Points: {
          type: 'array',
          items: {
            $ref: '#/definitions/PointType'
          },
          minItems: 4
        }
      },
      required: [
        'Points'
      ]
    },
    ExclusiveZoneType: {
      type: 'object',
      additionalProperties: false,
      description: 'Contains the excluded boundaries from the GPolygon.',
      properties: {
        Boundaries: {
          type: 'array',
          items: {
            $ref: '#/definitions/BoundaryType'
          },
          minItems: 1
        }
      },
      required: [
        'Boundaries'
      ]
    },
    LineType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Points: {
          type: 'array',
          items: {
            $ref: '#/definitions/PointType'
          },
          minItems: 2
        }
      },
      required: [
        'Points'
      ]
    },
    VerticalSpatialDomainType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        Type: {
          description: 'Describes the type of the area of vertical space covered by the collection locality.',
          $ref: '#/definitions/VerticalSpatialDomainTypeEnum'
        },
        Value: {
          description: 'Describes the extent of the area of vertical space covered by the collection. Must be accompanied by an Altitude Encoding Method description. The datatype for this attribute is the value of the attribute VerticalSpatialDomainType. The unit for this attribute is the value of either DepthDistanceUnits or AltitudeDistanceUnits.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [
        'Type',
        'Value'
      ]
    },
    VerticalSpatialDomainTypeEnum: {
      type: 'string',
      enum: [
        'Atmosphere Layer',
        'Maximum Altitude',
        'Maximum Depth',
        'Minimum Altitude',
        'Minimum Depth'
      ]
    },
    FootprintType: {
      type: 'object',
      additionalProperties: false,
      description: "The largest width of an instrument's footprint as measured on the Earths surface. The largest Footprint takes the place of SwathWidth in the Orbit Backtrack Algorithm if SwathWidth does not exist. The optional description element allows the user of the record to be able to distinguish between the different footprints of an instrument if it has more than 1.",
      properties: {
        Footprint: {
          description: "The largest width of an instrument's footprint as measured on the Earths surface. The largest Footprint takes the place of SwathWidth in the Orbit Backtrack Algorithm if SwathWidth does not exist.",
          type: 'number'
        },
        FootprintUnit: {
          description: "The Footprint value's unit.",
          type: 'string',
          enum: [
            'Kilometer',
            'Meter'
          ]
        },
        Description: {
          description: 'The description element allows the user of the record to be able to distinguish between the different footprints of an instrument if it has more than 1.',
          type: 'string'
        }
      },
      required: [
        'Footprint',
        'FootprintUnit'
      ]
    },
    OrbitParametersType: {
      description: 'Orbit parameters for the collection used by the Orbital Backtrack Algorithm.',
      oneOf: [
        {
          type: 'object',
          title: 'Orbit parameters with just swath',
          additionalProperties: false,
          properties: {
            SwathWidth: {
              description: 'Total observable width of the satellite sensor nominally measured at the equator.',
              type: 'number'
            },
            SwathWidthUnit: {
              description: "The SwathWidth value's unit.",
              type: 'string',
              enum: [
                'Kilometer',
                'Meter'
              ]
            },
            OrbitPeriod: {
              description: 'The time in decimal minutes the satellite takes to make one full orbit.',
              type: 'number'
            },
            OrbitPeriodUnit: {
              description: "The Orbit Period value's unit.",
              type: 'string',
              enum: [
                'Decimal Minute'
              ]
            },
            InclinationAngle: {
              description: 'The heading of the satellite as it crosses the equator on the ascending pass. This is the same as (180-declination) and also the same as the highest latitude achieved by the satellite.',
              type: 'number'
            },
            InclinationAngleUnit: {
              description: "The InclinationAngle value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            },
            NumberOfOrbits: {
              description: 'The number of full orbits composing each granule. This may be a fraction of an orbit.',
              type: 'number'
            },
            StartCircularLatitude: {
              description: 'The latitude start of the orbit relative to the equator. This is used by the backtrack search algorithm to treat the orbit as if it starts from the specified latitude. This is optional and will default to 0 if not specified.',
              type: 'number'
            },
            StartCircularLatitudeUnit: {
              description: "The StartCircularLatitude value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            }
          },
          required: [
            'SwathWidth',
            'SwathWidthUnit',
            'OrbitPeriod',
            'OrbitPeriodUnit',
            'InclinationAngle',
            'InclinationAngleUnit',
            'NumberOfOrbits'
          ],
          dependencies: {
            StartCircularLatitude: [
              'StartCircularLatitudeUnit'
            ]
          }
        },
        {
          type: 'object',
          title: 'Orbit parameters with just footprints',
          additionalProperties: false,
          properties: {
            Footprints: {
              description: "A list of instrument footprints or field of views. A footprint holds the largest width of the described footprint as measured on the earths surface along with the width's unit. An optional description element exists to be able to distinguish between the footprints, if that is desired. This element is optional. If this element is used at least 1 footprint must exist in the list.",
              type: 'array',
              items: {
                $ref: '#/definitions/FootprintType'
              },
              minItems: 1
            },
            OrbitPeriod: {
              description: 'The time in decimal minutes the satellite takes to make one full orbit.',
              type: 'number'
            },
            OrbitPeriodUnit: {
              description: "The Orbit Period value's unit.",
              type: 'string',
              enum: [
                'Decimal Minute'
              ]
            },
            InclinationAngle: {
              description: 'The heading of the satellite as it crosses the equator on the ascending pass. This is the same as (180-declination) and also the same as the highest latitude achieved by the satellite.',
              type: 'number'
            },
            InclinationAngleUnit: {
              description: "The InclinationAngle value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            },
            NumberOfOrbits: {
              description: 'The number of full orbits composing each granule. This may be a fraction of an orbit.',
              type: 'number'
            },
            StartCircularLatitude: {
              description: 'The latitude start of the orbit relative to the equator. This is used by the backtrack search algorithm to treat the orbit as if it starts from the specified latitude. This is optional and will default to 0 if not specified.',
              type: 'number'
            },
            StartCircularLatitudeUnit: {
              description: "The StartCircularLatitude value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            }
          },
          required: [
            'Footprints',
            'OrbitPeriod',
            'OrbitPeriodUnit',
            'InclinationAngle',
            'InclinationAngleUnit',
            'NumberOfOrbits'
          ],
          dependencies: {
            StartCircularLatitude: [
              'StartCircularLatitudeUnit'
            ]
          }
        },
        {
          type: 'object',
          title: 'Orbit parameters with both swathwidth and footprints',
          additionalProperties: false,
          properties: {
            SwathWidth: {
              description: 'Total observable width of the satellite sensor nominally measured at the equator.',
              type: 'number'
            },
            SwathWidthUnit: {
              description: "The SwathWidth value's unit.",
              type: 'string',
              enum: [
                'Kilometer',
                'Meter'
              ]
            },
            Footprints: {
              description: "A list of instrument footprints or field of views. A footprint holds the largest width of the described footprint as measured on the earths surface along with the width's unit. An optional description element exists to be able to distinguish between the footprints, if that is desired. This element is optional. If this element is used at least 1 footprint must exist in the list.",
              type: 'array',
              items: {
                $ref: '#/definitions/FootprintType'
              },
              minItems: 1
            },
            OrbitPeriod: {
              description: 'The time in decimal minutes the satellite takes to make one full orbit.',
              type: 'number'
            },
            OrbitPeriodUnit: {
              description: "The Orbit Period value's unit.",
              type: 'string',
              enum: [
                'Decimal Minute'
              ]
            },
            InclinationAngle: {
              description: 'The heading of the satellite as it crosses the equator on the ascending pass. This is the same as (180-declination) and also the same as the highest latitude achieved by the satellite.',
              type: 'number'
            },
            InclinationAngleUnit: {
              description: "The InclinationAngle value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            },
            NumberOfOrbits: {
              description: 'The number of full orbits composing each granule. This may be a fraction of an orbit.',
              type: 'number'
            },
            StartCircularLatitude: {
              description: 'The latitude start of the orbit relative to the equator. This is used by the backtrack search algorithm to treat the orbit as if it starts from the specified latitude. This is optional and will default to 0 if not specified.',
              type: 'number'
            },
            StartCircularLatitudeUnit: {
              description: "The StartCircularLatitude value's unit.",
              type: 'string',
              enum: [
                'Degree'
              ]
            }
          },
          required: [
            'SwathWidth',
            'SwathWidthUnit',
            'Footprints',
            'OrbitPeriod',
            'OrbitPeriodUnit',
            'InclinationAngle',
            'InclinationAngleUnit',
            'NumberOfOrbits'
          ],
          dependencies: {
            StartCircularLatitude: [
              'StartCircularLatitudeUnit'
            ]
          }
        }
      ]
    },
    GranuleSpatialRepresentationEnum: {
      type: 'string',
      enum: [
        'CARTESIAN',
        'GEODETIC',
        'ORBIT',
        'NO_SPATIAL'
      ]
    },
    TilingIdentificationSystemType: {
      description: 'A two-dimensional tiling system for a collection. There are two types of tiling systems. Those that use alaph-numeric coordinates and those that use numeric coordinates.',
      oneOf: [
        {
          type: 'object',
          title: 'Tiling Systems that use alpha-numberic coordinates.',
          additionalProperties: false,
          description: 'Information about a two-dimensional tiling system that uses alpha-numeric coordinates related to this collection.',
          properties: {
            TilingIdentificationSystemName: {
              type: 'string',
              enum: [
                'Military Grid Reference System'
              ]
            },
            Coordinate1: {
              description: 'Defines the minimum and maximum values for the first dimension of a two dimensional coordinate system.',
              $ref: '#/definitions/TilingCoordinateType'
            },
            Coordinate2: {
              description: 'Defines the minimum and maximum values for the second dimension of a two dimensional coordinate system.',
              $ref: '#/definitions/TilingCoordinateType'
            }
          },
          required: [
            'TilingIdentificationSystemName',
            'Coordinate1',
            'Coordinate2'
          ]
        },
        {
          type: 'object',
          title: 'Tiling Systems that use numeric coordinates.',
          additionalProperties: false,
          description: 'Information about a two-dimensional tiling system that uses numeric coordinates related to this collection.',
          properties: {
            TilingIdentificationSystemName: {
              type: 'string',
              enum: [
                'CALIPSO',
                'MISR',
                'MODIS Tile EASE',
                'MODIS Tile SIN',
                'WELD Alaska Tile',
                'WELD CONUS Tile',
                'WRS-1',
                'WRS-2'
              ]
            },
            Coordinate1: {
              description: 'Defines the minimum and maximum values for the first dimension of a two dimensional coordinate system.',
              $ref: '#/definitions/TilingCoordinateNumericType'
            },
            Coordinate2: {
              description: 'Defines the minimum and maximum values for the second dimension of a two dimensional coordinate system.',
              $ref: '#/definitions/TilingCoordinateNumericType'
            }
          },
          required: [
            'TilingIdentificationSystemName',
            'Coordinate1',
            'Coordinate2'
          ]
        }
      ]
    },
    TilingCoordinateType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines the alpha-numeric minimum and maximum values for one dimension of a two dimensional coordinate system.',
      properties: {
        MinimumValue: {
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        MaximumValue: {
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      }
    },
    TilingCoordinateNumericType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines the numeric minimum and maximum values for one dimension of a two dimensional coordinate system.',
      properties: {
        MinimumValue: {
          type: 'number'
        },
        MaximumValue: {
          type: 'number'
        }
      }
    },
    SpatialInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity stores the reference frame or system from which horizontal and vertical spatial domains are measured. The horizontal reference frame includes a Geodetic Model, Geographic Coordinates, and Local Coordinates. The Vertical reference frame includes altitudes (elevations) and depths.',
      properties: {
        VerticalCoordinateSystem: {
          $ref: '#/definitions/VerticalCoordinateSystemType'
        },
        SpatialCoverageType: {
          description: 'Denotes whether the spatial coverage of the collection is horizontal, vertical, horizontal and vertical, orbit, or vertical and orbit.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [
        'SpatialCoverageType'
      ]
    },
    VerticalCoordinateSystemType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        AltitudeSystemDefinition: {
          $ref: '#/definitions/AltitudeSystemDefinitionType'
        },
        DepthSystemDefinition: {
          $ref: '#/definitions/DepthSystemDefinitionType'
        }
      }
    },
    AltitudeDistanceUnitsEnum: {
      description: 'The units in which altitude measurements are recorded.',
      type: 'string',
      enum: [
        'HectoPascals',
        'Kilometers',
        'Millibars'
      ]
    },
    DepthDistanceUnitsEnum: {
      description: 'The units in which depth measurements are recorded.',
      type: 'string',
      enum: [
        'Fathoms',
        'Feet',
        'HectoPascals',
        'Meters',
        'Millibars'
      ]
    },
    AltitudeSystemDefinitionType: {
      type: 'object',
      additionalProperties: false,
      description: "The reference frame or system from which altitude is measured. The term 'altitude' is used instead of the common term 'elevation' to conform to the terminology in Federal Information Processing Standards 70-1 and 173. The information contains the datum name, distance units and encoding method, which provide the definition for the system.",
      properties: {
        DatumName: {
          description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DistanceUnits: {
          description: 'The units in which measurements are recorded.',
          $ref: '#/definitions/AltitudeDistanceUnitsEnum'
        },
        Resolutions: {
          description: 'The minimum distance possible between two adjacent values, expressed in distance units of measure for the collection.',
          type: 'array',
          items: {
            type: 'number'
          },
          minItems: 0
        }
      }
    },
    DepthSystemDefinitionType: {
      type: 'object',
      additionalProperties: false,
      description: 'The reference frame or system from which depth is measured. The information contains the datum name, distance units and encoding method, which provide the definition for the system.',
      properties: {
        DatumName: {
          description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        DistanceUnits: {
          description: 'The units in which measurements are recorded.',
          $ref: '#/definitions/DepthDistanceUnitsEnum'
        },
        Resolutions: {
          description: 'The minimum distance possible between two adjacent values, expressed in distance units of measure for the collection.',
          type: 'array',
          items: {
            type: 'number'
          },
          minItems: 0
        }
      }
    },
    ResolutionAndCoordinateSystemType: {
      description: "This class defines the horizontal spatial extents coordinate system and the data product's horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.",
      oneOf: [
        {
          type: 'object',
          title: 'Geodetic Model',
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: '#/definitions/DescriptionType'
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: '#/definitions/GeodeticModelType'
            }
          },
          required: [
            'GeodeticModel'
          ]
        },
        {
          type: 'object',
          title: 'Horizontal Data Resolution',
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: '#/definitions/DescriptionType'
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: '#/definitions/GeodeticModelType'
            },
            HorizontalDataResolution: {
              description: 'This class defines a number of the data products horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.',
              $ref: '#/definitions/HorizontalDataResolutionType'
            }
          },
          required: [
            'HorizontalDataResolution'
          ]
        },
        {
          type: 'object',
          title: 'Local Coordinate System',
          additionalProperties: false,
          properties: {
            Description: {
              description: 'This element holds a description about the resolution and coordinate system for people to read.',
              $ref: '#/definitions/DescriptionType'
            },
            GeodeticModel: {
              description: 'This element describes the geodetic model for the data product.',
              $ref: '#/definitions/GeodeticModelType'
            },
            LocalCoordinateSystem: {
              description: 'This element describes the local coordinate system for the data product.',
              $ref: '#/definitions/LocalCoordinateSystemType'
            }
          },
          required: [
            'LocalCoordinateSystem'
          ]
        }
      ]
    },
    DescriptionType: {
      description: 'This element defines what a description is.',
      type: 'string',
      minLength: 1,
      maxLength: 2048
    },
    GeodeticModelType: {
      description: 'This element describes the geodetic model for the data product.',
      type: 'object',
      additionalProperties: false,
      properties: {
        HorizontalDatumName: {
          description: 'The identification given to the reference system used for defining the coordinates of points.',
          $ref: '#/definitions/DatumNameType'
        },
        EllipsoidName: {
          description: "Identification given to established representation of the Earth's shape.",
          type: 'string',
          minLength: 1,
          maxLength: 255
        },
        SemiMajorAxis: {
          description: 'Radius of the equatorial axis of the ellipsoid.',
          type: 'number'
        },
        DenominatorOfFlatteningRatio: {
          description: "The ratio of the Earth's major axis to the difference between the major and the minor.",
          type: 'number'
        }
      }
    },
    DatumNameType: {
      description: 'The identification given to the level surface taken as the surface of reference from which measurements are compared.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    HorizontalDataResolutionType: {
      description: 'This class defines a number of the data products horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.',
      type: 'object',
      additionalProperties: false,
      properties: {
        VariesResolution: {
          description: 'Varies Resolution object describes a data product that has a number of resolution values.',
          $ref: '#/definitions/HorizontalDataResolutionVariesType'
        },
        PointResolution: {
          description: 'Point Resolution object describes a data product that is from a point source.',
          $ref: '#/definitions/HorizontalDataResolutionPointType'
        },
        NonGriddedResolutions: {
          description: 'Non Gridded Resolutions object describes resolution data for non gridded data products.',
          type: 'array',
          items: {
            $ref: '#/definitions/HorizontalDataResolutionNonGriddedType'
          },
          minItems: 1
        },
        NonGriddedRangeResolutions: {
          description: 'Non Gridded Range Resolutions object describes range resolution data for non gridded data products.',
          type: 'array',
          items: {
            $ref: '#/definitions/HorizontalDataResolutionNonGriddedRangeType'
          },
          minItems: 1
        },
        GriddedResolutions: {
          description: 'Gridded Resolutions object describes resolution data for gridded data products.',
          type: 'array',
          items: {
            $ref: '#/definitions/HorizontalDataResolutionGriddedType'
          },
          minItems: 1
        },
        GriddedRangeResolutions: {
          description: 'Gridded Range Resolutions object describes range resolution data for gridded data products.',
          type: 'array',
          items: {
            $ref: '#/definitions/HorizontalDataResolutionGriddedRangeType'
          },
          minItems: 1
        },
        GenericResolutions: {
          description: 'Generic Resolutions object describes general resolution data for a data product where it is not known if a data product is gridded or not.',
          type: 'array',
          items: {
            $ref: '#/definitions/HorizontalDataGenericResolutionType'
          },
          minItems: 1
        }
      }
    },
    HorizontalDataResolutionVariesType: {
      description: 'Varies Resolution object describes a data product that has a number of resolution values.',
      type: 'string',
      enum: [
        'Varies'
      ]
    },
    HorizontalDataResolutionPointType: {
      description: 'Point Resolution object describes a data product that is from a point source.',
      type: 'string',
      enum: [
        'Point'
      ]
    },
    HorizontalDataResolutionNonGriddedType: {
      description: 'Non Gridded Resolutions object describes resolution data for non gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: '#/definitions/HorizontalDataResolutionUnitEnum'
        },
        ViewingAngleType: {
          description: 'This element describes the angle of the measurement with respect to the instrument that gives an understanding of the specified resolution.',
          $ref: '#/definitions/HorizontalResolutionViewingAngleType'
        },
        ScanDirection: {
          description: 'This element describes the instrument scanning direction.',
          $ref: '#/definitions/HorizontalResolutionScanDirectionType'
        }
      },
      anyOf: [
        {
          required: [
            'XDimension',
            'Unit'
          ]
        },
        {
          required: [
            'YDimension',
            'Unit'
          ]
        }
      ]
    },
    HorizontalDataResolutionNonGriddedRangeType: {
      description: 'Non Gridded Range Resolutions object describes range resolution data for non gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MinimumXDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MinimumYDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        MaximumXDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MaximumYDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: '#/definitions/HorizontalDataResolutionUnitEnum'
        },
        ViewingAngleType: {
          description: 'This element describes the angle of the measurement with respect to the instrument that gives an understanding of the specified resolution.',
          $ref: '#/definitions/HorizontalResolutionViewingAngleType'
        },
        ScanDirection: {
          description: 'This element describes the instrument scanning direction.',
          $ref: '#/definitions/HorizontalResolutionScanDirectionType'
        }
      },
      anyOf: [
        {
          required: [
            'MinimumXDimension',
            'MaximumXDimension',
            'Unit'
          ]
        },
        {
          required: [
            'MinimumYDimension',
            'MaximumYDimension',
            'Unit'
          ]
        }
      ]
    },
    HorizontalDataResolutionGriddedType: {
      description: 'Gridded Resolutions object describes resolution data for gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: '#/definitions/HorizontalDataResolutionUnitEnum'
        }
      },
      anyOf: [
        {
          required: [
            'XDimension',
            'Unit'
          ]
        },
        {
          required: [
            'YDimension',
            'Unit'
          ]
        }
      ]
    },
    HorizontalDataResolutionGriddedRangeType: {
      description: 'Gridded Range Resolutions object describes range resolution data for gridded data products.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MinimumXDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MinimumYDimension: {
          description: 'The minimum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        MaximumXDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        MaximumYDimension: {
          description: 'The maximum, minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: '#/definitions/HorizontalDataResolutionUnitEnum'
        }
      },
      anyOf: [
        {
          required: [
            'MinimumXDimension',
            'MaximumXDimension',
            'Unit'
          ]
        },
        {
          required: [
            'MinimumYDimension',
            'MaximumYDimension',
            'Unit'
          ]
        }
      ]
    },
    HorizontalDataGenericResolutionType: {
      description: 'Generic Resolutions object describes general resolution data for a data product where it is not known if a data product is gridded or not.',
      type: 'object',
      additionalProperties: false,
      properties: {
        XDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plane in the X axis. In most cases this is along the longitudinal axis.',
          type: 'number'
        },
        YDimension: {
          description: 'The minimum difference between two adjacent values on a horizontal plan in the Y axis. In most cases this is along the latitudinal axis.',
          type: 'number'
        },
        Unit: {
          description: 'Units of measure used for the XDimension and YDimension values.',
          $ref: '#/definitions/HorizontalDataResolutionUnitEnum'
        }
      },
      anyOf: [
        {
          required: [
            'XDimension',
            'Unit'
          ]
        },
        {
          required: [
            'YDimension',
            'Unit'
          ]
        }
      ]
    },
    HorizontalDataResolutionUnitEnum: {
      description: 'Units of measure used for the geodetic latitude and longitude resolution values (e.g., decimal degrees).',
      type: 'string',
      enum: [
        'Decimal Degrees',
        'Kilometers',
        'Meters',
        'Statute Miles',
        'Nautical Miles',
        'Not provided'
      ]
    },
    HorizontalResolutionViewingAngleType: {
      description: 'This element describes the angle of the measurement with respect to the instrument that give an understanding of the specified resolution.',
      type: 'string',
      enum: [
        'At Nadir',
        'Scan Extremes'
      ]
    },
    HorizontalResolutionScanDirectionType: {
      description: 'This element describes the instrument scanning direction.',
      type: 'string',
      enum: [
        'Along Track',
        'Cross Track'
      ]
    },
    LocalCoordinateSystemType: {
      type: 'object',
      additionalProperties: false,
      properties: {
        GeoReferenceInformation: {
          description: 'The information provided to register the local system to the Earth (e.g. control points, satellite ephemeral data, and inertial navigation data).',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        },
        Description: {
          description: 'A description of the Local Coordinate System and geo-reference information.',
          type: 'string',
          minLength: 1,
          maxLength: 2048
        }
      }
    },
    CollectionDataTypeEnum: {
      description: "This element is used to identify the collection's ready for end user consumption latency from when the data was acquired by an instrument. NEAR_REAL_TIME is defined to be ready for end user consumption 1 to 3 hours after data acquisition. LOW_LATENCY is defined to be ready for consumption 3 to 24 hours after data acquisition. EXPEDITED is defined to be 1 to 4 days after data acquisition. SCIENCE_QUALITY is defined to mean that a collection has been fully and completely processed which usually takes between 2 to 3 weeks after data acquisition. OTHER is defined for collection where the latency is between EXPEDITED and SCIENCE_QUALITY.",
      type: 'string',
      enum: [
        'NEAR_REAL_TIME',
        'LOW_LATENCY',
        'EXPEDITED',
        'SCIENCE_QUALITY',
        'OTHER'
      ]
    },
    CollectionProgressEnum: {
      description: 'This element describes the production status of the data set. There are five choices for Data Providers: PLANNED refers to data sets to be collected in the future and are thus unavailable at the present time. For Example: The Hydro spacecraft has not been launched, but information on planned data sets may be available. ACTIVE refers to data sets currently in production or data that is continuously being collected or updated. For Example: data from the AIRS instrument on Aqua is being collected continuously. COMPLETE refers to data sets in which no updates or further data collection will be made. For Example: Nimbus-7 SMMR data collection has been completed. DEPRECATED refers to data sets that have been retired, but still can be retrieved. Usually newer products exist that replace the retired data set. NOT APPLICABLE refers to data sets in which a collection progress is not applicable such as a calibration collection. There is a sixth value of NOT PROVIDED that should not be used by a data provider. It is currently being used as a value when a correct translation cannot be done with the current valid values, or when the value is not provided by the data provider.',
      type: 'string',
      enum: [
        'ACTIVE',
        'PLANNED',
        'COMPLETE',
        'DEPRECATED',
        'INREVIEW',
        'NOT PROVIDED',
        'PREPRINT',
        'SUPERSEDED'
      ]
    },
    LocationKeywordType: {
      description: 'This element defines a hierarchical location list. It replaces SpatialKeywords. The controlled vocabulary for location keywords is maintained in the Keyword Management System (KMS). Each tier must have data in the tier above it.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Category: {
          description: 'Top-level controlled keyword hierarchical level that contains the largest general location where the collection data was taken from.',
          $ref: '#/definitions/KeywordStringType'
        },
        Type: {
          description: 'Second-tier controlled keyword hierarchical level that contains the regional location where the collection data was taken from',
          $ref: '#/definitions/KeywordStringType'
        },
        Subregion1: {
          description: 'Third-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: '#/definitions/KeywordStringType'
        },
        Subregion2: {
          description: 'Fourth-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: '#/definitions/KeywordStringType'
        },
        Subregion3: {
          description: 'Fifth-tier controlled keyword hierarchical level that contains the regional sub-location where the collection data was taken from',
          $ref: '#/definitions/KeywordStringType'
        },
        DetailedLocation: {
          description: 'Uncontrolled keyword hierarchical level that contains the specific location where the collection data was taken from. Exists outside the hierarchy.',
          $ref: '#/definitions/KeywordStringType'
        }
      },
      required: [
        'Category'
      ]
    },
    ArchiveDistributionFormatTypeEnum: {
      description: 'Defines the possible values for the Archive or Distribution file format type.',
      type: 'string',
      enum: [
        'Native',
        'Supported'
      ]
    },
    ArchiveDistributionFormatDescriptionType: {
      description: 'Allows a data provider to provide supporting information about the stated format.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    ArchiveDistributionUnitEnum: {
      description: 'Defines the possible values for the archive and distribution size units.',
      type: 'string',
      enum: [
        'KB',
        'MB',
        'GB',
        'TB',
        'PB',
        'NA'
      ]
    },
    DistributionMediaType: {
      description: 'This element defines the media by which the end user can obtain the distributable item. Examples of media include: CD-ROM, 9 track tape, diskettes, hard drives, online, transparencies, hardcopy, etc.',
      type: 'string',
      minLength: 1,
      maxLength: 80
    },
    FileArchiveInformationType: {
      description: 'This element defines a single artifact that is distributed by the data provider. This element only includes the distributable artifacts that can be obtained by the user without the user having to invoke a service. These should be documented in the UMM-S specification',
      anyOf: [
        {
          type: 'object',
          title: 'Total collection file size for archive',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for an archival artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS).',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the archivable item's format is its native format or another supported format.",
              $ref: '#/definitions/ArchiveDistributionFormatTypeEnum'
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: '#/definitions/ArchiveDistributionFormatDescriptionType'
            },
            AverageFileSize: {
              description: 'An approximate average size of the archivable item. This gives an end user an idea of the magnitude for each archivable file if more than 1 exists.',
              type: 'number',
              minimum: 0
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            TotalCollectionFileSize: {
              description: 'An approximate total size of all of the archivable items within a collection. This gives an end user an idea of the magnitude for all of archivable files combined.',
              type: 'number',
              minimum: 0
            },
            TotalCollectionFileSizeUnit: {
              description: 'Unit of measure for the total collection file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the archivable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [
            'Format'
          ],
          dependencies: {
            AverageFileSize: [
              'AverageFileSizeUnit'
            ],
            TotalCollectionFileSize: [
              'TotalCollectionFileSizeUnit'
            ]
          }
        },
        {
          type: 'object',
          title: 'Calculate collection file size by start date for archive',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for an archival artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS).',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the archivable item's format is its native format or another supported format.",
              $ref: '#/definitions/ArchiveDistributionFormatTypeEnum'
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: '#/definitions/ArchiveDistributionFormatDescriptionType'
            },
            AverageFileSize: {
              description: 'An approximate average size of the archivable item. This gives an end user an idea of the magnitude for each archivable file if more than 1 exists.',
              type: 'number',
              minimum: 0
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            TotalCollectionFileSizeBeginDate: {
              description: 'The date of which this collection started to collect data.  This date is used by users to be able to calculate the current total collection file size. The date needs to be in the yyyy-MM-ddTHH:mm:ssZ format; for example: 2018-01-01T10:00:00Z.',
              format: 'date-time',
              type: 'string'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the archivable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [
            'Format'
          ],
          dependencies: {
            AverageFileSize: [
              'AverageFileSizeUnit'
            ],
            TotalCollectionFileSizeBeginDate: [
              'AverageFileSize'
            ]
          }
        }
      ]
    },
    FileDistributionInformationType: {
      description: 'This element defines a single artifact that is distributed by the data provider. This element only includes the distributable artifacts that can be obtained by the user without the user having to invoke a service. These should be documented in the UMM-S specification.',
      anyOf: [
        {
          type: 'object',
          title: 'Total collection file size for distribution',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for a distributable artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml.',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the distributable item's format is its native format or another supported format.",
              $ref: '#/definitions/ArchiveDistributionFormatTypeEnum'
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: '#/definitions/ArchiveDistributionFormatDescriptionType'
            },
            Media: {
              description: 'This element defines the media by which the end user can obtain the distributable item. Each media type is listed separately. Examples of media include HTTPS, Earthdata Cloud, etc.',
              type: 'array',
              items: {
                $ref: '#/definitions/DistributionMediaType'
              },
              minItems: 1
            },
            AverageFileSize: {
              description: 'An approximate average size of the distributable item. This gives an end user an idea of the magnitude for each distributable file if more than 1 exists.',
              type: 'number',
              minimum: 0
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            TotalCollectionFileSize: {
              description: 'An approximate total size of all of the distributable items within a collection. This gives an end user an idea of the magnitude for all of distributable files combined.',
              type: 'number',
              minimum: 0
            },
            TotalCollectionFileSizeUnit: {
              description: 'Unit of measure for the total collection file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Fees: {
              description: 'Conveys the price one has to pay to obtain the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          },
          required: [
            'Format'
          ],
          dependencies: {
            AverageFileSize: [
              'AverageFileSizeUnit'
            ],
            TotalCollectionFileSize: [
              'TotalCollectionFileSizeUnit'
            ]
          }
        },
        {
          type: 'object',
          title: 'Calculate collection file size by start date for distribution',
          additionalProperties: false,
          properties: {
            Format: {
              description: 'This element defines a single format for a distributable artifact. Examples of format include: ascii, binary, GRIB, BUFR, HDF4, HDF5, HDF-EOS4, HDF-EOS5, jpeg, png, tiff, geotiff, kml.',
              type: 'string',
              minLength: 1,
              maxLength: 80
            },
            FormatType: {
              description: "Allows the provider to state whether the distributable item's format is its native format or another supported format.",
              $ref: '#/definitions/ArchiveDistributionFormatTypeEnum'
            },
            FormatDescription: {
              description: 'Allows the record provider to provide supporting documentation about the Format.',
              $ref: '#/definitions/ArchiveDistributionFormatDescriptionType'
            },
            Media: {
              description: 'This element defines the media by which the end user can obtain the distributable item. Each media type is listed separately. Examples of media include: CD-ROM, 9 track tape, diskettes, hard drives, online, transparencies, hardcopy, etc.',
              type: 'array',
              items: {
                $ref: '#/definitions/DistributionMediaType'
              },
              minItems: 1
            },
            AverageFileSize: {
              description: 'An approximate average size of the distributable item. This gives an end user an idea of the magnitude for each distributable file if more than 1 exists.',
              type: 'number',
              minimum: 0
            },
            AverageFileSizeUnit: {
              description: 'Unit of measure for the average file size.',
              $ref: '#/definitions/ArchiveDistributionUnitEnum'
            },
            TotalCollectionFileSizeBeginDate: {
              description: 'The date of which this collection started to collect data.  This date is used by users to be able to calculate the current total collection file size. The date needs to be in the yyyy-MM-ddTHH:mm:ssZ format; for example: 2018-01-01T10:00:00Z.',
              format: 'date-time',
              type: 'string'
            },
            Description: {
              description: 'Provides the data provider a way to convey more information about the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Fees: {
              description: 'Conveys the price one has to pay to obtain the distributable item.',
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          },
          required: [
            'Format'
          ],
          dependencies: {
            AverageFileSize: [
              'AverageFileSizeUnit'
            ],
            TotalCollectionFileSizeBeginDate: [
              'AverageFileSize'
            ]
          }
        }
      ]
    },
    ArchiveAndDistributionInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element and all of its sub elements exist for display purposes. It allows a data provider to provide archive and distribution information up front to an end user, to help them decide if they can use the product.',
      properties: {
        FileArchiveInformation: {
          description: 'This element defines a single archive artifact which a data provider would like to inform an end user that it exists.',
          type: 'array',
          items: {
            $ref: '#/definitions/FileArchiveInformationType'
          },
          minItems: 1
        },
        FileDistributionInformation: {
          description: 'This element defines a single artifact that is distributed by the data provider. This element only includes the distributable artifacts that can be obtained by the user without the user having to invoke a service. These should be documented in the UMM-S specification.',
          type: 'array',
          items: {
            $ref: '#/definitions/FileDistributionInformationType'
          },
          minItems: 1
        }
      },
      anyOf: [
        {
          required: [
            'FileArchiveInformation'
          ]
        },
        {
          required: [
            'FileDistributionInformation'
          ]
        }
      ]
    },
    DirectDistributionInformationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element allows end users to get direct access to data products that are stored in the Amazon Web Service (AWS) S3 buckets. The sub elements include S3 credentials end point and a documentation URL as well as bucket prefix names and an AWS region.',
      properties: {
        Region: {
          description: 'Defines the possible values for the Amazon Web Service US Regions where the data product resides.',
          $ref: '#/definitions/DirectDistributionInformationRegionEnum'
        },
        S3BucketAndObjectPrefixNames: {
          description: 'Defines the possible values for the Amazon Web Service US S3 bucket and/or object prefix names.',
          type: 'array',
          items: {
            type: 'string',
            minLength: 1,
            maxLength: 1024,
            pattern: '[!-~]{1,1024}'
          },
          minItems: 1
        },
        S3CredentialsAPIEndpoint: {
          description: 'Defines the URL where the credentials are stored.',
          type: 'string',
          format: 'uri',
          minLength: 1,
          maxLength: 1024
        },
        S3CredentialsAPIDocumentationURL: {
          description: 'Defines the URL where the credential documentation are stored.',
          type: 'string',
          format: 'uri',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'Region',
        'S3CredentialsAPIEndpoint',
        'S3CredentialsAPIDocumentationURL'
      ]
    },
    DirectDistributionInformationRegionEnum: {
      description: 'Defines the possible values for the Amazon Web Service US Regions where the data product resides.',
      type: 'string',
      enum: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2'
      ]
    },
    FileNamingConventionType: {
      type: 'object',
      additionalProperties: false,
      description: "The File Naming Convention refers to the naming convention of the data set's (Collection's) data files along with a description of the granule file construction.",
      properties: {
        Convention: {
          description: 'This element represents the convention of the filename.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        Description: {
          description: 'This element describes the convention of the filename.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      },
      required: [
        'Convention'
      ]
    },
    AssociatedDoiType: {
      oneOf: [
        {
          type: 'object',
          title: 'All Documented DOI Types',
          additionalProperties: false,
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. NASA metadata providers are strongly encouraged to include DOI and DOI Authority for their collections using CollectionDOI property.",
          properties: {
            DOI: {
              description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Title: {
              description: "The title of the DOI landing page. The title describes the DOI object to a user, so they don't have to look it up themselves to understand the association.",
              $ref: '#/definitions/TitleType'
            },
            Authority: {
              description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
              $ref: '#/definitions/AuthorityType'
            },
            Type: {
              description: 'This element describes to what DOI is associated.',
              type: 'string',
              enum: [
                'Child Dataset',
                'Collaborative/Other Agency',
                'Field Campaign',
                'IsPreviousVersionOf',
                'IsNewVersionOf',
                'Parent Dataset',
                'Related Dataset'
              ]
            }
          },
          required: [
            'DOI'
          ]
        },
        {
          type: 'object',
          title: 'Other DOI Types',
          additionalProperties: false,
          description: "This element stores the DOI (Digital Object Identifier) that identifies the collection. Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL. The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used. NASA metadata providers are strongly encouraged to include DOI and DOI Authority for their collections using CollectionDOI property.",
          properties: {
            DOI: {
              description: "This element stores the DOI (Digital Object Identifier) that identifies the collection.  Note: The values should start with the directory indicator which in ESDIS' case is 10.  If the DOI was registered through ESDIS, the beginning of the string should be 10.5067. The DOI URL is not stored here; it should be stored as a RelatedURL.",
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Title: {
              description: "The title of the DOI landing page. The title describes the DOI object to a user, so they don't have to look it up themselves to understand the association.",
              $ref: '#/definitions/TitleType'
            },
            Authority: {
              description: 'The DOI organization that is responsible for creating the DOI is described in the Authority element. For ESDIS records the value of https://doi.org/ should be used.',
              $ref: '#/definitions/AuthorityType'
            },
            Type: {
              description: 'This element describes to what DOI is associated.',
              type: 'string',
              enum: [
                'Other'
              ]
            },
            DescriptionOfOtherType: {
              description: 'This element allows the curator to describe what kind of DOI is present when the value of Other is chosen as the type. This element is not allowed if a value other than Other is chosen.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [
            'DOI',
            'Type',
            'DescriptionOfOtherType'
          ]
        }
      ]
    },
    OtherIdentifierType: {
      oneOf: [
        {
          type: 'object',
          title: 'ArchiveSetsNumber',
          additionalProperties: false,
          description: 'This object stores an additional identifier of the collection.',
          properties: {
            Identifier: {
              description: 'This element stores the identifier',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Type: {
              description: 'This element represents the type of the identifier.',
              type: 'string',
              enum: [
                'ArchiveSetsNumber'
              ]
            }
          },
          required: [
            'Identifier',
            'Type'
          ]
        },
        {
          type: 'object',
          title: 'Other',
          additionalProperties: false,
          description: 'This object stores an additional identifier of the collection.',
          properties: {
            Identifier: {
              description: 'This element stores the identifier',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            Type: {
              description: 'This element represents the type of the identifier.',
              type: 'string',
              enum: [
                'Other'
              ]
            },
            DescriptionOfOtherType: {
              description: 'This element allows the curator to describe what kind of Identifier is present when the value of Other is chosen as the type. This element is not allowed if a value other than Other is chosen.',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            }
          },
          required: [
            'Identifier',
            'Type',
            'DescriptionOfOtherType'
          ]
        }
      ]
    },
    MetadataSpecificationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object requires any metadata record that is validated by this schema to provide information about the schema.',
      properties: {
        URL: {
          description: 'This element represents the URL where the schema lives. The schema can be downloaded.',
          type: 'string',
          enum: [
            'https://cdn.earthdata.nasa.gov/umm/collection/v1.18.3'
          ]
        },
        Name: {
          description: 'This element represents the name of the schema.',
          type: 'string',
          enum: [
            'UMM-C'
          ]
        },
        Version: {
          description: 'This element represents the version of the schema.',
          type: 'string',
          enum: [
            '1.18.3'
          ]
        }
      },
      required: [
        'URL',
        'Name',
        'Version'
      ]
    },
    OrbitParameterExistsIfGranuleSpatialRepresentationIsOrbit: {
      $comment: 'Checks if the Granule Spatial Representation value is Oribt, then the oribt parameter must exist.',
      if: {
        properties: {
          GranuleSpatialRepresentation: {
            const: 'ORBIT'
          }
        }
      },
      then: {
        required: [
          'OrbitParameters'
        ]
      }
    }
  }
}
export default ummCSchema
