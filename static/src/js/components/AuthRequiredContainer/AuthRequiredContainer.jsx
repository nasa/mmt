import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router'
import { get } from 'tiny-cookie'
import { getApplicationConfig } from '../../utils/getConfig'

export const AuthRequiredContainer = ({
  children
}) => {
  const location = useLocation()
  const token = get('token')

  useEffect(() => {
    const { mmtHost } = getApplicationConfig()

    if (token === null || token === '' || token === undefined) {
      window.location.href = `${mmtHost}/saml/login?target=${encodeURIComponent(location.pathname)}`
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
