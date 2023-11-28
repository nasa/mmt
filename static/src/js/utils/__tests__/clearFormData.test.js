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
    test('form data is unchanged', () => {
      const controlName = 'url'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toEqual('Eastern Oregon Agriculture Research Center, Oregon State University')
      expect(clearedForm.URLValue).toEqual('http://oregonstate.edu/dept/eoarcunion/')
    })
  })
})

describe('clearFormData', () => {
  const mapping = {
    name: 'providers',
    map: {
      Additional: 'additional',
      ShortName: 'short_name',
      LongName: 'long_name',
      URLValue: 'url'
    },
    clearAdditions: ['Additional']
  }
  const data = {
    Additional: 'some values',
    ShortName: 'DOI/USGS/CMG/WHSC',
    LongName: 'Eastern Oregon Agriculture Research Center, Oregon State University',
    URLValue: 'http://oregonstate.edu/dept/eoarcunion/'
  }
  describe('when target key is the first level in the mapping hierarchy and additional key passed in', () => {
    test('all form data in sub levels are removed', () => {
      const controlName = 'short_name'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toBe(undefined)
      expect(clearedForm.URLValue).toBe(undefined)
      expect(clearedForm.Additional).toBe(undefined)
    })
  })
})

describe('clearFormData', () => {
  const mapping = {
    name: 'providers',
    map: {
      First: 'first',
      ShortName: 'short_name',
      LongName: { Additional: 'additional' },
      URLValue: 'url'
    },
    clearAdditions: ['LongName.Additional']
  }
  const data = {
    First: 'this is first',
    ShortName: 'DOI/USGS/CMG/WHSC',
    LongName: { Additional: 'DOI/USGS/CMG/WHSC' },
    URLValue: 'http://oregonstate.edu/dept/eoarcunion/'
  }
  describe('when additional sub field key passed in', () => {
    test('all form data in sub levels are removed', () => {
      const controlName = 'long_name'
      const clearedForm = clearFormData(mapping, data, controlName)
      expect(clearedForm.First).toEqual('this is first')
      expect(clearedForm.ShortName).toEqual('DOI/USGS/CMG/WHSC')
      expect(clearedForm.LongName).toEqual({})
      expect(clearedForm.URLValue).toEqual('http://oregonstate.edu/dept/eoarcunion/')
    })
  })
})
