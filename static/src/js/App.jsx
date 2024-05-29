import React, { useLayoutEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Navigate, createBrowserRouter } from 'react-router-dom'

import CollectionAssociationFormPage from '@/js/pages/CollectionAssociationFormPage/CollectionAssociationFormPage'
import DraftCollectionAssociationPage from '@/js/pages/DraftCollectionAssociationPage/DraftCollectionAssociationPage'
import DraftListPage from '@/js/pages/DraftListPage/DraftListPage'
import DraftPage from '@/js/pages/DraftPage/DraftPage'
import GroupFormPage from '@/js/pages/GroupFormPage/GroupFormPage'
import GroupListPage from '@/js/pages/GroupListPage/GroupListPage'
import GroupPage from '@/js/pages/GroupPage/GroupPage'
import HomePage from '@/js/pages/HomePage/HomePage'
import ManageCollectionAssociationPage from '@/js/pages/ManageCollectionAssociationPage/ManageCollectionAssociationPage'
import MetadataFormPage from '@/js/pages/MetadataFormPage/MetadataFormPage'
import OrderOptionFormPage from '@/js/pages/OrderOptionFormPage/OrderOptionFormPage'
import OrderOptionListPage from '@/js/pages/OrderOptionListPage/OrderOptionListPage'
import OrderOptionPage from '@/js/pages/OrderOptionPage/OrderOptionPage'
import ProvidersPage from '@/js/pages/ProvidersPage/ProvidersPage'
import PermissionListPage from '@/js/pages/PermissionListPage/PermissionListPage'
import PermissionPage from '@/js/pages/PermissionPage/PermissionPage'
import ProviderPermissionsPage from '@/js/pages/ProviderPermissionsPage/ProviderPermissionsPage'
import RevisionListPage from '@/js/pages/RevisionListPage/RevisionListPage'
import SearchPage from '@/js/pages/SearchPage/SearchPage'
import SystemPermissionsPage from '@/js/pages/SystemPermissionsPage/SystemPermissionsPage'

import AuthCallback from '@/js/components/AuthCallback/AuthCallback'
import AuthRequiredLayout from '@/js/components/AuthRequiredLayout/AuthRequiredLayout'
import CheckPermissions from '@/js/components/CheckPermissions/CheckPermissions'
import Layout from '@/js/components/Layout/Layout'
import Notifications from '@/js/components/Notifications/Notifications'
import Page from '@/js/components/Page/Page'
import PublishPreview from '@/js/components/PublishPreview/PublishPreview'
import TemplateForm from '@/js/components/TemplateForm/TemplateForm'
import TemplateList from '@/js/components/TemplateList/TemplateList'
import TemplatePreview from '@/js/components/TemplatePreview/TemplatePreview'

import REDIRECTS from '@/js/constants/redirectsMap/redirectsMap'

import withProviders from '@/js/providers/withProviders/withProviders'

import '../css/index.scss'
import LogoutPage from './pages/LogoutPage/LogoutPage'

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
      path: '/auth-callback',
      exact: true,
      element: <Layout />,
      children: [
        {
          path: '/auth-callback',
          element: <AuthCallback />
        }
      ]
    },
    {
      path: '/logout',
      exact: true,
      element: <LogoutPage />
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
          element: <AuthRequiredLayout />,
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
              path: '/permissions',
              element: <PermissionListPage />
            },
            {
              path: '/permissions/new',
              element: <PermissionFormPage />
            },
            {
              path: '/permissions/:conceptId',
              element: <PermissionPage />
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
              path: '/providers',
              element: <ProvidersPage />
            },
            {
              path: '/admin',
              element: <div>TBD</div>
            },
            {
              element: <CheckPermissions systemGroup={['read']} />,
              children: [
                {
                  path: '/admin/groups',
                  element: <GroupListPage isAdminPage />
                },
                {
                  path: '/admin/groups/:id',
                  element: <GroupPage isAdminPage />
                },
                {
                  path: '/admin/groups/:id/permissions',
                  element: <SystemPermissionsPage />
                }
              ]
            },
            {
              element: <CheckPermissions systemGroup={['create']} />,
              children: [
                {
                  path: '/admin/groups/new',
                  element: <GroupFormPage isAdminPage />
                },
                {
                  path: '/admin/groups/:id/edit',
                  element: <GroupFormPage isAdminPage />
                }
              ]
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
