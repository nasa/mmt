import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client'

import ExampleComponent from './components/ExampleComponent/ExampleComponent'

import config from '../../static.config.json'

const { graphQlHost } = config

const App = () => {
  const client = new ApolloClient({
    uri: graphQlHost,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <ExampleComponent />
    </ApolloProvider>
  )
}

export default App
