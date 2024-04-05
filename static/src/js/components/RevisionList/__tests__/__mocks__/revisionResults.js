import { GraphQLError } from 'graphql'
import { GET_COLLECTION_REVISIONS } from '../../../../operations/queries/getCollectionRevisions'
// Import { GET_SERVICES } from '../../../../operations/queries/getServices'
import { GET_VARIABLES } from '../../../../operations/queries/getVariables'
// Import { GET_TOOLS } from '../../../../operations/queries/getTools'

export const singlePageCollectionRevisions = {
  request: {
    query: GET_COLLECTION_REVISIONS,
    variables: {
      params: {
        conceptId: 'C1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 2,
        items: [
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 2',
            version: 'Collection Long Name 2',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '2',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          },
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 1',
            version: 'Collection Long Name 1',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '1',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionRevisionsPage1 = {
  request: {
    query: GET_COLLECTION_REVISIONS,
    variables: {
      params: {
        conceptId: 'C1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 4,
        items: [
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 4',
            version: 'Collection Long Name 4',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '4',
            revisionDate: '2023-12-30 00:00:00',
            userId: 'admin'
          },
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 3',
            version: 'Collection Long Name 3',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '3',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          },
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 2',
            version: 'Collection Long Name 2',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '2',
            revisionDate: '2023-10-30 00:00:00',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionRevisionsPage2 = {
  request: {
    query: GET_COLLECTION_REVISIONS,
    variables: {
      params: {
        conceptId: 'C1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 3,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 4,
        items: [
          {
            conceptId: 'C1004-MMT_2',
            shortName: 'Collection Short Name 1',
            version: 'Collection Long Name 1',
            title: 'Collection title',
            entryTitle: 'Collection Entry Title',
            revisionId: '1',
            revisionDate: '2023-9-30 00:00:00',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const singlePageCollectionRevisionsError = {
  request: {
    query: GET_COLLECTION_REVISIONS,
    variables: {
      params: {
        conceptId: 'C1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 0,
        items: []
      }
    },
    errors: [new GraphQLError('An error occurred')]
  }
}

export const singlePageVariableRevisions = {
  request: {
    query: GET_VARIABLES,
    variables: {
      params: {
        conceptId: 'V1004-MMT_2',
        allRevisions: true,
        limit: 20,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      variables: {
        count: 2,
        items: [
          {
            conceptId: 'V1004-MMT_2',
            name: 'Variable title 2',
            longName: 'Variable Short Name 2',
            providerId: 'MMT_2',
            revisionDate: '2023-12-30T00:00:00',
            revisionId: '2',
            userId: 'admin'
          },
          {
            conceptId: 'V1004-MMT_2',
            name: 'Variable title 1',
            longName: 'Variable Short Name 1',
            providerId: 'MMT_2',
            revisionDate: '2023-11-30T00:00:00',
            revisionId: '1',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const multiPageVariableRevisionsPage1 = {
  request: {
    query: GET_VARIABLES,
    variables: {
      params: {
        conceptId: 'V1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      variables: {
        count: 4,
        items: [
          {
            conceptId: 'V1004-MMT_2',
            shortName: 'Variable Short Name 4',
            version: 'Variable Long Name 4',
            title: 'Variable title',
            entryTitle: 'Variable Entry Title',
            revisionId: '4',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          },
          {
            conceptId: 'V1004-MMT_2',
            shortName: 'Variable Short Name 3',
            version: 'Variable Long Name 3',
            title: 'Variable title',
            entryTitle: 'Variable Entry Title',
            revisionId: '3',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          },
          {
            conceptId: 'V1004-MMT_2',
            shortName: 'Variable Short Name 2',
            version: 'Variable Long Name 2',
            title: 'Variable title',
            entryTitle: 'Variable Entry Title',
            revisionId: '2',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const multiPageVariableRevisionsPage2 = {
  request: {
    query: GET_VARIABLES,
    variables: {
      params: {
        conceptId: 'V1004-MMT_2',
        allRevisions: true,
        limit: 3,
        offset: 3,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      variables: {
        count: 4,
        items: [
          {
            conceptId: 'V1004-MMT_2',
            shortName: 'Variable Short Name 1',
            version: 'Variable Long Name 1',
            title: 'Variable title',
            entryTitle: 'Variable Entry Title',
            revisionId: '1',
            revisionDate: '2023-11-30 00:00:00',
            userId: 'admin'
          }
        ]
      }
    }
  }
}

export const singlePageVariableRevisionsError = {
  request: {
    query: GET_VARIABLES,
    variables: {
      params: {
        conceptId: 'V1004-MMT_2',
        allRevisions: true,
        limit: 20,
        offset: 0,
        sortKey: '-revisionDate'
      }
    }
  },
  result: {
    data: {
      variables: {
        count: undefined,
        items: []
      }
    },
    errors: [new GraphQLError('An error occurred')]
  }
}
