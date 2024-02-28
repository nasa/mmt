const isTokenExpired = (token) => {
  if (token == null || Object.keys(token) === 0) {
    return true
  }

  const now = new Date().valueOf()
  const { tokenValue, tokenExp } = token

  return (tokenValue === null || tokenValue === undefined || tokenValue === '') || now > tokenExp
}

export default isTokenExpired
