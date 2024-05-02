import { CREATE_ASSOCIATION } from '../../../../operations/mutations/createAssociation'
import { INGEST_DRAFT } from '../../../../operations/mutations/ingestDraft'
import { GET_COLLECTIONS } from '../../../../operations/queries/getCollections'

export const mockToolWithAssociation = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: {
    collections: [
      {
        conceptId: 'C12000001123-MMT_2'
      },
      {
        conceptId: 'C1200000034-SEDAC'
      }
    ]
  },
  conceptId: 'T1200000098-MMT_2',
  contactGroups: null,
  contactPersons: null,
  description: 'mock description',
  doi: null,
  nativeId: 'MMT_e090f57a-d611-48eb-a5d2-c6a94073f3f9',
  lastUpdatedDate: null,
  longName: 'mock long name',
  metadataSpecification: {
    url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    name: 'UMM-T',
    version: '1.2.0'
  },
  name: 'Collection Association Mock Test',
  organizations: [
    {
      roles: [
        'PUBLISHER'
      ],
      shortName: 'UCAR/NCAR/EOL/CEOPDM',
      longName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
      urlValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
    }
  ],
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisionId: '1',
  revisionDate: '2024-03-21T15:01:58.533Z',
  relatedUrls: null,
  searchAction: null,
  supportedBrowsers: null,
  supportedInputFormats: null,
  supportedOperatingSystems: null,
  supportedOutputFormats: null,
  supportedSoftwareLanguages: null,
  toolKeywords: [
    {
      toolCategory: 'EARTH SCIENCE SERVICES',
      toolTopic: 'DATA ANALYSIS AND VISUALIZATION',
      toolTerm: 'CALIBRATION/VALIDATION'
    }
  ],
  type: 'Downloadable Tool',
  ummMetadata: {
    URL: {
      URLContentType: 'DistributionURL',
      Type: 'GOTO WEB TOOL',
      URLValue: 'mock url'
    },
    Type: 'Downloadable Tool',
    Description: 'mock description',
    Version: '1',
    ToolKeywords: [
      {
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: 'CALIBRATION/VALIDATION'
      }
    ],
    Name: 'Collection Association Mock Test',
    Organizations: [
      {
        Roles: [
          'PUBLISHER'
        ],
        ShortName: 'UCAR/NCAR/EOL/CEOPDM',
        LongName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
        URLValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
      Name: 'UMM-T',
      Version: '1.2.0'
    },
    LongName: 'mock long name'
  },
  url: {
    urlContentType: 'DistributionURL',
    type: 'GOTO WEB TOOL',
    urlValue: 'mock url'
  },
  useConstraints: null,
  version: '1',
  versionDescription: null,
  collections: {
    count: 2,
    items: [
      {
        title: '2000 Pilot Environmental Sustainability Index (ESI)',
        conceptId: 'C12000001123-MMT_2',
        entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2000',
        version: '2000.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      },
      {
        title: '2001 Environmental Sustainability Index (ESI)',
        conceptId: 'C1200000035-SEDAC',
        entryTitle: '2001 Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2001',
        version: '2001.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Tool'
}

export const mockTool = {
  accessConstraints: null,
  ancillaryKeywords: null,
  associationDetails: {
    collections: [
      {
        conceptId: 'C1200000035-SEDAC'
      },
      {
        conceptId: 'C1200000034-SEDAC'
      }
    ]
  },
  conceptId: 'T1200000098-MMT_2',
  contactGroups: null,
  contactPersons: null,
  description: 'mock description',
  doi: null,
  nativeId: 'MMT_e090f57a-d611-48eb-a5d2-c6a94073f3f9',
  lastUpdatedDate: null,
  longName: 'mock long name',
  metadataSpecification: {
    url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
    name: 'UMM-T',
    version: '1.2.0'
  },
  name: 'Collection Association Mock Test',
  organizations: [
    {
      roles: [
        'PUBLISHER'
      ],
      shortName: 'UCAR/NCAR/EOL/CEOPDM',
      longName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
      urlValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
    }
  ],
  providerId: 'MMT_2',
  potentialAction: null,
  quality: null,
  revisionId: '1',
  revisionDate: '2024-03-21T15:01:58.533Z',
  relatedUrls: null,
  searchAction: null,
  supportedBrowsers: null,
  supportedInputFormats: null,
  supportedOperatingSystems: null,
  supportedOutputFormats: null,
  supportedSoftwareLanguages: null,
  toolKeywords: [
    {
      toolCategory: 'EARTH SCIENCE SERVICES',
      toolTopic: 'DATA ANALYSIS AND VISUALIZATION',
      toolTerm: 'CALIBRATION/VALIDATION'
    }
  ],
  type: 'Downloadable Tool',
  ummMetadata: {
    URL: {
      URLContentType: 'DistributionURL',
      Type: 'GOTO WEB TOOL',
      URLValue: 'mock url'
    },
    Type: 'Downloadable Tool',
    Description: 'mock description',
    Version: '1',
    ToolKeywords: [
      {
        ToolCategory: 'EARTH SCIENCE SERVICES',
        ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
        ToolTerm: 'CALIBRATION/VALIDATION'
      }
    ],
    Name: 'Collection Association Mock Test',
    Organizations: [
      {
        Roles: [
          'PUBLISHER'
        ],
        ShortName: 'UCAR/NCAR/EOL/CEOPDM',
        LongName: 'CEOP Data Management, Earth Observing Laboratory, National Center for Atmospheric Research, University Corporation for Atmospheric Research',
        URLValue: 'http://www.eol.ucar.edu/projects/ceop/dm/'
      }
    ],
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
      Name: 'UMM-T',
      Version: '1.2.0'
    },
    LongName: 'mock long name'
  },
  url: {
    urlContentType: 'DistributionURL',
    type: 'GOTO WEB TOOL',
    urlValue: 'mock url'
  },
  useConstraints: null,
  version: '1',
  versionDescription: null,
  collections: {
    count: 2,
    items: [
      {
        title: '2000 Pilot Environmental Sustainability Index (ESI)',
        conceptId: 'C1200000034-SEDAC',
        entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2000',
        version: '2000.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      },
      {
        title: '2001 Environmental Sustainability Index (ESI)',
        conceptId: 'C1200000035-SEDAC',
        entryTitle: '2001 Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2001',
        version: '2001.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Tool'
}

export const mockVariable = {
  additionalIdentifiers: [
    {
      identifier: '123'
    }
  ],
  associationDetails: {
    collections: [
      {
        conceptId: 'C1200000034-SEDAC'
      },
      {
        conceptId: 'C1200000035-SEDAC'
      }
    ]
  },
  conceptId: 'V1200000107-SEDAC',
  dataType: null,
  definition: '213',
  dimensions: null,
  fillValues: null,
  indexRanges: null,
  instanceInformation: null,
  longName: '123',
  measurementIdentifiers: null,
  name: 'Testing association',
  nativeId: 'MMT_fe95add0-9ae8-471e-938b-1e8110ec8207.',
  offset: null,
  providerId: 'SEDAC',
  relatedUrls: null,
  revisionDate: '2024-03-18T14:40:14.945Z',
  revisionId: '24',
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
        Identifier: '123'
      }
    ],
    Name: 'Testing association',
    LongName: '123',
    Definition: '213'
  },
  units: null,
  validRanges: null,
  variableSubType: null,
  variableType: null,
  collections: {
    count: 1,
    items: [
      {
        conceptId: 'C1200000034-SEDAC',
        entryTitle: '2000 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2000',
        version: '2000.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      },
      {
        conceptId: 'C1200000035-SEDAC',
        entryTitle: '2001 Pilot Environmental Sustainability Index (ESI)',
        shortName: 'CIESIN_SEDAC_ESI_2001',
        version: '2000.00',
        provider: 'SEDAC',
        __typename: 'Collection'
      }
    ],
    __typename: 'CollectionList'
  },
  __typename: 'Variable'
}

export const mockVariableDraft = {
  conceptId: 'VD1200000093-MMT_2',
  conceptType: 'variable-draft',
  deleted: false,
  name: 'Variable Draft Association Test',
  nativeId: 'MMT_a19bafe7-682e-44cf-84f5-f9252de0e14b',
  providerId: 'MMT_2',
  revisionDate: '2024-03-21T13:51:16.403Z',
  revisionId: '1',
  ummMetadata: {
    MetadataSpecification: {
      URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.9.0',
      Name: 'UMM-Var',
      Version: '1.9.0'
    },
    Name: 'Variable Draft Association Test',
    LongName: 'Mock Long Name',
    Definition: 'Mock Definition'
  },
  previewMetadata: {
    additionalIdentifiers: null,
    associationDetails: null,
    conceptId: 'VD1200000093-MMT_2',
    dataType: null,
    definition: 'Mock Definition',
    dimensions: null,
    fillValues: null,
    indexRanges: null,
    instanceInformation: null,
    longName: 'Mock Long Name',
    measurementIdentifiers: null,
    name: 'Variable Draft Association Test',
    nativeId: 'MMT_a19bafe7-682e-44cf-84f5-f9252de0e14b',
    offset: null,
    relatedUrls: null,
    samplingIdentifiers: null,
    scale: null,
    scienceKeywords: null,
    sets: null,
    standardName: null,
    units: null,
    validRanges: null,
    variableSubType: null,
    variableType: null,
    __typename: 'Variable'
  },
  __typename: 'Draft'
}

export const CollectionAssociationRequest = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: 'MMT_2',
        sortKey: null,
        options: { entryTitle: { pattern: true } },
        entryTitle: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C12000001123-MMT_2',
            provider: 'MMT_2',
            version: '1',
            revisionId: 1,
            tags: 1,
            granules: null,
            shortName: 'Collection Associations Short Name 1',
            entryTitle: 'Collection Associations Entry Title 1 ',
            title: 'Collection Associations Title 1',
            revisionDate: null,
            tagDefinitions: {
              items: [{
                conceptId: 'C100000',
                description: 'Mock tag description',
                originatorId: 'test.user',
                revisionId: '1',
                tagKey: 'Mock tag key'
              }]
            },
            __typename: 'Collection'
          },
          {
            conceptId: 'C12000001124-MMT_2',
            provider: 'MMT_2',
            version: '1',
            revisionId: 1,
            tags: 1,
            granules: null,
            shortName: 'Collection Associations Short Name 2',
            entryTitle: 'Collection Associations Entry Title 2',
            title: 'Collection Associations Title 2',
            revisionDate: null,
            tagDefinitions: {
              items: [{
                conceptId: 'C100000',
                description: 'Mock tag description',
                originatorId: 'test.user',
                revisionId: '1',
                tagKey: 'Mock tag key'
              }]
            },
            __typename: 'Collection'
          }
        ],
        count: 50,
        __typename: 'CollectionList'
      }
    }
  }
}

export const CollectionResultsWithPages = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 40,
        provider: 'MMT_2',
        sortKey: null,
        options: { entryTitle: { pattern: true } },
        entryTitle: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C12000001123-MMT_2',
            provider: 'MMT_2',
            version: '1',
            revisionId: 1,
            shortName: 'Collection Associations Short Name 1',
            entryTitle: 'Collection Associations Entry Title 1',
            tags: null,
            granules: null,
            revisionDate: null,
            title: 'Collection Associations Title 1',
            tagDefinitions: {
              items: [{
                conceptId: 'C100000',
                description: 'Mock tag description',
                originatorId: 'test.user',
                revisionId: '1',
                tagKey: 'Mock tag key'
              }]
            },
            __typename: 'Collection'
          }
        ],
        count: 50,
        __typename: 'CollectionList'
      }
    }
  }
}

export const createAssociationRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'T12000000-MMT_2',
      associatedConceptIds: ['C12000001124-MMT_2']
    }
  },
  result: {
    data: {
      createAssociation: {
        associatedConceptId: 'C1200000035-SEDAC',
        conceptId: 'TLA1200000140-CMR',
        revisionId: 2
      }
    }
  }
}

export const createAssociationErrorRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'T12000000-MMT_2',
      associatedConceptIds: ['C12000001123-MMT_2']
    }
  },
  error: new Error('An error occurred')
}

export const ingestVariableRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'V12000000-MMT_2',
      associatedConceptIds: ['C12000001123-MMT_2']
    }
  },
  result: {
    data: {
      createAssociation: {
        associatedConceptId: 'C1200000035-SEDAC',
        conceptId: 'VA1200000140-CMR',
        revisionId: 2
      }
    }
  }
}

export const ingestVariableErrorRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'V12000000-MMT_2',
      associatedConceptIds: ['C12000001123-MMT_2']
    }
  },
  error: new Error('An error occurred')
}

export const ingestVariableDraftResponse = {
  request: {
    query: INGEST_DRAFT,
    variables: {
      conceptType: 'Variable',
      metadata: {
        _private: {
          CollectionAssociation: {
            collectionConceptId: 'C12000001123-MMT_2',
            shortName: 'Collection Associations Short Name 1',
            version: '1'
          }
        }
      },
      providerId: 'MMT_2',
      ummVersion: '1.9.0'
    }
  },
  result: {
    data: {
      ingestDraft: {
        conceptId: 'VD120000000-MMT_2',
        revisionId: '3'
      }
    }
  }
}

export const ingestVariableDraftErrorResponse = {
  request: {
    query: INGEST_DRAFT,
    variables: {
      conceptType: 'Variable',
      metadata: {
        _private: {
          CollectionAssociation: {
            collectionConceptId: 'C12000001123-MMT_2',
            shortName: 'Collection Associations Short Name 1',
            version: '1'
          }
        }
      },
      providerId: 'MMT_2',
      ummVersion: '1.9.0'
    }
  },
  error: new Error('An error occurred')
}

export const CollectionSortRequest = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: null,
        sortKey: '-shortName',
        options: { entryTitle: { pattern: true } },
        entryTitle: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [
          {
            conceptId: 'C12000001123-MMT_2',
            provider: 'MMT_2',
            version: '1',
            revisionId: 1,
            tags: 1,
            granules: null,
            shortName: 'Collection Associations Short Name 1',
            entryTitle: 'Collection Associations Entry Title 1 ',
            title: 'Collection Associations Title 1',
            revisionDate: null,
            tagDefinitions: {
              items: [{
                conceptId: 'C100000',
                description: 'Mock tag description',
                originatorId: 'test.user',
                revisionId: '1',
                tagKey: 'Mock tag key'
              }]
            },
            __typename: 'Collection'
          },
          {
            conceptId: 'C12000001124-MMT_2',
            provider: 'MMT_2',
            version: '1',
            revisionId: 1,
            tags: 1,
            granules: null,
            shortName: 'Collection Associations Short Name 2',
            entryTitle: 'Collection Associations Entry Title 2',
            title: 'Collection Associations Title 2',
            revisionDate: null,
            tagDefinitions: {
              items: [{
                conceptId: 'C100000',
                description: 'Mock tag description',
                originatorId: 'test.user',
                revisionId: '1',
                tagKey: 'Mock tag key'
              }]
            },
            __typename: 'Collection'
          }
        ],
        count: 50,
        __typename: 'CollectionList'
      }
    }
  }
}
