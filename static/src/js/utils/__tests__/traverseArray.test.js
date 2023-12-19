import traverseArray from '../traverseArray'

describe('traverseArray', () => {
  describe('When map object is empty', () => {
    const map = {}
    const tokens = ['DistributionURL', 'DOWNLOAD SOFTWARE', 'MOBILE APP']
    const resultMap = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      }
    }
    test('loads map with tokens', () => {
      traverseArray(map, tokens)
      expect(map).toMatchObject(resultMap)
    })
  })

  describe('When map object has top and second level tokens as key', () => {
    const map = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      }
    }
    const tokens = ['DistributionURL', 'DOWNLOAD SOFTWARE', '']
    const resultMap = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      }
    }
    test('no changes should be made', () => {
      traverseArray(map, tokens)
      expect(map).toMatchObject(resultMap)
    })
  })

  describe('When map object does not have top token as key', () => {
    const map = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      }
    }
    const tokens = ['anotherURL', 'DOWNLOAD SOFTWARE', '']
    const resultMap = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      },
      anotherURL: {
        'DOWNLOAD SOFTWARE': {}
      }
    }
    test('new top level token added as key', () => {
      traverseArray(map, tokens)
      expect(map).toMatchObject(resultMap)
    })
  })

  describe('When map object does not have second level tokens as key', () => {
    const map = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        }
      }
    }
    const tokens = ['DistributionURL', 'GOTO WEB TOOL', 'LIVE ACCESS SERVER (LAS)']
    const resultMap = {
      DistributionURL: {
        'DOWNLOAD SOFTWARE': {
          'MOBILE APP': {}
        },
        'GOTO WEB TOOL': {
          'LIVE ACCESS SERVER (LAS)': {}
        }
      }
    }
    test('second level token is added as key', () => {
      traverseArray(map, tokens)
      expect(map).toMatchObject(resultMap)
    })
  })
})
