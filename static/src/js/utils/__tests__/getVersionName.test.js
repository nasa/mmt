import {
  describe,
  test,
  expect
} from 'vitest'
import { getVersionName } from '../getVersionName'

describe('getVersionName', () => {
  test('When version_type is published, should return "published"', () => {
    const version = {
      version: '1.0.0',
      version_type: 'published'
    }
    expect(getVersionName(version)).toBe('published')
  })

  test('When version_type is not published, should return the version string', () => {
    const version = {
      version: '1.0.0',
      version_type: 'draft'
    }
    expect(getVersionName(version)).toBe('1.0.0')
  })

  test('When version_type is undefined, should return the version string', () => {
    const version = { version: '2.0.0' }
    expect(getVersionName(version)).toBe('2.0.0')
  })

  test('When version is null or undefined, should return null', () => {
    expect(getVersionName(null)).toBe(null)
    expect(getVersionName(undefined)).toBe(null)
  })
})
