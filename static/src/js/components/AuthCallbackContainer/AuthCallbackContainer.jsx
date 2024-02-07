import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import useAppContext from '../../hooks/useAppContext'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified `target` path
 */

export const AuthCallbackContainer = () => {
  const [searchParams] = useSearchParams()
  const path = searchParams.get('target')
  const navigate = useNavigate()
  const { setUser } = useAppContext()

  const [cookies] = useCookies(['token', 'auid', 'name', 'email'])

  const { token, auid, name } = cookies

  setUser({
    auid,
    name,
    token,
    providerId: 'MMT_2'
  })

  useEffect(() => {
    navigate(path)
  })

  return <div />
}

AuthCallbackContainer.propTypes = {
}

export default AuthCallbackContainer
