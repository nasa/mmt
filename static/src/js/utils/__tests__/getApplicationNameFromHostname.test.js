import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'
import getApplicationNameFromHostname from '../getApplicationNameFromHostname'
import * as getConfig from '../../../../../sharedUtils/getConfig'

vi.mock('../../../../../sharedUtils/getConfig', () => ({
  getApplicationConfig: vi.fn()
}))

describe('getApplicationNameFromHostname', () => {
  const originalLocation = window.location

  beforeEach(() => {
    vi.resetAllMocks()
    delete window.location
    window.location = { hostname: 'mmt.sit.earthdata.nasa.gov' }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  test('returns mmt when hostname starts with mmt.', () => {
    window.location.hostname = 'mmt.prod.earthdata.nasa.gov'
    expect(getApplicationNameFromHostname()).toBe('mmt')
  })

  test('returns dmmt when hostname starts with dmmt.', () => {
    window.location.hostname = 'dmmt.prod.earthdata.nasa.gov'
    expect(getApplicationNameFromHostname()).toBe('dmmt')
  })

  test('falls back to application config name when hostname does not match', () => {
    window.location.hostname = 'other.example.com'
    vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({ name: 'custom-app' })

    expect(getApplicationNameFromHostname()).toBe('custom-app')
  })

  test('defaults to mmt when config does not specify a name', () => {
    window.location.hostname = 'another.example.com'
    vi.spyOn(getConfig, 'getApplicationConfig').mockReturnValue({})

    expect(getApplicationNameFromHostname()).toBe('mmt')
  })
})
