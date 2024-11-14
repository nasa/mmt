const ummSSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UMM-S',
  type: 'object',
  additionalProperties: false,
  properties: {
    Name: {
      description: 'The name of the service, software, or tool.',
      type: 'string',
      minLength: 1,
      maxLength: 85
    },
    LongName: {
      description: 'The long name of the service, software, or tool.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    Type: {
      description: 'The type of the service, software, or tool.',
      $ref: '#/definitions/ServiceTypeEnum'
    },
    Version: {
      description: 'The edition or version of the service.',
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
      description: 'This element describes the latest date when the service was most recently pushed to production for support and maintenance. ',
      format: 'date-time',
      type: 'string'
    },
    URL: {
      description: 'This element contains important information about the universal resource locator (URL) for the service.',
      $ref: '#/definitions/URLType'
    },
    RelatedURLs: {
      description: 'Web addresses used to get supported documentation or other related information link to the service.',
      type: 'array',
      items: {
        $ref: '#/definitions/RelatedURLType'
      },
      minItems: 1
    },
    Description: {
      description: 'A brief description of the service.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    ServiceKeywords: {
      description: 'Allows for the specification of Earth Science Service keywords that are representative of the service, software, or tool being described. The controlled vocabulary for Service Keywords is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: '#/definitions/ServiceKeywordType'
      },
      minItems: 1
    },
    ServiceOrganizations: {
      description: 'The service provider, or organization, or institution responsible for developing, archiving, and/or distributing the service, software, or tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/ServiceOrganizationType'
      },
      minItems: 1
    },
    ContactGroups: {
      description: 'This is the contact groups of the service.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactGroupType'
      },
      minItems: 1
    },
    ContactPersons: {
      description: 'This is the contact persons of the service.',
      type: 'array',
      items: {
        $ref: '#/definitions/ContactPersonType'
      },
      minItems: 1
    },
    ServiceQuality: {
      description: 'Information about the quality of the service, software, or tool, or any quality assurance procedures followed in development.',
      $ref: '#/definitions/ServiceQualityType'
    },
    AccessConstraints: {
      description: 'Information about any constraints for accessing the service, software, or tool.',
      $ref: '#/definitions/AccessConstraintsType'
    },
    UseConstraints: {
      description: 'Information on how the item (service, software, or tool) may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness.',
      $ref: '#/definitions/UseConstraintsType'
    },
    AncillaryKeywords: {
      description: 'Words or phrases to further describe the service, software, or tool.',
      type: 'array',
      items: {
        $ref: '#/definitions/AncillaryKeywordsType'
      },
      minItems: 1
    },
    ServiceOptions: {
      description: 'This element contains important information about the Unique Resource Locator for the service.',
      $ref: '#/definitions/ServiceOptionsType'
    },
    OperationMetadata: {
      description: 'This class describes the signature of the operational metadata provided by the service.',
      type: 'array',
      items: {
        $ref: '#/definitions/OperationMetadataType'
      },
      minItems: 1
    },
    MetadataSpecification: {
      description: "Requires the user to add in schema information into every service record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: '#/definitions/MetadataSpecificationType'
    }
  },
  required: [
    'Name',
    'LongName',
    'Type',
    'Version',
    'URL',
    'Description',
    'ServiceKeywords',
    'ServiceOrganizations',
    'MetadataSpecification'
  ],
  definitions: {
    ServiceOptionsType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes service options, data transformations and output formats.',
      properties: {
        Subset: {
          description: 'This element is used to identify the set of supported subsetting capabilities, Spatial, Temporal, and Variable.',
          $ref: '#/definitions/SubsetType'
        },
        Aggregation: {
          description: 'This element describes what kinds of aggregations the service allows. When services pull data files, this option allows the service to put the result data into as few files as possible.',
          $ref: '#/definitions/AggregationType'
        },
        VariableAggregationSupportedMethods: {
          description: 'This element is used to identify the list of supported methods of variable aggregation.',
          type: 'array',
          items: {
            $ref: '#/definitions/VariableAggregationTypeEnum'
          },
          minItems: 1
        },
        SupportedInputProjections: {
          description: 'This element is used to identify the list of supported input projections types.',
          type: 'array',
          items: {
            $ref: '#/definitions/SupportedProjectionType'
          },
          minItems: 1
        },
        SupportedOutputProjections: {
          description: 'This element is used to identify the list of supported output projections types.',
          type: 'array',
          items: {
            $ref: '#/definitions/SupportedProjectionType'
          },
          minItems: 1
        },
        InterpolationTypes: {
          description: 'This element is used to identify the list of supported interpolation types.',
          type: 'array',
          items: {
            $ref: '#/definitions/InterpolationTypeEnum'
          },
          minItems: 1
        },
        SupportedReformattings: {
          description: 'The project element describes the list of format name combinations which explicitly state which re-formatting options are available. These are entered as pairs of values, e.g. if NetCDF-3 -> NetCDF-4 is a valid supported reformatting, these two values would be entered as a pair.',
          type: 'array',
          items: {
            $ref: '#/definitions/SupportedReformattingsPairType'
          },
          minItems: 1
        },
        MaxGranules: {
          description: 'This field indicates the maximum number of granules which this service can process with one request.',
          type: 'number'
        }
      }
    },
    SubsetType: {
      description: 'This element is used to identify the set of supported subsetting capabilities, Spatial, Temporal, and Variable.',
      type: 'object',
      additionalProperties: false,
      properties: {
        SpatialSubset: {
          description: 'This element describes what kind of spatial subsetting the service provides. The sub elements provide the details.',
          $ref: '#/definitions/SpatialSubsetType'
        },
        TemporalSubset: {
          description: 'This element describes that the service provides temporal subsetting.',
          $ref: '#/definitions/TemporalSubsetType'
        },
        VariableSubset: {
          description: 'This element describes that the service provides variable subsetting.',
          $ref: '#/definitions/VariableSubsetType'
        }
      },
      anyOf: [
        {
          required: [
            'SpatialSubset'
          ]
        },
        {
          required: [
            'TemporalSubset'
          ]
        },
        {
          required: [
            'VariableSubset'
          ]
        }
      ]
    },
    SpatialSubsetType: {
      description: 'This element describes what kind of spatial subsetting the service provides. The sub elements provide the details.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Point: {
          description: 'This element describes that the service provides a point spatial subsetting capability.',
          $ref: '#/definitions/SpatialSubsetPointType'
        },
        Circle: {
          description: 'The described service provides a point and radius spatial subsetting capability where the point and radius describe a spatial circle.',
          $ref: '#/definitions/SpatialSubsetCircleType'
        },
        Line: {
          description: 'This element describes that the service provides a line spatial subsetting capability.',
          $ref: '#/definitions/SpatialSubsetLineType'
        },
        BoundingBox: {
          description: 'This element describes that the service provides a bounding box spatial subsetting capability.',
          $ref: '#/definitions/SpatialSubsetBoundingBoxType'
        },
        Polygon: {
          description: 'This element describes that the service provides a polygon spatial subsetting capability.',
          $ref: '#/definitions/SpatialSubsetPolygonType'
        },
        Shapefile: {
          description: 'This element describes that the service provides a shapefile spatial subsetting capability.',
          $ref: '#/definitions/SpatialSubsetShapefileType'
        }
      },
      anyOf: [
        {
          required: [
            'Point'
          ]
        },
        {
          required: [
            'Circle'
          ]
        },
        {
          required: [
            'Line'
          ]
        },
        {
          required: [
            'BoundingBox'
          ]
        },
        {
          required: [
            'Polygon'
          ]
        },
        {
          required: [
            'Shapefile'
          ]
        }
      ]
    },
    SpatialSubsetPointType: {
      description: 'The described service provides a point spatial subsetting capability.',
      type: 'object',
      additionalProperties: false,
      properties: {
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of multiple points, if this element is true. A value of false or the element is not used means the service only accepts a single point.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    SpatialSubsetCircleType: {
      description: 'The described service provides a point and radius spatial subsetting capability where the point and radius describe a spatial circle.',
      type: 'object',
      additionalProperties: false,
      properties: {
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of multiple circles, if this element is true. A value of false or the element is not used means the service only accepts a single circle (point and radius).',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    SpatialSubsetLineType: {
      description: 'The described service provides a line spatial subsetting capability.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MaximumNumberOfPoints: {
          description: 'The maximum number of points that can be used can be specified.',
          type: 'number'
        },
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of lines, if this element is true. A value of false or the element is not used means the service only accepts a single line.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    SpatialSubsetBoundingBoxType: {
      description: 'The described service provides a bounding box spatial subsetting capability.',
      type: 'object',
      additionalProperties: false,
      properties: {
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of multiple bounding boxes, if this element is true. A value of false or the element is not used means the service only accepts a single bounding box.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    SpatialSubsetPolygonType: {
      description: 'The described service provides a polygon spatial subsetting capability.',
      type: 'object',
      additionalProperties: false,
      properties: {
        MaximumNumberOfPoints: {
          description: 'The maximum number of points that can be specified.',
          type: 'number'
        },
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of multiple polygons, if this element is true. A value of false or the element is not used means the service only accepts a single polygon.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    SpatialSubsetShapefileType: {
      description: 'The described service provides a shapefile spatial subsetting capability. Additional information should be provided for this type of subsetter which includes the shapefile format, maximum number of points and the maximum file size in bytes.',
      type: 'array',
      items: {
        $ref: '#/definitions/SpatialSubsetShapefileInformationType'
      },
      minItems: 1
    },
    SpatialSubsetShapefileInformationType: {
      description: 'Additional information should be provided for this type of subsetter which includes the shapefile format, maximum number of points and the maximum file size in bytes.',
      type: 'object',
      additionalProperties: false,
      properties: {
        Format: {
          description: 'This element is used to identify the file format used in the shapefile.',
          type: 'string',
          enum: [
            'ESRI',
            'KML',
            'GeoJSON'
          ]
        },
        MaximumFileSizeInBytes: {
          description: 'This element describes the maximum file size in bytes of the shapefile that can be sent to the service.',
          type: 'number'
        },
        MaximumNumberOfPoints: {
          description: 'This element describes the maximum number of points contained in the shapefile that can be sent to the service.',
          type: 'number'
        }
      },
      required: [
        'Format'
      ]
    },
    TemporalSubsetType: {
      description: 'This element describes that the service provides temporal subsetting.',
      type: 'object',
      additionalProperties: false,
      properties: {
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of temporal values, if this element is true. A value of false or the element is not used means the service only accepts a temporal value.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    VariableSubsetType: {
      description: 'This element describes that the service provides variable subsetting.',
      type: 'object',
      additionalProperties: false,
      properties: {
        AllowMultipleValues: {
          description: 'The described service will accept a list of values, such as an array of variables, if this element is true. A value of false or the element is not used means the service only accepts a variable.',
          type: 'boolean'
        }
      },
      required: [
        'AllowMultipleValues'
      ]
    },
    AggregationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element describes what kinds of aggregations the service allows. When services pull data files, this option allows the service to put the result data into as few files as possible.',
      properties: {
        Concatenate: {
          description: 'The presence of this element describes that a service can concatenate data along a newly created dimension.',
          $ref: '#/definitions/ConcatenateType'
        }
      },
      oneOf: [
        {
          required: [
            'Concatenate'
          ]
        }
      ]
    },
    ConcatenateType: {
      type: 'object',
      additionalProperties: false,
      description: 'The presence of this element describes that a service can concatenate data along a newly created dimension.',
      properties: {
        ConcatenateDefault: {
          description: 'This element describes whether the default behavior of the service is to concatenate.',
          type: 'boolean'
        }
      },
      required: [
        'ConcatenateDefault'
      ]
    },
    SupportedReformattingsPairType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes the supported reformatting pairs, e.g. NetCDF4 -> [COG]. For every input there is 1 or more outputs.',
      properties: {
        SupportedInputFormat: {
          description: 'This element is used to identify the name of the supported input format in the pair.',
          $ref: '#/definitions/SupportedFormatTypeEnum'
        },
        SupportedOutputFormats: {
          description: 'This element is used to identify the name of all supported output formats for the provided input format.',
          type: 'array',
          items: {
            $ref: '#/definitions/SupportedFormatTypeEnum'
          },
          minItems: 1
        }
      },
      required: [
        'SupportedInputFormat',
        'SupportedOutputFormats'
      ]
    },
    SupportedProjectionType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element is used to identify the input projection type of the variable.',
      properties: {
        ProjectionName: {
          description: 'This element is used to identify the list of supported projection types.',
          type: 'string',
          enum: [
            'Geographic',
            'Military Grid Reference',
            'MODIS Sinusoidal System',
            'Sinusoidal',
            'World Mollweide',
            'Mercator',
            'Space Oblique Mercator',
            'Transverse Mercator',
            'Universal Transverse Mercator',
            'UTM Northern Hemisphere',
            'UTM Southern Hemisphere',
            'State Plane Coordinates',
            'Albers Equal-Area Conic',
            'Lambert Conic Conformal',
            'Lambert Equal Area',
            'Lambert Azimuthal Equal Area',
            'Cylindrical',
            'Cylindrical Equal Area',
            'Polar Stereographic',
            'EASE-Grid',
            'EASE-Grid 2.0',
            'WGS 84 / UPS North (N,E)',
            'WGS84 - World Geodetic System 1984',
            'NSIDC EASE-Grid North',
            'NSIDC EASE-Grid Global',
            'NSIDC Sea Ice Polar Stereographic North',
            'WGS 84 / NSIDC Sea Ice Polar Stereographic North',
            'NSIDC EASE Grid North and South (Lambert EA)',
            'WGS 84 / North Pole LAEA Bering Sea',
            'WGS 84 / North Pole LAEA Alaska',
            'WGS 84 / North Pole LAEA Canada',
            'WGS 84 / North Pole LAEA Atlantic',
            'WGS 84 / North Pole LAEA Europe',
            'WGS 84 / North Pole LAEA Russia',
            'WGS 84 / NSIDC EASE-Grid North',
            'WGS 84 / NSIDC EASE-Grid Global',
            'WGS 84 / UTM zone 24N',
            'Spherical Mercator',
            'WGS 84 / Pseudo-Mercator -- Spherical Mercator, Google Maps, OpenStreetMap, Bing, ArcGIS, ESRI',
            'Google Maps Global Mercator -- Spherical Mercator',
            'WGS 84 / Antarctic Polar Stereographic',
            'NSIDC EASE-Grid South',
            'NSIDC Sea Ice Polar Stereographic South',
            'WGS 84 / NSIDC EASE-Grid South',
            'WGS 84 / NSIDC Sea Ice Polar Stereographic South',
            'WGS 84 / UPS South (N,E)',
            'NSIDC EASE Grid Global',
            'EASE Grid 2.0 N. Polar',
            'Plate Carree',
            'WELD Albers Equal Area',
            'Canadian Albers Equal Area Conic',
            'NAD83 / UTM zone 17N'
          ]
        },
        ProjectionLatitudeOfCenter: {
          description: 'This element is used to identify the origin of the x-coordinates at the center of the projection.',
          type: 'number'
        },
        ProjectionLongitudeOfCenter: {
          description: 'This element is used to identify the origin of the y-coordinates at the center of the projection.',
          type: 'number'
        },
        ProjectionFalseEasting: {
          description: 'This element is used to identify the linear value applied to the origin of the y-coordinates. False easting and northing values are usually applied to ensure that all the x and y values are positive.',
          type: 'number'
        },
        ProjectionFalseNorthing: {
          description: 'This element is used to identify the linear value applied to the origin of the x-coordinates. False easting and northing values are usually applied to ensure that all the x and y values are positive.',
          type: 'number'
        },
        ProjectionAuthority: {
          description: 'This element is used to identify the authority, expressed as the authority code, for the list of supported projection types.',
          type: 'string'
        },
        ProjectionUnit: {
          description: 'This element is used to identify the projection unit of measurement.',
          type: 'string',
          enum: [
            'Meters',
            'Degrees'
          ]
        },
        ProjectionDatumName: {
          description: 'This element is used to identify the projection datum name.',
          type: 'string',
          enum: [
            'North American Datum (NAD) 1927',
            'North American Datum (NAD) 1983',
            'World Geodetic System (WGS) 1984'
          ]
        }
      }
    },
    VariableAggregationTypeEnum: {
      description: 'This element is used to identify the list of supported methods of variable aggregation.',
      type: 'string',
      enum: [
        'AVG',
        'COUNT',
        'SUM',
        'MIN',
        'MAX',
        'VAR',
        'ANOMOLY'
      ]
    },
    InterpolationTypeEnum: {
      description: 'This element is used to identify the interpolation type of the variable.',
      type: 'string',
      enum: [
        'Bilinear Interpolation',
        'Bicubic Interpolation',
        'Distance-weighted average resampling',
        'Nearest Neighbor',
        'Elliptical Weighted Averaging'
      ]
    },
    SupportedFormatTypeEnum: {
      description: 'This element contains a list of file formats supported by the service.',
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
        'BMP',
        'ZARR',
        'Shapefile',
        'Shapefile+zip',
        'GeoJSON',
        'COG',
        'WKT'
      ]
    },
    URLType: {
      type: 'object',
      additionalProperties: false,
      description: 'Represents the Internet site where you can directly access the back-end service.',
      properties: {
        Description: {
          description: 'Description of the web page at this URL.',
          type: 'string',
          minLength: 1,
          maxLength: 4000
        },
        URLValue: {
          description: 'The URL for the relevant online resource where you can directly access the back-end service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'URLValue'
      ]
    },
    RelatedURLType: {
      type: 'object',
      additionalProperties: false,
      description: 'Web addresses used to get supported documentation or other related information link to the service. Examples include project home pages, related data archives/servers, metadata extensions, online software packages, web mapping services, and calibration/validation data, other supporting documentation.',
      properties: {
        Description: {
          description: 'A Description meant for the end user of the web page at this URL.',
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
        }
      },
      required: [
        'Linkage',
        'Name',
        'Description'
      ]
    },
    ServiceKeywordType: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science service keywords related to the service.  The Earth Science Service keywords are chosen from a controlled keyword hierarchy maintained in the Keyword Management System (KMS).',
      properties: {
        ServiceCategory: {
          $ref: '#/definitions/KeywordStringType'
        },
        ServiceTopic: {
          $ref: '#/definitions/KeywordStringType'
        },
        ServiceTerm: {
          $ref: '#/definitions/KeywordStringType'
        },
        ServiceSpecificTerm: {
          $ref: '#/definitions/KeywordStringType'
        }
      },
      required: [
        'ServiceCategory',
        'ServiceTopic'
      ]
    },
    KeywordStringType: {
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
    },
    ServiceOrganizationType: {
      type: 'object',
      additionalProperties: false,
      description: 'Defines a service organization which is either an organization or institution responsible for distributing, archiving, or processing the data via a service, etc.',
      properties: {
        Roles: {
          description: 'This is the roles of the service organization.',
          type: 'array',
          items: {
            $ref: '#/definitions/ServiceOrganizationRoleEnum'
          },
          minItems: 1
        },
        ShortName: {
          description: 'This is the short name of the service organization.',
          $ref: '#/definitions/ServiceOrganizationShortNameType'
        },
        LongName: {
          description: 'This is the long name of the service organization.',
          $ref: '#/definitions/LongNameType'
        },
        OnlineResource: {
          description: 'This is the URL of the service organization.',
          $ref: '#/definitions/OnlineResourceType'
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
          description: 'This is the roles of the service contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/ServiceContactRoleEnum'
          },
          minItems: 1
        },
        ContactInformation: {
          description: 'This is the contact information of the service contact.',
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
          description: 'This is the roles of the service contact.',
          type: 'array',
          items: {
            $ref: '#/definitions/ServiceOrganizationRoleEnum'
          },
          minItems: 1
        },
        ContactInformation: {
          description: 'This is the contact information of the service contact.',
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
      description: 'Defines the contact information of a service organization or service contact.',
      properties: {
        OnlineResources: {
          description: 'A URL associated with the contact, e.g., the home page for the service provider which is responsible for the service.',
          type: 'array',
          items: {
            $ref: '#/definitions/OnlineResourceType'
          },
          minItems: 1
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
          },
          minItems: 1
        },
        Addresses: {
          description: 'Contact addresses.',
          type: 'array',
          items: {
            $ref: '#/definitions/AddressType'
          },
          minItems: 1
        }
      }
    },
    ContactMechanismType: {
      type: 'object',
      additionalProperties: false,
      description: 'Method for contacting the service contact. A contact can be available via phone, email, Facebook, or Twitter.',
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
    ServiceOrganizationShortNameType: {
      description: 'The unique name of the service organization.',
      type: 'string',
      minLength: 1,
      maxLength: 85,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,84}"
    },
    ServiceOrganizationRoleEnum: {
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
    ServiceTypeEnum: {
      description: 'This element is used to identify the type of the service.',
      type: 'string',
      enum: [
        'OPeNDAP',
        'THREDDS',
        'WEB SERVICES',
        'ESI',
        'ECHO ORDERS',
        'WCS',
        'WMS',
        'WMTS',
        'EGI - No Processing',
        'SOFTWARE PACKAGE',
        'TOOL',
        'WEB PORTAL',
        'International Web Portal',
        'MODEL',
        'Harmony',
        'ArcGIS Image Service',
        'Web Feature Service',
        'Web Geoprocessing Service',
        'NOT PROVIDED',
        'SWODLR'
      ]
    },
    ServiceQualityType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object describes service quality, composed of the quality flag, the quality flagging system, traceability and lineage.',
      properties: {
        QualityFlag: {
          description: 'The quality flag for the service.',
          $ref: '#/definitions/QualityFlagEnum'
        },
        Traceability: {
          description: 'The quality traceability of the service.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        Lineage: {
          description: 'The quality lineage of the service.',
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
      description: 'Information about any constraints for accessing the service, software, or tool.',
      type: 'string',
      minLength: 1,
      maxLength: 4000
    },
    UseConstraintsType: {
      type: 'object',
      additionalProperties: false,
      description: 'Information on how the item (service, software, or tool) may or may not be used after access is granted. This includes any special restrictions, legal prerequisites, terms and conditions, and/or limitations on using the item. Providers may request acknowledgement of the item from users and claim no responsibility for quality and completeness.',
      properties: {
        LicenseURL: {
          description: 'The web address of the license associated with the service.',
          type: 'string',
          minLength: 0,
          maxLength: 1024
        },
        LicenseText: {
          description: 'The text of the license associated with the service.',
          type: 'string',
          minLength: 0,
          maxLength: 20000
        }
      }
    },
    AncillaryKeywordsType: {
      description: 'Words or phrases to further describe the service, software, or tool.',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    ServiceContactRoleEnum: {
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
          minItems: 1
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
    OperationMetadataType: {
      type: 'object',
      additionalProperties: false,
      description: 'This class describes the signature of the operational metadata provided by the service.',
      properties: {
        OperationName: {
          description: 'This element contains the name of the operation(s) made possible via this service.',
          type: 'string',
          enum: [
            'GetCapabilities',
            'DescribeCoverage',
            'GetCoverage',
            'GetMap',
            'GetLegendGraphic',
            'GetTile',
            'GetFeatureInfo',
            'DescribeFeatureType',
            'GetPropertyValue',
            'GetFeature',
            'GetFeatureWithLock',
            'LockFeature',
            'Transaction',
            'CreateStoredQuery',
            'DropStoredQuery',
            'ListStoredQueries',
            'DescribeStoredQueries',
            'SPATIAL_SUBSETTING',
            'TEMPORAL_SUBSETTING',
            'VARIABLE_SUBSETTING',
            'VARIABLE_AGGREGATION'
          ]
        },
        DistributedComputingPlatform: {
          description: 'This element contains the distributed computing platform (protocol) for the operation(s) made possible via this service.',
          type: 'array',
          items: {
            $ref: '#/definitions/DistributedComputingPlatformTypeEnum'
          },
          minItems: 1
        },
        OperationDescription: {
          description: 'This element contains the description of the operation(s) made possible via this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        InvocationName: {
          description: 'This element contains the name of the invocation of the operation(s) made possible via this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ConnectPoint: {
          description: 'This element contains the URL of the invocation of the operation(s) made possible via this service.',
          $ref: '#/definitions/ConnectPointType'
        },
        OperationChainedMetadata: {
          description: 'This element contains the name of the chained operation(s) made possible via this service.',
          $ref: '#/definitions/OperationChainedMetadataType'
        },
        CoupledResource: {
          description: 'This element contains important information about the resource(s) coupled to this service.',
          $ref: '#/definitions/CoupledResourceType'
        },
        Parameters: {
          description: 'This element contains important information about the parameter associated with the resource(s) coupled to this service.',
          type: 'array',
          items: {
            $ref: '#/definitions/ParameterType'
          },
          minItems: 1
        }
      }
    },
    ConnectPointType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains the URL of the invocation of the operation(s) made possible via this service.',
      properties: {
        ResourceName: {
          description: 'This element contains the name of the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ResourceLinkage: {
          description: 'This element contains the URL of the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ResourceDescription: {
          description: 'This element contains the description of the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'ResourceLinkage'
      ]
    },
    OperationChainedMetadataType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains the name of the chained operation(s) made possible via this service.',
      properties: {
        OperationChainName: {
          description: 'TThis element contains the name of the operation chain made possible via this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        OperationChainDescription: {
          description: 'This element contains the description of the operation chain made possible via this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'OperationChainName'
      ]
    },
    CoupledResourceType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains the name of the chained operation(s) made possible via this service.',
      properties: {
        ScopedName: {
          description: 'This element contains the name of the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        DataResourceDOI: {
          description: 'This element contains the DOI for the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        DataResource: {
          description: 'This element contains the data identification and scope for the resource(s) coupled to this service.',
          $ref: '#/definitions/DataResourceType'
        },
        CouplingType: {
          description: 'This element contains the coupling type for the resource(s) coupled to this service.',
          $ref: '#/definitions/CouplingTypeEnum'
        }
      }
    },
    DataResourceType: {
      type: 'object',
      additionalProperties: false,
      description: 'The DataResource class describes the layers, feature types or coverages available from the service.',
      properties: {
        DataResourceIdentifier: {
          description: 'The identifier of the layer, feature type or coverage available from the service.',
          type: 'string',
          minLength: 1,
          maxLength: 100
        },
        DataResourceSourceType: {
          description: 'The resource type of the layer, feature type or coverage available from the service.',
          type: 'string',
          enum: [
            'Map',
            'Variable',
            'Granule',
            'Collection',
            'Virtual'
          ]
        },
        DataResourceSpatialExtent: {
          description: 'The spatial extent of the coverage available from the service. These are coordinate pairs which describe either the point, line string, or polygon representing the spatial extent. The bounding box is described by the west, south, east and north ordinates',
          $ref: '#/definitions/DataResourceSpatialExtentType'
        },
        SpatialResolution: {
          description: 'The spatial resolution of the layer, feature type or coverage available from the service.',
          type: 'number'
        },
        SpatialResolutionUnit: {
          description: 'The unit of the spatial resolution of the layer, feature type or coverage available from the service.',
          type: 'string',
          enum: [
            'Meters',
            'KM',
            'Degrees',
            'Degrees_North',
            'Degrees_East'
          ]
        },
        DataResourceTemporalExtent: {
          description: 'The temporal extent of the layer, feature type or coverage available from the service.',
          $ref: '#/definitions/DataResourceTemporalExtentType'
        },
        DataResourceTemporalType: {
          description: 'The temporal extent of the layer, feature type or coverage available from the service.',
          $ref: '#/definitions/DataResourceTemporalTypeEnum'
        },
        TemporalResolution: {
          description: 'TThe temporal resolution of the layer, feature type or coverage available from the service.',
          type: 'number'
        },
        TemporalResolutionUnit: {
          description: 'The unit of the temporal resolution of the layer, feature type or coverage available from the service.',
          type: 'string',
          enum: [
            'DAY',
            'TWICE_PER_DAY',
            'WEEK',
            'MONTH',
            'YEAR'
          ]
        },
        RelativePath: {
          description: 'Path relative to the root URL for the layer, feature type or coverage service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      }
    },
    ParameterType: {
      type: 'object',
      additionalProperties: false,
      description: 'This element contains important information about the parameter associated with the resource(s) coupled to this service.',
      properties: {
        ParameterName: {
          description: 'This element contains the name of the parameter associated with the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ParameterDirection: {
          description: 'This element contains the direction of the parameter associated with the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ParameterDescription: {
          description: 'This element contains the description of the parameter associated with the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ParameterOptionality: {
          description: 'This element contains the optionality of the parameter associated with the resource(s) coupled to this service',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        ParameterRepeatability: {
          description: 'This element contains the repeatability of the parameter associated with the resource(s) coupled to this service.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'ParameterName',
        'ParameterDescription',
        'ParameterDirection',
        'ParameterOptionality',
        'ParameterRepeatability'
      ]
    },
    CoordinatesType: {
      type: 'object',
      additionalProperties: false,
      description: 'The coordinates consist of a latitude and longitude.',
      properties: {
        Latitude: {
          description: 'The latitude of the point.',
          type: 'number'
        },
        Longitude: {
          description: 'The longitude of the point.',
          type: 'number'
        }
      },
      required: [
        'Latitude',
        'Longitude'
      ]
    },
    LineStringType: {
      type: 'object',
      additionalProperties: false,
      description: 'The line string consists of two points: a start point and an end ppint.',
      properties: {
        StartPoint: {
          description: 'The start point of the line string.',
          $ref: '#/definitions/CoordinatesType'
        },
        EndPoint: {
          description: 'The end point of the line string.',
          $ref: '#/definitions/CoordinatesType'
        }
      },
      required: [
        'StartPoint',
        'EndPoint'
      ]
    },
    SpatialBoundingBoxType: {
      type: 'object',
      additionalProperties: false,
      description: 'The bounding box consists of west bounding, south bounding, east bounding and north bounding coordinates and the CRS identifier.',
      properties: {
        CRSIdentifier: {
          description: 'The CRS identifier of the bounding box.',
          $ref: '#/definitions/CRSIdentifierTypeEnum'
        },
        WestBoundingCoordinate: {
          description: 'The west bounding coordinate of the bounding box.',
          type: 'number'
        },
        SouthBoundingCoordinate: {
          description: 'The south bounding coordinate of the bounding box.',
          type: 'number'
        },
        EastBoundingCoordinate: {
          description: 'The east bounding coordinate of the bounding box.',
          type: 'number'
        },
        NorthBoundingCoordinate: {
          description: 'The north bounding coordinate of the bounding box.',
          type: 'number'
        }
      },
      required: [
        'CRSIdentifier',
        'WestBoundingCoordinate',
        'SouthBoundingCoordinate',
        'EastBoundingCoordinate',
        'NorthBoundingCoordinate'
      ]
    },
    GeneralGridType: {
      type: 'object',
      additionalProperties: false,
      description: 'The general grid consists of a CRS Identifier and an Axis.',
      properties: {
        CRSIdentifier: {
          description: 'The CRS identifier (srsName) of the general grid.',
          $ref: '#/definitions/CRSIdentifierTypeEnum'
        },
        Axis: {
          description: 'The grid axis identifiers, all distinct within a grid.',
          type: 'array',
          items: {
            $ref: '#/definitions/AxisType'
          },
          minItems: 1
        }
      },
      required: [
        'CRSIdentifier',
        'Axis'
      ]
    },
    AxisType: {
      type: 'object',
      additionalProperties: false,
      description: 'The axis consists of an extent and grid information.',
      properties: {
        AxisLabel: {
          description: 'The axis label of the general grid.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        GridResolution: {
          description: 'The resolution of the general grid.',
          type: 'number'
        },
        Extent: {
          description: 'The extent of the general grid.',
          $ref: '#/definitions/ExtentType'
        }
      },
      required: [
        'AxisLabel',
        'Extent'
      ]
    },
    ExtentType: {
      type: 'object',
      additionalProperties: false,
      description: 'The extent consists of .',
      properties: {
        ExtentLabel: {
          description: 'The label of the extent.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        },
        LowerBound: {
          description: 'The lowest value along this grid axis.',
          type: 'number'
        },
        UpperBound: {
          description: 'The highest value along this grid axis.',
          type: 'number'
        },
        UOMLabel: {
          description: 'The unit of measure in which values along this axis are expressed.',
          type: 'string',
          minLength: 1,
          maxLength: 1024
        }
      },
      required: [
        'LowerBound',
        'UpperBound',
        'UOMLabel'
      ]
    },
    DataResourceSpatialExtentType: {
      type: 'object',
      description: 'The spatial extent of the coverage available from the service. These are coordinate pairs which describe either the point, line string, or polygon representing the spatial extent. The bounding box is described by the west, south, east and north ordinates',
      oneOf: [
        {
          additionalProperties: false,
          title: 'Points',
          properties: {
            SpatialPoints: {
              description: 'The spatial extent of the layer, feature type or coverage described by a point.',
              type: 'array',
              items: {
                $ref: '#/definitions/CoordinatesType'
              },
              minItems: 1
            }
          },
          required: [
            'SpatialPoints'
          ]
        },
        {
          additionalProperties: false,
          title: 'Line String',
          properties: {
            SpatialLineStrings: {
              description: 'The spatial extent of the layer, feature type or coverage described by a line string.',
              type: 'array',
              items: {
                $ref: '#/definitions/LineStringType'
              },
              minItems: 1
            }
          },
          required: [
            'SpatialLineStrings'
          ]
        },
        {
          additionalProperties: false,
          title: 'Bounding Box',
          properties: {
            SpatialBoundingBox: {
              description: 'The spatial extent of the layer, feature type or coverage described by a bounding box.',
              $ref: '#/definitions/SpatialBoundingBoxType'
            }
          },
          required: [
            'SpatialBoundingBox'
          ]
        },
        {
          additionalProperties: false,
          title: 'General Grid',
          properties: {
            GeneralGrid: {
              description: 'The spatial extent of the layer, feature type or coverage described by a general grid.',
              $ref: '#/definitions/GeneralGridType'
            }
          },
          required: [
            'GeneralGrid'
          ]
        },
        {
          additionalProperties: false,
          title: 'Polygon',
          properties: {
            SpatialPolygons: {
              description: 'The spatial extent of the layer, feature type or coverage described by a polygon.',
              type: 'array',
              items: {
                $ref: '#/definitions/CoordinatesType'
              },
              minItems: 1
            }
          },
          required: [
            'SpatialPolygons'
          ]
        }
      ]
    },
    DataResourceTemporalExtentType: {
      type: 'object',
      properties: {
        DataResourceTimePoints: {
          description: 'Points in time representing the temporal extent of the layer or coverage.',
          type: 'array',
          items: {
            $ref: '#/definitions/TimePointsType'
          },
          minItems: 1
        }
      }
    },
    TimePointsType: {
      type: 'object',
      properties: {
        TimeFormat: {
          description: 'Time format representing time point of the temporal extent.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        TimeValue: {
          description: 'Time value of the time point of temporal extent.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        Description: {
          description: 'Description of the time value of the temporal extent.',
          type: 'string',
          minLength: 1,
          maxLength: 80
        }
      }
    },
    CRSIdentifierTypeEnum: {
      description: 'The CRS Identifier of the spatial extent, expressed as a code.',
      type: 'string',
      enum: [
        'EPSG:4326',
        'EPSG:3395',
        'EPSG:3785',
        'EPSG:9807',
        'EPSG:2000.63',
        'EPSG:2163',
        'EPSG:3408',
        'EPSG:3410',
        'EPSG:6931',
        'EPSG:6933',
        'EPSG:3411',
        'EPSG:9822',
        'EPSG:54003',
        'EPSG:54004',
        'EPSG:54008',
        'EPSG:54009',
        'EPSG:26917',
        'EPSG:900913',
        'Other'
      ]
    },
    DataResourceTemporalTypeEnum: {
      description: 'The temporal extent of the layer, feature type or coverage available from the service.',
      type: 'string',
      enum: [
        'TIME_STAMP',
        'TIME_RANGE',
        'TIME_SERIES',
        'TIME_AVERAGE'
      ]
    },
    CouplingTypeEnum: {
      description: "This element contains the coupling type for the resource(s) coupled to this service. Examples are: 'LOOSE' - this is where a variety of data sources (which are not specified precisely) are used to generate the resource, 'MIXED' - this is where a combination of well-cited data sources are used to generate the resource, 'TIGHT - this is where a single well-cited data source is used to generate the resource.",
      type: 'string',
      enum: [
        'LOOSE',
        'MIXED',
        'TIGHT'
      ]
    },
    DistributedComputingPlatformTypeEnum: {
      description: 'This element contains the distributed computing platform (protocol) for the operation(s) made possible via this service.',
      type: 'string',
      enum: [
        'XML',
        'CORBA',
        'JAVA',
        'COM',
        'SQL',
        'SOAP',
        'Z3950',
        'HTTP',
        'HTTPS',
        'FTP',
        'WEBSERVICES'
      ]
    },
    MetadataSpecificationType: {
      type: 'object',
      additionalProperties: false,
      description: 'This object requires any metadata record that is validated by this schema to provide information about the schema.',
      properties: {
        URL: {
          description: 'The web address of the metadata schema used to validate the service record.',
          type: 'string',
          enum: [
            'https://cdn.earthdata.nasa.gov/umm/service/v1.5.3'
          ]
        },
        Name: {
          description: 'The name of the metadata schema.',
          type: 'string',
          enum: [
            'UMM-S'
          ]
        },
        Version: {
          description: 'The version of the metadata schema.',
          type: 'string',
          enum: [
            '1.5.3'
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
export default ummSSchema
