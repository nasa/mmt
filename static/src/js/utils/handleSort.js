/**
 * Function to handle 'handleSort
 * @param {String} provider required search parameter provided by user
 * @param {String} page required search parameter provided by user
 * @param {String} keyword required search parameter provided by user
 * @param {Function} setSearchParams Sets the searchParams of parent component
 * @param {String} key Name of column being used for sort function
 * @param {String} order Direction of sorting (ascending or descending)
 */

const handleSort = (provider, page, keyword, setSearchParams, key, order) => {
  let nextSortKey
  if (order === 'ascending') nextSortKey = `-${key}`
  if (order === 'descending') nextSortKey = key

  if (!order) {
    setSearchParams((currentParams) => {
      currentParams.delete('sortKey')

      return Object.fromEntries(currentParams)
    })

    return
  }

  setSearchParams((currentParams) => {
    currentParams.set('sortKey', nextSortKey)
    if (provider) {
      currentParams.set('provider', provider)
    } else {
      currentParams.delete('provider')
    }

    if (page) {
      currentParams.set('page', page)
    } else {
      currentParams.delete('page')
    }

    if (keyword) {
      currentParams.set('keyword', keyword)
    } else {
      currentParams.delete('keyword')
    }

    return Object.fromEntries(currentParams)
  })
}

export default handleSort
