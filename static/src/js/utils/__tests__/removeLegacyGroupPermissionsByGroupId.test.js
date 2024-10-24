import removeLegacyGroupPermissionsByGroupId from '../removeLegacyGroupPermissionsByGroupId'

describe('removeLegacyGroupPermissionsByGroupId', () => {
  test('should remove group permissions with group ID is not null and not an UUID', () => {
    const testArray = [
      {
        permissions: [
          'read',
          'order'
        ],
        userType: 'guest'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        userType: 'registered'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        groupId: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        groupId: 'AG234274823-CMR'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        groupId: 'af712868-ea62-474c-9400-76800716dae9'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        groupId: 'AG90157814935-NSIDC'
      },
      {
        permissions: [
          'read',
          'order'
        ],
        groupId: 'e1b8b63f-f753-4a92-bf7b-43f45302fdfa'
      }
    ]

    const result = removeLegacyGroupPermissionsByGroupId(testArray)

    const expectedResult = [
      {
        permissions: ['read', 'order'],
        userType: 'guest'
      },
      {
        permissions: ['read', 'order'],
        userType: 'registered'
      },
      {
        permissions: ['read', 'order'],
        groupId: 'fc9f3eab-97d5-4c99-8ba1-f2ae0eca42ee'
      },
      {
        permissions: ['read', 'order'],
        groupId: 'af712868-ea62-474c-9400-76800716dae9'
      },
      {
        permissions: ['read', 'order'],
        groupId: 'e1b8b63f-f753-4a92-bf7b-43f45302fdfa'
      }

    ]

    expect(result).toEqual(expectedResult)
  })
})
