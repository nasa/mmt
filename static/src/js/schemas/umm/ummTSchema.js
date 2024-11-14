const ummTSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UMM-T',
  type: 'object',
  additionalProperties: false,
  properties: {
    Name: {
      description: 'The name of the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    LongName: {
      description: 'The long name of the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    Type: {
      description: 'The type of the downloadable tool or web user interface.',
      $ref: '#/definitions/ToolTypeEnum'
    },
    Version: {
      description: "The edition or version of the web user interface software, or tool. A value of 'NOT PROVIDED' may be used if the version is not available or unknown.",
      type: 'string',
      minLength: 1,
      maxLength: 20
    },
    VersionDescription: {
      description: 'This field provides users with information on what changes were included in the most recent version.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    LastUpdatedDate: {
      description: 'This element describes the latest date when the tool was most recently pushed to production for support and maintenance. ',
      format: 'date-time',
      type: 'string'
    },
    Description: {
      description: 'A brief description of the web user interface or downloadable tool. Note: This field allows lightweight markup language with plain text formatting syntax. Line breaks within the text are preserved.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    URL: {
      description: 'The URL where you can directly access the web user interface or downloadable tool.',
      $ref: '#/definitions/URLType'
    },
    DOI: {
      description: 'The Digital Object Identifier (DOI) of the web user interface or downloadable tool.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    RelatedURLs: {
      description: 'A URL associated with the web user interface or downloadable tool, e.g., the home page for the tool provider which is responsible for the tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/RelatedURLType'
      },
      minItems: 0
    },
    SupportedOutputFormats: {
      description: 'The project element describes the list of output format names supported by the web user interface or downloadable tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/SupportedFormatTypeEnum'
      },
      minItems: 0
    },
    SupportedInputFormats: {
      description: 'The project element describes the list of input format names supported by the web user interface or downloadable tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/SupportedFormatTypeEnum'
      },
      minItems: 0
    },
    SupportedOperatingSystems: {
      description: 'The operating system(s) and associated version supported by the downloadable tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/SupportedOperatingSystemType'
      },
      minItems: 0
    },
    SupportedBrowsers: {
      description: 'The browser(s) and associated version supported by the web user interface.',
      type: 'array',
      items: {
        $ref: '#/definitions/SupportedBrowserType'
      },
      minItems: 0
    },
    SupportedSoftwareLanguages: {
      description: 'The programming language(s) and associated version supported by the downloadable tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/SupportedSoftwareLanguageType'
      },
      minItems: 0
    },
    ToolKeywords: {
      description: 'Allows for the specification of Earth Science keywords that are representative of the service, software, or tool being described. The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: '#/definitions/ToolKeywordType'
      },
      minItems: 1
    },
    Organizations: {
      description: 'The tool provider, or organization, or institution responsible for developing, archiving, and/or distributing the web user interface, software, or tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/OrganizationType'
      },
      minItems: 1
    },
    Quality: {
      description: 'Information about the quality of the downloadable tool or web user interface. This would include information about any quality assurance procedures followed in development. Note: This field allows lightweight markup language with plain text formatting syntax. Line breaks within the text are preserved.',
      $ref: '#/definitions/ToolQualityType'
    },
    AccessConstraints: {
      description: 'Information about any constraints for accessing the downloadable tool or web user interface.',
      $ref: '#/definitions/AccessConstraintsType'
    },
    UseConstraints: {
      description: 'Information on how the item (downloadable tool or web user interface) may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness.',
      $ref: '#/definitions/UseConstraintsType'
    },
    AncillaryKeywords: {
      description: 'Words or phrases to further describe the downloadable tool or web user interface.',
      type: 'array',
      items: {
        $ref: '#/definitions/AncillaryKeywordsType'
      },
      minItems: 0
    },
    ContactPersons: {
      description: 'This is the contact persons of the downloadable tool or web user interface.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactPersonType'
      }
    },
    ContactGroups: {
      description: 'Group(s) to contact at an organization to get information about the web user interface or downloadable tool, including how the group may be contacted.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactGroupType'
      }
    },
    PotentialAction: {
      description: 'This element contains information about a smart handoff from one web user interface to another.',
      $ref: '#/definitions/PotentialActionType'
    },
    MetadataSpecification: {
      description: "Requires the client, or user, to add in schema information into every tool record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: '#/definitions/MetadataSpecificationType'
    }
  },
  required: [
    'Name',
    'LongName',
    'Type',
    'Version',
    'Description',
    'ToolKeywords',
    'Organizations',
    'URL',
    'MetadataSpecification'
  ],
  definitions: {
    URLType: {
      type: 'object',
      additionalProperties: false,
      description: 'Represents the Internet site where you can directly access the tool or web user interface.',
      properties: {
        Description: {
          description: 'Description of online resource at this URL.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        URLContentType: {
          description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Type: {
          description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Subtype: {
          description: 'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URLValue: {
          description: 'The URL for the relevant online resource where you can directly access the downloadable tool or web user interface.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'URLContentType',
        'Type',
        'URLValue'
      ]
    },
    RelatedURLType: {
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
          description: 'A keyword describing the distinct content type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Type: {
          description: 'A keyword describing the type of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Subtype: {
          description: 'A keyword describing the subtype of the online resource to this resource. This helps software present the information to the user. The valid values are contained in the KMS System: https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/all/8759ab63-ac04-4136-bc25-0c00eece1096/.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        URL: {
          description: 'The web address for the relevant web page.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        Format: {
          description: 'Describes the organization of the data content so that users and applications know how to read and use the content. The controlled vocabulary for formats is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/DataFormat?gtm_scheme=DataFormat',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        MimeType: {
          description: 'The multi-purpose internet mail extensions indicates the nature and format of the data that is accessed through the URL. The controlled vocabulary for MimeTypes is maintained in the Keyword Management System (KMS): https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/MimeType?gtm_scheme=MimeType',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      },
      required: [
        'URL',
        'URLContentType',
        'Type'
      ]
    },
    SupportedOperatingSystemType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element describes the operating system(s) and associated version supported by the downloadable tool.',
      properties: {
        OperatingSystemName: {
          description: 'The short name of the operating system associated with the downloadable tool.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        OperatingSystemVersion: {
          description: 'The version of the operating system associated with the downloadable tool.',
          type: 'string',
          minLength: 0,
          maxLength: 80
        }
      }
    },
    SupportedBrowserType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element describes the browser(s) and associated version supported by the downloadable tool.',
      properties: {
        BrowserName: {
          description: 'The short name of the browser associated with the downloadable tool.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        BrowserVersion: {
          description: 'The version of the browser associated with the downloadable tool.',
          type: 'string',
          minLength: 0,
          maxLength: 80
        }
      }
    },
    SupportedSoftwareLanguageType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element describes the programming language(s) and associated version supported by the web user interface.',
      properties: {
        SoftwareLanguageName: {
          description: 'The short name of the programming language associated with the downloadable tool.',
          type: 'string',
          minLength: 0,
          maxLength: 1024
        },
        SoftwareLanguageVersion: {
          description: 'The version of the programming language associated with the downloadable tool.',
          type: 'string',
          minLength: 0,
          maxLength: 80
        }
      }
    },
    SupportedFormatTypeEnum: {
      description: 'This element contains a list of file formats supported by the tool.',
      type: 'string',
      enum: [
        'HDF4',
        'HDF5',
        'HDF-EOS',
        'HDF-EOS2',
        'HDF-EOS5',
        'NETCDF-3',
        'NETCDF-4',
        'GEOTIFF',
        'GEOTIFFINT16',
        'GEOTIFFFLOAT32',
        'XML',
        'ASCII',
        'BINARY',
        'ICARTT',
        'PNG',
        'JPEG',
        'GIF',
        'TIFF',
        'XLSX',
        'JSON',
        'CSV',
        'KML',
        'PNG24',
        'BMP'
      ]
    },
    ToolKeywordType: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science tool keywords related to the tool.  The Earth Science Tool keywords are chosen from a controlled keyword hierarchy maintained in the Keyword Management System (KMS).',
      properties: {
        ToolCategory: {
          $ref: '#/definitions/KeywordStringType'
        },
        ToolTopic: {
          $ref: '#/definitions/KeywordStringType'
        },
        ToolTerm: {
          $ref: '#/definitions/KeywordStringType'
        },
        ToolSpecificTerm: {
          $ref: '#/definitions/KeywordStringType'
        }
      },
      required: [
        'ToolCategory',
        'ToolTopic'
      ]
    },
    KeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
    },
    OrganizationType: {
      type: 'object',
      additionalProperties: false,
      description: 'The organization or institution responsible for developing, archiving, and/or hosting the web user interface or downloadable tool.',
      properties: {
        Roles: {
          description: 'This is the roles of the organization.',
          type: 'array',
          items: {
            $ref: '#/definitions/ToolOrganizationRoleEnum'
          },
          minItems: 1
        },
        ShortName: {
          description: 'This is the short name of the organization.',
          $ref: '#/definitions/ToolOrganizationShortNameType'
        },
        LongName: {
          description: 'This is the long name of the organization.',
          $ref: '#/definitions/LongNameType'
        },
        URLValue: {
          description: 'The URL of the organization.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
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
          description: 'This is the roles of the downloadable tool or web user interface contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/ToolOrganizationRoleEnum'
          },
          minItems: 1
        },
        ContactInformation: {
          description: 'This is the contact information of the downloadable tool or web user interface contact.',
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
          description: 'This is the roles of the downloadable tool or web user interface contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/ToolOrganizationRoleEnum'
          },
          minItems: 1
        },
        ContactInformation: {
          description: 'This is the contact information of the tool contact.',
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
      description: 'Defines the contact information of a downloadable tool or web user interface.',
      properties: {
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
      description: 'Method for contacting the service or tool contact. A contact can be available via phone, email, Facebook, or Twitter.',
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
    ToolOrganizationShortNameType: {
      description: 'The unique name of the service organization.',
      type: 'string',
      minLength: 1,
      maxLength: 85,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,84}"
    },
    ToolOrganizationRoleEnum: {
      description: 'Defines the possible values of a service provider role.',
      type: 'string',
      enum: [
        'SERVICE PROVIDER',
        'DEVELOPER',
        'PUBLISHER',
        'AUTHOR',
        'ORIGINATOR'
      ]
    },
    LongNameType: {
      description: 'The expanded or long name related to the short name.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    ToolTypeEnum: {
      description: 'This element is used to identify the type of the downloadable tool or web user interface.',
      type: 'string',
      enum: [
        'Downloadable Tool',
        'Web User Interface',
        'Web Portal',
        'Model',
        'NOT PROVIDED'
      ]
    },
    ToolQualityType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes tool quality, composed of the quality flag, the quality flagging system, traceability and lineage.',
      properties: {
        QualityFlag: {
          description: 'The quality flag for the tool or web user interface.',
          $ref: '#/definitions/QualityFlagEnum'
        },
        Traceability: {
          description: 'The quality traceability of the downloadable tool or web user interface.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        Lineage: {
          description: 'The quality lineage of the downloadable tool or web user interface.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        }
      },
      required: [
        'QualityFlag'
      ]
    },
    QualityFlagEnum: {
      description: 'Defines the possible quality flags.',
      type: 'string',
      enum: [
        'Available',
        'Unavailable',
        'Reviewed',
        'Not Reviewed',
        'Other'
      ]
    },
    AccessConstraintsType: {
      description: 'Information about any constraints for accessing the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 4000
    },
    UseConstraintsType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information on how the downloadable tool or web user interface may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness.',
      properties: {
        LicenseURL: {
          description: 'The web address of the license associated with the tool.',
          type: 'string',
          minLength: 0,
          maxLength: 1024
        },
        LicenseText: {
          description: 'The text of the license associated with the tool.',
          type: 'string',
          minLength: 0,
          maxLength: 20000
        }
      }
    },
    AncillaryKeywordsType: {
      description: 'Words or phrases to further describe the downloadable tool or web user interface.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    PotentialActionType: {
      type: 'object',
      additionalProperties: false,
      description: 'The HTTP API definition of this tool for use with smart-handoffs.',
      properties: {
        Type: {
          description: 'The intent of action this tool supports. Does this tool provide a search? Does it create a resource? Does it consume a resource?',
          $ref: '#/definitions/ActionTypeEnum'
        },
        Target: {
          description: 'The HTTP endpoint definition.',
          $ref: '#/definitions/ActionTargetType'
        },
        QueryInput: {
          type: 'array',
          description: 'A set of HTTP query parameter inputs. Each one indicates how a property should be filled in before initiating the action',
          items: {
            $ref: '#/definitions/PropertyValueSpecificationType'
          },
          minItems: 1
        }
      },
      required: [
        'Type',
        'Target'
      ]
    },
    ActionTypeEnum: {
      type: 'string',
      description: 'The intent of action this tool supports. Does this tool provide a search? Does it create a resource? Does it consume a resource?',
      enum: [
        'SearchAction',
        'CreateAction',
        'ConsumeAction'
      ]
    },
    ActionTargetType: {
      type: 'object',
      description: "The definition of the tool's HTTP API.",
      additionalProperties: false,
      properties: {
        Type: {
          description: 'The type of target. For example, is it an entry point into the application this record describes?',
          $ref: '#/definitions/TargetTypeEnum'
        },
        Description: {
          description: 'Human readable text that answers the question of what this API can do',
          type: 'string'
        },
        ResponseContentType: {
          type: 'array',
          description: 'The supported MIME type(s) of the response from the HTTP API.',
          items: {
            type: 'string'
          },
          minItems: 1
        },
        UrlTemplate: {
          type: 'string',
          description: 'An url template (RFC6570) that will be used to construct the target of the execution of the action.',
          minLength: 1,
          maxLength: 4094
        },
        HttpMethod: {
          type: 'array',
          description: 'The accepted HTTP methods for this API.',
          items: {
            $ref: '#/definitions/HttpMethodEnum'
          },
          minItems: 1
        }
      },
      required: [
        'Type',
        'UrlTemplate',
        'HttpMethod'
      ]
    },
    TargetTypeEnum: {
      type: 'string',
      description: 'The type of target. For example, is it an entry point into the application this record describes?',
      enum: [
        'EntryPoint'
      ]
    },
    HttpMethodEnum: {
      description: 'An HTTP method that specifies the appropriate HTTP method for a request to an HTTP Entrypoint. Values are capitalized strings as used in HTTP.',
      type: 'string',
      enum: [
        'GET',
        'POST'
      ]
    },
    PropertyValueSpecificationType: {
      type: 'object',
      description: 'The definition of a query parameter for an HTTP API',
      additionalProperties: false,
      properties: {
        ValueType: {
          type: 'string',
          description: 'Note: not currently part of schema.org specification. This element references a standard describing the type and format of the query parameter value. For example, `https://schema.org/box` will describe a geo bounding box with the format `min Longitude, min Latitude, max Longitude, max Latitude`.'
        },
        Description: {
          type: 'string',
          description: 'Provides information regarding the correct population of the url template parameter with respect to type, format and whether the parameter is required.'
        },
        ValueName: {
          type: 'string',
          description: 'Indicates the name of the parameter this PropertyValue specification maps to in the URL template.'
        },
        ValueRequired: {
          type: 'boolean',
          description: 'Whether the property must be filled in to complete the action. Default is false.'
        }
      },
      required: [
        'ValueType',
        'ValueName'
      ]
    },
    ContactRoleEnum: {
      description: 'Defines the possible values of a service provider role.',
      type: 'string',
      enum: [
        'SERVICE PROVIDER CONTACT',
        'TECHNICAL CONTACT',
        'SCIENCE CONTACT',
        'INVESTIGATOR',
        'SOFTWARE AUTHOR',
        'TOOL AUTHOR',
        'USER SERVICES',
        'SCIENCE SOFTWARE DEVELOPMENT',
        'SERVICE PROVIDER'
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
    AddressType: {
      type: 'object',
      additionalProperties: false,
      description: 'This entity contains the physical address details for the contact.',
      properties: {
        StreetAddresses: {
          description: 'An address line for the street address, used for mailing or physical addresses of organizations or individuals who serve as contacts for the service.',
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
    MetadataSpecificationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object requires any metadata record that is validated by this schema to provide information about the schema.',
      properties: {
        URL: {
          description: 'This element represents the URL where the schema lives. The schema can be downloaded.',
          type: 'string',
          enum: [
            'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0'
          ]
        },
        Name: {
          description: 'This element represents the name of the schema.',
          type: 'string',
          enum: [
            'UMM-T'
          ]
        },
        Version: {
          description: 'This element represents the version of the schema.',
          type: 'string',
          enum: [
            '1.2.0'
          ]
        }
      },
      required: [
        'URL',
        'Name',
        'Version'
      ]
    }
  }
}
export default ummTSchema
