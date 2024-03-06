import React, { useLayoutEffect } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import ManagePage from './pages/ManagePage/ManagePage'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import Notifications from './components/Notifications/Notifications'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'
import SearchPage from './pages/SearchPage/SearchPage'
import HomePage from './pages/HomePage/HomePage'
import AuthRequiredContainer from './components/AuthRequiredContainer/AuthRequiredContainer'
import AuthCallbackContainer from './components/AuthCallbackContainer/AuthCallbackContainer'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

import '../css/index.scss'
import Providers from './providers/Providers/Providers'

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
export const App = () => {
  useLayoutEffect(() => {
    document.body.classList.remove('is-loading')
  }, [])

  const { graphQlHost } = getApplicationConfig()
  const { user } = useAppContext()
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

  const retrieveKeywords = async () => {
    const abstract = 'cloud cover is the ozone'
    const query = {
      description: abstract
    }
    const url = 'http://localhost:4001/dev/gkr-request'

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(query)
    })
    const gkrResponse = await response.json()
    const { recommendations } = gkrResponse

    return recommendations
  }

  retrieveKeywords().then((keywords) => {
    console.log('keywords are ', keywords)
  })

  // http://localhost:5173/tool-drafts/TD1200000093-MMT_2/
  // appContext = {
  //   statusMessage
  //   errorMessage
  // }

  return (
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
            <Route
              path="search"
              element={
                (
                  <AuthRequiredContainer>
                    <SearchPage />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              exact
              path="/auth_callback"
              element={<AuthCallbackContainer />}
            />
            <Route path="/404" element={<Page title="404 Not Found" pageType="secondary">Not Found :(</Page>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/:type/:conceptId/:revisionId" element={<PublishPreview />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Notifications />
    </Providers>
  )
}

export default App
