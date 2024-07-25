import React from 'react'
import { Outlet, useLocation } from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'

import isTokenExpired from '@/js/utils/isTokenExpired'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const AuthRequiredLayout = () => {
  const { apiHost } = getApplicationConfig()
  const {
    authLoading,
    redirecting,
    setRedirecting,
    tokenExpires
  } = useAuthContext()

  const location = useLocation()

  // If the app is still loading the auth context, please wait...

  if (authLoading || redirecting) {
    return (
      <div>
        <div>
          Please wait logging in...
        </div>
      </div>
    )
  }

  const isExpired = isTokenExpired(tokenExpires)

  // If we have a token value that has expired, redirect to login the user again
  if (isExpired && !redirecting) {
    const nextPath = location.pathname + location.search

    setRedirecting(true)
    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent(nextPath)}`

    return (
      <div>
        <div>
          Please wait redirecting...
        </div>
      </div>
    )
  }

  // If the user has a non-expired token, render the Outlet component
  return <Outlet />
}

export default AuthRequiredLayout
