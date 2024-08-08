import handleSort from '../handleSort'

describe('handleSort', () => {
  const originalSearchParams1 = new URLSearchParams('?keyword=AIR&provider=LARC&page=2')
  const originalProvider1 = originalSearchParams1.get('provider')
  const originalPage1 = originalSearchParams1.get('page')
  const originalKeyword1 = originalSearchParams1.get('keyword')

  const originalSearchParams2 = new URLSearchParams('?keyword=&provider=')
  const originalProvider2 = originalSearchParams2.get('provider')
  const originalPage2 = originalSearchParams2.get('page')
  const originalKeyword2 = originalSearchParams2.get('keyword')

  describe('when given a query', () => {
    test('returns appropriate search params for sorting', () => {
      const searchParamsSortKeyAsc = new URLSearchParams('?sortKey=-name')
      const searchParamsSortKeyDes = new URLSearchParams('?sortKey=name')
      const searchParamsRemoved = new URLSearchParams('')
      const setSearchParams = vi.fn()
      const key = 'name'
      const orderAsc = 'ascending'
      const orderDes = 'descending'

      handleSort(originalProvider1, originalPage1, originalKeyword1, setSearchParams, key, orderAsc)

      // First call setting searchParams to provider = 'LARC' and sortKey = '-name'
      setSearchParams.mock.calls[0][0](searchParamsSortKeyAsc)

      expect(searchParamsSortKeyAsc.get('sortKey')).toBe('-name')
      expect(searchParamsSortKeyAsc.get('provider')).toBe('LARC')
      expect(searchParamsSortKeyAsc.get('page')).toBe('2')
      expect(searchParamsSortKeyAsc.get('keyword')).toBe('AIR')

      handleSort(originalProvider2, originalPage2, originalKeyword2, setSearchParams, key, orderDes)

      // Second call setting searchParams after user removes providers and sortKey = 'name'
      setSearchParams.mock.calls[1][0](searchParamsSortKeyDes)

      expect(searchParamsSortKeyDes.get('sortKey')).toBe('name')
      expect(searchParamsSortKeyDes.get('provider')).toBeNull()
      expect(searchParamsSortKeyDes.get('page')).toBeNull()
      expect(searchParamsSortKeyDes.get('keyword')).toBeNull()

      handleSort(originalProvider2, originalPage2, originalKeyword2, setSearchParams)

      // Third call setting searchParams after user removes provider and removes sortKey
      setSearchParams.mock.calls[2][0](searchParamsRemoved)

      expect(searchParamsRemoved.get('sortKey')).toBeNull()
      expect(searchParamsRemoved.get('provider')).toBeNull()
      expect(searchParamsRemoved.get('page')).toBeNull()
      expect(searchParamsRemoved.get('keyword')).toBeNull()
    })
  })
})
