import shouldHideGetData from '../shouldHideGetData'

describe('shouldHideGetData', () => {
  describe('when URLContentType is not DistributionURL and Type is not GET DATA or GET CAPABILITIES', () => {
    test('should hide GetData form', () => {
      const props = {
        URLContentType: 'OtherContentType',
        Type: 'OtherType'
      }
      const getData = shouldHideGetData(props)
      expect(getData).toBe(true)
    })
  })

  describe('when URLContentType is DistributionURL and Type is GET DATA', () => {
    test('should not hide GetData form', () => {
      const props = {
        URLContentType: 'DistributionURL',
        Type: 'GET DATA'
      }

      const getData = shouldHideGetData(props)
      expect(getData).toBe(false)
    })
  })

  describe('when URLContentType is DistributionURL and Type is GET CAPABILITIES', () => {
    test('should not hide GetData', () => {
      const props = {
        URLContentType: 'DistributionURL',
        Type: 'GET CAPABILITIES'
      }
      const getData = shouldHideGetData(props)
      expect(getData).toBe(false)
    })
  })
})
