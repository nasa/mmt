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

import '../css/index.scss'

const { graphQlHost } = config

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
            <Route path="/" element={<Navigate replace to="/manage-collections" />} />
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
