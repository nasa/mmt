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

import useAuthContext from '@/js/hooks/useAuthContext'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const { graphQlHost } = getApplicationConfig()

// Function to determine the key used for caching objects
const keyFieldsFunction = (object) => {
  const {
    conceptId,
    revisionId,
    __typename
  } = object

  return [__typename, conceptId, revisionId].filter(Boolean).join('-')
}

// Define the Apollo Client Cache settings
const cache = new InMemoryCache({
  typePolicies: {
    Acl: {
      keyFields: keyFieldsFunction
    },
    AclGroup: {
      keyFields: false
    },
    Collection: {
      keyFields: keyFieldsFunction
    },
    Draft: {
      keyFields: keyFieldsFunction
    },
    Grid: {
      keyFields: keyFieldsFunction
    },
    OrderOption: {
      keyFields: keyFieldsFunction
    },
    Service: {
      keyFields: keyFieldsFunction
    },
    Subscription: {
      keyFields: keyFieldsFunction
    },
    Tool: {
      keyFields: keyFieldsFunction
    },
    Variable: {
      keyFields: keyFieldsFunction
    },
    Visualization: {
      keyFields: keyFieldsFunction
    },
    Citation: {
      keyFields: keyFieldsFunction
    }
  }
})

// Custom middleware link that delays responses for mutations
const responseDelayLink = new ApolloLink((operation, forward) => new Observable((observer) => {
  const subscription = forward(operation).subscribe({
    next: (result) => {
      // Check if the operation is a mutation
      if (operation.query.definitions.some(
        // TODO ignore group calls to save time
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

// Create the HTTP link for Apollo client
const httpLink = createHttpLink({
  uri: graphQlHost
})

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
  const { tokenValue } = useAuthContext()

  const client = useMemo(() => {
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'Client-Id': `eed-mmt-${getApplicationConfig().env}`,
        Authorization: tokenValue
      }
    }))

    return new ApolloClient({
      cache,
      link: ApolloLink.from([authLink, responseDelayLink, httpLink])
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
