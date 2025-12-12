import React, { useEffect, useState } from 'react'
import {
  Navigate,
  Outlet,
  useLocation
} from 'react-router'
import { useQuery } from '@apollo/client'

import useAuthContext from '@/js/hooks/useAuthContext'
import isTokenExpired from '@/js/utils/isTokenExpired'
import errorLogger from '@/js/utils/errorLogger'
import { GET_NON_NASA_DRAFT_USER_ACLS } from '@/js/operations/queries/getNonNasaDraftUserAcls'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const MINIMUM_ASSURANCE_LEVEL = 4

/**
 * Gatekeeper layout that ensures users are authenticated and, when needed,
 * verifies Non-NASA draft permissions before exposing protected routes.
 */
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

  const [hasNonNasaAccess, setHasNonNasaAccess] = useState(null)

  const { loading: nonNasaCheckLoading } = useQuery(GET_NON_NASA_DRAFT_USER_ACLS, {
    skip: !requiresNonNasaCheck,
    variables: {
      params: {
        permittedUser: user.uid,
        target: 'NON_NASA_DRAFT_USER'
      }
    },
    onCompleted: (data) => {
      const { acls = {} } = data
      const { items = [] } = acls
      setHasNonNasaAccess(items.length > 0)
    },
    onError: (error) => {
      errorLogger('Failed fetching available providers', error)
      setHasNonNasaAccess(false)
    }
  })

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

  const isLoading = authLoading || tokenExpired
  || (requiresNonNasaCheck && (nonNasaCheckLoading || hasNonNasaAccess === null))

  if (isLoading) {
    return (
      <div className="p-5">
        <span className="app-loading-screen__text">
          Please wait logging in...
        </span>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  if (requiresNonNasaCheck && !hasNonNasaAccess) {
    return (
      <Navigate to="/unauthorizedAccess?errorType=deniedNonNasaAccessMMT" replace />
    )
  }

  // If the user has a non-expired token and sufficient access, render the Outlet component
  return <Outlet />
}

export default AuthRequiredLayout
