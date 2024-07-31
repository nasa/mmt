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
