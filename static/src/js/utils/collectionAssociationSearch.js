export const collectionAssociationSearch = (formData, limit, offset, providerId) => {
  const { searchField, providerFilter } = formData
  const type = Object.keys(searchField)
  const value = Object.values(searchField).at(0)

  let provider = null

  if (providerFilter) {
    provider = providerId
  }

  const params = {
    limit,
    offset,
    provider
  }
  const isWildCardSearch = (searchType) => {
    const wildcardSearch = ['dataCenter', 'entryTitle', 'instrument', 'platform', 'processingLevelId', 'project', 'shortName', 'spatialKeyword', 'version']

    return wildcardSearch.includes(searchType[0])
  }

  if (isWildCardSearch(type)) {
    return {
      ...params,
      options: {
        [type]: {
          pattern: true
        }
      },
      [type]: value
    }
  }

  if (type.includes('rangeStart')) {
    const rangeStart = Object.values(searchField).at(0)
    const rangeEnd = Object.values(searchField).at(1)
    const range = `${rangeStart},${rangeEnd}`

    return {
      ...params,
      temporal: range
    }
  }

  if (type.includes('scienceKeywords')) {
    return {
      ...params,
      scienceKeywords: {
        0: {
          any: value
        }
      }
    }
  }

  return {
    ...params,
    [type]: value
  }
}
