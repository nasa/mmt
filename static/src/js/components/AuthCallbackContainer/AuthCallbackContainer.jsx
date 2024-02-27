import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified `target` path
 */

export const AuthCallbackContainer = () => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('target')

  const navigate = useNavigate()

  useEffect(() => {
    if (path) {
      navigate(path)
    }
  }, [])

  return <div />
}

export default AuthCallbackContainer
