/**
 * Given formData returns params based on searchType.
 * Example: If the searchType is entryTitle then returns a wildcard search query.
 *          If the searchType is scienceKeywords then returns the scienceKeyword query.
 * @param {Object} formData A object that has the searched user input data
 */
export const collectionAssociationSearch = (formData) => {
  const type = Object.keys(formData)
  const value = Object.values(formData).at(0)

  const isWildCardSearch = (searchType) => {
    const wildcardSearch = ['dataCenter', 'entryTitle', 'instrument', 'platform', 'processingLevelId', 'project', 'shortName', 'spatialKeyword', 'version']

    return wildcardSearch.includes(searchType[0])
  }

  // Example of a wildcard search
  //  {
  //    "params": {
  //      "options": {
  //        "shortName": {
  //         "pattern": true
  //        }
  //      },
  //      "shortName": "air*"
  //    }
  if (isWildCardSearch(type)) {
    return {
      options: {
        [type]: {
          pattern: true
        }
      },
      [type]: value
    }
  }

  // When the search type is Temporal Extent. In the UI from temporal there are two date-time fields,
  // when searching in CMR for temporal extent, MMT needs to combine both date-time field.
  // Example: "params": {
  //   "temporal": "1978-01-01T00:00:00Z,1999-12-31T00:00:00Z"
  //   }
  if (type.includes('rangeStart')) {
    const rangeStart = Object.values(formData).at(0)
    const rangeEnd = Object.values(formData).at(1)
    const range = `${rangeStart},${rangeEnd}`

    return {
      temporal: range
    }
  }

  if (type.includes('scienceKeywords')) {
    return {
      scienceKeywords: {
        0: {
          any: value
        }
      }
    }
  }

  return {
    [type]: value
  }
}
