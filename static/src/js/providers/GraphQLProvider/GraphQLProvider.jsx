import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  Observable,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

import useAppContext from '../../hooks/useAppContext'

/**
 * @typedef {Object} GraphQLProviderProps
 * @property {ReactNode} children The children to be rendered.

/**
 * Renders any children wrapped with access to the Apollo context.
 * @param {GraphQLProviderProps} props
 *
 * @example <caption>Renders children wrapped with access to the Apollo context.</caption>
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

  // Custom middleware link that delays responses for mutations
  const responseDelayLink = new ApolloLink((operation, forward) => new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        // Check if the operation is a mutation
        if (operation.query.definitions.some(
          (def) => def.operation === 'mutation'
        )) {
          // Delay the response by 1 second for mutations because CMR has to update elastic indexes
          setTimeout(() => {
            observer.next(result)
            observer.complete()
          }, 1000)
        } else {
          // Immediately pass through for queries
          observer.next(result)
          observer.complete()
        }
      },
      error: observer.error.bind(observer),
      complete: () => {
        if (!operation.query.definitions.some(
          (def) => def.operation === 'mutation'
        )) {
          // Immediately pass through for queries
          observer.complete()
        }
      }
    })

    return () => subscription.unsubscribe()
  }))

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: graphQlHost
    })

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        // TODO add client id
        Authorization: tokenValue
      }
    }))

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([authLink, responseDelayLink, httpLink]),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache'
        },
        watchQuery: {
          fetchPolicy: 'no-cache'
        }
      }
    })
  }, [tokenValue])

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
