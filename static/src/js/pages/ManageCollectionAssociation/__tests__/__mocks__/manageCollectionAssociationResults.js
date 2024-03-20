import { DELETE_ASSOCIATION } from '../../../../operations/mutations/deleteAssociation'
import { GET_TOOL } from '../../../../operations/queries/getTool'
import { GET_VARIABLE } from '../../../../operations/queries/getVariable'

export const toolRecordSearch = {
  request: {
    query: GET_TOOL,
    variables: {
      params: {
        conceptId: 'TL1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
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
            },
            {
              conceptId: 'C120000002-TEST'
            }
          ]
        },
        conceptId: 'TL1200000-TEST',
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
          count: 2,
          items: [
            {
              title: 'Associated Collection 1',
              conceptId: 'C120000001_TEST',
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
        conceptId: 'TL1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
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
        conceptId: 'TL1200000-TEST',
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
              conceptId: 'C120000001_TEST',
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
      params: { conceptId: 'TL1200000-TEST' },
      collectionsParams: {
        limit: 20,
        sortKey: null
      }
    }
  },
  error: new Error('An error occurred')
}

export const deleteAssociationResponse = {
  request: {
    query: DELETE_ASSOCIATION,
    variables: {
      conceptId: 'TL1200000-TEST',
      collectionConceptIds: [{ conceptId: 'C120000001_TEST' }],
      conceptType: 'Tool'
    }
  },
  result: {
    data: {
      deleteAssociation: {
        associatedItem: {
          concept_id: 'C1200000035-SEDAC'
        },
        serviceAssociation: null,
        toolAssociation: {
          concept_id: 'TLA1200000140-CMR',
          revision_id: 2
        },
        variableAssociation: null,
        warnings: null,
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
        conceptId: 'TL1200000-TEST'
      },
      collectionsParams: {
        limit: 20,
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
              conceptId: 'C120000002-TEST'
            }
          ]
        },
        conceptId: 'TL1200000-TEST',
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
        __typename: 'Tool'
      }
    }
  }
}

export const variableRecord = {
  request: {
    query: GET_VARIABLE,
    variables: {
      params: { conceptId: 'V1200000104-SEDAC' },
      collectionsParams: {
        limit: 20,
        sortKey: null
      }
    }
  },
  result: {
    data: {
      variable: {
        additionalIdentifiers: [
          {
            identifier: '123'
          }
        ],
        associationDetails: {
          collections: [
            {
              conceptId: 'C1200000036-SEDAC'
            }
          ]
        },
        conceptId: 'V1200000104-SEDAC',
        dataType: null,
        definition: '213',
        dimensions: null,
        fillValues: null,
        indexRanges: null,
        instanceInformation: null,
        longName: '123',
        measurementIdentifiers: null,
        name: 'Testing association',
        nativeId: 'MMT_fe95add0-9ae8-471e-938b-1e8110ec8207',
        offset: null,
        providerId: 'SEDAC',
        relatedUrls: null,
        revisionDate: '2024-03-19T15:00:17.275Z',
        revisionId: '21',
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
              conceptId: 'C1200000036-SEDAC',
              entryTitle: '2002 Environmental Sustainability Index (ESI)',
              shortName: 'CIESIN_SEDAC_ESI_2002',
              version: '2002.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        __typename: 'Variable'
      }
    }
  }
}

export const sortVariableRecord = {
  request: {
    query: GET_VARIABLE,
    variables: {
      params: { conceptId: 'V1200000104-SEDAC' },
      collectionsParams: {
        limit: 20,
        sortKey: '-shortName'
      }
    }
  },
  result: {
    data: {
      variable: {
        additionalIdentifiers: [
          {
            identifier: '123'
          }
        ],
        associationDetails: {
          collections: [
            {
              conceptId: 'C1200000036-SEDAC'
            }
          ]
        },
        conceptId: 'V1200000104-SEDAC',
        dataType: null,
        definition: '213',
        dimensions: null,
        fillValues: null,
        indexRanges: null,
        instanceInformation: null,
        longName: '123',
        measurementIdentifiers: null,
        name: 'Testing association',
        nativeId: 'MMT_fe95add0-9ae8-471e-938b-1e8110ec8207',
        offset: null,
        providerId: 'SEDAC',
        relatedUrls: null,
        revisionDate: '2024-03-19T15:00:17.275Z',
        revisionId: '21',
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
              conceptId: 'C1200000036-SEDAC',
              entryTitle: '2002 Environmental Sustainability Index (ESI)',
              shortName: 'CIESIN_SEDAC_ESI_2002',
              version: '2002.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        __typename: 'Variable'
      }
    }
  }
}

export const sortProvider = {
  request: {
    query: GET_VARIABLE,
    variables: {
      params: { conceptId: 'V1200000104-SEDAC' },
      collectionsParams: {
        limit: 20,
        sortKey: '-provider'
      }
    }
  },
  result: {
    data: {
      variable: {
        additionalIdentifiers: [
          {
            identifier: '123'
          }
        ],
        associationDetails: {
          collections: [
            {
              conceptId: 'C1200000036-SEDAC'
            }
          ]
        },
        conceptId: 'V1200000104-SEDAC',
        dataType: null,
        definition: '213',
        dimensions: null,
        fillValues: null,
        indexRanges: null,
        instanceInformation: null,
        longName: '123',
        measurementIdentifiers: null,
        name: 'Testing association',
        nativeId: 'MMT_fe95add0-9ae8-471e-938b-1e8110ec8207',
        offset: null,
        providerId: 'SEDAC',
        relatedUrls: null,
        revisionDate: '2024-03-19T15:00:17.275Z',
        revisionId: '21',
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
              conceptId: 'C1200000036-SEDAC',
              entryTitle: '2002 Environmental Sustainability Index (ESI)',
              shortName: 'CIESIN_SEDAC_ESI_2002',
              version: '2002.00',
              provider: 'SEDAC',
              __typename: 'Collection'
            }
          ],
          __typename: 'CollectionList'
        },
        __typename: 'Variable'
      }
    }
  }
}
