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

import { useCookies } from 'react-cookie'
import Layout from './components/Layout/Layout'
import ManagePage from './pages/ManagePage/ManagePage'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import Notifications from './components/Notifications/Notifications'
import Providers from './providers/Providers/Providers'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

import { getApplicationConfig } from './utils/getConfig'

import '../css/index.scss'
import HomePage from './pages/HomePage/HomePage'
import AuthCallbackContainer from './components/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './components/AuthRequiredContainer/AuthRequiredContainer'

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

  const [cookies] = useCookies(['token'])

  const { token } = cookies

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
        Authorization: token
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
              <Route path="/" index element={<HomePage />} />
              <Route
                path="manage/:type/*"
                element={
                  (
                    <AuthRequiredContainer>
                      <ManagePage />
                    </AuthRequiredContainer>
                  )
                }
              />
              <Route
                path="manage/cmr"
                element={
                  (
                    <AuthRequiredContainer>
                      <ManageCmrPage />
                    </AuthRequiredContainer>
                  )
                }
              />

              <Route
                path="drafts/:draftType/*"
                element={
                  (
                    <AuthRequiredContainer>
                      <DraftsPage />
                    </AuthRequiredContainer>
                  )
                }
              />

              <Route path="/404" element={<Page title="404 Not Found" pageType="secondary">Not Found :(</Page>} />
              <Route path="*" element={<Navigate to="/404" replace />} />
              <Route path="/auth_callback" element={<AuthCallbackContainer />} />

              <Route
                path="/:type/:conceptId/:revisionId"
                element={
                  (
                    <AuthRequiredContainer>
                      <PublishPreview />
                    </AuthRequiredContainer>
                  )
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        <Notifications />
      </Providers>
    </ApolloProvider>
  )
}

export default App
