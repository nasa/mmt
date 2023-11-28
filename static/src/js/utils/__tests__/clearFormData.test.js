import clearFormData from '../clearFormData'

describe('clearFormData', () => {
  const mapping = {
    name: 'providers',
    map: {
      ShortName: 'short_name',
      LongName: 'long_name',
      URLValue: 'url'
    }
  }
  const data = {
    ShortName: 'DOI/USGS/CMG/WHSC',
    LongName: 'Eastern Oregon Agriculture Research Center, Oregon State University',
    URLValue: 'http://oregonstate.edu/dept/eoarcunion/'
  }
  describe('when target key is the first level in the mapping hierarchy', () => {
    test('all form data in sub levels are removed', () => {
      const controlName = 'short_name'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toBe(undefined)
      expect(clearedForm.URLValue).toBe(undefined)
    })
  })
})

describe('clearFormData', () => {
  const mapping = {
    name: 'providers',
    map: {
      ShortName: 'short_name',
      LongName: 'long_name',
      URLValue: 'url'
    }
  }
  const data = {
    ShortName: 'DOI/USGS/CMG/WHSC',
    LongName: 'Eastern Oregon Agriculture Research Center, Oregon State University',
    URLValue: 'http://oregonstate.edu/dept/eoarcunion/'
  }
  describe('when target key is the second level in the mapping hierarchy', () => {
    test('form data in the lower levels is removed', () => {
      const controlName = 'long_name'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toEqual('Eastern Oregon Agriculture Research Center, Oregon State University')
      expect(clearedForm.URLValue).toBe(undefined)
    })
  })
})

describe('clearFormData', () => {
  const mapping = {
    name: 'providers',
    map: {
      ShortName: 'short_name',
      LongName: 'long_name',
      URLValue: 'url'
    }
  }
  const data = {
    ShortName: 'DOI/USGS/CMG/WHSC',
    LongName: 'Eastern Oregon Agriculture Research Center, Oregon State University',
    URLValue: 'http://oregonstate.edu/dept/eoarcunion/'
  }
  describe('when target key is the last level in the mapping hierarchy', () => {
    test('form data of higher levels are not changed', () => {
      const controlName = 'url'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toEqual('Eastern Oregon Agriculture Research Center, Oregon State University')
      expect(clearedForm.URLValue).toBe('http://oregonstate.edu/dept/eoarcunion/')
    })
  })
})
