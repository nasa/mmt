import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import useAuthContext from '@/js/hooks/useAuthContext'
import isTokenExpired from '@/js/utils/isTokenExpired'
import errorLogger from '@/js/utils/errorLogger'

import checkNonNasaMMTAccess from 'sharedUtils/checkNonNasaMMTAccess'

const MINIMUM_ASSURANCE_LEVEL = 4

/**
 * This class handles the authenticated redirect from our EDL callback lambda function.
 * We get the EDL token and redirect to the specified `target` path
 */
export const AuthCallback = () => {
  const [searchParams] = useSearchParams()

  const [hasNonNasaAccess, setHasNonNasaAccess] = useState(null)

  const {
    authLoading,
    tokenExpires,
    tokenValue,
    user = {}
  } = useAuthContext()

  const { assuranceLevel: rawAssuranceLevel, uid } = user
  const assuranceLevel = Number(rawAssuranceLevel)

  // Assurance level 5 users are fully trusted and skip additional ACL checks
  const requiresNonNasaCheck = assuranceLevel === MINIMUM_ASSURANCE_LEVEL

  const target = searchParams.get('target')

  // If we are still loading the token from the cookie, don't Navigate yet
  if (authLoading) return null

  const isExpired = isTokenExpired(tokenExpires)

  useEffect(() => {
    let isMounted = true

    const shouldVerify = requiresNonNasaCheck && tokenValue && uid

    if (!shouldVerify) {
      setHasNonNasaAccess(null)
    } else {
      const verifyAccess = async () => {
        try {
          const hasAccess = await checkNonNasaMMTAccess(uid, tokenValue)
          if (!isMounted) return

          setHasNonNasaAccess(hasAccess)
        } catch (error) {
          errorLogger(error, 'AuthCallback: checking Non-NASA MMT access')
          if (!isMounted) return
          setHasNonNasaAccess(false)
        }
      }

      setHasNonNasaAccess(null)
      verifyAccess()
    }

    return () => {
      isMounted = false
    }
  }, [
    requiresNonNasaCheck,
    tokenValue,
    uid
  ])

  // If we have a good token, Navigate to the target location
  if (!isExpired) {
    if (!Number.isFinite(assuranceLevel) || assuranceLevel < MINIMUM_ASSURANCE_LEVEL) {
      return (
        <Navigate to="/unauthorizedAccess?errorType=deniedAccessMMT" replace />
      )
    }

    if (requiresNonNasaCheck) {
      if (hasNonNasaAccess === null) return null

      if (!hasNonNasaAccess) {
        return (
          <Navigate to="/unauthorizedAccess?errorType=deniedNonNasaAccessMMT" replace />
        )
      }
    }

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
