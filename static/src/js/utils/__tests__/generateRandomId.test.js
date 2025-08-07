import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import generateRandomId from '../generateRandomId'

describe('generateRandomId', () => {
  // Setup
  let originalDateNow
  let originalMathRandom

  beforeEach(() => {
    originalDateNow = Date.now
    originalMathRandom = Math.random
  })

  afterEach(() => {
    Date.now = originalDateNow
    Math.random = originalMathRandom
  })

  test('When called, should return a string', () => {
    const result = generateRandomId()
    expect(typeof result).toBe('string')
  })

  test('When called, should return a string with a hyphen', () => {
    const result = generateRandomId()
    expect(result).toContain('-')
  })

  test('When called multiple times, should return different values', () => {
    const result1 = generateRandomId()
    const result2 = generateRandomId()
    expect(result1).not.toBe(result2)
  })

  test('When Date.now is mocked, should use the mocked timestamp', () => {
    const mockedTimestamp = 1234567890123
    Date.now = vi.fn(() => mockedTimestamp)
    Math.random = vi.fn(() => 0.5)

    const result = generateRandomId()
    expect(result.split('-')[0]).toBe(mockedTimestamp.toString(36))
  })

  test('When Math.random is mocked, should use the mocked random value', () => {
    const mockedRandom = 0.123456789
    Math.random = vi.fn(() => mockedRandom)

    const result = generateRandomId()
    expect(result.split('-')[1]).toBe(mockedRandom.toString(36).slice(2, 11))
  })
})
