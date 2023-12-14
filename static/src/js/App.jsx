import React, { useLayoutEffect } from 'react'
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
import ManagePage from './pages/ManagePage/ManagePage'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import Notifications from './components/Notifications/Notifications'
import Providers from './providers/Providers/Providers'
import Page from './components/Page/Page'

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
  useLayoutEffect(() => {
    document.body.classList.remove('is-loading')
  }, [])

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
  // http://localhost:5173/tool-drafts/TD1200000093-MMT_2/
  // appContext = {
  //   statusMessage
  //   errorMessage
  // }

  return (
    <ApolloProvider client={client}>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {Redirects}
              <Route path="manage/:type/*" element={<ManagePage />} />
              <Route path="manage/cmr" element={<ManageCmrPage />} />
              <Route path="drafts/:draftType/*" element={<DraftsPage />} />
              <Route path="/404" element={<Page title="404 Not Found" pageType="secondary">Not Found :(</Page>} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Notifications />
      </Providers>
    </ApolloProvider>
  )
}

export default App
