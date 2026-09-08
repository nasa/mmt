import { safeCompareSecret } from '../safeCompareSecret'

describe('safeCompareSecret', () => {
  test('returns true when the values match exactly', () => {
    expect(safeCompareSecret('super-secret-key', 'super-secret-key')).toBe(true)
  })

  test('returns false when the values differ', () => {
    expect(safeCompareSecret('super-secret-key', 'wrong-secret-key')).toBe(false)
  })

  test('returns false when the values differ only in length', () => {
    expect(safeCompareSecret('super-secret-key', 'super-secret-key-extra')).toBe(false)
  })

  test('returns false when the provided value is undefined', () => {
    expect(safeCompareSecret(undefined, 'super-secret-key')).toBe(false)
  })

  test('returns false when the expected value is undefined', () => {
    expect(safeCompareSecret('super-secret-key', undefined)).toBe(false)
  })

  test('returns false when both values are empty strings', () => {
    expect(safeCompareSecret('', '')).toBe(false)
  })

  test('returns false when the provided value is not a string', () => {
    expect(safeCompareSecret({ key: 'super-secret-key' }, 'super-secret-key')).toBe(false)
  })
})
