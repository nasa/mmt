import React, { useEffect } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate
} from 'react-router'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'
import isTokenExpired from '../../utils/isTokenExpired'
import useAppContext from '../../hooks/useAppContext'

export const AuthRequiredContainer = () => {
  const { user } = useAppContext()

  const { token } = user
  const isExpired = isTokenExpired(token)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { apiHost } = getApplicationConfig()

    if (isExpired) {
      const nextPath = location.pathname + location.search
      window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent(nextPath)}`
    }
  }, [])

  useEffect(() => {
    if (isExpired) {
      navigate('/', { replace: true })
    }
  }, [user])

  if (!isExpired) {
    return <Outlet />
  }

  return (
    <div data-testid="auth-required" className="route-wrapper" />
  )
}

export default AuthRequiredContainer
