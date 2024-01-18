import { getUmmVersionsConfig } from '../getConfig'
import getUmmVersion from '../getUmmVersion'

const ummVersion = getUmmVersionsConfig()
describe('getUmmVersion', () => {
  describe('when the concept type is Tool', () => {
    test('returns correct UMM-T version', () => {
      expect(getUmmVersion('Tool')).toEqual(ummVersion.ummT)
    })
  })

  describe('when the concept type is Service', () => {
    test('returns correct UMM-S version', () => {
      expect(getUmmVersion('Service')).toEqual(ummVersion.ummS)
    })
  })

  describe('when the concept type is Variable', () => {
    test('returns correct UMM-V version', () => {
      expect(getUmmVersion('Variable')).toEqual(ummVersion.ummV)
    })
  })

  describe('when the concept type is Collection', () => {
    test('returns correct UMM-C version', () => {
      expect(getUmmVersion('Collection')).toEqual(ummVersion.ummC)
    })
  })
})
