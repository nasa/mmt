import React, { useLayoutEffect, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import { useLazyQuery } from '@apollo/client'
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

import errorLogger from './utils/errorLogger'
import useNotificationsContext from './hooks/useNotificationsContext'
import { GET_ACLS } from './operations/queries/getAcls'
import useAppContext from './hooks/useAppContext'
import withProviders from './providers/withProviders/withProviders'
import ManageCollectionAssociation from './components/ManageCollectionAssociation/ManageCollectionAssociation'
import CollectionAssociationSearch from './components/CollectionAssociationSearch/CollectionAssociationSearch'
import getPermittedUser from './utils/getPermittedUser'

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

  const { addNotification } = useNotificationsContext()

  const {
    user, setProviderId, setProviderIds
  } = useAppContext()

  const { uid } = user

  const permittedUser = getPermittedUser()

  const [getProviders] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
        includeFullAcl: true,
        pageNum: 1,
        pageSize: 2000,
        permittedUser,
        target: 'PROVIDER_CONTEXT'
      }
    },
    onCompleted: (getProviderData) => {
      const { acls } = getProviderData
      const { items } = acls

      if (items.length > 0) {
        const providerList = items.map(({ acl }) => acl.provider_identity.provider_id)

        setProviderIds(providerList)

        // Check if user does not have providerId
        // and set it to the first providerId if available
        const { providerId } = user
        if (!providerId && providerList.length > 0) {
          setProviderId(providerList[0])
        }
      }
    },
    onError: (getProviderError) => {
      // Todo: Hackish, we really only want to call getProviders if uid is not null
      // Seems to be re-fetching whenever uid changes
      if (uid) {
        // Send the error to the errorLogger
        errorLogger(getProviderError, 'Error fetching providers')
        addNotification({
          message: 'An error occurred while fetching providers.',
          variant: 'danger'
        })
      }
    }
  })

  useEffect(() => {
    if (uid) {
      getProviders()
    }
  }, [user])

  return (
    <>
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
            <Route path="/:type/:conceptId" element={<PublishPreview />} />
            <Route path="/:type/:conceptId/:revisionId" element={<PublishPreview />} />
            <Route path="/:type/:conceptId/collection-association" element={<ManageCollectionAssociation />} />
            <Route path="/:type/:conceptId/:revisionId/collection-association" element={<ManageCollectionAssociation />} />
            <Route path="/:type/:conceptId/collection-association-search" element={<CollectionAssociationSearch />} />
            <Route path="/:type/:conceptId/:revisionId/collection-association-search" element={<CollectionAssociationSearch />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Notifications />
    </>
  )
}

export default withProviders(App)
