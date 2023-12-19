/**
 * Parse out an error message thrown by GraphQL
 * @param {Object} error Error object thrown by GraphQL
 */
const parseError = (error) => {
  const {
    graphQLErrors = [],
    networkError
  } = error

  let message

  if (graphQLErrors.length > 0) {
    message = graphQLErrors.map((graphQLError) => graphQLError.message).join('\n')
  }

  if (networkError) {
    ({ message } = networkError)
  }

  if (message) return message

  return error
}

export default parseError
