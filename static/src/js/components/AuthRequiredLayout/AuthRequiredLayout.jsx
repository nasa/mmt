import React from 'react'
import { Outlet, useLocation } from 'react-router'

import useAuthContext from '@/js/hooks/useAuthContext'

import APP_LOADING_TOKEN from '@/js/constants/appLoadingToken'

import isTokenExpired from '@/js/utils/isTokenExpired'

import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'

const AuthRequiredLayout = () => {
  const { apiHost } = getApplicationConfig()
  const {
    tokenExpires,
    tokenValue
  } = useAuthContext()

  if (tokenValue === APP_LOADING_TOKEN) {
    return null
  }

  const isExpired = isTokenExpired(tokenExpires)

  const location = useLocation()

  if (isExpired) {
    const nextPath = location.pathname + location.search

    window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent(nextPath)}`

    return null
  }

  return <Outlet />
}

export default AuthRequiredLayout
