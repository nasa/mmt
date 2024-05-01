/**
 * Given formData returns params based on searchType.
 * Example: If the searchType is entryTitle then returns a wildcard search query.
 *          If the searchType is scienceKeywords then returns the scienceKeyword query.
 * @param {String} type The title of the field
 * @param {String} value The value of the field
 */
const collectionAssociationSearch = (type, value) => {
  const isWildCardSearch = (searchType) => {
    const wildcardSearch = ['dataCenter', 'entryTitle', 'instrument', 'platform', 'processingLevelId', 'project', 'shortName', 'spatialKeyword', 'version']

    return wildcardSearch.includes(searchType)
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

export default collectionAssociationSearch
