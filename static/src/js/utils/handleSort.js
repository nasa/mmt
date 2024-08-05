/**
 * Function to handle 'handleSort
 * @param {String} provider Optional search parameter provided by user
 * @param {Function} setSearchParams Sets the searchParams of parent component
 * @param {String} key Name of column being used for sort function
 * @param {String} order Direction of sorting (ascending or descending)
 */

const handleSort = (provider, setSearchParams, key, order) => {
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

    return Object.fromEntries(currentParams)
  })
}

export default handleSort
