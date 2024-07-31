import handleSort from '../handleSort'

describe('handleSort', () => {
  const originalSearchParams1 = new URLSearchParams('?keyword=&provider=LARC')
  const originalProvider1 = originalSearchParams1.get('provider')

  const originalSearchParams2 = new URLSearchParams('?keyword=&provider=')
  const originalProvider2 = originalSearchParams2.get('provider')

  describe('when given a query', () => {
    test('returns appropriate search params for sorting', () => {
      const searchParamsSortKeyAsc = new URLSearchParams('?sortKey=-name')
      const searchParamsSortKeyDes = new URLSearchParams('?sortKey=name')
      const searchParamsRemoved = new URLSearchParams('')
      const setSearchParams = vi.fn()
      const key = 'name'
      const orderAsc = 'ascending'
      const orderDes = 'descending'

      handleSort(originalProvider1, setSearchParams, key, orderAsc)

      // First call setting searchParams to provider = 'LARC' and sortKey = '-name'
      setSearchParams.mock.calls[0][0](searchParamsSortKeyAsc)

      expect(searchParamsSortKeyAsc.get('sortKey')).toBe('-name')
      expect(searchParamsSortKeyAsc.get('provider')).toBe('LARC')

      handleSort(originalProvider2, setSearchParams, key, orderDes)

      // Second call setting searchParams after user removes providers and sortKey = 'name'
      setSearchParams.mock.calls[1][0](searchParamsSortKeyDes)

      expect(searchParamsSortKeyDes.get('sortKey')).toBe('name')
      expect(searchParamsSortKeyDes.get('provider')).toBeNull()

      handleSort(originalProvider2, setSearchParams)

      // Third call setting searchParams after user removes provider and removes sortKey
      setSearchParams.mock.calls[2][0](searchParamsRemoved)

      expect(searchParamsRemoved.get('sortKey')).toBeNull()
      expect(searchParamsRemoved.get('provider')).toBeNull()
    })
  })
})
