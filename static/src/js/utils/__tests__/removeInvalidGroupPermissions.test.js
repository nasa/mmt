import removeInvalidGroupPermissions from '../removeInvalidGroupPermissions'

describe('removeInvalidGroupPermissions', () => {
  test('should remove group permissions without id and without userType', () => {
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
          id: null,
          name: null,
          permissions: [
            'read'
          ],
          tag: null,
          userType: null
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

    const result = removeInvalidGroupPermissions(groups.items)

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
