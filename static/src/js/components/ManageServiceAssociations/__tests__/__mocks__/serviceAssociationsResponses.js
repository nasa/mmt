import { DELETE_ASSOCIATION } from '@/js/operations/mutations/deleteAssociation'
import { GET_SERVICE_ASSOCIATIONS } from '@/js/operations/queries/getServiceAssociations'

export const serviceAssociationsSearch = {
  request: {
    query: GET_SERVICE_ASSOCIATIONS,
    variables: {
      params: {
        conceptId: 'C00000001-TESTPROV'
      }
    }
  },
  result: {
    data: {
      collection: {
        conceptId: 'C1000000000-TESTPROV',
        shortName: 'Collection Short Name 1',
        services: {
          __typename: 'ServiceList',
          count: 2,
          items: [
            {
              conceptId: 'S100000-TESTPROV',
              longName: 'UARS Read Software',
              orderOptions: {
                __typename: 'OrderOptionList',
                count: 1,
                items: [
                  {
                    conceptId: 'OO10000-TESTPROV',
                    name: 'Order Option'
                  }
                ]
              }
            },
            {
              conceptId: 'S200000-TESTPROV',
              longName: 'UARS Write Software',
              orderOptions: {
                __typename: 'OrderOptionList',
                count: 0,
                items: []
              }
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
      associatedConceptIds: ['S100000-TESTPROV']
    }
  },
  result: {
    data: {
      deleteAssociation: {
        associatedConceptId: 'S100000-TESTPROV',
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
      associatedConceptIds: ['S100000-TESTPROV']
    }
  },
  error: new Error('An error occurred')
}
