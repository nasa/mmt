import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router'
import { getApplicationConfig } from '../../../../../sharedUtils/getConfig'
import isTokenExpired from '../../utils/isTokenExpired'
import useAppContext from '../../hooks/useAppContext'

export const AuthRequiredContainer = ({
  children
}) => {
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
    return children
  }

  return (
    <div data-testid="auth-required" className="route-wrapper" />
  )
}

AuthRequiredContainer.defaultProps = {
}

AuthRequiredContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthRequiredContainer
