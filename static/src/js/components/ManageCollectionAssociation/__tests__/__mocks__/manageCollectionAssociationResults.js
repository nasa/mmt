import { DELETE_ASSOCIATION } from '../../../../operations/mutations/deleteAssociation'
import { GET_TOOL } from '../../../../operations/queries/getTool'

export const toolRecordSearch = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      tool: {
        __typename: 'Tool',
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [{
            conceptId: 'C120000001-TEST'
          }, {
            conceptId: 'C120000002-TEST'
          }]
        },
        collections: {
          count: 2,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 1',
              shortName: 'CIESIN_SEDAC_ESI_2000',
              version: '2000.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            },
            {
              title: 'Associated Collection 2',
              conceptId: 'C120000002-TEST',
              entryTitle: 'Associated Collection 2',
              shortName: 'CIESIN_SEDAC_ESI_2001',
              version: '2001.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          name: 'UMM-T',
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        nativeId: 'Test-123',
        organizations: [{
          longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
          roles: ['DEVELOPER'],
          shortName: 'DOI/USGS/CMG/WHSC',
          urlValue: 'http://woodshole.er.usgs.gov/'
        }],
        pageTitle: 'Testing publish with routes',
        potentialAction: null,
        providerId: 'MMT_2',
        quality: null,
        relatedUrls: null,
        revisionDate: '2024-03-19T17:05:21.642Z',
        revisionId: '1',
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
        searchAction: null,
        supportedBrowsers: null,
        supportedInputFormats: null,
        supportedOperatingSystems: null,
        supportedOutputFormats: null,
        supportedSoftwareLanguages: null,
        toolKeywords: [{
          toolCategory: 'EARTH SCIENCE SERVICES',
          toolTerm: 'CALIBRATION/VALIDATION',
          toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
        }],
        type: 'Model',
        ummMetadata: {
          Description: '312',
          LongName: '123',
          MetadataSpecification: {
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Version: '1.2.0'
          },
          Name: 'Testing publish with routes',
          Organizations: [{
            LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            Roles: ['DEVELOPER'],
            ShortName: 'DOI/USGS/CMG/WHSC',
            URLValue: 'http://woodshole.er.usgs.gov/'
          }],
          ToolKeywords: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION'
          }],
          Type: 'Model',
          URL: {
            Type: 'DOWNLOAD SOFTWARE',
            URLContentType: 'DistributionURL',
            URLValue: '132'
          },
          Version: '123'
        },
        url: {
          type: 'DOWNLOAD SOFTWARE',
          urlContentType: 'DistributionURL',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null
      }
    }
  }
}
export const toolRecordSearchNoAssociatedCollections = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      tool: {
        __typename: 'Tool',
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: null,
        collections: {
          count: 0,
          items: []
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          name: 'UMM-T',
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        nativeId: 'Test-123',
        organizations: [{
          longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
          roles: ['DEVELOPER'],
          shortName: 'DOI/USGS/CMG/WHSC',
          urlValue: 'http://woodshole.er.usgs.gov/'
        }],
        pageTitle: 'Testing publish with routes',
        potentialAction: null,
        providerId: 'MMT_2',
        quality: null,
        relatedUrls: null,
        revisionDate: '2024-03-19T17:05:21.642Z',
        revisionId: '1',
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
        searchAction: null,
        supportedBrowsers: null,
        supportedInputFormats: null,
        supportedOperatingSystems: null,
        supportedOutputFormats: null,
        supportedSoftwareLanguages: null,
        toolKeywords: [{
          toolCategory: 'EARTH SCIENCE SERVICES',
          toolTerm: 'CALIBRATION/VALIDATION',
          toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
        }],
        type: 'Model',
        ummMetadata: {
          Description: '312',
          LongName: '123',
          MetadataSpecification: {
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Version: '1.2.0'
          },
          Name: 'Testing publish with routes',
          Organizations: [{
            LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            Roles: ['DEVELOPER'],
            ShortName: 'DOI/USGS/CMG/WHSC',
            URLValue: 'http://woodshole.er.usgs.gov/'
          }],
          ToolKeywords: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION'
          }],
          Type: 'Model',
          URL: {
            Type: 'DOWNLOAD SOFTWARE',
            URLContentType: 'DistributionURL',
            URLValue: '132'
          },
          Version: '123'
        },
        url: {
          type: 'DOWNLOAD SOFTWARE',
          urlContentType: 'DistributionURL',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null
      }
    }
  }
}

export const toolRecordSearchwithPages = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 20
      }
    }
  },
  result: {
    data: {
      tool: {
        __typename: 'Tool',
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [{
            conceptId: 'C120000001-TEST'
          }, {
            conceptId: 'C120000002-TEST'
          }]
        },
        collections: {
          count: 50,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 1',
              shortName: 'CIESIN_SEDAC_ESI_2000',
              version: '2000.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            },
            {
              title: 'Associated Collection 2',
              conceptId: 'C120000002-TEST',
              entryTitle: 'Associated Collection 2',
              shortName: 'CIESIN_SEDAC_ESI_2001',
              version: '2001.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          name: 'UMM-T',
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        nativeId: 'Test-123',
        organizations: [{
          longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
          roles: ['DEVELOPER'],
          shortName: 'DOI/USGS/CMG/WHSC',
          urlValue: 'http://woodshole.er.usgs.gov/'
        }],
        pageTitle: 'Testing publish with routes',
        potentialAction: null,
        providerId: 'MMT_2',
        quality: null,
        relatedUrls: null,
        revisionDate: '2024-03-19T17:05:21.642Z',
        revisionId: '1',
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
        searchAction: null,
        supportedBrowsers: null,
        supportedInputFormats: null,
        supportedOperatingSystems: null,
        supportedOutputFormats: null,
        supportedSoftwareLanguages: null,
        toolKeywords: [{
          toolCategory: 'EARTH SCIENCE SERVICES',
          toolTerm: 'CALIBRATION/VALIDATION',
          toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
        }],
        type: 'Model',
        ummMetadata: {
          Description: '312',
          LongName: '123',
          MetadataSpecification: {
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Version: '1.2.0'
          },
          Name: 'Testing publish with routes',
          Organizations: [{
            LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            Roles: ['DEVELOPER'],
            ShortName: 'DOI/USGS/CMG/WHSC',
            URLValue: 'http://woodshole.er.usgs.gov/'
          }],
          ToolKeywords: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION'
          }],
          Type: 'Model',
          URL: {
            Type: 'DOWNLOAD SOFTWARE',
            URLContentType: 'DistributionURL',
            URLValue: '132'
          },
          Version: '123'
        },
        url: {
          type: 'DOWNLOAD SOFTWARE',
          urlContentType: 'DistributionURL',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null
      }
    }
  }
}
export const toolRecordSearchTestPage = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      tool: {
        __typename: 'Tool',
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [{
            conceptId: 'C120000001-TEST'
          }, {
            conceptId: 'C120000002-TEST'
          }]
        },
        collections: {
          count: 50,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 1',
              shortName: 'CIESIN_SEDAC_ESI_2000',
              version: '2000.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            },
            {
              title: 'Associated Collection 2',
              conceptId: 'C120000002-TEST',
              entryTitle: 'Associated Collection 2',
              shortName: 'CIESIN_SEDAC_ESI_2001',
              version: '2001.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          name: 'UMM-T',
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        nativeId: 'Test-123',
        organizations: [{
          longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
          roles: ['DEVELOPER'],
          shortName: 'DOI/USGS/CMG/WHSC',
          urlValue: 'http://woodshole.er.usgs.gov/'
        }],
        pageTitle: 'Testing publish with routes',
        potentialAction: null,
        providerId: 'MMT_2',
        quality: null,
        relatedUrls: null,
        revisionDate: '2024-03-19T17:05:21.642Z',
        revisionId: '1',
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
        searchAction: null,
        supportedBrowsers: null,
        supportedInputFormats: null,
        supportedOperatingSystems: null,
        supportedOutputFormats: null,
        supportedSoftwareLanguages: null,
        toolKeywords: [{
          toolCategory: 'EARTH SCIENCE SERVICES',
          toolTerm: 'CALIBRATION/VALIDATION',
          toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
        }],
        type: 'Model',
        ummMetadata: {
          Description: '312',
          LongName: '123',
          MetadataSpecification: {
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Version: '1.2.0'
          },
          Name: 'Testing publish with routes',
          Organizations: [{
            LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            Roles: ['DEVELOPER'],
            ShortName: 'DOI/USGS/CMG/WHSC',
            URLValue: 'http://woodshole.er.usgs.gov/'
          }],
          ToolKeywords: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION'
          }],
          Type: 'Model',
          URL: {
            Type: 'DOWNLOAD SOFTWARE',
            URLContentType: 'DistributionURL',
            URLValue: '132'
          },
          Version: '123'
        },
        url: {
          type: 'DOWNLOAD SOFTWARE',
          urlContentType: 'DistributionURL',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null
      }
    }
  }
}

export const toolRecordSortSearch = {
  request: {
    query: GET_TOOL,
    variables: {
      params: { conceptId: 'T1200000-TEST' },
      collectionsParams: {
        limit: 20,
        offset: 0,
        sortKey: '-provider'
      }
    }
  },
  result: {
    data: {
      tool: {
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [{
            conceptId: 'C120000001-TEST'
          }, {
            conceptId: 'C120000002-TEST'
          }]
        },
        collections: {
          count: 2,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 1',
              shortName: 'CIESIN_SEDAC_ESI_2000',
              version: '2000.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            },
            {
              title: 'Associated Collection 2',
              conceptId: 'C120000002-TEST',
              entryTitle: 'Associated Collection 2',
              shortName: 'CIESIN_SEDAC_ESI_2001',
              version: '2001.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          name: 'UMM-T',
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        nativeId: 'Test-123',
        organizations: [{
          longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
          roles: ['DEVELOPER'],
          shortName: 'DOI/USGS/CMG/WHSC',
          urlValue: 'http://woodshole.er.usgs.gov/'
        }],
        pageTitle: 'Testing publish with routes',
        potentialAction: null,
        providerId: 'MMT_2',
        quality: null,
        relatedUrls: null,
        revisionDate: '2024-03-19T17:05:21.642Z',
        revisionId: '1',
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
        searchAction: null,
        supportedBrowsers: null,
        supportedInputFormats: null,
        supportedOperatingSystems: null,
        supportedOutputFormats: null,
        supportedSoftwareLanguages: null,
        toolKeywords: [{
          toolCategory: 'EARTH SCIENCE SERVICES',
          toolTerm: 'CALIBRATION/VALIDATION',
          toolTopic: 'DATA ANALYSIS AND VISUALIZATION'
        }],
        type: 'Model',
        ummMetadata: {
          Description: '312',
          LongName: '123',
          MetadataSpecification: {
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Version: '1.2.0'
          },
          Name: 'Testing publish with routes',
          Organizations: [{
            LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            Roles: ['DEVELOPER'],
            ShortName: 'DOI/USGS/CMG/WHSC',
            URLValue: 'http://woodshole.er.usgs.gov/'
          }],
          ToolKeywords: [{
            ToolCategory: 'EARTH SCIENCE SERVICES',
            ToolTerm: 'CALIBRATION/VALIDATION',
            ToolTopic: 'DATA ANALYSIS AND VISUALIZATION'
          }],
          Type: 'Model',
          URL: {
            Type: 'DOWNLOAD SOFTWARE',
            URLContentType: 'DistributionURL',
            URLValue: '132'
          },
          Version: '123'
        },
        url: {
          type: 'DOWNLOAD SOFTWARE',
          urlContentType: 'DistributionURL',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null,
        __typename: 'Tool'
      }
    }
  }
}

export const singleAssociationSearch = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 0,
        sortKey: null
      }
    }
  },
  result: {
    data: {
      tool: {
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [
            {
              conceptId: 'C120000001-TEST'
            }
          ]
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        nativeId: 'Test-123',
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          name: 'UMM-T',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        organizations: [
          {
            roles: [
              'DEVELOPER'
            ],
            shortName: 'DOI/USGS/CMG/WHSC',
            longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            urlValue: 'http://woodshole.er.usgs.gov/'
          }
        ],
        providerId: 'MMT_2',
        potentialAction: null,
        quality: null,
        revisionId: '1',
        revisionDate: '2024-03-19T17:05:21.642Z',
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
        type: 'Model',
        ummMetadata: {
          URL: {
            URLContentType: 'DistributionURL',
            Type: 'DOWNLOAD SOFTWARE',
            URLValue: '132'
          },
          Type: 'Model',
          Description: '312',
          Version: '123',
          ToolKeywords: [
            {
              ToolCategory: 'EARTH SCIENCE SERVICES',
              ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
              ToolTerm: 'CALIBRATION/VALIDATION'
            }
          ],
          Name: 'Testing publish with routes',
          Organizations: [
            {
              Roles: [
                'DEVELOPER'
              ],
              ShortName: 'DOI/USGS/CMG/WHSC',
              LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
              URLValue: 'http://woodshole.er.usgs.gov/'
            }
          ],
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Name: 'UMM-T',
            Version: '1.2.0'
          },
          LongName: '123'
        },
        url: {
          urlContentType: 'DistributionURL',
          type: 'DOWNLOAD SOFTWARE',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null,
        collections: {
          count: 1,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 1',
              shortName: 'CIESIN_SEDAC_ESI_2000',
              version: '2000.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        __typename: 'Tool'
      }
    }
  }
}

export const toolRecordSearchError = {
  request: {
    query: GET_TOOL,
    variables: {
      params: { conceptId: 'T1200000-TEST' }
    }
  },
  error: new Error('An error occurred')
}

export const deleteAssociationResponse = {
  request: {
    query: DELETE_ASSOCIATION,
    variables: {
      conceptId: 'T1200000-TEST',
      associatedConceptIds: ['C120000001-TEST']
    }
  },
  result: {
    data: {
      deleteAssociation: {
        associatedConceptId: 'C1200000035-SEDAC',
        conceptId: 'TLA1200000140-CMR',
        revisionId: 2,
        __typename: 'AssociationMutationResponse'
      }
    }
  }
}

export const deletedAssociationResponse = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'T1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      tool: {
        accessConstraints: null,
        ancillaryKeywords: null,
        associationDetails: {
          collections: [
            {
              conceptId: 'C120000001-TEST'
            }
          ]
        },
        conceptId: 'T1200000-TEST',
        contactGroups: null,
        contactPersons: null,
        description: '312',
        doi: null,
        nativeId: 'Test-123',
        lastUpdatedDate: null,
        longName: '123',
        metadataSpecification: {
          url: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
          name: 'UMM-T',
          version: '1.2.0'
        },
        name: 'Testing publish with routes',
        organizations: [
          {
            roles: [
              'DEVELOPER'
            ],
            shortName: 'DOI/USGS/CMG/WHSC',
            longName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
            urlValue: 'http://woodshole.er.usgs.gov/'
          }
        ],
        pageTitle: 'Testing publish with routes',
        providerId: 'MMT_2',
        potentialAction: null,
        quality: null,
        revisionId: '1',
        revisionDate: '2024-03-19T17:05:21.642Z',
        relatedUrls: null,
        revisions: {
          __typename: 'ToolRevisionList',
          count: 1,
          items: [{
            __typename: 'Tool',
            conceptId: 'T1200000-TEST',
            revisionDate: '2024-04-25T17:11:57.611Z',
            revisionId: '1',
            userId: 'ECHO_SYS'
          }]
        },
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
        type: 'Model',
        ummMetadata: {
          URL: {
            URLContentType: 'DistributionURL',
            Type: 'DOWNLOAD SOFTWARE',
            URLValue: '132'
          },
          Type: 'Model',
          Description: '312',
          Version: '123',
          ToolKeywords: [
            {
              ToolCategory: 'EARTH SCIENCE SERVICES',
              ToolTopic: 'DATA ANALYSIS AND VISUALIZATION',
              ToolTerm: 'CALIBRATION/VALIDATION'
            }
          ],
          Name: 'Testing publish with routes',
          Organizations: [
            {
              Roles: [
                'DEVELOPER'
              ],
              ShortName: 'DOI/USGS/CMG/WHSC',
              LongName: 'Woods Hole Science Center, Coastal and Marine Geology, U.S. Geological Survey, U.S. Department of the Interior',
              URLValue: 'http://woodshole.er.usgs.gov/'
            }
          ],
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.2.0',
            Name: 'UMM-T',
            Version: '1.2.0'
          },
          LongName: '123'
        },
        url: {
          urlContentType: 'DistributionURL',
          type: 'DOWNLOAD SOFTWARE',
          urlValue: '132'
        },
        useConstraints: null,
        version: '123',
        versionDescription: null,
        collections: {
          count: 1,
          items: [
            {
              title: 'Associated Collection 2',
              conceptId: 'C120000001-TEST',
              entryTitle: 'Associated Collection 2',
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
    }
  }
}
