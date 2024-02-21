import React, { useLayoutEffect } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import ManagePage from './pages/ManagePage/ManagePage'
import ManageCmrPage from './pages/ManageCmrPage/ManageCmrPage'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import Notifications from './components/Notifications/Notifications'
import Providers from './providers/Providers/Providers'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

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
  )
}

export default App
