import toTitleCase from '../toTitleCase'

describe('toTitleCase', () => {
  test('converts "OrderOption" to "Order Option"', () => {
    expect(toTitleCase('OrderOption')).toEqual('Order Option')
  })

  test('converts "order-option" to "Order Option"', () => {
    expect(toTitleCase('order-option')).toEqual('Order Option')
  })

  test('converts "collection" to "Collection"', () => {
    expect(toTitleCase('collection')).toEqual('Collection')
  })

  test('converts "Collection" to "Collection"', () => {
    expect(toTitleCase('Collection')).toEqual('Collection')
  })
})
