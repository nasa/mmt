import React from 'react'
import { Navigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import useAuthContext from '@/js/hooks/useAuthContext'
import isTokenExpired from '@/js/utils/isTokenExpired'

/**
 * Handles the authenticaed redirect from our EDL callback lambda function.
 * The token is already stored byt he time this renders, see 'consumeAuthToken'
 * This only sends the user on to the target path.
 */
export const AuthCallback = () => {
  const [searchParams] = useSearchParams()

  const { authLoading, tokenExpires } = useAuthContext()

  const target = searchParams.get('target')

  // If we are still loading the token from the cookie, don't Navigate yet
  if (authLoading) return null

  const isExpired = isTokenExpired(tokenExpires)

  // If we have a good token, Navigate to the target location
  if (!isExpired) {
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
