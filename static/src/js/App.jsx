import React, { useLayoutEffect, useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import CollectionAssociationFormPage from './pages/CollectionAssociationFormPage/CollectionAssociationFormPage'
import DraftCollectionAssociationPage from './pages/DraftCollectionAssociationPage/DraftCollectionAssociationPage'
import DraftListPage from './pages/DraftListPage/DraftListPage'
import DraftPage from './pages/DraftPage/DraftPage'
import GroupFormPage from './pages/GroupFormPage/GroupFormPage'
import GroupListPage from './pages/GroupListPage/GroupListPage'
import GroupPage from './pages/GroupPage/GroupPage'
import HomePage from './pages/HomePage/HomePage'
import ManageCollectionAssociationPage from './pages/ManageCollectionAssociationPage/ManageCollectionAssociationPage'
import MetadataFormPage from './pages/MetadataFormPage/MetadataFormPage'
import OrderOptionFormPage from './pages/OrderOptionFormPage/OrderOptionFormPage'
import OrderOptionListPage from './pages/OrderOptionListPage/OrderOptionListPage'
import OrderOptionPage from './pages/OrderOptionPage/OrderOptionPage'
import ProviderPermissionsPage from './pages/ProviderPermissionsPage/ProviderPermissionsPage'
import RevisionListPage from './pages/RevisionListPage/RevisionListPage'
import SearchPage from './pages/SearchPage/SearchPage'
import SystemPermissionsPage from './pages/SystemPermissionsPage/SystemPermissionsPage'

import AuthCallbackContainer from './components/AuthCallbackContainer/AuthCallbackContainer'
import AuthRequiredContainer from './components/AuthRequiredContainer/AuthRequiredContainer'
import Layout from './components/Layout/Layout'
import Notifications from './components/Notifications/Notifications'
import Page from './components/Page/Page'
import PublishPreview from './components/PublishPreview/PublishPreview'
import TemplateForm from './components/TemplateForm/TemplateForm'
import TemplateList from './components/TemplateList/TemplateList'
import TemplatePreview from './components/TemplatePreview/TemplatePreview'

import REDIRECTS from './constants/redirectsMap/redirectsMap'

import errorLogger from './utils/errorLogger'
import getPermittedUser from './utils/getPermittedUser'

import useAppContext from './hooks/useAppContext'
import useNotificationsContext from './hooks/useNotificationsContext'

import { GET_ACLS } from './operations/queries/getAcls'

import withProviders from './providers/withProviders/withProviders'

import '../css/index.scss'

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

  // TODO fix this name, GET_ACLS isn't useful
  const [getProviders] = useLazyQuery(GET_ACLS, {
    variables: {
      params: {
        limit: 500,
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

  const router = createBrowserRouter([
    {
      path: '/',
      exact: true,
      element: <Layout displayNav={false} />,
      children: [
        {
          path: '/',
          element: <HomePage />
        }
      ]
    },
    {
      path: '/auth_callback',
      exact: true,
      element: <Layout />,
      children: [
        {
          path: '/auth_callback',
          element: <AuthCallbackContainer />
        }
      ]
    },
    ...Object.keys(REDIRECTS).map((redirectKey) => ({
      path: redirectKey,
      element: <Navigate replace to={`/${REDIRECTS[redirectKey]}`} />
    })),
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          element: <AuthRequiredContainer />,
          children: [
            {
              path: ':type',
              element: <SearchPage />
            },
            {
              path: ':type/:conceptId',
              element: <PublishPreview />
            },
            {
              path: '/:type/:conceptId/revisions',
              element: <RevisionListPage />
            },
            {
              path: '/:type/:conceptId/revisions/:revisionId',
              element: <PublishPreview isRevision />
            },
            {
              path: '/:type/:conceptId/collection-association',
              element: <ManageCollectionAssociationPage />
            },
            {
              path: '/:type/:conceptId/collection-association-search',
              element: <CollectionAssociationFormPage />
            },
            {
              path: '/drafts/:draftType',
              element: <DraftListPage />
            },
            {
              path: '/drafts/:draftType/:conceptId',
              element: <DraftPage />
            },
            {
              path: '/drafts/:draftType/new',
              element: <MetadataFormPage />
            },
            {
              path: '/drafts/:draftType/:conceptId/:sectionName',
              element: <MetadataFormPage />
            },
            {
              path: '/drafts/:draftType/:conceptId/:sectionName/:fieldName',
              element: <MetadataFormPage />
            },
            {
              path: '/drafts/:draftType/:conceptId/collection-association',
              element: <DraftCollectionAssociationPage />
            },
            {
              path: '/order-options',
              element: <OrderOptionListPage />
            },
            {
              path: '/order-options/new',
              element: <OrderOptionFormPage />
            },
            {
              path: '/order-options/:conceptId/edit',
              element: <OrderOptionFormPage />
            },
            {
              path: '/order-options/:conceptId',
              element: <OrderOptionPage />
            },
            {
              path: '/groups',
              element: <GroupListPage />
            },
            {
              path: '/groups/new',
              element: <GroupFormPage />
            },
            {
              path: '/groups/:id/edit',
              element: <GroupFormPage />
            },
            {
              path: '/groups/:id',
              element: <GroupPage />
            },
            {
              path: '/groups/:id/permissions',
              element: <ProviderPermissionsPage />
            },
            {
              path: 'templates/:templateType',
              element: <TemplateList />
            },
            {
              path: 'templates/:templateType/new',
              element: <TemplateForm />
            },
            {
              path: 'templates/:templateType/:id',
              element: <TemplatePreview />
            },
            {
              path: 'templates/:templateType/:id/:sectionName',
              element: <TemplateForm />
            },
            {
              path: 'templates/:templateType/:id/:sectionName/:fieldName',
              element: <TemplateForm />
            },
            {
              path: '/admin/groups/:id/permissions',
              element: <SystemPermissionsPage />
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    },
    {
      path: '/404',
      element: <Page header={<div />} title="404 Not Found" pageType="secondary">Not Found :(</Page>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <Notifications />
    </>
  )
}

export default withProviders(App)
