export const publishCollectionRecord = {
  __typename: 'Collection',
  abstract: 'Mock Testing Collections',
  accessConstraints: null,
  additionalAttributes: [{
    dataType: 'STRING',
    description: 'Lorem Ipsum',
    group: 'Mock Test Group',
    measurementResolution: 'Measurement Resolution test',
    name: 'Mock additional attribute 1',
    parameterUnitsOfMeasure: 'meters',
    parameterValueAccuracy: 'centimeter',
    updateDate: '2020-07-02T00:00:00.000Z',
    valueAccuracyExplanation: 'Mock Text '
  }],
  ancillaryKeywords: ['Test Ancillary keyword'],
  archiveAndDistributionInformation: {
    fileArchiveInformation: [{
      averageFileSize: 1,
      averageFileSizeUnit: 'TB',
      description: 'Lorem Ipsum',
      format: 'Test Archive',
      formatType: 'Supported',
      totalCollectionFileSize: 2,
      totalCollectionFileSizeUnit: 'TB'
    }],
    fileDistributionInformation: [{
      averageFileSize: 10,
      averageFileSizeUnit: 'GB',
      description: 'Lorem Ipsum',
      fees: 'Lorem Ipsum',
      format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
      media: ['Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'],
      totalCollectionFileSize: 10,
      totalCollectionFileSizeUnit: 'GB'
    }]
  },
  associatedDois: [{
    doi: 'TestDOI'
  }],
  collectionCitations: [{
    releaseDate: '2024-01-23T00:00:00.000Z',
    title: 'Testing',
    version: '1'
  }],
  collectionProgress: 'NOT APPLICABLE',
  conceptId: 'C1200000100-MMT_2',
  contactGroups: null,
  contactPersons: null,
  dataCenters: [{
    contactInformation: {
      contactInstruction: 'Cell',
      contactMechanisms: [{
        type: 'Mobile',
        value: '555-555-1212'
      }],
      relatedUrls: [{
        type: 'HOME PAGE',
        url: 'http://www.aag.org/',
        urlContentType: 'DataCenterURL'
      }],
      serviceHours: '8 to 6'
    },
    contactPersons: [{
      contactInformation: {
        relatedUrls: [{
          type: 'HOME PAGE',
          url: 'http://www.aag.org/',
          urlContentType: 'DataContactURL'
        }]
      },
      firstName: 'Mock',
      lastName: 'Gray',
      roles: ['Metadata Author']
    }],
    longName: 'Association of American Geographers',
    roles: ['ORIGINATOR'],
    shortName: 'AAG'
  }],
  dataDates: [{
    date: '2024-01-23T00:00:00.000Z',
    type: 'UPDATE'
  }],
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
  metadataDates: [{
    date: '2025-06-17T00:00:00.000Z',
    type: 'REVIEW'
  }, {
    date: '2020-09-22T08:59:00.000Z',
    type: 'CREATE'
  }, {
    date: '2024-01-23T11:46:00.000Z',
    type: 'UPDATE'
  }],
  nativeId: 'mock native id',
  pageTitle: 'mock name',
  paleoTemporalCoverages: null,
  platforms: [{
    instruments: [{
      longName: 'Atomic Absorption Spectrophotometry',
      shortName: 'AAS'
    }],
    longName: 'MeV Auroral X-ray Imaging and Spectroscopy',
    shortName: 'MAXIS',
    type: 'Balloons'
  }],
  processingLevel: {
    id: '1'
  },
  projects: null,
  providerId: 'MMT_2',
  publicationReferences: null,
  purpose: null,
  quality: null,
  relatedCollections: null,
  relatedUrls: [{
    description: 'Test related URL',
    getService: {
      dataId: 'Test ID',
      dataType: 'Test type',
      format: 'ascii',
      fullName: 'Test Service',
      mimeType: 'application/json',
      protocol: 'HTTPS',
      uri: ['www.testingTest']
    },
    type: 'USE SERVICE API',
    url: 'amazon.com',
    urlContentType: 'DistributionURL'
  }],
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  revisions: {
    count: 1,
    items: []
  },
  scienceKeywords: [{
    category: 'EARTH SCIENCE',
    term: 'VEGETATION',
    topic: 'BIOSPHERE',
    variableLevel1: 'CARBON'
  }, {
    category: 'EARTH SCIENCE',
    term: 'FROZEN GROUND',
    topic: 'LAND SURFACE',
    variableLevel1: 'ROCK GLACIERS'
  }, {
    category: 'EARTH SCIENCE',
    term: 'OCEAN OPTICS',
    topic: 'OCEANS'
  }],
  services: {
    __typename: 'ServiceList',
    count: 1,
    items: []
  },
  shortName: 'Mock Quick Test Services #2',
  spatialExtent: {
    granuleSpatialRepresentation: 'CARTESIAN',
    horizontalSpatialDomain: {
      geometry: {
        boundingRectangles: [{
          eastBoundingCoordinate: 135,
          northBoundingCoordinate: 90,
          southBoundingCoordinate: -75,
          westBoundingCoordinate: -180
        }],
        coordinateSystem: 'GEODETIC'
      }
    },
    spatialCoverageType: 'HORIZONTAL_VERTICAL'
  },
  spatialInformation: {
    spatialCoverageType: 'VERTICAL',
    verticalCoordinateSystem: {
      depthSystemDefinition: {
        datumName: 'Test datum',
        distanceUnits: 'Feet',
        resolutions: [0.5]
      }
    }
  },
  standardProduct: null,
  tagDefinitions: {
    items: [{
      conceptId: 'C100000',
      description: 'Mock tag description',
      originatorId: 'test.user',
      revisionId: '1',
      tagKey: 'Mock tag key'
    }]
  },
  tags: {},
  temporalExtents: [{
    endsAtPresentFlag: true,
    rangeDateTimes: [{
      beginningDateTime: '2020-02-01T00:00:00.000Z',
      endingDateTime: '2020-05-20T00:00:00.000Z'
    }]
  }],
  temporalKeywords: ['1 second - < 1 minute'],
  tilingIdentificationSystems: null,
  title: 'Mock Test for Services Tab',
  tools: {
    __typename: 'ToolList',
    count: 0,
    items: null
  },
  ummMetadata: {
    Abstract: 'Mock Testing Collections',
    AdditionalAttributes: [{
      DataType: 'STRING',
      Description: 'Lorem Ipsum',
      Group: 'Mock Test Group',
      MeasurementResolution: 'Measurement Resolution test',
      Name: 'Mock additional attribute 1',
      ParameterUnitsOfMeasure: 'meters',
      ParameterValueAccuracy: 'centimeter',
      UpdateDate: '2020-07-02T00:00:00.000Z',
      ValueAccuracyExplanation: 'Mock Text '
    }],
    AncillaryKeywords: ['Test Ancillary keyword'],
    ArchiveAndDistributionInformation: {
      FileArchiveInformation: [{
        AverageFileSize: 1,
        AverageFileSizeUnit: 'TB',
        Description: 'Lorem Ipsum',
        Format: 'Test Archive',
        FormatType: 'Supported',
        TotalCollectionFileSize: 2,
        TotalCollectionFileSizeUnit: 'TB'
      }],
      FileDistributionInformation: [{
        AverageFileSize: 10,
        AverageFileSizeUnit: 'GB',
        Description: 'Lorem Ipsum',
        Fees: 'Lorem Ipsum',
        Format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
        Media: ['Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'],
        TotalCollectionFileSize: 10,
        TotalCollectionFileSizeUnit: 'GB'
      }]
    },
    AssociatedDOIs: [{
      DOI: 'TestDOI'
    }],
    CollectionCitations: [{
      ReleaseDate: '2024-01-23T00:00:00.000Z',
      Title: 'Testing',
      Version: '1'
    }],
    CollectionProgress: 'NOT APPLICABLE',
    DataCenters: [{
      ContactInformation: {
        ContactInstruction: 'Cell',
        ContactMechanisms: [{
          Type: 'Mobile',
          Value: '555-555-1212'
        }],
        RelatedUrls: [{
          Type: 'HOME PAGE',
          URL: 'http://www.aag.org/',
          URLContentType: 'DataCenterURL'
        }],
        ServiceHours: '8 to 6'
      },
      ContactPersons: [{
        ContactInformation: {
          RelatedUrls: [{
            Type: 'HOME PAGE',
            URL: 'http://www.aag.org/',
            URLContentType: 'DataContactURL'
          }]
        },
        FirstName: 'Mock',
        LastName: 'Gray',
        Roles: ['Metadata Author']
      }],
      LongName: 'Association of American Geographers',
      Roles: ['ORIGINATOR'],
      ShortName: 'AAG'
    }],
    DataDates: [{
      Date: '2024-01-23T00:00:00.000Z',
      Type: 'UPDATE'
    }],
    DOI: {
      MissingReason: 'Not Applicable'
    },
    EntryTitle: 'Mock Test for Services Tab',
    MetadataDates: [{
      Date: '2025-06-17T00:00:00.000Z',
      Type: 'REVIEW'
    }, {
      Date: '2020-09-22T08:59:00.000Z',
      Type: 'CREATE'
    }, {
      Date: '2024-01-23T11:46:00.000Z',
      Type: 'UPDATE'
    }],
    MetadataLanguage: 'eng',
    MetadataSpecification: {
      Name: 'UMM-C',
      URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2',
      Version: '1.17.2'
    },
    Platforms: [{
      Instruments: [{
        LongName: 'Atomic Absorption Spectrophotometry',
        ShortName: 'AAS'
      }],
      LongName: 'MeV Auroral X-ray Imaging and Spectroscopy',
      ShortName: 'MAXIS',
      Type: 'Balloons'
    }],
    ProcessingLevel: {
      Id: '1'
    },
    RelatedUrls: [{
      Description: 'Test related URL',
      GetService: {
        DataID: 'Test ID',
        DataType: 'Test type',
        Format: 'ascii',
        FullName: 'Test Service',
        MimeType: 'application/json',
        Protocol: 'HTTPS',
        URI: ['www.testingTest']
      },
      Type: 'USE SERVICE API',
      URL: 'amazon.com',
      URLContentType: 'DistributionURL'
    }],
    ScienceKeywords: [{
      Category: 'EARTH SCIENCE',
      Term: 'VEGETATION',
      Topic: 'BIOSPHERE',
      VariableLevel1: 'CARBON'
    }, {
      Category: 'EARTH SCIENCE',
      Term: 'FROZEN GROUND',
      Topic: 'LAND SURFACE',
      VariableLevel1: 'ROCK GLACIERS'
    }, {
      Category: 'EARTH SCIENCE',
      Term: 'OCEAN OPTICS',
      Topic: 'OCEANS'
    }],
    ShortName: 'Mock Quick Test Services #2',
    SpatialExtent: {
      GranuleSpatialRepresentation: 'CARTESIAN',
      HorizontalSpatialDomain: {
        Geometry: {
          BoundingRectangles: [{
            EastBoundingCoordinate: 135,
            NorthBoundingCoordinate: 90,
            SouthBoundingCoordinate: -75,
            WestBoundingCoordinate: -180
          }],
          CoordinateSystem: 'GEODETIC'
        }
      },
      SpatialCoverageType: 'HORIZONTAL_VERTICAL'
    },
    SpatialInformation: {
      SpatialCoverageType: 'VERTICAL',
      VerticalCoordinateSystem: {
        DepthSystemDefinition: {
          DatumName: 'Test datum',
          DistanceUnits: 'Feet',
          Resolutions: [0.5]
        }
      }
    },
    TemporalExtents: [{
      EndsAtPresentFlag: true,
      RangeDateTimes: [{
        BeginningDateTime: '2020-02-01T00:00:00.000Z',
        EndingDateTime: '2020-05-20T00:00:00.000Z'
      }]
    }],
    TemporalKeywords: ['1 second - < 1 minute'],
    Version: '1',
    VersionDescription: 'Mock Test'
  },
  useConstraints: null,
  userId: 'admin',
  variables: null,
  versionDescription: 'Mock Test',
  versionId: '1'
}

export const noTagsOrGranulesOrServicesCollection = {
  __typename: 'Collection',
  abstract: 'Mock Testing Collections',
  accessConstraints: null,
  additionalAttributes: [{
    dataType: 'STRING',
    description: 'Lorem Ipsum',
    group: 'Mock Test Group',
    measurementResolution: 'Measurement Resolution test',
    name: 'Mock additional attribute 1',
    parameterUnitsOfMeasure: 'meters',
    parameterValueAccuracy: 'centimeter',
    updateDate: '2020-07-02T00:00:00.000Z',
    valueAccuracyExplanation: 'Mock Text '
  }],
  ancillaryKeywords: ['Test Ancillary keyword'],
  archiveAndDistributionInformation: {
    fileArchiveInformation: [{
      averageFileSize: 1,
      averageFileSizeUnit: 'TB',
      description: 'Lorem Ipsum',
      format: 'Test Archive',
      formatType: 'Supported',
      totalCollectionFileSize: 2,
      totalCollectionFileSizeUnit: 'TB'
    }],
    fileDistributionInformation: [{
      averageFileSize: 10,
      averageFileSizeUnit: 'GB',
      description: 'Lorem Ipsum',
      fees: 'Lorem Ipsum',
      format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
      media: ['Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'],
      totalCollectionFileSize: 10,
      totalCollectionFileSizeUnit: 'GB'
    }]
  },
  associatedDois: [{
    doi: 'TestDOI'
  }],
  collectionCitations: [{
    releaseDate: '2024-01-23T00:00:00.000Z',
    title: 'Testing',
    version: '1'
  }],
  collectionProgress: 'NOT APPLICABLE',
  conceptId: 'C1200000100-MMT_2',
  contactGroups: null,
  contactPersons: null,
  dataCenters: [{
    contactInformation: {
      contactInstruction: 'Cell',
      contactMechanisms: [{
        type: 'Mobile',
        value: '555-555-1212'
      }],
      relatedUrls: [{
        type: 'HOME PAGE',
        url: 'http://www.aag.org/',
        urlContentType: 'DataCenterURL'
      }],
      serviceHours: '8 to 6'
    },
    contactPersons: [{
      contactInformation: {
        relatedUrls: [{
          type: 'HOME PAGE',
          url: 'http://www.aag.org/',
          urlContentType: 'DataContactURL'
        }]
      },
      firstName: 'Mock',
      lastName: 'Gray',
      roles: ['Metadata Author']
    }],
    longName: 'Association of American Geographers',
    roles: ['ORIGINATOR'],
    shortName: 'AAG'
  }],
  dataDates: [{
    date: '2024-01-23T00:00:00.000Z',
    type: 'UPDATE'
  }],
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
  metadataDates: [{
    date: '2025-06-17T00:00:00.000Z',
    type: 'REVIEW'
  }, {
    date: '2020-09-22T08:59:00.000Z',
    type: 'CREATE'
  }, {
    date: '2024-01-23T11:46:00.000Z',
    type: 'UPDATE'
  }],
  nativeId: 'mock native id',
  pageTitle: 'mock name',
  paleoTemporalCoverages: null,
  platforms: [{
    instruments: [{
      longName: 'Atomic Absorption Spectrophotometry',
      shortName: 'AAS'
    }],
    longName: 'MeV Auroral X-ray Imaging and Spectroscopy',
    shortName: 'MAXIS',
    type: 'Balloons'
  }],
  processingLevel: {
    id: '1'
  },
  projects: null,
  providerId: 'MMT_2',
  publicationReferences: null,
  purpose: null,
  quality: null,
  relatedCollections: null,
  relatedUrls: [{
    description: 'Test related URL',
    getService: {
      dataId: 'Test ID',
      dataType: 'Test type',
      format: 'ascii',
      fullName: 'Test Service',
      mimeType: 'application/json',
      protocol: 'HTTPS',
      uri: ['www.testingTest']
    },
    type: 'USE SERVICE API',
    url: 'amazon.com',
    urlContentType: 'DistributionURL'
  }],
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  revisions: {
    count: 1,
    items: []
  },
  scienceKeywords: [{
    category: 'EARTH SCIENCE',
    term: 'VEGETATION',
    topic: 'BIOSPHERE',
    variableLevel1: 'CARBON'
  }, {
    category: 'EARTH SCIENCE',
    term: 'FROZEN GROUND',
    topic: 'LAND SURFACE',
    variableLevel1: 'ROCK GLACIERS'
  }, {
    category: 'EARTH SCIENCE',
    term: 'OCEAN OPTICS',
    topic: 'OCEANS'
  }],
  services: {
    __typename: 'ServiceList',
    count: 0,
    items: null
  },
  shortName: 'Mock Quick Test Services #2',
  spatialExtent: {
    granuleSpatialRepresentation: 'CARTESIAN',
    horizontalSpatialDomain: {
      geometry: {
        boundingRectangles: [{
          eastBoundingCoordinate: 135,
          northBoundingCoordinate: 90,
          southBoundingCoordinate: -75,
          westBoundingCoordinate: -180
        }],
        coordinateSystem: 'GEODETIC'
      }
    },
    spatialCoverageType: 'HORIZONTAL_VERTICAL'
  },
  spatialInformation: {
    spatialCoverageType: 'VERTICAL',
    verticalCoordinateSystem: {
      depthSystemDefinition: {
        datumName: 'Test datum',
        distanceUnits: 'Feet',
        resolutions: [0.5]
      }
    }
  },
  standardProduct: null,
  tagDefinitions: null,
  tags: null,
  temporalExtents: [{
    endsAtPresentFlag: true,
    rangeDateTimes: [{
      beginningDateTime: '2020-02-01T00:00:00.000Z',
      endingDateTime: '2020-05-20T00:00:00.000Z'
    }]
  }],
  temporalKeywords: ['1 second - < 1 minute'],
  tilingIdentificationSystems: null,
  title: 'Mock Test for Services Tab',
  tools: {
    __typename: 'ToolList',
    count: 0,
    items: null
  },
  ummMetadata: {
    Abstract: 'Mock Testing Collections',
    AdditionalAttributes: [{
      DataType: 'STRING',
      Description: 'Lorem Ipsum',
      Group: 'Mock Test Group',
      MeasurementResolution: 'Measurement Resolution test',
      Name: 'Mock additional attribute 1',
      ParameterUnitsOfMeasure: 'meters',
      ParameterValueAccuracy: 'centimeter',
      UpdateDate: '2020-07-02T00:00:00.000Z',
      ValueAccuracyExplanation: 'Mock Text '
    }],
    AncillaryKeywords: ['Test Ancillary keyword'],
    ArchiveAndDistributionInformation: {
      FileArchiveInformation: [{
        AverageFileSize: 1,
        AverageFileSizeUnit: 'TB',
        Description: 'Lorem Ipsum',
        Format: 'Test Archive',
        FormatType: 'Supported',
        TotalCollectionFileSize: 2,
        TotalCollectionFileSizeUnit: 'TB'
      }],
      FileDistributionInformation: [{
        AverageFileSize: 10,
        AverageFileSizeUnit: 'GB',
        Description: 'Lorem Ipsum',
        Fees: 'Lorem Ipsum',
        Format: 'Mock Very Long Text Mock Very Text Mock Very Long Text Mock Very',
        Media: ['Mock Very Long  Text Mock Very Text Mock Very Long Text MockVery'],
        TotalCollectionFileSize: 10,
        TotalCollectionFileSizeUnit: 'GB'
      }]
    },
    AssociatedDOIs: [{
      DOI: 'TestDOI'
    }],
    CollectionCitations: [{
      ReleaseDate: '2024-01-23T00:00:00.000Z',
      Title: 'Testing',
      Version: '1'
    }],
    CollectionProgress: 'NOT APPLICABLE',
    DataCenters: [{
      ContactInformation: {
        ContactInstruction: 'Cell',
        ContactMechanisms: [{
          Type: 'Mobile',
          Value: '555-555-1212'
        }],
        RelatedUrls: [{
          Type: 'HOME PAGE',
          URL: 'http://www.aag.org/',
          URLContentType: 'DataCenterURL'
        }],
        ServiceHours: '8 to 6'
      },
      ContactPersons: [{
        ContactInformation: {
          RelatedUrls: [{
            Type: 'HOME PAGE',
            URL: 'http://www.aag.org/',
            URLContentType: 'DataContactURL'
          }]
        },
        FirstName: 'Mock',
        LastName: 'Gray',
        Roles: ['Metadata Author']
      }],
      LongName: 'Association of American Geographers',
      Roles: ['ORIGINATOR'],
      ShortName: 'AAG'
    }],
    DataDates: [{
      Date: '2024-01-23T00:00:00.000Z',
      Type: 'UPDATE'
    }],
    DOI: {
      MissingReason: 'Not Applicable'
    },
    EntryTitle: 'Mock Test for Services Tab',
    MetadataDates: [{
      Date: '2025-06-17T00:00:00.000Z',
      Type: 'REVIEW'
    }, {
      Date: '2020-09-22T08:59:00.000Z',
      Type: 'CREATE'
    }, {
      Date: '2024-01-23T11:46:00.000Z',
      Type: 'UPDATE'
    }],
    MetadataLanguage: 'eng',
    MetadataSpecification: {
      Name: 'UMM-C',
      URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.17.2',
      Version: '1.17.2'
    },
    Platforms: [{
      Instruments: [{
        LongName: 'Atomic Absorption Spectrophotometry',
        ShortName: 'AAS'
      }],
      LongName: 'MeV Auroral X-ray Imaging and Spectroscopy',
      ShortName: 'MAXIS',
      Type: 'Balloons'
    }],
    ProcessingLevel: {
      Id: '1'
    },
    RelatedUrls: [{
      Description: 'Test related URL',
      GetService: {
        DataID: 'Test ID',
        DataType: 'Test type',
        Format: 'ascii',
        FullName: 'Test Service',
        MimeType: 'application/json',
        Protocol: 'HTTPS',
        URI: ['www.testingTest']
      },
      Type: 'USE SERVICE API',
      URL: 'amazon.com',
      URLContentType: 'DistributionURL'
    }],
    ScienceKeywords: [{
      Category: 'EARTH SCIENCE',
      Term: 'VEGETATION',
      Topic: 'BIOSPHERE',
      VariableLevel1: 'CARBON'
    }, {
      Category: 'EARTH SCIENCE',
      Term: 'FROZEN GROUND',
      Topic: 'LAND SURFACE',
      VariableLevel1: 'ROCK GLACIERS'
    }, {
      Category: 'EARTH SCIENCE',
      Term: 'OCEAN OPTICS',
      Topic: 'OCEANS'
    }],
    ShortName: 'Mock Quick Test Services #2',
    SpatialExtent: {
      GranuleSpatialRepresentation: 'CARTESIAN',
      HorizontalSpatialDomain: {
        Geometry: {
          BoundingRectangles: [{
            EastBoundingCoordinate: 135,
            NorthBoundingCoordinate: 90,
            SouthBoundingCoordinate: -75,
            WestBoundingCoordinate: -180
          }],
          CoordinateSystem: 'GEODETIC'
        }
      },
      SpatialCoverageType: 'HORIZONTAL_VERTICAL'
    },
    SpatialInformation: {
      SpatialCoverageType: 'VERTICAL',
      VerticalCoordinateSystem: {
        DepthSystemDefinition: {
          DatumName: 'Test datum',
          DistanceUnits: 'Feet',
          Resolutions: [0.5]
        }
      }
    },
    TemporalExtents: [{
      EndsAtPresentFlag: true,
      RangeDateTimes: [{
        BeginningDateTime: '2020-02-01T00:00:00.000Z',
        EndingDateTime: '2020-05-20T00:00:00.000Z'
      }]
    }],
    TemporalKeywords: ['1 second - < 1 minute'],
    Version: '1',
    VersionDescription: 'Mock Test'
  },
  useConstraints: null,
  userId: 'admin',
  variables: null,
  versionDescription: 'Mock Test',
  versionId: '1'
}

export const publishedVariableRecord = {
  __typename: 'Variable',
  additionalIdentifiers: [{
    identifier: 'dfag'
  }],
  associationDetails: {
    collections: [{
      conceptId: 'C1200000115-MMT_2'
    }]
  },
  collections: {
    __typename: 'CollectionList',
    count: 1,
    items: [{
      __typename: 'Collection',
      conceptId: 'C1200000115-MMT_2',
      entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
      provider: 'MMT_2',
      shortName: 'CIESIN_SEDAC_ESI_2000',
      title: '2000 Pilot Environmental Sustainability Index (ESI)',
      version: '2000.00'
    }]
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
  pageTitle: 'Variable Test',
  providerId: 'MMT_2',
  relatedUrls: null,
  revisionDate: '2024-04-08T15:53:12.359Z',
  revisionId: '1',
  revisions: {
    count: 2,
    items: []
  },
  samplingIdentifiers: null,
  scale: null,
  scienceKeywords: null,
  sets: null,
  standardName: null,
  ummMetadata: {
    AdditionalIdentifiers: [{
      Identifier: 'dfag'
    }],
    Definition: 'Mock Definition',
    LongName: 'Mock Long Name',
    MetadataSpecification: {
      Name: 'UMM-Var',
      URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
      Version: '1.9.0'
    },
    Name: 'Variable Test'
  },
  units: null,
  validRanges: null,
  variableSubType: null,
  variableType: null
}

export const recordWithRevisions = {
  count: 2,
  items: [{
    __typename: 'Tool',
    conceptId: 'T1200000104-MMT_2',
    longName: 'The Advanced National Seismic System (ANSS)',
    name: 'ANSS-Seismic',
    providerId: 'MMT_2',
    revisionDate: '2024-04-09T15:47:00.781Z',
    revisionId: '2',
    userId: 'admin'
  }, {
    __typename: 'Tool',
    conceptId: 'T1200000104-MMT_2',
    longName: 'The Advanced National Seismic System (ANSS)',
    name: 'ANSS-Seismic',
    providerId: 'MMT_2',
    revisionDate: '2024-04-09T15:47:00.781Z',
    revisionId: '1',
    userId: 'admin'
  }]
}

export const variableRecordWithRevisions = {
  count: 2,
  items: [{
    __typename: 'Tool',
    conceptId: 'V1000000-MMT',
    longName: 'The Advanced National Seismic System (ANSS)',
    name: 'ANSS-Seismic',
    providerId: 'MMT',
    revisionDate: '2024-04-09T15:47:00.781Z',
    revisionId: '2',
    userId: 'admin'
  }, {
    __typename: 'Tool',
    conceptId: 'V1000000-MMT',
    longName: 'The Advanced National Seismic System (ANSS)',
    name: 'ANSS-Seismic',
    providerId: 'MMT',
    revisionDate: '2024-04-09T15:47:00.781Z',
    revisionId: '1',
    userId: 'admin'
  }]
}

export const collectionRecordWithRevisions = {
  count: 2,
  items: [{
    __typename: 'Collection',
    conceptId: 'C1000000-MMT',
    revisionDate: '2024-04-05T15:21:13.179Z',
    revisionId: '2',
    shortName: 'Required Fields',
    title: 'All Required fields to publish',
    userId: 'admin',
    version: '1'
  }, {
    __typename: 'Collection',
    conceptId: 'C1000000-MMT',
    revisionDate: '2024-04-05T15:21:13.179Z',
    revisionId: '1',
    shortName: 'Required Fields',
    title: 'All Required fields to publish',
    userId: 'admin',
    version: '1'
  }]
}
