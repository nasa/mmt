import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import useAppContext from '../../hooks/useAppContext'

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
    updateLoginInfo(auid)

    if (!isEmpty(user)) {
      navigate(path, { replace: true })
    }
  }, [user])

  return (<div />)
}

export default AuthCallbackContainer
