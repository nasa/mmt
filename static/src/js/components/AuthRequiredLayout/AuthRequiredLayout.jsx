import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'

import isTokenExpired from '@/js/utils/isTokenExpired'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const AuthRequiredLayout = () => {
  const { apiHost } = getApplicationConfig()
  const {
    authLoading,
    tokenExpires
  } = useAuthContext()

  const location = useLocation()

  useEffect(() => {
    // If we have a token value that has expired, redirect to login the user again
    if (!authLoading && isTokenExpired(tokenExpires)) {
      const nextPath = location.pathname + location.search

      window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent(nextPath)}`
    }
  }, [authLoading, tokenExpires])

  // If the app is still loading the auth context, please wait...
  if (authLoading || isTokenExpired(tokenExpires)) {
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
