import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { getApplicationConfig } from '../../utils/getConfig'
import useAppContext from '../../hooks/useAppContext'

export const AuthRequiredContainer = ({
  children
}) => {
  const { user } = useAppContext()
  let { token } = user

  const location = useLocation()

  useEffect(() => {
    const { apiHost, cookie: appCookie } = getApplicationConfig()

    if (appCookie) {
      token = appCookie.token
    }

    if (token === null || token === '' || token === undefined) {
      window.location.href = `${apiHost}/saml-login?target=${encodeURIComponent(location.pathname)}`
    }
  }, [])

  if (token) {
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
