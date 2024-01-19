const stringifyCircularJSON = (obj) => {
  const seen = new WeakSet()

  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return
      seen.add(v)
    }

    // eslint-disable-next-line consistent-return
    return v
  })
}

export default stringifyCircularJSON
