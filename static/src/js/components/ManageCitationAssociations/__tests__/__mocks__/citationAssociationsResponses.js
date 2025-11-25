import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'
import { GET_CITATION_ASSOCIATIONS } from '@/js/operations/queries/getCitationAssociations'

export const citationAssociationsSearch = {
  request: {
    query: GET_CITATION_ASSOCIATIONS,
    variables: {
      params: {
        conceptId: 'C00000001-TESTPROV'
      },
      citationParams: {
        limit: 10,
        offset: 0
      }
    }
  },
  result: {
    data: {
      collection: {
        conceptId: 'C1000000000-TESTPROV',
        shortName: 'Collection Short Name 1',
        citations: {
          __typename: 'CitationList',
          count: 2,
          items: [
            {
              conceptId: 'CIT100000-TESTPROV',
              name: 'Citation 1',
              identifier: 'citation1',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT200000-TESTPROV',
              name: 'Citation 2',
              identifier: 'citation2',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            }
          ]
        },
        temporalKeywords: null,
        entryTitle: null,
        revisionDate: '2023-11-30 00:00:00',
        previewMetadata: {}
      }
    }
  }
}

export const citationAssociationsSearchZero = {
  request: {
    query: GET_CITATION_ASSOCIATIONS,
    variables: {
      params: {
        conceptId: 'C00000001-TESTPROV'
      },
      citationParams: {
        limit: 10,
        offset: 0
      }
    }
  },
  result: {
    data: {
      collection: {
        conceptId: 'C1000000000-TESTPROV',
        shortName: 'Collection Short Name 1',
        citations: {
          __typename: 'CitationList',
          count: 0,
          items: []
        },
        temporalKeywords: null,
        entryTitle: null,
        revisionDate: '2023-11-30 00:00:00',
        previewMetadata: {}
      }
    }
  }
}

export const citationAssociationsSearchPage1 = {
  request: {
    query: GET_CITATION_ASSOCIATIONS,
    variables: {
      params: {
        conceptId: 'C00000001-TESTPROV'
      },
      citationParams: {
        limit: 10,
        offset: 0
      }
    }
  },
  result: {
    data: {
      collection: {
        conceptId: 'C1000000000-TESTPROV',
        shortName: 'Collection Short Name 1',
        citations: {
          __typename: 'CitationList',
          count: 12,
          items: [
            {
              conceptId: 'CIT100000-TESTPROV',
              name: 'Citation 1',
              identifier: 'citation1',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT200000-TESTPROV',
              name: 'Citation 2',
              identifier: 'citation2',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            },
            {
              conceptId: 'CIT300000-TESTPROV',
              name: 'Citation 3',
              identifier: 'citation3',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT400000-TESTPROV',
              name: 'Citation 4',
              identifier: 'citation4',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            },
            {
              conceptId: 'CIT500000-TESTPROV',
              name: 'Citation 5',
              identifier: 'citation5',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT600000-TESTPROV',
              name: 'Citation 6',
              identifier: 'citation6',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            },
            {
              conceptId: 'CIT700000-TESTPROV',
              name: 'Citation 7',
              identifier: 'citation7',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT800000-TESTPROV',
              name: 'Citation 8',
              identifier: 'citation8',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            },
            {
              conceptId: 'CIT900000-TESTPROV',
              name: 'Citation 9',
              identifier: 'citation9',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT1000000-TESTPROV',
              name: 'Citation 10',
              identifier: 'citation10',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            }
          ]
        },
        temporalKeywords: null,
        entryTitle: null,
        revisionDate: '2023-11-30 00:00:00',
        previewMetadata: {}
      }
    }
  }
}

export const citationAssociationsSearchPage2 = {
  request: {
    query: GET_CITATION_ASSOCIATIONS,
    variables: {
      params: {
        conceptId: 'C00000001-TESTPROV'
      },
      citationParams: {
        limit: 10,
        offset: 10
      }
    }
  },
  result: {
    data: {
      collection: {
        conceptId: 'C1000000000-TESTPROV',
        shortName: 'Collection Short Name 1',
        citations: {
          __typename: 'CitationList',
          count: 12,
          items: [
            {
              conceptId: 'CIT1100000-TESTPROV',
              name: 'Citation 11',
              identifier: 'citation11',
              identifierType: 'DOI',
              providerId: 'MMT_1'
            },
            {
              conceptId: 'CIT1200000-TESTPROV',
              name: 'Citation 12',
              identifier: 'citation12',
              identifierType: 'ISBN',
              providerId: 'MMT_2'
            }
          ]
        },
        temporalKeywords: null,
        entryTitle: null,
        revisionDate: '2023-11-30 00:00:00',
        previewMetadata: {}
      }
    }
  }
}

export const deleteAssociationResponse = {
  request: {
    query: DELETE_ASSOCIATION,
    variables: {
      conceptId: 'C00000001-TESTPROV',
      associatedConceptIds: ['CIT100000-TESTPROV']
    }
  },
  result: {
    data: {
      deleteAssociation: {
        associatedConceptId: 'CIT100000-TESTPROV',
        conceptId: 'C00000001-TESTPROV',
        revisionId: 2,
        __typename: 'AssociationMutationResponse'
      }
    }
  }
}

export const deleteAssociationsError = {
  request: {
    query: DELETE_ASSOCIATION,
    variables: {
      conceptId: 'C00000001-TESTPROV',
      associatedConceptIds: ['CIT100000-TESTPROV']
    }
  },
  error: new Error('An error occurred')
}
