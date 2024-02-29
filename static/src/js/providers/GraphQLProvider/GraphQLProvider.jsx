import React from 'react'
import PropTypes from 'prop-types'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getApplicationConfig } from '../../utils/getConfig'

import useAppContext from '../../hooks/useAppContext'

/**
 * @typedef {Object} GraphQLProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with Auth.
 * @param {GraphQLProviderProps} props
 *
 * @example <caption>Renders children wrapped with Auth.</caption>
 *
 * return (
 *   <GraphQLProvider>
 *     {children}
 *   </GraphQLProvider>
 * )
 */
const GraphQLProvider = ({ children }) => {
  const { graphQlHost } = getApplicationConfig()
  const appContext = useAppContext()
  const { user } = appContext
  const { token } = user
  const { tokenValue } = token || {}

  const httpLink = createHttpLink({
    uri: graphQlHost
  })

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: tokenValue
    }
  }))

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      },
      watchQuery: {
        fetchPolicy: 'no-cache'
      }
    }
  })

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

GraphQLProvider.defaultProps = {
  children: null
}

GraphQLProvider.propTypes = {
  children: PropTypes.node
}

export default GraphQLProvider
