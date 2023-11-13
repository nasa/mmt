import React from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import ManageCollectionsPage from './pages/ManageCollectionsPage/ManageCollectionsPage'
import ManageServicesPage from './pages/ManageServicesPage/ManageServicesPage'
import ManageToolsPage from './pages/ManageToolsPage/ManageToolsPage'
import ManageVariablesPage from './pages/ManageVariablesPage/ManageVariablesPage'
import ToolDraftsPage from './pages/ToolDraftsPage/ToolDraftsPage'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

import { getApplicationConfig } from './utils/getConfig'

import '../css/index.scss'

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
  const { graphQlHost } = getApplicationConfig()

  const httpLink = createHttpLink({
    uri: graphQlHost
  })

  // TODO remove eslint-disable after this method expands in MMT-3407
  // eslint-disable-next-line arrow-body-style
  const authLink = setContext((_, { headers }) => {
    // TODO MMT-3407 - get a real token from launchpad to send

    return {
      headers: {
        ...headers,
        Authorization: 'ABC-1'
      }
    }
  })

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
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
            <Route
              element={<ToolDraftsPage />}
              path="tool-drafts/*"
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
