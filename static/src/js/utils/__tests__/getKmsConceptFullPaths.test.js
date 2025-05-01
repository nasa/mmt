import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import { getKmsConceptFullPaths } from '@/js/utils/getKmsConceptFullPaths'

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

  it('should fetch and return full paths from KMS', async () => {
    const value = 'test-uuid'
    const expectedResult = ['Chained Operations']

    const result = await getKmsConceptFullPaths(value)

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/concept_fullpaths/concept_uuid/${value}`), { method: 'GET' })

    expect(result).toEqual(expectedResult)
  })

  it('should throw an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 404
    }))

    await expect(getKmsConceptFullPaths('bad-uuid')).rejects.toThrow('getConceptFullPaths HTTP error! status: 404')
  })
})
