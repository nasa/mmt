import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import config from '../../../static.config.json'

import Layout from './components/Layout/Layout'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import ManageCollectionsPage from './pages/ManageCollectionsPage/ManageCollectionsPage'
import ManageServicesPage from './pages/ManageServicesPage/ManageServicesPage'
import ManageToolsPage from './pages/ManageToolsPage/ManageToolsPage'
import ManageVariablesPage from './pages/ManageVariablesPage/ManageVariablesPage'
import REDIRECTS from './constants/redirectsMap/redirectsMap'

import '../css/index.scss'

const { graphQlHost } = config

const redirectKeys = Object.keys(REDIRECTS)

// Create an array of the redirect `Route`s
const Redirects = redirectKeys.map(
  (redirectKey) => (
    <Route
      key={redirectKey}
      path={redirectKey}
      element={(
        <Navigate replace to={`/${REDIRECTS[redirectKey]}`} />
      )}
    />
  )
)

/**
 * Renders the `App` component
 *
 * @component
 * @example <caption>Renders a `App` component</caption>
 * return (
 *   <App />
 * )
 */
const App = () => {
  const client = new ApolloClient({
    uri: graphQlHost,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {Redirects}
            <Route
              element={<ManageCollectionsPage />}
              index
              path="manage-collections"
            />
            <Route
              element={<ManageVariablesPage />}
              path="manage-variables"
            />
            <Route
              element={<ManageServicesPage />}
              path="manage-services"
            />
            <Route
              element={<ManageToolsPage />}
              path="manage-tools"
            />
            <Route
              element={<ManageCmrPage />}
              path="manage-cmr"
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
