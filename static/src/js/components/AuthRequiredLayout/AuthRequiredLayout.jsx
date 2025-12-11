import React, { useEffect } from 'react'
import {
  Navigate,
  Outlet,
  useLocation
} from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'
import usePermissions from '@/js/hooks/usePermissions'

import isTokenExpired from '@/js/utils/isTokenExpired'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const MINIMUM_ASSURANCE_LEVEL = 4

const AuthRequiredLayout = () => {
  const { apiHost } = getApplicationConfig()
  const {
    authLoading,
    tokenExpires,
    user = {}
  } = useAuthContext()

  const { assuranceLevel: rawAssuranceLevel } = user
  const assuranceLevel = Number(rawAssuranceLevel)
  const requiresNonNasaCheck = assuranceLevel === MINIMUM_ASSURANCE_LEVEL

  const {
    hasProviderIdentities: hasNonNasaAccess = true,
    loading: permissionsLoading
  } = usePermissions({
    providerIdentityTargets: requiresNonNasaCheck ? ['NON_NASA_DRAFT_USER'] : null
  })

  const assuranceInsufficient = !Number.isFinite(assuranceLevel) || assuranceLevel < MINIMUM_ASSURANCE_LEVEL

  const location = useLocation()

  const tokenExpired = isTokenExpired(tokenExpires)

  useEffect(() => {
    // If we have a token value that has expired, redirect to login the user again
    if (!authLoading && tokenExpired) {
      const nextPath = location.pathname + location.search
      const loginUrl = new URL(`${apiHost}/login`)
      loginUrl.searchParams.append('target', nextPath)

      window.location.href = loginUrl.toString()
    }
  }, [apiHost, authLoading, location, tokenExpired])

  const providerCheckLoading = requiresNonNasaCheck && permissionsLoading

  if (!authLoading && !tokenExpired) {
    if (assuranceInsufficient) {
      return (
        <Navigate to="/unauthorizedAccess?errorType=deniedAccessMMT" replace />
      )
    }

    if (requiresNonNasaCheck) {
      if (!providerCheckLoading && !hasNonNasaAccess) {
        return (
          <Navigate to="/unauthorizedAccess?errorType=deniedNonNasaAccessMMT" replace />
        )
      }
    }
  }

  // If the app is still loading the auth context, please wait...
  if (authLoading || tokenExpired || providerCheckLoading) {
    return (
      <div className="p-5">
        <span className="app-loading-screen__text">
          Please wait logging in...
        </span>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  // If the user has a non-expired token, render the Outlet component
  return <Outlet />
}

export default AuthRequiredLayout
