export const publishCollectionRecord = {
  relatedCollections: null,
  nativeId: 'mock native id',
  abstract: 'Mock Testing Collections',
  accessConstraints: null,
  additionalAttributes: [
    {
      parameterUnitsOfMeasure: 'meters',
      dataType: 'STRING',
      parameterValueAccuracy: 'centimeter',
      valueAccuracyExplanation: 'Mock Text ',
      description: 'Lorem Ipsum',
      updateDate: '2020-07-02T00:00:00.000Z',
      measurementResolution: 'Measurement Resolution test',
      name: 'Mock additional attribute 1',
      group: 'Mock Test Group'
    }
  ],
  ancillaryKeywords: [
    'Test Ancillary keyword'
  ],
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  revisions: {
    count: 1,
    items: []
  },
  pageTitle: 'mock name',
  userId: 'admin',
  archiveAndDistributionInformation: {
    fileArchiveInformation: [
      {
        format: 'Test Archive',
        formatType: 'Supported',
        averageFileSize: 1,
        averageFileSizeUnit: 'TB',
        totalCollectionFileSize: 2,
        totalCollectionFileSizeUnit: 'TB',
        description: 'Lorem Ipsum'
      }
    ],
    fileDistributionInformation: [
      {
        format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
        media: [
          'Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'
        ],
        averageFileSize: 10,
        averageFileSizeUnit: 'GB',
        totalCollectionFileSize: 10,
        totalCollectionFileSizeUnit: 'GB',
        description: 'Lorem Ipsum',
        fees: 'Lorem Ipsum'
      }
    ]
  },
  associatedDois: [
    {
      doi: 'TestDOI'
    }
  ],
  collectionCitations: [
    {
      version: '1',
      title: 'Testing',
      releaseDate: '2024-01-23T00:00:00.000Z'
    }
  ],
  collectionProgress: 'NOT APPLICABLE',
  conceptId: 'C1200000100-MMT_2',
  contactGroups: null,
  contactPersons: null,
  tagDefinitions: {
    items: [{
      conceptId: 'C100000',
      description: 'Mock tag description',
      originatorId: 'test.user',
      revisionId: '1',
      tagKey: 'Mock tag key'
    }]
  },
  dataCenters: [
    {
      roles: [
        'ORIGINATOR'
      ],
      shortName: 'AAG',
      longName: 'Association of American Geographers',
      contactInformation: {
        serviceHours: '8 to 6',
        contactInstruction: 'Cell',
        contactMechanisms: [
          {
            type: 'Mobile',
            value: '555-555-1212'
          }
        ],
        relatedUrls: [
          {
            urlContentType: 'DataCenterURL',
            type: 'HOME PAGE',
            url: 'http://www.aag.org/'
          }
        ]
      },
      contactPersons: [
        {
          roles: [
            'Metadata Author'
          ],
          firstName: 'Mock',
          lastName: 'Gray',
          contactInformation: {
            relatedUrls: [
              {
                urlContentType: 'DataContactURL',
                type: 'HOME PAGE',
                url: 'http://www.aag.org/'
              }
            ]
          }
        }
      ]
    }
  ],
  dataDates: [
    {
      type: 'UPDATE',
      date: '2024-01-23T00:00:00.000Z'
    }
  ],
  directDistributionInformation: null,
  doi: {
    missingReason: 'Not Applicable'
  },
  granules: {
    count: 1
  },
  isoTopicCategories: null,
  locationKeywords: null,
  metadataAssociations: null,
  metadataDates: [
    {
      type: 'REVIEW',
      date: '2025-06-17T00:00:00.000Z'
    },
    {
      type: 'CREATE',
      date: '2020-09-22T08:59:00.000Z'
    },
    {
      type: 'UPDATE',
      date: '2024-01-23T11:46:00.000Z'
    }
  ],
  paleoTemporalCoverages: null,
  platforms: [
    {
      type: 'Balloons',
      shortName: 'MAXIS',
      longName: 'MeV Auroral X-ray Imaging and Spectroscopy',
      instruments: [
        {
          shortName: 'AAS',
          longName: 'Atomic Absorption Spectrophotometry'
        }
      ]
    }
  ],
  processingLevel: {
    id: '1'
  },
  projects: null,
  publicationReferences: null,
  purpose: null,
  quality: null,
  relatedUrls: [
    {
      description: 'Test related URL',
      urlContentType: 'DistributionURL',
      type: 'USE SERVICE API',
      url: 'amazon.com',
      getService: {
        format: 'ascii',
        mimeType: 'application/json',
        protocol: 'HTTPS',
        fullName: 'Test Service',
        dataId: 'Test ID',
        dataType: 'Test type',
        uri: [
          'www.testingTest'
        ]
      }
    }
  ],
  scienceKeywords: [
    {
      category: 'EARTH SCIENCE',
      topic: 'BIOSPHERE',
      term: 'VEGETATION',
      variableLevel1: 'CARBON'
    },
    {
      category: 'EARTH SCIENCE',
      topic: 'LAND SURFACE',
      term: 'FROZEN GROUND',
      variableLevel1: 'ROCK GLACIERS'
    },
    {
      category: 'EARTH SCIENCE',
      topic: 'OCEANS',
      term: 'OCEAN OPTICS'
    }
  ],
  variables: null,
  services: {
    count: 0,
    items: null,
    __typename: 'ServiceList'
  },
  shortName: 'Mock Quick Test Services #2',
  spatialExtent: {
    spatialCoverageType: 'HORIZONTAL_VERTICAL',
    horizontalSpatialDomain: {
      geometry: {
        coordinateSystem: 'GEODETIC',
        boundingRectangles: [
          {
            northBoundingCoordinate: 90,
            westBoundingCoordinate: -180,
            eastBoundingCoordinate: 135,
            southBoundingCoordinate: -75
          }
        ]
      }
    },
    granuleSpatialRepresentation: 'CARTESIAN'
  },
  spatialInformation: {
    spatialCoverageType: 'VERTICAL',
    verticalCoordinateSystem: {
      depthSystemDefinition: {
        datumName: 'Test datum',
        distanceUnits: 'Feet',
        resolutions: [
          0.5
        ]
      }
    }
  },
  standardProduct: null,
  tags: {},
  temporalExtents: [
    {
      endsAtPresentFlag: true,
      rangeDateTimes: [
        {
          beginningDateTime: '2020-02-01T00:00:00.000Z',
          endingDateTime: '2020-05-20T00:00:00.000Z'
        }
      ]
    }
  ],
  temporalKeywords: [
    '1 second - < 1 minute'
  ],
  tilingIdentificationSystems: null,
  title: 'Mock Test for Services Tab',
  tools: {
    count: 0,
    items: null,
    __typename: 'ToolList'
  },
  ummMetadata: {
    AncillaryKeywords: [
      'Test Ancillary keyword'
    ],
    CollectionCitations: [
      {
        Version: '1',
        Title: 'Testing',
        ReleaseDate: '2024-01-23T00:00:00.000Z'
      }
    ],
    AdditionalAttributes: [
      {
        ParameterUnitsOfMeasure: 'meters',
        DataType: 'STRING',
        ParameterValueAccuracy: 'centimeter',
        ValueAccuracyExplanation: 'Mock Text ',
        Description: 'Lorem Ipsum',
        UpdateDate: '2020-07-02T00:00:00.000Z',
        MeasurementResolution: 'Measurement Resolution test',
        Name: 'Mock additional attribute 1',
        Group: 'Mock Test Group'
      }
    ],
    SpatialExtent: {
      SpatialCoverageType: 'HORIZONTAL_VERTICAL',
      HorizontalSpatialDomain: {
        Geometry: {
          CoordinateSystem: 'GEODETIC',
          BoundingRectangles: [
            {
              NorthBoundingCoordinate: 90,
              WestBoundingCoordinate: -180,
              EastBoundingCoordinate: 135,
              SouthBoundingCoordinate: -75
            }
          ]
        }
      },
      GranuleSpatialRepresentation: 'CARTESIAN'
    },
    CollectionProgress: 'NOT APPLICABLE',
    ScienceKeywords: [
      {
        Category: 'EARTH SCIENCE',
        Topic: 'BIOSPHERE',
        Term: 'VEGETATION',
        VariableLevel1: 'CARBON'
      },
      {
        Category: 'EARTH SCIENCE',
        Topic: 'LAND SURFACE',
        Term: 'FROZEN GROUND',
        VariableLevel1: 'ROCK GLACIERS'
      },
      {
        Category: 'EARTH SCIENCE',
        Topic: 'OCEANS',
        Term: 'OCEAN OPTICS'
      }
    ],
    TemporalExtents: [
      {
        EndsAtPresentFlag: true,
        RangeDateTimes: [
          {
            BeginningDateTime: '2020-02-01T00:00:00.000Z',
            EndingDateTime: '2020-05-20T00:00:00.000Z'
          }
        ]
      }
    ],
    ProcessingLevel: {
      Id: '1'
    },
    DOI: {
      MissingReason: 'Not Applicable'
    },
    ShortName: 'Mock Quick Test Services #2',
    EntryTitle: 'Mock Test for Services Tab',
    MetadataLanguage: 'eng',
    RelatedUrls: [
      {
        Description: 'Test related URL',
        URLContentType: 'DistributionURL',
        Type: 'USE SERVICE API',
        URL: 'amazon.com',
        GetService: {
          Format: 'ascii',
          MimeType: 'application/json',
          Protocol: 'HTTPS',
          FullName: 'Test Service',
          DataID: 'Test ID',
          DataType: 'Test type',
          URI: [
            'www.testingTest'
          ]
        }
      }
    ],
    SpatialInformation: {
      SpatialCoverageType: 'VERTICAL',
      VerticalCoordinateSystem: {
        DepthSystemDefinition: {
          DatumName: 'Test datum',
          DistanceUnits: 'Feet',
          Resolutions: [
            0.5
          ]
        }
      }
    },
    DataDates: [
      {
        Type: 'UPDATE',
        Date: '2024-01-23T00:00:00.000Z'
      }
    ],
    Abstract: 'Mock Testing Collections',
    MetadataDates: [
      {
        Type: 'REVIEW',
        Date: '2025-06-17T00:00:00.000Z'
      },
      {
        Type: 'CREATE',
        Date: '2020-09-22T08:59:00.000Z'
      },
      {
        Type: 'UPDATE',
        Date: '2024-01-23T11:46:00.000Z'
      }
    ],
    VersionDescription: 'Mock Test',
    Version: '1',
    AssociatedDOIs: [
      {
        DOI: 'TestDOI'
      }
    ],
    DataCenters: [
      {
        Roles: [
          'ORIGINATOR'
        ],
        ShortName: 'AAG',
        LongName: 'Association of American Geographers',
        ContactInformation: {
          ServiceHours: '8 to 6',
          ContactInstruction: 'Cell',
          ContactMechanisms: [
            {
              Type: 'Mobile',
              Value: '555-555-1212'
            }
          ],
          RelatedUrls: [
            {
              URLContentType: 'DataCenterURL',
              Type: 'HOME PAGE',
              URL: 'http://www.aag.org/'
            }
          ]
        },
        ContactPersons: [
          {
            Roles: [
              'Metadata Author'
            ],
            FirstName: 'Mock',
            LastName: 'Gray',
            ContactInformation: {
              RelatedUrls: [
                {
                  URLContentType: 'DataContactURL',
                  Type: 'HOME PAGE',
                  URL: 'http://www.aag.org/'
                }
              ]
            }
          }
        ]
      }
    ],
    TemporalKeywords: [
      '1 second - < 1 minute'
    ],
    Platforms: [
      {
        Type: 'Balloons',
        ShortName: 'MAXIS',
        LongName: 'MeV Auroral X-ray Imaging and Spectroscopy',
        Instruments: [
          {
            ShortName: 'AAS',
            LongName: 'Atomic Absorption Spectrophotometry'
          }
        ]
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2',
      Name: 'UMM-C',
      Version: '1.17.2'
    },
    ArchiveAndDistributionInformation: {
      FileArchiveInformation: [
        {
          Format: 'Test Archive',
          FormatType: 'Supported',
          AverageFileSize: 1,
          AverageFileSizeUnit: 'TB',
          TotalCollectionFileSize: 2,
          TotalCollectionFileSizeUnit: 'TB',
          Description: 'Lorem Ipsum'
        }
      ],
      FileDistributionInformation: [
        {
          Format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
          Media: [
            'Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'
          ],
          AverageFileSize: 10,
          AverageFileSizeUnit: 'GB',
          TotalCollectionFileSize: 10,
          TotalCollectionFileSizeUnit: 'GB',
          Description: 'Lorem Ipsum',
          Fees: 'Lorem Ipsum'
        }
      ]
    }
  },
  useConstraints: null,
  '': {
    count: 0,
    items: null,
    __typename: 'VariableList'
  },
  versionDescription: 'Mock Test',
  versionId: '1',
  __typename: 'Collection'
}

export const noTagsOrGranulesCollection = {
  relatedCollections: null,
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  revisions: {
    count: 1,
    items: []
  },
  pageTitle: 'mock name',
  userId: 'admin',
  nativeId: 'mock native id',
  abstract: 'Mock Testing Collections',
  accessConstraints: null,
  additionalAttributes: [
    {
      parameterUnitsOfMeasure: 'meters',
      dataType: 'STRING',
      parameterValueAccuracy: 'centimeter',
      valueAccuracyExplanation: 'Mock Text ',
      description: 'Lorem Ipsum',
      updateDate: '2020-07-02T00:00:00.000Z',
      measurementResolution: 'Measurement Resolution test',
      name: 'Mock additional attribute 1',
      group: 'Mock Test Group'
    }
  ],
  ancillaryKeywords: [
    'Test Ancillary keyword'
  ],
  archiveAndDistributionInformation: {
    fileArchiveInformation: [
      {
        format: 'Test Archive',
        formatType: 'Supported',
        averageFileSize: 1,
        averageFileSizeUnit: 'TB',
        totalCollectionFileSize: 2,
        totalCollectionFileSizeUnit: 'TB',
        description: 'Lorem Ipsum'
      }
    ],
    fileDistributionInformation: [
      {
        format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
        media: [
          'Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'
        ],
        averageFileSize: 10,
        averageFileSizeUnit: 'GB',
        totalCollectionFileSize: 10,
        totalCollectionFileSizeUnit: 'GB',
        description: 'Lorem Ipsum',
        fees: 'Lorem Ipsum'
      }
    ]
  },
  associatedDois: [
    {
      doi: 'TestDOI'
    }
  ],
  collectionCitations: [
    {
      version: '1',
      title: 'Testing',
      releaseDate: '2024-01-23T00:00:00.000Z'
    }
  ],
  collectionProgress: 'NOT APPLICABLE',
  conceptId: 'C1200000100-MMT_2',
  contactGroups: null,
  contactPersons: null,
  tagDefinitions: null,
  dataCenters: [
    {
      roles: [
        'ORIGINATOR'
      ],
      shortName: 'AAG',
      longName: 'Association of American Geographers',
      contactInformation: {
        serviceHours: '8 to 6',
        contactInstruction: 'Cell',
        contactMechanisms: [
          {
            type: 'Mobile',
            value: '555-555-1212'
          }
        ],
        relatedUrls: [
          {
            urlContentType: 'DataCenterURL',
            type: 'HOME PAGE',
            url: 'http://www.aag.org/'
          }
        ]
      },
      contactPersons: [
        {
          roles: [
            'Metadata Author'
          ],
          firstName: 'Mock',
          lastName: 'Gray',
          contactInformation: {
            relatedUrls: [
              {
                urlContentType: 'DataContactURL',
                type: 'HOME PAGE',
                url: 'http://www.aag.org/'
              }
            ]
          }
        }
      ]
    }
  ],
  dataDates: [
    {
      type: 'UPDATE',
      date: '2024-01-23T00:00:00.000Z'
    }
  ],
  directDistributionInformation: null,
  doi: {
    missingReason: 'Not Applicable'
  },
  granules: {
    count: 0
  },
  isoTopicCategories: null,
  locationKeywords: null,
  metadataAssociations: null,
  metadataDates: [
    {
      type: 'REVIEW',
      date: '2025-06-17T00:00:00.000Z'
    },
    {
      type: 'CREATE',
      date: '2020-09-22T08:59:00.000Z'
    },
    {
      type: 'UPDATE',
      date: '2024-01-23T11:46:00.000Z'
    }
  ],
  paleoTemporalCoverages: null,
  platforms: [
    {
      type: 'Balloons',
      shortName: 'MAXIS',
      longName: 'MeV Auroral X-ray Imaging and Spectroscopy',
      instruments: [
        {
          shortName: 'AAS',
          longName: 'Atomic Absorption Spectrophotometry'
        }
      ]
    }
  ],
  processingLevel: {
    id: '1'
  },
  projects: null,
  publicationReferences: null,
  purpose: null,
  quality: null,
  relatedUrls: [
    {
      description: 'Test related URL',
      urlContentType: 'DistributionURL',
      type: 'USE SERVICE API',
      url: 'amazon.com',
      getService: {
        format: 'ascii',
        mimeType: 'application/json',
        protocol: 'HTTPS',
        fullName: 'Test Service',
        dataId: 'Test ID',
        dataType: 'Test type',
        uri: [
          'www.testingTest'
        ]
      }
    }
  ],
  scienceKeywords: [
    {
      category: 'EARTH SCIENCE',
      topic: 'BIOSPHERE',
      term: 'VEGETATION',
      variableLevel1: 'CARBON'
    },
    {
      category: 'EARTH SCIENCE',
      topic: 'LAND SURFACE',
      term: 'FROZEN GROUND',
      variableLevel1: 'ROCK GLACIERS'
    },
    {
      category: 'EARTH SCIENCE',
      topic: 'OCEANS',
      term: 'OCEAN OPTICS'
    }
  ],
  variables: null,
  services: {
    count: 0,
    items: null,
    __typename: 'ServiceList'
  },
  shortName: 'Mock Quick Test Services #2',
  spatialExtent: {
    spatialCoverageType: 'HORIZONTAL_VERTICAL',
    horizontalSpatialDomain: {
      geometry: {
        coordinateSystem: 'GEODETIC',
        boundingRectangles: [
          {
            northBoundingCoordinate: 90,
            westBoundingCoordinate: -180,
            eastBoundingCoordinate: 135,
            southBoundingCoordinate: -75
          }
        ]
      }
    },
    granuleSpatialRepresentation: 'CARTESIAN'
  },
  spatialInformation: {
    spatialCoverageType: 'VERTICAL',
    verticalCoordinateSystem: {
      depthSystemDefinition: {
        datumName: 'Test datum',
        distanceUnits: 'Feet',
        resolutions: [
          0.5
        ]
      }
    }
  },
  standardProduct: null,
  tags: null,
  temporalExtents: [
    {
      endsAtPresentFlag: true,
      rangeDateTimes: [
        {
          beginningDateTime: '2020-02-01T00:00:00.000Z',
          endingDateTime: '2020-05-20T00:00:00.000Z'
        }
      ]
    }
  ],
  temporalKeywords: [
    '1 second - < 1 minute'
  ],
  tilingIdentificationSystems: null,
  title: 'Mock Test for Services Tab',
  tools: {
    count: 0,
    items: null,
    __typename: 'ToolList'
  },
  ummMetadata: {
    AncillaryKeywords: [
      'Test Ancillary keyword'
    ],
    CollectionCitations: [
      {
        Version: '1',
        Title: 'Testing',
        ReleaseDate: '2024-01-23T00:00:00.000Z'
      }
    ],
    AdditionalAttributes: [
      {
        ParameterUnitsOfMeasure: 'meters',
        DataType: 'STRING',
        ParameterValueAccuracy: 'centimeter',
        ValueAccuracyExplanation: 'Mock Text ',
        Description: 'Lorem Ipsum',
        UpdateDate: '2020-07-02T00:00:00.000Z',
        MeasurementResolution: 'Measurement Resolution test',
        Name: 'Mock additional attribute 1',
        Group: 'Mock Test Group'
      }
    ],
    SpatialExtent: {
      SpatialCoverageType: 'HORIZONTAL_VERTICAL',
      HorizontalSpatialDomain: {
        Geometry: {
          CoordinateSystem: 'GEODETIC',
          BoundingRectangles: [
            {
              NorthBoundingCoordinate: 90,
              WestBoundingCoordinate: -180,
              EastBoundingCoordinate: 135,
              SouthBoundingCoordinate: -75
            }
          ]
        }
      },
      GranuleSpatialRepresentation: 'CARTESIAN'
    },
    CollectionProgress: 'NOT APPLICABLE',
    ScienceKeywords: [
      {
        Category: 'EARTH SCIENCE',
        Topic: 'BIOSPHERE',
        Term: 'VEGETATION',
        VariableLevel1: 'CARBON'
      },
      {
        Category: 'EARTH SCIENCE',
        Topic: 'LAND SURFACE',
        Term: 'FROZEN GROUND',
        VariableLevel1: 'ROCK GLACIERS'
      },
      {
        Category: 'EARTH SCIENCE',
        Topic: 'OCEANS',
        Term: 'OCEAN OPTICS'
      }
    ],
    TemporalExtents: [
      {
        EndsAtPresentFlag: true,
        RangeDateTimes: [
          {
            BeginningDateTime: '2020-02-01T00:00:00.000Z',
            EndingDateTime: '2020-05-20T00:00:00.000Z'
          }
        ]
      }
    ],
    ProcessingLevel: {
      Id: '1'
    },
    DOI: {
      MissingReason: 'Not Applicable'
    },
    ShortName: 'Mock Quick Test Services #2',
    EntryTitle: 'Mock Test for Services Tab',
    MetadataLanguage: 'eng',
    RelatedUrls: [
      {
        Description: 'Test related URL',
        URLContentType: 'DistributionURL',
        Type: 'USE SERVICE API',
        URL: 'amazon.com',
        GetService: {
          Format: 'ascii',
          MimeType: 'application/json',
          Protocol: 'HTTPS',
          FullName: 'Test Service',
          DataID: 'Test ID',
          DataType: 'Test type',
          URI: [
            'www.testingTest'
          ]
        }
      }
    ],
    SpatialInformation: {
      SpatialCoverageType: 'VERTICAL',
      VerticalCoordinateSystem: {
        DepthSystemDefinition: {
          DatumName: 'Test datum',
          DistanceUnits: 'Feet',
          Resolutions: [
            0.5
          ]
        }
      }
    },
    DataDates: [
      {
        Type: 'UPDATE',
        Date: '2024-01-23T00:00:00.000Z'
      }
    ],
    Abstract: 'Mock Testing Collections',
    MetadataDates: [
      {
        Type: 'REVIEW',
        Date: '2025-06-17T00:00:00.000Z'
      },
      {
        Type: 'CREATE',
        Date: '2020-09-22T08:59:00.000Z'
      },
      {
        Type: 'UPDATE',
        Date: '2024-01-23T11:46:00.000Z'
      }
    ],
    VersionDescription: 'Mock Test',
    Version: '1',
    AssociatedDOIs: [
      {
        DOI: 'TestDOI'
      }
    ],
    DataCenters: [
      {
        Roles: [
          'ORIGINATOR'
        ],
        ShortName: 'AAG',
        LongName: 'Association of American Geographers',
        ContactInformation: {
          ServiceHours: '8 to 6',
          ContactInstruction: 'Cell',
          ContactMechanisms: [
            {
              Type: 'Mobile',
              Value: '555-555-1212'
            }
          ],
          RelatedUrls: [
            {
              URLContentType: 'DataCenterURL',
              Type: 'HOME PAGE',
              URL: 'http://www.aag.org/'
            }
          ]
        },
        ContactPersons: [
          {
            Roles: [
              'Metadata Author'
            ],
            FirstName: 'Mock',
            LastName: 'Gray',
            ContactInformation: {
              RelatedUrls: [
                {
                  URLContentType: 'DataContactURL',
                  Type: 'HOME PAGE',
                  URL: 'http://www.aag.org/'
                }
              ]
            }
          }
        ]
      }
    ],
    TemporalKeywords: [
      '1 second - < 1 minute'
    ],
    Platforms: [
      {
        Type: 'Balloons',
        ShortName: 'MAXIS',
        LongName: 'MeV Auroral X-ray Imaging and Spectroscopy',
        Instruments: [
          {
            ShortName: 'AAS',
            LongName: 'Atomic Absorption Spectrophotometry'
          }
        ]
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2',
      Name: 'UMM-C',
      Version: '1.17.2'
    },
    ArchiveAndDistributionInformation: {
      FileArchiveInformation: [
        {
          Format: 'Test Archive',
          FormatType: 'Supported',
          AverageFileSize: 1,
          AverageFileSizeUnit: 'TB',
          TotalCollectionFileSize: 2,
          TotalCollectionFileSizeUnit: 'TB',
          Description: 'Lorem Ipsum'
        }
      ],
      FileDistributionInformation: [
        {
          Format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
          Media: [
            'Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'
          ],
          AverageFileSize: 10,
          AverageFileSizeUnit: 'GB',
          TotalCollectionFileSize: 10,
          TotalCollectionFileSizeUnit: 'GB',
          Description: 'Lorem Ipsum',
          Fees: 'Lorem Ipsum'
        }
      ]
    }
  },
  useConstraints: null,
  '': {
    count: 0,
    items: null,
    __typename: 'VariableList'
  },
  versionDescription: 'Mock Test',
  versionId: '1',
  __typename: 'Collection'
}

export const publishedVariableRecord = {
  additionalIdentifiers: [
    {
      identifier: 'dfag'
    }
  ],
  associationDetails: {
    collections: [
      {
        conceptId: 'C1200000115-MMT_2'
      }
    ]
  },
  conceptId: 'V1200000149-MMT_2',
  dataType: null,
  definition: 'afg',
  dimensions: null,
  fillValues: null,
  indexRanges: null,
  instanceInformation: null,
  longName: 'asfd',
  measurementIdentifiers: null,
  name: 'Variable Test',
  nativeId: 'MMT_d2f6c3da-44d7-47b1-8d8a-324c60235de4',
  offset: null,
  providerId: 'MMT_2',
  relatedUrls: null,
  revisions: {
    count: 2,
    items: []
  },
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  samplingIdentifiers: null,
  scale: null,
  scienceKeywords: null,
  sets: null,
  standardName: null,
  ummMetadata: {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
      Name: 'UMM-Var',
      Version: '1.9.0'
    },
    AdditionalIdentifiers: [
      {
        Identifier: 'dfag'
      }
    ],
    Name: 'Variable Test',
    LongName: 'Mock Long Name',
    Definition: 'Mock Definition'
  },
  units: null,
  validRanges: null,
  variableSubType: null,
  variableType: null,
  collections: {
    count: 1,
    items: [
      {
        conceptId: 'C1200000115-MMT_2',
        entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2000',
        version: '2000.00',
        provider: 'MMT_2',
        title: '2000 Pilot Environmental Sustainability Index (ESI)',
        __typename: 'Collection'
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Variable'
}

export const recordWithRevisions = {
  count: 2,
  items: [
    {
      conceptId: 'T1200000104-MMT_2',
      longName: 'The Advanced National Seismic System (ANSS)',
      name: 'ANSS-Seismic',
      providerId: 'MMT_2',
      revisionDate: '2024-04-09T15:47:00.781Z',
      revisionId: '2',
      userId: 'admin',
      __typename: 'Tool'
    },
    {
      conceptId: 'T1200000104-MMT_2',
      longName: 'The Advanced National Seismic System (ANSS)',
      name: 'ANSS-Seismic',
      providerId: 'MMT_2',
      revisionDate: '2024-04-09T15:47:00.781Z',
      revisionId: '1',
      userId: 'admin',
      __typename: 'Tool'
    }
  ]
}

export const variableRecordWithRevisions = {
  count: 2,
  items: [
    {
      conceptId: 'V1000000-MMT',
      longName: 'The Advanced National Seismic System (ANSS)',
      name: 'ANSS-Seismic',
      providerId: 'MMT',
      revisionDate: '2024-04-09T15:47:00.781Z',
      revisionId: '2',
      userId: 'admin',
      __typename: 'Tool'
    },
    {
      conceptId: 'V1000000-MMT',
      longName: 'The Advanced National Seismic System (ANSS)',
      name: 'ANSS-Seismic',
      providerId: 'MMT',
      revisionDate: '2024-04-09T15:47:00.781Z',
      revisionId: '1',
      userId: 'admin',
      __typename: 'Tool'
    }
  ]
}

export const collectionRecordWithRevisions = {
  count: 2,
  items: [
    {
      conceptId: 'C1000000-MMT',
      revisionDate: '2024-04-05T15:21:13.179Z',
      revisionId: '2',
      shortName: 'Required Fields',
      title: 'All Required fields to publish',
      userId: 'admin',
      version: '1',
      __typename: 'Collection'
    },
    {
      conceptId: 'C1000000-MMT',
      revisionDate: '2024-04-05T15:21:13.179Z',
      revisionId: '1',
      shortName: 'Required Fields',
      title: 'All Required fields to publish',
      userId: 'admin',
      version: '1',
      __typename: 'Collection'
    }
  ]
}
