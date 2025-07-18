// This is not currently in CDN. This is a combination of five different schemas found here: https://git.earthdata.nasa.gov/projects/EMFD/repos/otherschemas/browse/visualization/v1.1.0/schema.json
const otherSchemasVisSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'UMM-Vis',
  type: 'object',
  $comment: 'set the following as false to enforce',
  additionalProperties: false,
  properties: {
    Identifier: {
      description: 'The unique identifier for the visualization.',
      type: 'string',
      minLength: 1,
      maxLength: 256
    },
    Name: {
      $comment: 'This field is added by CMR team. Need to clarify.',
      description: 'A name of the visualization.',
      type: 'string',
      minLength: 1,
      maxLength: 256
    },
    Title: {
      description: 'A short descriptive title of the visualization.',
      type: 'string',
      minLength: 1,
      maxLength: 256
    },
    Subtitle: {
      description: 'A short descriptive subtitle of the visualization.',
      type: 'string',
      minLength: 1,
      maxLength: 256
    },
    Description: {
      description: 'A human readable description of the visualization written using HTML notation for advanced text.  The goal is to create descriptions for the science-minded public that may have an interest in finding out what the visualization shows, why it’s important, how it was created, etc...',
      type: 'string',
      minLength: 1,
      maxLength: 1024
    },
    ScienceKeywords: {
      description: 'Earth Science keywords that are representative of the data being visualized. The controlled vocabulary for Science Keywords is maintained in the Keyword Management System (KMS).',
      type: 'array',
      items: {
        $ref: '#/definitions/ScienceKeywordType'
      },
      minItems: 0
    },
    SpatialExtent: {
      $comment: 'this one probably should be array, in order to handle case of discrete areas',
      $ref: '#/definitions/SpatialExtentType'
    },
    TemporalExtents: {
      description: 'This class contains attributes which describe the temporal range of a specific layer. Temporal Extent includes a specification of the Temporal Range Type of the collection, which is one of Range Date Time, Single Date Time, or Periodic Date Time',
      type: 'array',
      items: {
        $ref: '#/definitions/TemporalExtentType'
      },
      minItems: 1
    },
    ConceptIds: {
      description: 'Which CMR dataset(s) are represented by the visualization.',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          Type: {
            description: 'Identify whether the associated dataset is NRT or STD.',
            type: 'string',
            enum: [
              'NRT',
              'STD'
            ]
          },
          Value: {
            description: "The dataset's CMR concept id",
            type: 'string'
          },
          DataCenter: {
            type: 'string'
          },
          ShortName: {
            type: 'string'
          },
          Title: {
            type: 'string'
          },
          Version: {
            type: 'string'
          }
        },
        required: [
          'Type',
          'Value'
        ],
        additionalProperties: false
      },
      minItems: 1
    },
    VisualizationType: {
      type: 'string',
      enum: [
        'tiles'
        // Can put back when maps is supported
        // 'maps'
      ]
    },
    Specification: {
      $comment: 'must be here when additionalProperties==false. otherwise fails',
      $ref: '#/definitions/Specification'
    },
    Generation: {
      $comment: 'must be here when additionalProperties==false. otherwise fails',
      $ref: '#/definitions/Generation'
    },
    MetadataSpecification: {
      description: "Required to add in schema information into every record. It includes the schema's name, version, and URL location. The information is controlled through enumerations at the end of this schema.",
      $ref: '#/definitions/MetadataSpecificationType'
    }
  },
  required: [
    'Identifier',
    'VisualizationType',
    'Name',
    'Specification',
    'Generation',
    'ConceptIds',
    'MetadataSpecification'
  ],
  allOf: [
    {
      if: {
        properties: {
          VisualizationType: {
            const: 'tiles'
          }
        }
      },
      then: {
        properties: {
          Specification: {
            $ref: '#/definitions/Specification'
          },
          Generation: {
            $ref: '#/definitions/Generation'
          }
        }
      }
    },
    {
      if: {
        properties: {
          VisualizationType: {
            const: 'maps'
          }
        }
      },
      then: {
        properties: {
          Specification: {
            $ref: '#/definitions/Specification'
          },
          Generation: {
            $ref: '#/definitions/Generation'
          }
        }
      }
    }
  ],
  definitions: {
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
    },
    ResolutionAndCoordinateSystemType: {
      description: "This class defines the horizontal spatial extents coordinate system and the data product's horizontal data resolution. The horizontal data resolution is defined as the smallest horizontal distance between successive elements of data in a dataset. This is synonymous with terms such as ground sample distance, sample spacing and pixel size. It is to be noted that the horizontal data resolution could be different in the two horizontal dimensions. Also, it is different from the spatial resolution of an instrument, which is the minimum distance between points that an instrument can see as distinct.",
      oneOf: [
        {
          type: 'object',
          title: 'Description of the Resolution',
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
          title: 'Horizontal Data Resolution Information',
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
          title: 'Local Coordinate System Information',
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
          title: 'Contant or Varies Resolution',
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
    DurationUnitEnum: {
      type: 'string',
      enum: [
        'DAY',
        'MONTH',
        'YEAR'
      ]
    },
    ScienceKeywordType: {
      type: 'object',
      additionalProperties: false,
      description: 'Enables specification of Earth science keywords related to the collection.  The Earth Science keywords are chosen from a controlled keyword hierarchy maintained in the Keyword Management System (KMS). The valid values can be found at the KMS website: https://gcmdservices.gsfc.nasa.gov/kms/concepts/concept_scheme/sciencekeywords?format=csv.',
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
    KeywordStringType: {
      description: 'The keyword string type for science keywords. The pattern below helps to minimize the types of characters allowed in the keywords to help users minimize keyword issues.',
      type: 'string',
      minLength: 1,
      maxLength: 80,
      pattern: "[\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=,][\\w\\-&'()\\[\\]/.\"#$%\\^@!*+=, ]{1,79}"
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
            'https://cdn.earthdata.nasa.gov/umm/visualization/v1.1.0'
          ]
        },
        Name: {
          description: 'This element represents the name of the schema.',
          type: 'string',
          enum: [
            'Visualization'
          ]
        },
        Version: {
          description: 'This element represents the version of the schema.',
          type: 'string',
          enum: [
            '1.1.0'
          ]
        }
      },
      required: [
        'URL',
        'Name',
        'Version'
      ]
    },
    'ows:MetadataType': {
      $comment: 'http://schemas.opengis.net/ows/1.1.0/owsCommon.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'This element either references or contains more metadata about the element that includes this element. To reference metadata stored remotely, at least the xlinks:href attribute in xlink:simpleAttrs shall be included. Either at least one of the attributes in xlink:simpleAttrs or a substitute for the AbstractMetaData element shall be included, but not both. An Implementation Specification can restrict the contents of this element to always be a reference or always contain metadata. (Informative: This element was adapted from the metaDataProperty element in GML 3.0.)',
      properties: {
        'xlink:Href': {
          $comment: 'http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Role': {
          $comment: 'http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Title': {
          $comment: 'http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Type': {
          $comment: 'http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        about: {
          type: 'string',
          minLength: 0,
          maxLength: 1064
        }
      }
    },
    'wmts:StyleType': {
      $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'Descriptive information for visualization appearance.',
      properties: {
        Title: {
          type: 'string',
          minLength: 0,
          maxLength: 64
        },
        Abstract: {
          type: 'string',
          minLength: 0,
          maxLength: 1064
        },
        Keywords: {
          $ref: '#/definitions/KeywordStringType'
        },
        Identifier: {
          type: 'string',
          minLength: 0,
          maxLength: 64
        },
        LegendURL: {
          type: 'array',
          description: 'Zero or more LegendURL elements may be provided, providing an image(s) of a legend relevant to each Style of a Layer.',
          items: {
            $ref: '#/definitions/wmts:LegendURLType'
          }
        },
        IsDefault: {
          type: 'boolean',
          description: 'This style is used when no style is specified.'
        }
      }
    },
    'wmts:LegendURLType': {
      $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'An image of a legend relevant to a Style of a Layer. The Format element indicates the MIME type of the legend. minScaleDenominator and maxScaleDenominator attributes may be provided to indicate to the client which scale(s) (inclusive) the legend image is appropriate for. (If provided, these values must exactly match the scale denominators of available TileMatrixes.) width and height attributes may be provided to assist client applications in laying out space to display the legend.',
      properties: {
        'xlink:Href': {
          $comment: 'https://schemas.opengis.net/ows/1.1.0/ows19115subset.xsd, http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Role': {
          $comment: 'https://schemas.opengis.net/ows/1.1.0/ows19115subset.xsd, http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Title': {
          $comment: 'https://schemas.opengis.net/ows/1.1.0/ows19115subset.xsd, http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        'xlink:Type': {
          $comment: 'https://schemas.opengis.net/ows/1.1.0/ows19115subset.xsd, http://www.w3.org/1999/xlink.xsd',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        Format: {
          $ref: '#/definitions/ows:MimeType',
          description: 'A supported output format for the legend image'
        },
        MinScaleDenominator: {
          type: 'number',
          description: 'Denominator of the minimum scale (inclusive) for which this legend image is valid',
          exclusiveMinimum: 0
        },
        MaxScaleDenominator: {
          type: 'number',
          description: 'Denominator of the maximum scale (exclusive) for which this legend image is valid',
          exclusiveMinimum: 0
        },
        Width: {
          type: 'integer',
          description: 'Width (in pixels) of the legend image',
          minimum: 1
        },
        Height: {
          type: 'integer',
          description: 'Height (in pixels) of the legend image',
          minimum: 1
        }
      }
    },
    'ows:MimeType': {
      type: 'string',
      description: "A string representing a MIME type as defined in IETF RFC 2045 and 2046. The format is 'type/subtype', such as 'image/png', 'text/html', etc.",
      pattern: '^[a-zA-Z0-9][a-zA-Z0-9!#$&\\-^_.+]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&\\-^_.+]{0,126}$'
    },
    'wmts:DimensionType': {
      $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'Metadata about a particular dimension that the tiles of a layer are available.',
      properties: {
        Title: {
          type: 'string',
          minLength: 0,
          maxLength: 64
        },
        Abstract: {
          type: 'string',
          minLength: 0,
          maxLength: 1064
        },
        Keywords: {
          $ref: '#/definitions/KeywordStringType'
        },
        Identifier: {
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        UOM: {
          type: 'string',
          description: 'Units of measure of dimensional axis.',
          minLength: 0,
          maxLength: 256
        },
        UnitSymbol: {
          type: 'string',
          description: 'Symbol of the units.',
          minLength: 0,
          maxLength: 256
        },
        Default: {
          type: 'string',
          description: "Default value that will be used if a tile request does not specify a value or uses the keyword 'default'.",
          minLength: 0,
          maxLength: 256
        },
        Current: {
          type: 'boolean',
          description: "A value of 1 indicates (a) that temporal data are normally kept current and (b) that the request value of this dimension accepts the keyword 'current'."
        },
        Value: {
          type: 'array',
          description: 'Available value(s) for this dimension.',
          items: {
            type: 'string',
            minLength: 0,
            maxLength: 256
          }
        }
      }
    },
    'wmts:TileMatrixSetLinkType': {
      $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'Metadata about the TileMatrixSet reference.',
      properties: {
        TileMatrixSet: {
          type: 'string',
          description: 'Reference to a tileMatrixSet',
          minLength: 0,
          maxLength: 256
        },
        TileMatrixSetLimits: {
          $comment: 'Experimental. Need more details',
          type: 'string',
          description: 'Indices limits for this tileMatrixSet. The absence of this element means that tile row and tile col indices are only limited by 0 and the corresponding tileMatrixSet maximum definitions.',
          minLength: 0,
          maxLength: 256
        }
      }
    },
    'wmts:URLTemplateType': {
      $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
      type: 'object',
      additionalProperties: false,
      description: 'WMTS URLTemplateType',
      properties: {
        Format: {
          type: 'string',
          description: 'Format of the resource representation that can be retrieved one resolved the URL template.',
          minLength: 0,
          maxLength: 256
        },
        ResourceType: {
          type: 'string',
          description: 'Resource type to be retrieved. The WMTS main standard only defines "tile" or "FeatureInfo" but others can be incorporated in the future.',
          minLength: 0,
          maxLength: 256
        },
        Template: {
          type: 'string',
          description: "URL template. A template processor will be applied to substitute some variables between {} for their values and get a URL to a resource. We could not use a anyURI type (that conforms the character restrictions specified in RFC2396 and excludes '{' '}' characters in some XML parsers) because this attribute must accept the '{' '}' characters.",
          pattern: "([A-Za-z0-9\\-_\\.!~\\*'\\(\\);/\\?:@\\+:$,#\\{\\}=&]|%[A-Fa-f0-9][A-Fa-f0-9])+",
          minLength: 0,
          maxLength: 256
        }
      }
    },
    ConceptIdType: {
      description: 'CMR concept id of a concept.',
      type: 'string',
      minLength: 4,
      maxLength: 64,
      pattern: '[A-Z]+\\d+-[A-Z0-9_]+'
    },
    SourceDataType: {
      $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
      type: 'object',
      additionalProperties: false,
      description: 'Specifies source data used to generate browse image.',
      properties: {
        Dataset: {
          type: 'object',
          additionalProperties: false,
          description: 'Specifies dataset used.',
          properties: {
            Name: {
              type: 'string',
              minLength: 1,
              maxLength: 64
            },
            ConceptId: {
              type: 'string',
              minLength: 1,
              maxLength: 16
            }
          }
        },
        ScienceParameter: {
          type: 'object',
          additionalProperties: false,
          description: 'Specifies science parameter used.',
          properties: {
            Name: {
              type: 'string',
              minLength: 1,
              maxLength: 64
            },
            ConceptId: {
              type: 'string',
              minLength: 1,
              maxLength: 16
            }
          }
        }
      }
    },
    ProjectionType: {
      $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
      type: 'object',
      additionalProperties: false,
      description: 'Specifies projection.',
      properties: {
        Name: {
          type: 'string',
          enum: [
            'EPSG:3031',
            'EPSG:3413',
            'EPSG:4326'
          ]
        }
      }
    },
    GridType: {
      $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
      type: 'object',
      additionalProperties: false,
      description: 'Specifies grid.',
      properties: {
        Name: {
          type: 'string',
          enum: [
            'EASE',
            'geographic'
          ]
        }
      }
    },
    SpatialResolutionTypeAlt: {
      $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
      type: 'object',
      additionalProperties: false,
      description: 'Specifies resolution in one dimension.',
      properties: {
        Value: {
          description: 'The integer value of the unit',
          type: 'number'
        },
        Unit: {
          description: 'Unit for value specified above. ie. meters, seconds, degrees, etc.',
          type: 'string',
          minLength: 1,
          maxLength: 64
        }
      },
      require: [
        'Value',
        'Unit'
      ]
    },
    SpatialResolutionNameTypeA: {
      type: 'string',
      description: 'Specifies spatial resolution as a meaningful well-formed string such as 1.0 degree x 2.0 degree.',
      pattern: '^(\\d+|\\d+\\.\\d+) degree x (\\d+|\\d+\\.\\d+) degree$'
    },
    SpatialResolutionNameTypeB: {
      type: 'string',
      description: 'Specifies spatial resolution in names as used by projects like MODIS for long time.',
      enum: [
        '2km',
        '1km',
        '500m',
        '250m',
        '125m',
        '62.5m',
        '31.25m',
        '15.125m'
      ]
    },
    VisualizationLatencyType: {
      $comment: "Integer + Units or 'N/A'",
      oneOf: [
        {
          description: "The approximate latency between the end of data acquisition and visualization file availability for GIBS to ingest. This value may be minutes, hours, or days, depending on the appropriate units. A value of 'N/A' may be provided if not applicable (e.g. static historical products). Examples: '1 second', '2 days'",
          title: 'Unit',
          type: 'string',
          pattern: '(\\d+(\\.\\d+)?) (second|minute|hour|day|week|month|year)(s)?'
        },
        {
          title: 'Not Applicable',
          type: 'string',
          enum: [
            'N/A'
          ]
        }
      ]
    },
    TextStringOrNaType: {
      $comment: "Text string or 'N/A'",
      oneOf: [
        {
          title: 'Input Manually',
          type: 'string',
          minLength: 8,
          maxLength: 256
        },
        {
          title: 'Not Applicable',
          type: 'string',
          enum: [
            'N/A'
          ]
        }
      ]
    },
    IdentifierType: {
      type: 'string',
      minLength: 1,
      maxLength: 64
    },
    TitleType: {
      type: 'string',
      minLength: 1,
      maxLength: 256
    },
    Specification: {
      // Put oneOf back in when maps are ready to be supported.
      // oneOf: [
      //   {
      type: 'object',
      title: 'UMM-Vis-Tiles',
      additionalProperties: false,
      description: 'Identify and specify visualization product.',
      properties: {
        ProductIdentification: {
          $comment: 'Table 3.1 1 in GIBS Imagery Provider ICD, Revision B',
          description: 'Fields used to identify products internally and externally to the GIBS system.',
          type: 'object',
          additionalProperties: false,
          properties: {
            InternalIdentifier: {
              description: "The visualization product's internal identifier used by the GIBS team.",
              $ref: '#/definitions/IdentifierType'
            },
            StandardOrNRTExternalIdentifier: {
              description: "The visualization product's external identifier used for accessing the \"standard\" or \"near real-time\" visualizations through GIBS APIs.",
              $ref: '#/definitions/IdentifierType'
            },
            BestAvailableExternalIdentifier: {
              description: "The visualization product's external identifier used for acces sing the \"best available\" visualizations through GIBS APIs.",
              $ref: '#/definitions/IdentifierType'
            },
            GIBSTitle: {
              description: 'A human-readable title for the visualization product to be used in the GIBS service documentation (e.g. WMTS Title).',
              $ref: '#/definitions/TitleType'
            },
            WorldviewTitle: {
              description: 'The first line to the product title in the Worldview client.',
              $ref: '#/definitions/TitleType'
            },
            WorldviewSubtitle: {
              description: 'The second line to the product title in the Worldview client.',
              $ref: '#/definitions/TitleType'
            }
          }
        },
        ProductMetadata: {
          $comment: 'Table 3.1 2 in GIBS Imagery Provider ICD, Revision B, Fields at this level are all defined in ICD Table 3.1 2, exceptd ones with their own inline comment(s), from https://wiki.earthdata.nasa.gov/download/attachments/197006592/LayerMetadata_v1.0-0.json and ones with prefix ows: and wmts:, which are from OGC OWS and WMTS xsd files and ones commented as Experimental, which are based on discussions with stakeholders.',
          description: 'Fields within the GIBS visualization product metadata model that can be directly traced to items found in the underlying dataset and/or parameter metadata or are descriptions of the visualization process/product.',
          type: 'object',
          additionalProperties: false,
          properties: {
            InternalIdentifier: {
              description: "The visualization product's internal identifier used by the GIBS team.",
              $ref: '#/definitions/IdentifierType'
            },
            SourceDatasets: {
              description: 'The CMR Concept ID for the collection(s) from which visualizations are generated.',
              type: 'array',
              items: {
                description: 'A single CMR Concept ID.',
                $ref: '#/definitions/ConceptIdType'
              },
              minItems: 1
            },
            RepresentingDatasets: {
              description: 'The CMR Concept ID for the collection(s) for which visualizations represent.',
              type: 'array',
              items: {
                description: 'A single CMR Concept ID.',
                $ref: '#/definitions/ConceptIdType'
              },
              minItems: 1
            },
            ScienceParameters: {
              description: 'The name of science parameter (s) or HDF/netCDF Science Data Set(s) that were utilized during visualization generation.',
              type: 'array',
              items: {
                description: 'A science parameter name.',
                type: 'string',
                minLength: 1,
                maxLength: 256
              },
              minItems: 1
            },
            ParameterUnits: {
              description: 'The units for the parameter being visualized.',
              type: 'array',
              items: {
                description: 'A unit name.',
                $comment: 'can be null if no units are appropriate.',
                type: 'string',
                minLength: 1,
                maxLength: 64
              },
              minItems: 1
            },
            Measurement: {
              description: 'The scientific measurement category to which the visualization product will be assigned within the Worldview interface.',
              type: 'string',
              $comment: 'These values do not directly correlate to Science Keyword values managed within the GCMD.',
              minLength: 1,
              maxLength: 256
            },
            DataResolution: {
              description: "The x/y resolution of the data that is being visualized (e.g. '1.0 degree x 1.0 degree').",
              $ref: '#/definitions/SpatialResolutionNameTypeA'
            },
            GranuleOrComposite: {
              description: 'Indicates what unit of data is being visualized and provided to end-users.',
              type: 'string',
              enum: [
                'Granule',
                'Composite'
              ]
            },
            DataDayBreak: {
              description: 'The time of day (UTC) at which the "data day" changes for a data granule being visualized.',
              type: 'string',
              pattern: '^[0-2][0-3]:[0-5][0-9]:[0-5][0-9]Z$'
            },
            VisualizationLatency: {
              description: "The approximate latency between the end of data acquisition and visualization file availability for GIBS to ingest. This value may be minutes, hours, or days, depending on the appropriate units. A value of 'N/A' may be provided if not applicable (e.g. static historical products)",
              $comment: "Integer + Units or 'N/A'",
              $ref: '#/definitions/VisualizationLatencyType'
            },
            UpdateInterval: {
              description: "The approximate interval, in minutes, between updates for Near Real-Time or partially-delivered Standard visualizations. For example, the number of minutes between PDRs that contain input tiles for a specific data day. A value of 'N/A' may be provided if not applicable.",
              $comment: "Integer or 'N/A'",
              oneOf: [
                {
                  title: 'User Input',
                  type: 'integer'
                },
                {
                  title: 'Not Applicable',
                  type: 'string',
                  enum: [
                    'N/A'
                  ]
                }
              ]
            },
            TemporalCoverage: {
              description: 'A time interval specifying the start , end, and duration of the visualization products that will be generated. The ISO 8601 interval notation (PnYnMnDTnHnMnS) is used to specify the durat ion between images. For example, a product that is generated every day within 2013 would have the following temporal coverage: 2013-01-01/2013-12-31/P1D. If a layer has discontinuous ranges, they should be provided in a comma-separated list. Visualization products that have a nonstatic end-date should provide only the start date and interval (e.g. 2013-01-01/P1D). Note that files which represent a 5-day average, but are generated daily, would have a period of P1D.',
              $comment: 'A pattern for full matching of iso 8601 can be overkill. More discussion with stakeholders about pattern detail is needed.',
              type: 'string',
              minLength: 3
            },
            WGS84SpatialCoverage: {
              description: 'The spatial coverage of the data that will be visualized. The coverage is referenced in the WGS84 coordinate system.',
              $comment: 'LL_Lat, LL_Lon, UR_Lat, UR_Lon',
              type: 'array',
              items: {
                type: 'number'
              },
              maxItems: 4,
              minItems: 4
            },
            NativeSpatialCoverage: {
              description: 'The spatial coverage of the data that will be visualized. The coverage is referenced in the coordinate system native to the projection. In the order of LL_Y, LL_X, UR_Y, UR_X',
              $comment: 'LL_Y, LL_X, UR_Y, UR_X',
              type: 'array',
              items: {
                type: 'number'
              },
              maxItems: 4,
              minItems: 4
            },
            AscendingOrDescending: {
              description: "Indicates whether visualizations are generated from data that was acquired during the ascending or descending orbit. May be 'N/A' for Geostationary platforms or utility visualization products.",
              type: 'string',
              enum: [
                'Ascending',
                'Descending',
                'Both',
                'N/A'
              ]
            },
            ColorMap: {
              description: "The extension-less filename (e.g. \"MODIS_Brightness_Temperature\") of the colormap associated with this product. One or more visualization products may have the same mapping from data to RGB (e.g. MODIS Aqua/Terra Brightness Temp Day/Night). To simplify configuration and improve usability, GIBS will utilize a consolidated colormap for all products that share that colormap. Existing colormaps within the GIBS visualization catalog may be reviewed here https://gibs.earthdata.nasa.gov/colormaps/v1.3/output/. A value of 'N/A' may be provided if not applicable (e.g. JPEG multi- band visualizations)",
              $ref: '#/definitions/TextStringOrNaType'
            },
            VectorStyle: {
              description: 'The extension-less filename (e.g. "FIRMS_MODIS_Thermal_Anomalies") of the vector style file associated with this product. One or more vector visualization products may utilize the same vector style file for simplification of configuration and improved usability. Existing vector style files within the GIBS visualization catalog may be reviewed here https://gibs.earthdata.nasa.gov/vector-styles/v1.0/.',
              $ref: '#/definitions/TextStringOrNaType'
            },
            VectorMetadata: {
              description: 'The extension-less filename (e.g. "FIRMS_MODIS_Thermal_Anomalies") of the vector metadata file associated with this product. One or more vector products may utilize the same vector metadata file for simplification of configuration and improved usability. Existing vector metadata files within the GIBS visualization catalog may be reviewed here https://gibs.earthdata.nasa.gov/vector-metadata/v1.0/.',
              $ref: '#/definitions/TextStringOrNaType'
            },
            TitleAlt: {
              $comment: 'LayerMetadata v1.0-0, kept for review and renamed as TitleAlt. /Title should be preferred.',
              deprecated: true,
              description: 'The layer title.',
              $ref: '#/definitions/TitleType'
            },
            SubtitleAlt: {
              $comment: 'LayerMetadata v1.0-0, kept for review and renamed as SubtitleAlt. /Subtitle should be preferred.',
              deprecated: true,
              // eslint-disable-next-line no-template-curly-in-string
              description: "The layer subtitle. Usually '${SatelliteName} / ${InstrumentName}'",
              $ref: '#/definitions/TitleType'
            },
            MeasurementAlt: {
              $comment: 'LayerMetadata v1.0-0, kept for review and renamed as MeasurementAlt ./Measurement should be preferred.',
              deprecated: true,
              description: 'The visualization layer’s measurement category',
              type: 'string',
              minLength: 1,
              maxlenght: 256
            },
            LayerPeriod: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'The visualization layer’s temporal resolution',
              type: 'string',
              enum: [
                'Subdaily',
                'Daily',
                'Multi-Day',
                '4-Day',
                '5-Day',
                '7-Day',
                '8-Day',
                '16-Day',
                'Weekly',
                'Monthly',
                '3-Month',
                'Yearly'
              ]
            },
            TransAntiMeridian: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Whether the visualization layer provides representations that cross the antimeridian.',
              type: 'boolean'
            },
            Daynight: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Whether the visualization layer represents data captured during the day, night (or both) as perceived during time of data acquisition.',
              title: 'Day or Night',
              type: 'array',
              uniqueItems: true,
              maxItems: 2,
              items: {
                type: 'string',
                enum: [
                  'day',
                  'night'
                ]
              }
            },
            OrbitTracks: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Corresponding orbit track layers',
              type: 'array',
              uniqueItems: true,
              items: {
                description: 'Orbit track layer identifier(s)',
                type: 'string',
                minLength: 1
              }
            },
            OrbitDirection: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Whether the visualization layer represents data from the ascending, descending, or both tracks of a satellite.',
              type: 'array',
              maxItems: 2,
              items: {
                description: 'Orbit track direction',
                enum: [
                  'ascending',
                  'descending'
                ]
              }
            },
            ConceptIdsAlt: {
              $comment: 'LayerMetadata v1.0-0, kept for review and renamed as ConceptIdsAlt. /ConceptIds should be preferred.',
              description: 'Which CMR dataset(s) are represented by the visualization layer.',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    description: 'Identify whether the associated dataset is NRT or STD.',
                    type: 'string',
                    enum: [
                      'NRT',
                      'STD'
                    ]
                  },
                  value: {
                    description: "The dataset's CMR concept id",
                    $ref: '#/definitions/ConceptIdType'
                  }
                },
                required: [
                  'type',
                  'value'
                ],
                additionalProperties: false
              },
              minItems: 1
            },
            ResolutionAtNadir: {
              $comment: 'LayerMetadata v1.0-0',
              description: "The visualization layer's approximate horizontal spatial resolution @ NADIR retrieval (e.g. \"250m\").",
              type: 'string',
              minLength: 1
            },
            Ongoing: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Whether the visualization layer is being actively updated or is a static (i.e. historical-only or reference) layer.',
              type: 'boolean'
            },
            RetentionPeriod: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'The retention period for a visualization layer, as calculated as the number of days after the end of acquisition for the associated data. Indefinite retention indicated by value of -1.',
              type: 'integer'
            },
            Latency: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'Latency, in minutes, between the end of data acquisition and when the visualization layer will reflect the sensed data.',
              type: 'integer'
            },
            UpdateFrequency: {
              $comment: 'LayerMetadata v1.0-0',
              description: 'How often, in minutes, a non-static visualization layer is updated for the current data day.',
              type: 'integer'
            },
            'ows:Title': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsDataIdentification.xsd',
              description: 'OWS Title',
              type: 'string',
              minLength: 1,
              maxLength: 256
            },
            'ows:Abstract': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsDataIdentification.xsd',
              description: 'OWS Abstract',
              type: 'string',
              minLength: 1,
              maxLength: 1024
            },
            'ows:Keywords': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsDataIdentification.xsd',
              description: 'OWS Keywords',
              type: 'array',
              items: {
                description: 'OWS Keyword',
                type: 'string',
                minLength: 1,
                maxLength: 64
              },
              minItems: 1
            },
            'ows:WGS84BoundingBox': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsContents.xsd',
              description: 'Unordered list of zero or more minimum bounding rectangles surrounding coverage data, using the WGS 84 CRS with decimal degrees and longitude before latitude. ... If multiple WGS 84 bounding boxes are included, this shall be interpreted as the union of the areas of these bounding boxes. Should be in the order of longitude0, longitude1, latitude0, latitude1',
              type: 'array',
              items: {
                description: 'longitude0, longitude1, latitude0, latitude1',
                type: 'number'
              },
              maxItems: 4,
              minItems: 4
            },
            'ows:Identifier': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsContents.xsd',
              description: 'Unambiguous identifier or name of this coverage, unique for this server.',
              type: 'string',
              minLength: 1,
              maxLength: 64
            },
            'ows:BoundingBox': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsContents.xsd',
              description: 'Unordered list of zero or more minimum bounding rectangles surrounding coverage data, in AvailableCRSs. Zero or more BoundingBoxes are allowed in addition to one or more WGS84BoundingBoxes to allow more precise specification of the Dataset area in AvailableCRSs. ... If multiple bounding boxes are included with the same CRS, this shall be interpreted as the union of the areas of these bounding boxes.',
              type: 'array',
              items: {
                description: 'longitude0, longitude1, latitude0, latitude1',
                type: 'number'
              },
              maxItems: 4,
              minItems: 4
            },
            'ows:Metadata': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsContents.xsd',
              description: 'Optional unordered list of additional metadata about this dataset. A list of optional metadata elements for this dataset description could be specified in the Implementation Specification for this service.',
              type: 'array',
              items: {
                $ref: '#/definitions/ows:MetadataType'
              },
              minItems: 1
            },
            'ows:DatasetDescriptionSummary ': {
              $comment: 'http://schemas.opengis.net/ows/1.1.0/owsContents.xsd',
              description: 'Metadata describing zero or more unordered subsidiary datasets available from this server.',
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 1064
              }
            },
            'wmts:Style': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: 'WMTS Style',
              type: 'array',
              items: {
                $ref: '#/definitions/wmts:StyleType'
              },
              minItems: 1
            },
            'wmts:Format': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: 'Supported valid output MIME types for a tile.',
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 64
              },
              minItems: 1
            },
            'wmts:InfoFormat': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: "Supported valid output MIME types for a FeatureInfo. If there isn't any, The server do not support FeatureInfo requests for this layer.",
              type: 'array',
              items: {
                type: 'string',
                minLength: 1,
                maxLength: 64
              },
              minItems: 1
            },
            'wmts:Dimension': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: 'Metadata about a particular dimension that the tiles of a layer are available.',
              $ref: '#/definitions/wmts:DimensionType'
            },
            'wmts:TileMatrixSetLink': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: 'Metadata about the TileMatrixSet reference.',
              $ref: '#/definitions/wmts:TileMatrixSetLinkType'
            },
            'wmts:ResourceURL': {
              $comment: 'http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
              description: 'URL template to a tile or a FeatureInfo resource on resource oriented architectural style.',
              $ref: '#/definitions/wmts:URLTemplateType'
            }
          },
          required: []
        }
      }
      //   },
      //   {
      //     title: 'UMM-Vis-Maps',
      //     type: 'object',
      //     additionalProperties: false,
      //     description: 'Specifies the Map type.',
      //     properties: {
      //       SpecificationMap1: {
      //         type: 'string'
      //       },
      //       SpecificationMap2: {
      //         type: 'string'
      //       }
      //     },
      //     required: [
      //       'SpecificationMap1',
      //       'SpecificationMap2'
      //     ]
      //   }
      // ]
    },
    Generation: {
      // Put oneOf back in when maps are ready to be supported.
      // oneOf: [
      //   {
      $comment: 'Table 4.1 2 in GIBS Imagery Provider ICD, Revision B, Table 3.1 1 in GIBS Imagery Provider ICD, Revision B',
      description: 'How this visualization is generated.',
      title: 'UMM-Vis-Tiles',
      type: 'object',
      additionalProperties: false,
      properties: {
        SourceProjection: {
          description: 'The EPSG code identifying the projection of the source visualization files.',
          type: 'string',
          $comment: 'Table 4.1.1-1 in GIBS Imagery Provider ICD, Revision B',
          enum: [
            'EPSG:4326',
            'EPSG:3413',
            'EPSG:3031'
          ]
        },
        SourceResolution: {
          description: 'An indication of whether the resolution of the source visualization file(s) will match one of GIBS’ access resolutions or will be in data’s the native resolution',
          type: 'string',
          $comment: "Value '0.25°' appears in GIBS ICD Appendix - PODAAC_v1_21.xlsx, but not in ICD document",
          enum: [
            'GIBS',
            'Native',
            '0.25°'
          ]
        },
        SourceFormat: {
          description: 'The format of the source visualization file(s).',
          type: 'string',
          enum: [
            'PNG',
            'JPEG',
            'GeoTIFF',
            'GeoJSON',
            'Shapefile'
          ]
        },
        SourceColorModel: {
          description: 'The color model of the source raster visualization file(s).',
          type: 'string',
          $comment: 'Table 4.1.4-1 in GIBS Imagery Provider ICD, Revision B',
          enum: [
            'Full-Color RGB',
            'Full-Color RGBA',
            'Indexed RGBA',
            'Indexed Grayscale',
            'Hybrid RGBA',
            'N/A'
          ]
        },
        SourceNoDataIndexOrRGB: {
          description: "The palette entry index that is designated as the \"No Data\" value in the associated colormap for raster visualization produc ts with a Source Color Model value of 'Indexed RGBA', 'Hybrid RGBA', or 'Indexed Grayscale’ OR The RGB value to be used as \"No Data\" value for raster visualization products with a Source Color Model value of 'Full-Color RGB' or 'Full-Color RGBA'.",
          type: 'string',
          minLength: 0,
          maxLength: 64
        },
        SourceCoverage: {
          description: 'The geographic coverage type of the source visualization file(s).',
          type: 'string',
          enum: [
            'Full',
            'Tiled',
            'Granule',
            'Tiled-Granule'
          ]
        },
        OutputProjection: {
          description: 'The EPSG code identifying the projection of the output visualization product generated and served by GIBS.',
          type: 'string',
          $comment: 'Table 4.1.7-1 in in GIBS Imagery Provider ICD, Revision B',
          enum: [
            'EPSG:4326',
            'EPSG:3413',
            'EPSG:3031'
          ]
        },
        OutputResolution: {
          description: 'The normalized resolution (meters /pixel) of the output visualization product generated and served by GIBS.',
          type: 'string',
          $comment: 'Table 4.1.8-1 in GIBS Imagery Provider ICD, Revision B, Table 4.1.8-2 in GIBS Imagery Provider ICD, Revision B, Table 4.1.8-3 in GIBS Imagery Provider ICD, Revision B',
          enum: [
            '2km',
            '1km',
            '500m',
            '250m',
            '125m',
            '62.5m',
            '31.25m',
            '15.125m'
          ]
        },
        OutputFormat: {
          description: 'The format of the visualization that will be served by GIBS.',
          type: 'string',
          enum: [
            'PNG',
            'PPNG',
            'JPEG',
            'MVT'
          ]
        },
        SourceData: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'Source data used to create visualization',
          type: 'array',
          items: {
            $ref: '#/definitions/SourceDataType'
          },
          minItems: 1
        },
        Reprojection: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'How reprojection is done. Describe what source projection and output projection are',
          type: 'object',
          properties: {
            Source: {
              $ref: '#/definitions/ProjectionType'
            },
            Output: {
              $ref: '#/definitions/ProjectionType'
            }
          }
        },
        Regridding: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'How regridding is done. Ddescribe what source grid and output grid are',
          type: 'object',
          properties: {
            Source: {
              $ref: '#/definitions/GridType'
            },
            Output: {
              $ref: '#/definitions/GridType'
            }
          }
        },
        Sampling: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'How sampling is done. Type can be interpolate,  average-out, etc.',
          type: 'object',
          properties: {
            Type: {
              type: 'string',
              enum: [
                'interpolation'
              ]
            },
            Method: {
              type: 'string',
              enum: [
                'nearest-neighbor'
              ]
            }
          }
        },
        Resolution: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'What are resolutions of source data and resulting visualization.',
          type: 'object',
          properties: {
            Source: {
              $ref: '#/definitions/SpatialResolutionTypeAlt'
            },
            Output: {
              $ref: '#/definitions/SpatialResolutionTypeAlt'
            }
          }
        },
        QualityFlag: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'Describe filtering, mask, etc.',
          type: 'string',
          minLength: 0,
          maxLength: 256
        },
        ColorMapAlt: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation. Kept for review and renamed as ColorMapAlt. /Specification/ProductMetadata/ColorMap is preferred? Or they are different?',
          deprecated: true,
          description: 'Describe color map or table used.',
          type: 'object',
          properties: {
            Name: {
              type: 'string'
            },
            Url: {
              type: 'string'
            }
          }
        },
        Range: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'Describe min/max value in data used.',
          type: 'object',
          properties: {
            Min: {
              type: 'number'
            },
            Max: {
              type: 'number'
            }
          }
        },
        Scale: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'Describe algorithm used in scaling data. It can be linear, logarithmic, etc.',
          type: 'object',
          properties: {
            Method: {
              type: 'string',
              enum: [
                'linear',
                'logarithmic'
              ]
            }
          }
        },
        PixelStyle: {
          $comment: 'Experimental. From discussion with Jeff Hall, author of classic IDL-based tools for browse image generation.',
          description: 'Describe shape of pixel when visualization is rendered.',
          type: 'object',
          properties: {
            Name: {
              type: 'string',
              enum: [
                'rectangle'
              ]
            }
          }
        }
      }
      // },
      //   {
      //     title: 'UMM-Vis-Maps',
      //     type: 'object',
      //     additionalProperties: false,
      //     description: 'Specifies the Map type.',
      //     properties: {
      //       GenerationMap1: {
      //         type: 'string'
      //       },
      //       GenerationMap2: {
      //         type: 'string'
      //       }
      //     },
      //     required: [
      //       'GenerationMap1',
      //       'GenerationMap2'
      //     ]
      //   }
      // ]
    }
  }

}

export default otherSchemasVisSchema
