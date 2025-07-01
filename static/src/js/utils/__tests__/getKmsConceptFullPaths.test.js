import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import { getKmsConceptFullPaths } from '@/js/utils/getKmsConceptFullPaths'

// Mock getApplicationConfig
vi.mock('sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn(() => ({ kmsHost: 'http://example.com' }))
}))

// Mocking fetch
global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  text: () => Promise.resolve(`
      <FullPaths>
        <FullPath xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">Chained Operations</FullPath>
      </FullPaths>
    `)
}))

describe('getKmsConceptFullPaths', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetch.mockClear()
  })

  it('should fetch and return full paths from KMS without version', async () => {
    const conceptId = 'test-uuid'
    const expectedResult = ['Chained Operations']

    const result = await getKmsConceptFullPaths({ conceptId })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://example.com/concept_fullpaths/concept_uuid/test-uuid', { method: 'GET' })

    expect(result).toEqual(expectedResult)
  })

  it('should fetch and return full paths from KMS with version', async () => {
    const conceptId = 'test-uuid'
    const version = '1.0'
    const expectedResult = ['Chained Operations']

    const result = await getKmsConceptFullPaths({
      conceptId,
      version
    })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://example.com/concept_fullpaths/concept_uuid/test-uuid?version=1.0', { method: 'GET' })

    expect(result).toEqual(expectedResult)
  })

  it('should throw an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 404
    }))

    await expect(getKmsConceptFullPaths({ conceptId: 'bad-uuid' })).rejects.toThrow('getConceptFullPaths HTTP error! status: 404')
  })

  it('should handle multiple full paths', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      text: () => Promise.resolve(`
        <FullPaths>
          <FullPath xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">Path 1</FullPath>
          <FullPath xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xsi:type="xs:string">Path 2</FullPath>
        </FullPaths>
      `)
    }))

    const conceptId = 'multi-path-uuid'
    const expectedResult = ['Path 1', 'Path 2']

    const result = await getKmsConceptFullPaths({ conceptId })

    expect(result).toEqual(expectedResult)
  })
})
