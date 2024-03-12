import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import useAppContext from '../../hooks/useAppContext'
import isTokenExpired from '../../utils/isTokenExpired'

/**
 * This class handles the authenticated redirect from our saml lambda function.
 * We get the launchpad token and redirect to the specified `target` path
 */

export const AuthCallbackContainer = () => {
  const [searchParams] = useSearchParams()
  const { updateLoginInfo, user } = useAppContext()
  const path = searchParams.get('target')
  const auid = searchParams.get('auid')

  const navigate = useNavigate()

  useEffect(() => {
    if (!isEmpty(user) && !isTokenExpired(user.token)) {
      navigate(path, { replace: true })
    } else {
      updateLoginInfo(auid)
    }
  }, [user])

  return (<div />)
}

export default AuthCallbackContainer
