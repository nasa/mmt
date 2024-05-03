import toTitleCase from '../toTitleCase'

test('toTitleCase', () => {
  test('converts "OrderOption" to "Order Option"', () => {
    expect(toTitleCase('OrderOption')).toBe('Order Option')
  })

  test('converts "order-option" to "Order Option"', () => {
    expect(toTitleCase('order-option')).toBe('Order Option')
  })

  test('converts "collection" to "Collection"', () => {
    expect(toTitleCase('collection')).toBe('Collection')
  })

  test('converts "Collection" to "Collection"', () => {
    expect(toTitleCase('Collection')).toBe('Collection')
  })
})
