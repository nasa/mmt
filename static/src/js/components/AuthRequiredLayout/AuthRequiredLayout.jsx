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
import useMMTCookie from '@/js/hooks/useMMTCookie'
import MMT_COOKIE from 'sharedConstants/mmtCookie'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const MINIMUM_ASSURANCE_LEVEL = 4

const AuthRequiredLayout = () => {
  const {
    apiHost,
    cookieDomain
  } = getApplicationConfig()
  const {
    authLoading,
    tokenExpires,
    user = {}
  } = useAuthContext()
  const { setCookie } = useMMTCookie()

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
      errorLogger('Failed non nasa draft user acls', error)
      setHasNonNasaAccess(false)
    }
  })

  const location = useLocation()

  const tokenExpired = isTokenExpired(tokenExpires)

  useEffect(() => {
    if (!authLoading && tokenExpired) {
      const nextPath = location.pathname + location.search
      const loginUrl = new URL(`${apiHost}/login`)
      loginUrl.searchParams.append('target', nextPath)

      window.location.href = loginUrl.toString()
    }
  }, [apiHost, authLoading, location, tokenExpired])

  const isLoading = authLoading || tokenExpired
    || (requiresNonNasaCheck && nonNasaCheckLoading)

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

  if (requiresNonNasaCheck) {
    if (hasNonNasaAccess === true) {
      return <Outlet />
    }

    if (hasNonNasaAccess === false) {
      // Clear the cookie before redirecting
      setCookie(MMT_COOKIE, null, {
        domain: cookieDomain,
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      })

      return (
        <Navigate to="/unauthorizedAccess?errorType=deniedNonNasaAccessMMT" replace />
      )
    }

    // If hasNonNasaAccess is null, we're still loading
    // If hasNonNasaAccess is null, we're still loading
    return (
      <div className="p-5">
        <span className="app-loading-screen__text">
          Checking permissions...
        </span>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  // If we don't require a non-NASA check or all checks have passed
  return <Outlet />
}

export default AuthRequiredLayout
