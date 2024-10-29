import validGroupItems from '../validGroupItems'

describe('validGroupItems', () => {
  describe('when items with no id and no userType', () => {
    test('should remove those properties', () => {
      const testItems = [
        {
          __typename: 'AclGroup',
          permissions: [
            'read'
          ],
          userType: 'guest',
          id: null,
          name: null,
          tag: null
        },
        {
          __typename: 'AclGroup',
          permissions: [
            'read'
          ],
          userType: 'registered',
          id: null,
          name: null,
          tag: null
        },
        {
          __typename: 'AclGroup',
          permissions: [
            'read'
          ],
          userType: null,
          id: null,
          name: null,
          tag: null
        },
        {
          __typename: 'AclGroup',
          permissions: [
            'read'
          ],
          userType: null,
          id: '1234-abcd-345',
          name: null,
          tag: null
        }
      ]

      const expected = [
        {
          __typename: 'AclGroup',
          permissions: ['read'],
          userType: 'guest',
          id: null,
          name: null,
          tag: null
        },
        {
          __typename: 'AclGroup',
          permissions: ['read'],
          userType: 'registered',
          id: null,
          name: null,
          tag: null
        },
        {
          __typename: 'AclGroup',
          permissions: ['read'],
          userType: null,
          id: '1234-abcd-345',
          name: null,
          tag: null
        }
      ]

      const result = validGroupItems(testItems)

      expect(result).toEqual(expected)
    })
  })
})
