import React, { useLayoutEffect, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter, Navigate } from 'react-router-dom'

import { useLazyQuery } from '@apollo/client'
import Layout from './components/Layout/Layout'
import ManagePage from './pages/ManagePage/ManagePage'
import DraftsPage from './pages/DraftsPage/DraftsPage'
import Notifications from './components/Notifications/Notifications'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'
import SearchPage from './pages/SearchPage/SearchPage'
import HomePage from './pages/HomePage/HomePage'
import AuthRequiredContainer from './components/AuthRequiredContainer/AuthRequiredContainer'
import AuthCallbackContainer from './components/AuthCallbackContainer/AuthCallbackContainer'
import ManageCollectionAssociation from './pages/ManageCollectionAssociation/ManageCollectionAssociation'
import CollectionAssociationSearch from './components/CollectionAssociationSearch/CollectionAssociationSearch'
import TemplateList from './components/TemplateList/TemplateList'

import TemplateForm from './components/TemplateForm/TemplateForm'
import TemplatePreview from './components/TemplatePreview/TemplatePreview'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

import '../css/index.scss'

import errorLogger from './utils/errorLogger'
import useNotificationsContext from './hooks/useNotificationsContext'
import { GET_ACLS } from './operations/queries/getAcls'
import useAppContext from './hooks/useAppContext'
import withProviders from './providers/withProviders/withProviders'
import getPermittedUser from './utils/getPermittedUser'
import RevisionList from './components/RevisionList/RevisionList'
import OrderOptionList from './components/OrderOptionList/OrderOptionList'
import OrderOptionPreview from './components/OrderOptionPreivew/OrderOptionPreview'

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

  const permittedUser = getPermittedUser(user)

  const [getProviders] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
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
              path="templates/:templateType"
              element={
                (
                  <AuthRequiredContainer>
                    <TemplateList />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="templates/:templateType/new"
              element={
                (
                  <AuthRequiredContainer>
                    <TemplateForm />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="templates/:templateType/:id"
              element={
                (
                  <AuthRequiredContainer>
                    <TemplatePreview />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="templates/:templateType/:id/:sectionName"
              element={
                (
                  <AuthRequiredContainer>
                    <TemplateForm />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="templates/:templateType/:id/:sectionName/:fieldName"
              element={
                (
                  <AuthRequiredContainer>
                    <TemplateForm />
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
            <Route
              path="/:type/:conceptId/"
              element={
                (
                  <AuthRequiredContainer>
                    <PublishPreview />
                  </AuthRequiredContainer>
                )
              }
            />
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
            <Route
              path="/:type/:conceptId/collection-association"
              element={
                (
                  <AuthRequiredContainer>
                    <ManageCollectionAssociation />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="/:type/:conceptId/collection-association-search"
              element={
                (
                  <AuthRequiredContainer>
                    <ManageCollectionAssociation />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="order-options"
              element={
                (
                  <AuthRequiredContainer>
                    <OrderOptionList />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route
              path="order-options/:conceptId"
              element={
                (
                  <AuthRequiredContainer>
                    <OrderOptionPreview />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route path="/404" element={<Page title="404 Not Found" pageType="secondary">Not Found :(</Page>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/:type/:conceptId/" element={<PublishPreview />} />
            <Route path="/:type/:conceptId/revisions/:revisionId" element={<PublishPreview isRevision />} />
            <Route
              path="/:type/:conceptId/revisions"
              element={
                (
                  <AuthRequiredContainer>
                    <RevisionList />
                  </AuthRequiredContainer>
                )
              }
            />
            <Route path="/:type/:conceptId/collection-association" element={<ManageCollectionAssociation />} />
            <Route path="/:type/:conceptId/collection-association-search" element={<CollectionAssociationSearch />} />
            <Route path="/:type/:conceptId/:revisionId/collection-association-search" element={<CollectionAssociationSearch />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/404" element={<Page title="404 Not Found" pageType="secondary">Not Found :(</Page>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Notifications />
    </>
  )
}

export default withProviders(App)
