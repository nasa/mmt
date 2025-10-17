import { CREATE_ASSOCIATION } from '@/js/operations/mutations/createAssociation'
import { GET_COLLECTIONS } from '@/js/operations/queries/getCollections'
import { GET_ORDER_OPTION } from '@/js/operations/queries/getOrderOption'
import { GET_SERVICES } from '@/js/operations/queries/getServices'
import { GET_TOOL } from '@/js/operations/queries/getTool'

export const mockOrderOption = {
  request: {
    query: GET_ORDER_OPTION,
    variables: {
      params: {
        conceptId: 'OO1257381321-EDF_OPS'
      }
    }
  },
  result: {
    data: {
      orderOption: {
        deprecated: false,
        name: 'Test Name',
        description: 'Test Description',
        form: 'Test Form',
        scope: 'PROVIDER',
        providerId: 'MMT_2',
        __typename: 'OrderOption'
      }
    }
  }
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
  pageTitle: 'Collection Association Mock Test',
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
  revisions: {
    count: 1,
    items: {
      conceptId: 'T1200000098-MMT_2',
      revisionDate: '2024-03-21T15:01:58.533Z',
      revisionId: '1',
      userId: 'user1'
    }
  },
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

export const mockNoCollections = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: null,
        sortKey: null,
        options: { entryTitle: { pattern: true } },
        entryTitle: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        items: [],
        count: 0,
        __typename: 'CollectionList'
      }
    }
  }
}

export const mockCollections = {
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
    },
    {
      conceptId: 'C12000001124-MMT_2',
      provider: 'MMT_2',
      version: '1',
      revisionId: 1,
      shortName: 'Unassociated Collection Short Name 1',
      entryTitle: 'Unassociated Collection Entry Title 1',
      tags: null,
      granules: null,
      revisionDate: null,
      title: 'Unassociated Title 1',
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

export const getCollectionsMockPage1 = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: null,
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

export const getCollectionsMockPage2 = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 20,
        provider: null,
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

export const getServices = {
  request: {
    query: GET_SERVICES,
    variables: {
      params: {
        limit: 2000
      }
    }
  },
  result: {
    data: {
      services: {
        count: 1,
        items: [
          {
            conceptId: 'S1000000000-TESTPROV',
            name: 'Service Name 1',
            longName: 'Service Long Name 1',
            providerId: 'TESTPROV',
            revisionDate: '2023-11-30 00:00:00',
            revisionId: '1',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const createAssociationRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'T1200000098-MMT_2',
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

export const createAssociationWithServiceRequest = {
  request: {
    query: CREATE_ASSOCIATION,
    variables: {
      conceptId: 'S1000000000-TESTPROV',
      associatedConceptData: [{
        concept_id: 'C12000001124-MMT_2',
        data: { order_option: 'OO1257381321-EDF_OPS' }
      }]
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
      conceptId: 'T1200000098-MMT_2',
      associatedConceptIds: ['C12000001124-MMT_2']
    }
  },
  error: new Error('An error occurred')
}

export const getCollectionSortRequestByShortName = {
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

export const getCollectionSortRequestByProvider = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: null,
        sortKey: 'provider',
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

export const getToolMock = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000098-MMT_2'
      }
    }
  },
  result: {
    data: { tool: mockTool }
  }
}

export const getToolMockWithError = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000098-MMT_2'
      }
    }
  },
  error: new Error('An error occurred')
}

export const getCollectionsMock = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        limit: 20,
        offset: 0,
        provider: null,
        sortKey: null,
        options: { entryTitle: { pattern: true } },
        entryTitle: '*'
      }
    }
  },
  result: {
    data: { collections: mockCollections }
  }
}
