/**
 * Extracts error messages from the Apollo error object.
 * @param {ApolloError} fullError - The error object from Apollo Client.
 * @returns {Array} An array of error objects from the response data.
 */
const extractErrorsFromGraphQlResponse = (fullError) => {
  if (fullError.graphQLErrors && fullError.graphQLErrors.length > 0) {
    return fullError.graphQLErrors.map((graphQLError) => ({
      message: graphQLError.message,
      locations: graphQLError.locations,
      path: graphQLError.path,
      extensions: graphQLError.extensions
    }))
  }

  if (fullError.networkError
    && fullError.networkError.result
    && fullError.networkError.result.errors) {
    return fullError.networkError.result.errors.map((networkError) => ({
      message: networkError.message,
      extensions: networkError.extensions
    }))
  }

  // If we couldn't find the expected error structure, return a default error
  return [{
    message: fullError.message || 'An unknown error occurred',
    extensions: {
      code: fullError.networkError?.statusCode
        ? `HTTP_${fullError.networkError.statusCode}` : 'UNKNOWN_ERROR'
    }
  }]
}

export default extractErrorsFromGraphQlResponse
