import React from 'react'
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

  // If the app is loadind up (authLoading=true) and the token
  // is null or expired.
  if (authLoading && isTokenExpired(tokenExpires)) {
    const nextPath = location.pathname + location.search
    const url = `${apiHost}/saml-login?target=${encodeURIComponent(nextPath)}`
    window.location.href = url

    return (
      <div>
        <div>
          Please wait logging in...
        </div>
      </div>
    )
  }

  // If the user has a non-expired token, render the Outlet component
  if (!isTokenExpired(tokenExpires)) {
    return <Outlet />
  }

  return null
}

export default AuthRequiredLayout
