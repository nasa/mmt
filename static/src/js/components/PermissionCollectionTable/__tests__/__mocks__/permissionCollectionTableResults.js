import { GET_COLLECTION_PERMISSION } from '@/js/operations/queries/getCollectionPermission'

export const mockPermission = {
  __typename: 'Acl',
  conceptId: 'ACL00000-CMR',
  collections: {
    __typename: 'CollectionList',
    count: 1,
    items: [
      {
        __typename: 'Collection',
        conceptId: 'C1200450691-MMT_2',
        shortName: 'Collection 1',
        title: 'Mock Collection 1',
        version: '1',
        provider: 'MMT_2'
      },
      {
        __typename: 'Collection',
        conceptId: 'C1200450692-MMT_2',
        shortName: 'Collection 2',
        title: 'Mock Collection 2',
        version: '2',
        provider: 'MMT_2'
      }
    ]
  },
  identityType: 'Catalog Item',
  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
  name: 'Mock Permission',
  providerIdentity: null,
  revisionId: 5,
  systemIdentity: null,
  catalogItemIdentity: {
    __typename: 'CatalogItemIdentity',
    collectionApplicable: true,
    granuleApplicable: false,
    granuleIdentifier: null,
    name: 'Mock Permission',
    providerId: 'MMT_2',
    collectionIdentifier: {
      __typename: 'CollectionIdentifier',
      accessValue: null,
      temporal: null
    }
  },
  groups: {
    __typename: 'AclGroupList',
    items: [
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'guest',
        group: null,
        id: null,
        name: null
      },
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'registered',
        group: null,
        id: null,
        name: null
      }
    ]
  }
}

export const mockPermissions = {
  __typename: 'Acl',
  conceptId: 'ACL00000-CMR',
  collections: {
    __typename: 'CollectionList',
    count: 45,
    items: [
      {
        __typename: 'Collection',
        conceptId: 'C1200450691-MMT_2',
        shortName: 'Collection 1',
        title: 'Mock Collection 1',
        version: '1',
        provider: 'MMT_2'
      },
      {
        __typename: 'Collection',
        conceptId: 'C1200450692-MMT_2',
        shortName: 'Collection 2',
        title: 'Mock Collection 2',
        version: '2',
        provider: 'MMT_2'
      }
    ]
  },
  identityType: 'Catalog Item',
  location: 'https://cmr.sit.earthdata.nasa.gov:443/access-control/acls/ACL00000-CMR',
  name: 'Mock Permission',
  providerIdentity: null,
  revisionId: 5,
  systemIdentity: null,
  catalogItemIdentity: {
    __typename: 'CatalogItemIdentity',
    collectionApplicable: true,
    granuleApplicable: false,
    granuleIdentifier: null,
    name: 'Mock Permission',
    providerId: 'MMT_2',
    collectionIdentifier: {
      __typename: 'CollectionIdentifier',
      accessValue: null,
      temporal: null
    }
  },
  groups: {
    __typename: 'AclGroupList',
    items: [
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'guest',
        group: null,
        id: null,
        name: null
      },
      {
        __typename: 'GroupPermission',
        permissions: [
          'read'
        ],
        userType: 'registered',
        group: null,
        id: null,
        name: null
      }
    ]
  }
}

export const mockCollectionPermissionSearch = {
  request: {
    query: GET_COLLECTION_PERMISSION,
    variables: {
      conceptId: 'ACL00000-CMR',
      collectionParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      acl: mockPermission
    }
  }
}

export const mockCollectionPermissionSearchWithPages = {
  request: {
    query: GET_COLLECTION_PERMISSION,
    variables: {
      conceptId: 'ACL00000-CMR',
      collectionParams: {
        limit: 20,
        offset: 0
      }
    }
  },
  result: {
    data: {
      acl: mockPermissions
    }
  }
}
