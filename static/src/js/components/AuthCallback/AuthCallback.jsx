import React, { useEffect } from 'react'
import { Navigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import useAuthContext from '@/js/hooks/useAuthContext'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified `target` path
 */
export const AuthCallback = () => {
  const [searchParams] = useSearchParams()

  const { setToken } = useAuthContext()

  const target = searchParams.get('target')
  const jwt = searchParams.get('jwt')

  useEffect(() => {
    // Call setToken when the jwt exists to update the auth context
    if (jwt) setToken(jwt)
  }, [jwt])

  if (jwt) {
    // If the jwt exists, forward the user to the target URL
    return (
      <Navigate to={target || '/'} />
    )
  }

  // Default to sending the user to the home page
  return (
    <Navigate to="/" />
  )
}

export default AuthCallback
