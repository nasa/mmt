import removeLegacyGroupPermissionsById from '../removeLegacyGroupPermissionsById'

describe('removeLegacyGroupPermissionsByGroupId', () => {
  test('should remove group permissions with group ID is not null and not an UUID', () => {
    const groups = {
      items: [
        {
          __typename: 'AclGroup',
          id: null,
          name: null,
          permissions: [
            'read'
          ],
          tag: null,
          userType: 'guest'
        },
        {
          __typename: 'AclGroup',
          id: null,
          name: null,
          permissions: [
            'read'
          ],
          tag: null,
          userType: 'registered'
        },
        {
          __typename: 'AclGroup',
          id: 'AG31476474824-CMR',
          name: null,
          permissions: [
            'read'
          ],
          tag: null,
          userType: 'registered'
        },
        {
          __typename: 'AclGroup',
          id: 'af712868-ea62-474c-9400-76800716dae9',
          name: 'ECHO System',
          permissions: [
            'read'
          ],
          tag: null,
          userType: 'registered'
        }
      ]
    }

    const result = removeLegacyGroupPermissionsById(groups)

    const expectedResult = [
      {
        __typename: 'AclGroup',
        id: null,
        name: null,
        permissions: ['read'],
        tag: null,
        userType: 'guest'
      },
      {
        __typename: 'AclGroup',
        id: null,
        name: null,
        permissions: ['read'],
        tag: null,
        userType: 'registered'
      },
      {
        __typename: 'AclGroup',
        id: 'af712868-ea62-474c-9400-76800716dae9',
        name: 'ECHO System',
        permissions: ['read'],
        tag: null,
        userType: 'registered'
      }
    ]

    expect(result).toEqual(expectedResult)
  })
})
