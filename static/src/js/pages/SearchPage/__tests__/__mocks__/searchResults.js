import { GraphQLError } from 'graphql'
import { GET_COLLECTIONS } from '../../../../operations/queries/getCollections'

export const singlePageCollectionSearch = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 20,
        offset: 0,
        sortKey: null,
        includeTags: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 2,
        items: [
          {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            version: '1',
            title: 'Collection Title 1',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000001-TESTPROV',
            shortName: 'Collection Short Name 2',
            version: '2',
            title: 'Collection Title 2',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionSearchPage1 = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 3,
        offset: 0,
        sortKey: null,
        includeTags: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 8,
        items: [
          {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            version: '1',
            title: 'Collection Title 1',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000001-TESTPROV',
            shortName: 'Collection Short Name 2',
            version: '2',
            title: 'Collection Title 2',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          },
          {
            conceptId: 'C1000000002-TESTPROV',
            shortName: 'Collection Short Name 3',
            version: '3',
            title: 'Collection Title 3',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionSearchPage2 = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 3,
        offset: 3,
        sortKey: null,
        includeTags: '*'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 8,
        items: [
          {
            conceptId: 'C1000000003-TESTPROV',
            shortName: 'Collection Short Name 4',
            version: '2',
            title: 'Collection Title 4',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          },
          {
            conceptId: 'C1000000004-TESTPROV',
            shortName: 'Collection Short Name 5',
            version: '1',
            title: 'Collection Title 5',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000005-TESTPROV',
            shortName: 'Collection Short Name 6',
            version: '2',
            title: 'Collection Title 6',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: null,
            revisionDate: '2023-11-31 00:00:00'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionSearchPage1Asc = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 3,
        offset: 0,
        includeTags: '*',
        sortKey: '-shortName'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 8,
        items: [
          {
            conceptId: 'C1000000002-TESTPROV',
            shortName: 'Collection Short Name 3',
            version: '3',
            title: 'Collection Title 3',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000001-TESTPROV',
            shortName: 'Collection Short Name 2',
            version: '2',
            title: 'Collection Title 2',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          },
          {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            version: '1',
            title: 'Collection Title 1',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionSearchPage1Desc = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 3,
        offset: 0,
        includeTags: '*',
        sortKey: 'shortName'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 8,
        items: [
          {
            conceptId: 'C1000000002-TESTPROV',
            shortName: 'Collection Short Name 3',
            version: '3',
            title: 'Collection Title 3',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000001-TESTPROV',
            shortName: 'Collection Short Name 2',
            version: '2',
            title: 'Collection Title 2',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          },
          {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            version: '1',
            title: 'Collection Title 1',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          }
        ]
      }
    }
  }
}

export const multiPageCollectionSearchPage1TitleAsc = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 3,
        offset: 0,
        includeTags: '*',
        sortKey: '-entryTitle'
      }
    }
  },
  result: {
    data: {
      collections: {
        count: 8,
        items: [
          {
            conceptId: 'C1000000002-TESTPROV',
            shortName: 'Collection Short Name 3',
            version: '3',
            title: 'Collection Title 3',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          },
          {
            conceptId: 'C1000000001-TESTPROV',
            shortName: 'Collection Short Name 2',
            version: '2',
            title: 'Collection Title 2',
            provider: 'MMT',
            granules: {
              count: 1234
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              },
              'test.tag.two': {
                data: 'Tag Data 2'
              }
            },
            revisionDate: '2023-11-31 00:00:00'
          },
          {
            conceptId: 'C1000000000-TESTPROV',
            shortName: 'Collection Short Name 1',
            version: '1',
            title: 'Collection Title 1',
            provider: 'TESTPROV',
            granules: {
              count: 1000
            },
            tags: {
              'test.tag.one': {
                data: 'Tag Data 1'
              }
            },
            revisionDate: '2023-11-30 00:00:00'
          }
        ]
      }
    }
  }
}

export const singlePageCollectionSearchError = {
  request: {
    query: GET_COLLECTIONS,
    variables: {
      params: {
        keyword: '',
        limit: 20,
        offset: 0,
        sortKey: null,
        includeTags: '*'
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
